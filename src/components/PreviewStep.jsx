import { useState } from 'react'
import PosterPreview from './PosterPreview'
import ImageSelector from './ImageSelector'
import EmailModal from './EmailModal'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const PreviewStep = ({ posterData, selectImage, onBack, onEdit, onReset, showModal }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const handleImageSelect = (index) => {
    setIsUpdating(true)
    setTimeout(() => {
      selectImage(index)
      setIsUpdating(false)
    }, 150)
  }

  const handleSendEmail = async (email) => {
    if (!email || !email.trim()) {
      showModal('Please enter an email address', 'error')
      return
    }

    setIsSending(true)

    try {
      const posterElement = document.querySelector('.poster')
      if (!posterElement) {
        throw new Error('Poster element not found')
      }

      console.log('Generating PDF for email...')

      // Captura o poster como imagem
      const canvas = await html2canvas(posterElement, {
        backgroundColor: '#ffffff',
        scale: 4,
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: posterElement.scrollWidth,
        windowHeight: posterElement.scrollHeight
      })

      // Cria o PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      })

      const pdfWidth = 210
      const pdfHeight = 297
      const margin = 10
      
      const usableWidth = pdfWidth - (margin * 2)
      const usableHeight = pdfHeight - (margin * 2)
      
      let imgHeight = usableHeight
      let imgWidth = (canvas.width / canvas.height) * imgHeight
      let xOffset, yOffset
      
      if (imgWidth > usableWidth) {
        imgWidth = usableWidth
        imgHeight = (canvas.height / canvas.width) * imgWidth
        xOffset = margin
        yOffset = (pdfHeight - imgHeight) / 2
      } else {
        xOffset = (pdfWidth - imgWidth) / 2
        yOffset = margin
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.98)
      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight, undefined, 'FAST')

      // Converte para Blob
      const pdfBlob = pdf.output('blob')

      // Cria FormData para enviar para API
      const formData = new FormData()
      formData.append('email', email)
      formData.append('Name', posterData.name)
      formData.append('file', pdfBlob, `SafetyCircle_Poster_${posterData.name.replace(/\s+/g, '_')}.pdf`)

      console.log('Sending to API...')

      // Envia para API
      const response = await fetch('https://agentes-n8n.pod3wz.easypanel.host/webhook/api/upload-email', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      console.log('Email sent successfully!')
      setIsEmailModalOpen(false)
      showModal('Poster sent successfully! Check your email.', 'success')

    } catch (error) {
      console.error('Error sending email:', error)
      showModal(`Error sending poster: ${error.message}`, 'error')
    } finally {
      setIsSending(false)
    }
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      const posterElement = document.querySelector('.poster')
      if (!posterElement) {
        showModal('Error: Poster not found', 'error')
        setIsDownloading(false)
        return
      }

      console.log('Starting poster capture...')

      // Captura o poster como imagem com alta qualidade
      const canvas = await html2canvas(posterElement, {
        backgroundColor: '#ffffff',
        scale: 4, // Alta qualidade
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: posterElement.scrollWidth,
        windowHeight: posterElement.scrollHeight
      })

      console.log('Canvas created:', canvas.width, 'x', canvas.height)

      // Cria o PDF em modo retrato (portrait) - folha em pé
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      })

      // Dimensões A4 retrato (em pé)
      const pdfWidth = 210 // A4 portrait width in mm
      const pdfHeight = 297 // A4 portrait height in mm
      const margin = 10 // Margem em mm
      
      // Área útil
      const usableWidth = pdfWidth - (margin * 2)
      const usableHeight = pdfHeight - (margin * 2)
      
      // O poster é vertical, então usa toda a altura disponível
      let imgHeight = usableHeight
      let imgWidth = (canvas.width / canvas.height) * imgHeight
      let xOffset, yOffset
      
      // Se a largura calculada for maior que a disponível, ajusta pela largura
      if (imgWidth > usableWidth) {
        imgWidth = usableWidth
        imgHeight = (canvas.height / canvas.width) * imgWidth
        xOffset = margin
        yOffset = (pdfHeight - imgHeight) / 2
      } else {
        xOffset = (pdfWidth - imgWidth) / 2
        yOffset = margin
      }

      console.log('PDF dimensions:', imgWidth, 'x', imgHeight, 'at position', xOffset, yOffset)

      // Converte canvas para imagem com qualidade alta
      const imgData = canvas.toDataURL('image/jpeg', 0.98)

      // Adiciona a imagem centralizada no PDF
      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight, undefined, 'FAST')

      // Faz o download do PDF
      const fileName = `SafetyCircle_Poster_${posterData.name.replace(/\s+/g, '_') || 'User'}_${Date.now()}.pdf`
      console.log('Saving PDF:', fileName)
      pdf.save(fileName)

      console.log('PDF generated successfully!')
      showModal('PDF downloaded successfully!', 'success')

    } catch (error) {
      console.error('Error generating PDF:', error)
      showModal(`Error generating PDF: ${error.message}`, 'error')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <section className="step active">
      <div className="step-header">
        <h2><i className="fas fa-eye"></i> Step 3: Preview Your Poster</h2>
        <p>Review your safety poster before sending</p>
      </div>
      
      <ImageSelector
        images={posterData.images}
        selectedIndex={posterData.selectedImageIndex}
        onImageSelect={handleImageSelect}
      />
      
      <div className="poster-container">
        <PosterPreview
          posterData={posterData}
          isUpdating={isUpdating}
        />
      </div>
      
      <div className="preview-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <button type="button" className="btn btn-secondary" onClick={onEdit}>
          <i className="fas fa-edit"></i> Edit
        </button>
        <button 
          type="button" 
          className="btn btn-info" 
          onClick={handleDownloadPDF}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <><i className="fas fa-spinner fa-spin"></i> Gerando PDF...</>
          ) : (
            <><i className="fas fa-download"></i> Download PDF</>
          )}
        </button>
        <button type="button" className="btn btn-primary" onClick={() => setIsEmailModalOpen(true)}>
          <i className="fas fa-paper-plane"></i> Send Poster
        </button>
      </div>

      <div className="completion-section" style={{ marginTop: 'var(--spacing-xl)' }}>
        <button type="button" className="btn btn-success" onClick={onReset}>
          <i className="fas fa-plus"></i> Create Another Poster
        </button>
      </div>

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSend={handleSendEmail}
        posterData={posterData}
        isSending={isSending}
      />
    </section>
  )
}

export default PreviewStep
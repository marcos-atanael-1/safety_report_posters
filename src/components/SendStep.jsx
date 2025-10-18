import { useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import PosterPreview from './PosterPreview'

const SendStep = ({ posterData, emailStatus, setEmailStatus, onBack, onReset, showModal }) => {
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)

  const isValidEmail = (emailAddress) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(emailAddress)
  }

  const generatePosterPDF = async () => {
    try {
      const posterElement = document.querySelector('.poster')
      if (!posterElement) {
        throw new Error('Poster element not found')
      }
      
      console.log('Generating PDF for email...')
      
      // Captura o poster como imagem com alta qualidade
      const canvas = await html2canvas(posterElement, {
        backgroundColor: '#ffffff',
        scale: 4,
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: posterElement.scrollWidth,
        windowHeight: posterElement.scrollHeight
      })

      // Cria o PDF em modo retrato (portrait)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      })

      // Dimensões A4 retrato
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

      // Retorna o PDF como Blob
      return pdf.output('blob')
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw error
    }
  }

  const handleSendPoster = async () => {
    if (!email.trim()) {
      showModal('Please enter an email address', 'error')
      return
    }
    
    if (!isValidEmail(email)) {
      showModal('Please enter a valid email address', 'error')
      return
    }

    setIsSending(true)
    
    try {
      console.log('Starting to send poster...')
      
      // Gera o PDF
      const pdfBlob = await generatePosterPDF()
      console.log('PDF generated successfully')
      
      // Cria o FormData para enviar para a API
      const formData = new FormData()
      formData.append('email', email)
      formData.append('Name', posterData.name)
      formData.append('file', pdfBlob, `SafetyCircle_Poster_${posterData.name.replace(/\s+/g, '_')}.pdf`)
      
      console.log('Sending to API...')
      
      // Envia para a API
      const response = await fetch('https://agentes-n8n.pod3wz.easypanel.host/webhook/api/upload-email', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      console.log('API response:', response.status)
      
      // Atualiza o status
      setEmailStatus(prev => ({
        ...prev,
        sent: true
      }))
      
      showModal('Poster sent successfully!', 'success')
      
    } catch (error) {
      console.error('Error sending poster:', error)
      showModal(`Error sending poster: ${error.message}`, 'error')
    } finally {
      setIsSending(false)
    }
  }

  const showCompletion = emailStatus.sent

  return (
    <section className="step active">
      {/* Poster oculto para gerar PDF */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <PosterPreview posterData={posterData} isUpdating={false} />
      </div>
      
      <div className="step-header">
        <h2><i className="fas fa-paper-plane"></i> Step 4: Send Your Poster</h2>
        <p>Choose how to share your safety message</p>
      </div>
      <div className="step-back-only">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          <i className="fas fa-arrow-left"></i> Back to Preview
        </button>
      </div>
      
      <div className="send-options">
        <div className="send-option">
          <h3><i className="fas fa-envelope"></i> Send Poster via Email</h3>
          <p>Enter your email address to receive your safety poster</p>
          {!emailStatus.sent ? (
            <div className="email-input-group">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendPoster()}
              />
              <button 
                type="button"
                className="btn btn-primary"
                onClick={handleSendPoster}
                disabled={isSending}
              >
                {isSending ? (
                  <><i className="fas fa-spinner fa-spin"></i> Sending...</>
                ) : (
                  <><i className="fas fa-paper-plane"></i> Send Poster</>
                )}
              </button>
            </div>
          ) : (
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              <p><strong>Success!</strong> Your poster has been sent to {email}</p>
            </div>
          )}
        </div>
      </div>
      
      {showCompletion && (
        <div className="completion-section">
          <div className="completion-header">
            <i className="fas fa-check-circle"></i>
            <h3>Great Job!</h3>
            <p>Your safety poster has been sent. You can still send it to another destination or create a new poster.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={onReset}>
            <i className="fas fa-plus"></i> Create Another Poster
          </button>
        </div>
      )}
    </section>
  )
}

export default SendStep
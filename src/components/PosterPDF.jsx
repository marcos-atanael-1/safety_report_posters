import React from 'react'

const PosterPDF = ({ posterData }) => {
  const selectedImage = posterData.images[posterData.selectedImageIndex]

  if (!selectedImage) {
    return null
  }

  return (
    <div className="poster-pdf-wrapper" style={{ 
      margin: '0 auto', 
      padding: '20px', 
      width: '440px',
      maxWidth: '440px',
      minWidth: '440px',
      backgroundColor: '#ffffff',
      minHeight: '600px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Header do PDF */}
      <div className="pdf-header">
        <div className="pdf-logo">
          <img src="/images/Logo Safety.png" alt="SafetyCircle" className="pdf-logo-image" />
        </div>
      </div>

      {/* Poster */}
      <div className="poster poster-for-pdf">
        <div className="poster-title">
          <h1>Why I stay inside the Circle</h1>
        </div>
        <div className="poster-image-container">
          <img 
            src={selectedImage.url} 
            alt="Safety Image" 
            className="poster-image"
            crossOrigin="anonymous"
          />
        </div>
        <div className="poster-details">
          <p className="poster-reason"><strong>What's Important:</strong> {posterData.reason}</p>
          <p className="poster-name"><strong>Name:</strong> {posterData.name}</p>
          <p className="poster-role"><strong>Role:</strong> {posterData.role}</p>
        </div>
        <div className="poster-footer poster-footer-no-icon">
          <div className="poster-footer-text">
            Manage Risks Well | Go Home Safe and Well Today
          </div>
        </div>
      </div>
    </div>
  )
}

export default PosterPDF


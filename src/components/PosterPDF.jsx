import React from 'react'

const PosterPDF = ({ posterData }) => {
  const selectedImage = posterData.images[posterData.selectedImageIndex]

  if (!selectedImage) {
    return null
  }

  return (
    <div className="poster-pdf-wrapper" style={{ 
      margin: 0, 
      padding: '10px 20px 20px 20px', 
      width: '400px',
      maxWidth: '400px',
      minWidth: '400px',
      backgroundColor: '#ffffff',
      minHeight: '600px'
    }}>
      {/* Header do PDF */}
      <div className="pdf-header">
        <div className="pdf-logo">
          <img src="/images/safetycircle-logo.png" alt="SafetyCircle" className="pdf-logo-image" />
          <div className="pdf-logo-text">
            <h2>SafetyCircle®</h2>
          </div>
        </div>
      </div>

      {/* Poster */}
      <div className="poster poster-for-pdf">
        <div className="poster-title">
          <h1>Why I stay inside the Circle</h1>
        </div>
        <img 
          src={selectedImage.url} 
          alt="Safety Image" 
          className="poster-image"
          crossOrigin="anonymous"
          style={{
            width: '100%',
            height: 'auto',
            minHeight: '180px',
            maxHeight: '250px',
            objectFit: 'contain',
            backgroundColor: '#f5f5f5',
            display: 'block'
          }}
        />
        <div className="poster-details">
          <p><strong>Name:</strong> {posterData.name}</p>
          <p><strong>Role:</strong> {posterData.role}</p>
          <p><strong>What's Important:</strong> {posterData.reason}</p>
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


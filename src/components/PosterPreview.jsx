import React from 'react'

const PosterPreview = ({ posterData, isUpdating }) => {
  const selectedImage = posterData.images[posterData.selectedImageIndex]

  if (!selectedImage) {
    return null
  }

  return (
    <div 
      className="poster"
      style={{ opacity: isUpdating ? '0.7' : '1' }}
    >
      <div className="poster-title">
        <h1>Why I stay inside the Circle</h1>
      </div>
      <img 
        src={selectedImage.url} 
        alt="Safety Image" 
        className="poster-image"
        crossOrigin="anonymous"
      />
      <div className="poster-details">
        <p><strong>Name:</strong> {posterData.name}</p>
        <p><strong>Role:</strong> {posterData.role}</p>
        <p><strong>What's Important:</strong> {posterData.reason}</p>
      </div>
      <div className="poster-footer">
        <div className="poster-footer-text">
          Manage Risks Well | Go Home Safe and Well Today
        </div>
      </div>
    </div>
  )
}

export default PosterPreview
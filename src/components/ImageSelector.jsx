import React from 'react'

const ImageSelector = ({ images, selectedIndex, onImageSelect }) => {
  if (images.length <= 1) {
    return null
  }

  return (
    <div className="image-selector-container">
      <div className="image-selector-header">
        <h3><i className="fas fa-images"></i> Choose Main Image</h3>
        <p>Click on an image to see it in your poster</p>
      </div>
      <div className="image-thumbnails">
        {images.map((image, index) => (
          <div
            key={index}
            className={`image-thumbnail ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => onImageSelect(index)}
          >
            <img src={image.url} alt={`Image ${index + 1}`} />
            <div className="image-thumbnail-overlay">
              <i className={`fas ${index === selectedIndex ? 'fa-check' : 'fa-eye'} thumbnail-icon`}></i>
            </div>
            <div className="image-thumbnail-number">{index + 1}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageSelector
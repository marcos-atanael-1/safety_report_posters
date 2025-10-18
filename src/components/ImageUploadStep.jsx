import React, { useRef } from 'react'

const ImageUploadStep = ({ posterData, addImage, removeImage, onBack, onContinue }) => {
  const fileInputRef = useRef(null)

  const handleFileSelect = (files) => {
    const maxFiles = 4
    const remainingSlots = maxFiles - posterData.images.length
    
    if (remainingSlots <= 0) {
      alert('Máximo de 4 imagens permitido')
      return
    }

    const filesToProcess = Math.min(files.length, remainingSlots)
    
    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i]
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageData = {
            file: file,
            url: e.target.result,
            name: file.name
          }
          addImage(imageData)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      handleFileSelect(e.target.files)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.style.backgroundColor = 'var(--light-green)'
  }

  const handleDragLeave = (e) => {
    e.currentTarget.style.backgroundColor = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.style.backgroundColor = ''
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  return (
    <section className="step active">
      <div className="step-header">
        <h2><i className="fas fa-images"></i> Step 2: Add Your Photos</h2>
        <p>Upload up to 4 pictures that represent your story</p>
      </div>
      <div className="image-upload-container">
        <div
          className="upload-area"
          onClick={handleUploadAreaClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <i className="fas fa-cloud-upload-alt"></i>
          <p>Click or drag photos here</p>
          <p className="upload-limit">Maximum 4 images</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />
        </div>
        <div className="image-preview">
          {posterData.images.map((image, index) => (
            <div key={index} className="image-item">
              <img src={image.url} alt={image.name} />
              <button
                className="image-remove"
                onClick={() => removeImage(index)}
                type="button"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="step-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <button type="button" className="btn btn-primary" onClick={onContinue}>
          Preview Poster <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </section>
  )
}

export default ImageUploadStep
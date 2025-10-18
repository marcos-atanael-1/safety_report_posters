import React from 'react'

const Modal = ({ message, type, onClose }) => {
  if (!message) return null

  const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'
  const iconColor = type === 'success' ? '#4CAF50' : '#F44336'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <i 
            className={`fas ${iconClass}`}
            style={{ color: iconColor, fontSize: '3rem' }}
          />
        </div>
        <p className="modal-message">{message}</p>
        <button className="btn btn-primary modal-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  )
}

export default Modal


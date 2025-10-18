import React from 'react'

const FormStep = ({ posterData, updatePosterData, onContinue }) => {
  const handleInputChange = (field) => (e) => {
    updatePosterData(field, e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onContinue()
  }

  return (
    <section className="step active">
      <div className="step-header">
        <h2><i className="fas fa-edit"></i> Step 1: Tell Your Story</h2>
        <p>Share why you stay inside the SafetyCircle®</p>
      </div>
      <form className="poster-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reason">Why do you stay inside the SafetyCircle®?</label>
          <textarea
            id="reason"
            name="reason"
            placeholder="Tell us what's important to you..."
            rows="4"
            value={posterData.reason}
            onChange={handleInputChange('reason')}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              value={posterData.name}
              onChange={handleInputChange('name')}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <input
              type="text"
              id="role"
              name="role"
              placeholder="Your role/position"
              value={posterData.role}
              onChange={handleInputChange('role')}
              required
            />
          </div>
        </div>
      </form>
      <div className="step-actions step-actions-center">
        <button type="button" className="btn btn-primary" onClick={onContinue}>
          Continue <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </section>
  )
}

export default FormStep
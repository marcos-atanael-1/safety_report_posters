import React from 'react'

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="/images/safetycircle-logo.png" alt="SafetyCircle" className="logo-image" />
        <div className="logo-text">
          <h1>SafetyCircle®</h1>
          <p>Poster Generator</p>
        </div>
      </div>
    </header>
  )
}

export default Header
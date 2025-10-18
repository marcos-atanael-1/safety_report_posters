import { useState } from 'react'
import Header from './components/Header'
import FormStep from './components/FormStep'
import ImageUploadStep from './components/ImageUploadStep'
import PreviewStep from './components/PreviewStep'
import StepNavigation from './components/StepNavigation'
import Modal from './components/Modal'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [posterData, setPosterData] = useState({
    name: '',
    role: '',
    reason: '',
    images: [],
    selectedImageIndex: 0
  })
  const [modalState, setModalState] = useState({ message: null, type: null })

  const showModal = (message, type = 'success') => {
    setModalState({ message, type })
    setTimeout(() => {
      setModalState({ message: null, type: null })
    }, 3000)
  }

  const maxStep = 3

  const updatePosterData = (field, value) => {
    setPosterData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addImage = (imageData) => {
    setPosterData(prev => ({
      ...prev,
      images: [...prev.images, imageData]
    }))
  }

  const removeImage = (index) => {
    setPosterData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const selectImage = (index) => {
    setPosterData(prev => ({
      ...prev,
      selectedImageIndex: index
    }))
  }

  const goToStep = (step) => {
    if (step >= 1 && step <= maxStep) {
      setCurrentStep(step)
    }
  }

  const validateForm = () => {
    const { name, role, reason } = posterData
    if (!name.trim() || !role.trim() || !reason.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return false
    }
    return true
  }

  const validateImages = () => {
    if (posterData.images.length === 0) {
      alert('Por favor, adicione pelo menos uma imagem')
      return false
    }
    return true
  }

  const resetApp = () => {
    setPosterData({
      name: '',
      role: '',
      reason: '',
      images: [],
      selectedImageIndex: 0
    })
    setCurrentStep(1)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStep
            posterData={posterData}
            updatePosterData={updatePosterData}
            onContinue={() => {
              if (validateForm()) {
                goToStep(2)
              }
            }}
          />
        )
      case 2:
        return (
          <ImageUploadStep
            posterData={posterData}
            addImage={addImage}
            removeImage={removeImage}
            onBack={() => goToStep(1)}
            onContinue={() => {
              if (validateImages()) {
                setPosterData(prev => ({ ...prev, selectedImageIndex: 0 }))
                goToStep(3)
              }
            }}
          />
        )
      case 3:
        return (
          <PreviewStep
            posterData={posterData}
            selectImage={selectImage}
            onBack={() => goToStep(2)}
            onEdit={() => goToStep(1)}
            onReset={resetApp}
            showModal={showModal}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="container">
      <Header />
      <main className="main-content">
        {renderStep()}
      </main>
      <StepNavigation currentStep={currentStep} maxStep={maxStep} />
      <Modal
        message={modalState.message}
        type={modalState.type}
        onClose={() => setModalState({ message: null, type: null })}
      />
    </div>
  )
}

export default App
/**
 * SafetyCircle Poster Generator - Main Application
 * Client-side only, no server dependencies
 */

'use strict';

// ===================================
// UI Strings (i18n-ready)
// ===================================
const strings = {
    uploadSuccess: 'Image uploaded successfully!',
    uploadError: 'Failed to upload image. Please try again.',
    uploadSizeError: 'File is too large. Maximum size is 20MB.',
    uploadTypeError: 'Unsupported file type. Please use JPG, PNG, or HEIC.',
    heicNotSupported: 'HEIC format is not supported in your browser. Please convert to JPG or PNG.',
    cropperError: 'Image cropping failed. Please try with a different image.',
    exportPNGSuccess: 'Poster downloaded as PNG!',
    exportPDFSuccess: 'Poster downloaded as PDF!',
    exportError: 'Export failed. Please try again.',
    draftSaved: 'Draft saved successfully!',
    draftRestored: 'Draft restored from previous session.',
    resetConfirm: 'Are you sure you want to reset all data? This action cannot be undone.',
    resetSuccess: 'All data has been reset.',
    requiredFields: 'Please fill in all required fields.',
    messageOverflow: 'Message is longer than recommended. Consider shortening it.',
};

// ===================================
// Application State
// ===================================
const appState = {
    currentStep: 1,
    cropper: null,
    croppedImageDataURL: null,
    formData: {
        message: '',
        name: '',
        role: '',
    },
    adminSettings: {
        headline: 'Why I stay inside the SafetyCircle',
        footer: 'Manage Risks Well • Go Home Safe and Well Today',
        showLogo: true,
        showQR: false,
    },
    isAdminMode: false,
};

// ===================================
// DOM References
// ===================================
const DOM = {
    // Steps
    steps: document.querySelectorAll('.wizard-step'),
    progressSteps: document.querySelectorAll('.progress-steps .step'),
    
    // Step 1: Upload & Crop
    uploadArea: document.getElementById('uploadArea'),
    imageInput: document.getElementById('imageInput'),
    cropperContainer: document.getElementById('cropperContainer'),
    cropperImage: document.getElementById('cropperImage'),
    zoomInBtn: document.getElementById('zoomInBtn'),
    zoomOutBtn: document.getElementById('zoomOutBtn'),
    resetCropBtn: document.getElementById('resetCropBtn'),
    nextStep1: document.getElementById('nextStep1'),
    uploadToast: document.getElementById('uploadToast'),
    
    // Step 2: Message
    messageInput: document.getElementById('messageInput'),
    charCount: document.getElementById('charCount'),
    messageCounter: document.getElementById('messageCounter'),
    messageWarning: document.getElementById('messageWarning'),
    prevStep2: document.getElementById('prevStep2'),
    nextStep2: document.getElementById('nextStep2'),
    
    // Step 3: Details
    nameInput: document.getElementById('nameInput'),
    roleInput: document.getElementById('roleInput'),
    prevStep3: document.getElementById('prevStep3'),
    nextStep3: document.getElementById('nextStep3'),
    
    // Step 4: Preview & Export
    prevStep4: document.getElementById('prevStep4'),
    posterPreview: document.getElementById('posterPreview'),
    posterHeadline: document.getElementById('posterHeadline'),
    posterImage: document.getElementById('posterImage'),
    posterMessage: document.getElementById('posterMessage'),
    posterName: document.getElementById('posterName'),
    posterRole: document.getElementById('posterRole'),
    posterFooter: document.getElementById('posterFooter'),
    posterFooterText: document.getElementById('posterFooterText'),
    posterLogo: document.getElementById('posterLogo'),
    posterQR: document.getElementById('posterQR'),
    posterCaption: document.getElementById('posterCaption'),
    downloadPNGBtn: document.getElementById('downloadPNGBtn'),
    downloadPDFBtn: document.getElementById('downloadPDFBtn'),
    saveDraftBtn: document.getElementById('saveDraftBtn'),
    resetBtn: document.getElementById('resetBtn'),
    exportToast: document.getElementById('exportToast'),
    
    // Admin
    adminToggle: document.getElementById('adminToggle'),
    adminControls: document.getElementById('adminControls'),
    headlineInput: document.getElementById('headlineInput'),
    footerInput: document.getElementById('footerInput'),
    showLogoToggle: document.getElementById('showLogoToggle'),
    showQRToggle: document.getElementById('showQRToggle'),
    
    // Help Modal
    helpBtn: document.getElementById('helpBtn'),
    helpModal: document.getElementById('helpModal'),
    modalClose: document.querySelector('.modal-close'),
    closeModalBtn: document.querySelector('.close-modal'),
};

// ===================================
// Utility Functions
// ===================================

/**
 * Show toast notification
 */
function showToast(message, type = 'success', container = DOM.uploadToast) {
    container.textContent = message;
    container.className = `toast ${type} show`;
    
    setTimeout(() => {
        container.classList.remove('show');
    }, 3000);
}

/**
 * Capitalize each word in a string
 */
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Trim excess whitespace
 */
function trimWhitespace(str) {
    return str.trim().replace(/\s+/g, ' ');
}

/**
 * Navigate to a specific step
 */
function goToStep(stepNumber) {
    // Hide all steps
    DOM.steps.forEach(step => {
        step.classList.remove('active');
        step.hidden = true;
    });
    
    // Show target step
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
        targetStep.hidden = false;
    }
    
    // Update progress indicators
    DOM.progressSteps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum < stepNumber) {
            step.classList.add('completed');
        } else if (stepNum === stepNumber) {
            step.classList.add('active');
        }
    });
    
    appState.currentStep = stepNumber;
    
    // Update poster preview if on step 4
    if (stepNumber === 4) {
        updatePosterPreview();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Validate current step
 */
function validateStep(stepNumber) {
    switch (stepNumber) {
        case 1:
            return appState.croppedImageDataURL !== null;
        case 2:
            return appState.formData.message.trim().length > 0;
        case 3:
            return appState.formData.name.trim().length > 0 && 
                   appState.formData.role.trim().length > 0;
        default:
            return true;
    }
}

/**
 * Enable/disable next button based on validation
 */
function updateNextButton(stepNumber) {
    const button = document.getElementById(`nextStep${stepNumber}`);
    if (button) {
        button.disabled = !validateStep(stepNumber);
    }
}

// ===================================
// Image Upload & Cropping
// ===================================

/**
 * Handle image file selection
 */
function handleImageSelect(file) {
    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
        showToast(strings.uploadSizeError, 'error');
        return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
    if (!validTypes.includes(file.type)) {
        showToast(strings.uploadTypeError, 'error');
        return;
    }
    
    // Check HEIC support
    if ((file.type === 'image/heic' || file.type === 'image/heif') && !supportsHEIC()) {
        showToast(strings.heicNotSupported, 'warning');
        return;
    }
    
    // Read file and initialize cropper
    const reader = new FileReader();
    reader.onload = (e) => {
        initializeCropper(e.target.result);
        showToast(strings.uploadSuccess, 'success');
    };
    reader.onerror = () => {
        showToast(strings.uploadError, 'error');
    };
    reader.readAsDataURL(file);
}

/**
 * Check if browser supports HEIC
 */
function supportsHEIC() {
    // Most browsers don't support HEIC natively
    // This is a simple check; in production you might use a library
    return false;
}

/**
 * Initialize Cropper.js
 */
function initializeCropper(imageDataURL) {
    // Show cropper container
    DOM.uploadArea.style.display = 'none';
    DOM.cropperContainer.hidden = false;
    
    // Destroy existing cropper if any
    if (appState.cropper) {
        appState.cropper.destroy();
    }
    
    // Set image source
    DOM.cropperImage.src = imageDataURL;
    
    // Initialize Cropper with A4 portrait aspect ratio (210:297 ≈ 0.707)
    appState.cropper = new Cropper(DOM.cropperImage, {
        aspectRatio: 210 / 297,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 1,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        ready: function() {
            // Auto-crop and enable next button
            updateCroppedImage();
        },
        crop: function() {
            // Update cropped image when user adjusts
            updateCroppedImage();
        }
    });
}

/**
 * Update cropped image data
 */
function updateCroppedImage() {
    if (!appState.cropper) return;
    
    try {
        // Get cropped canvas with high quality
        const canvas = appState.cropper.getCroppedCanvas({
            maxWidth: 2100,  // High resolution for printing
            maxHeight: 2970,
            fillColor: '#fff',
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        });
        
        if (canvas) {
            appState.croppedImageDataURL = canvas.toDataURL('image/jpeg', 0.95);
            updateNextButton(1);
        }
    } catch (error) {
        console.error('Cropping error:', error);
        showToast(strings.cropperError, 'error');
    }
}

/**
 * Zoom cropper
 */
function zoomCropper(delta) {
    if (appState.cropper) {
        appState.cropper.zoom(delta);
    }
}

/**
 * Reset cropper
 */
function resetCropper() {
    if (appState.cropper) {
        appState.cropper.reset();
    }
}

// ===================================
// Form Handling
// ===================================

/**
 * Update character counter
 */
function updateCharCounter() {
    const length = DOM.messageInput.value.length;
    DOM.charCount.textContent = length;
    
    // Update counter color
    if (length > 140) {
        DOM.messageCounter.classList.add('warning');
        DOM.messageWarning.hidden = false;
    } else {
        DOM.messageCounter.classList.remove('warning');
        DOM.messageWarning.hidden = true;
    }
    
    if (length > 200) {
        DOM.messageCounter.classList.add('error');
    } else {
        DOM.messageCounter.classList.remove('error');
    }
}

/**
 * Handle message input
 */
function handleMessageInput() {
    appState.formData.message = DOM.messageInput.value;
    updateCharCounter();
    updateNextButton(2);
}

/**
 * Handle name input
 */
function handleNameInput() {
    appState.formData.name = DOM.nameInput.value;
    updateNextButton(3);
}

/**
 * Handle name blur (auto-capitalize)
 */
function handleNameBlur() {
    const trimmed = trimWhitespace(DOM.nameInput.value);
    const capitalized = capitalizeWords(trimmed);
    DOM.nameInput.value = capitalized;
    appState.formData.name = capitalized;
}

/**
 * Handle role input
 */
function handleRoleInput() {
    appState.formData.role = DOM.roleInput.value;
    updateNextButton(3);
}

/**
 * Handle role blur (trim whitespace)
 */
function handleRoleBlur() {
    const trimmed = trimWhitespace(DOM.roleInput.value);
    DOM.roleInput.value = trimmed;
    appState.formData.role = trimmed;
}

// ===================================
// Poster Preview
// ===================================

/**
 * Update poster preview with current data
 */
function updatePosterPreview() {
    // Update image
    if (appState.croppedImageDataURL) {
        DOM.posterImage.src = appState.croppedImageDataURL;
    }
    
    // Update text content
    DOM.posterMessage.textContent = appState.formData.message;
    DOM.posterName.textContent = appState.formData.name;
    DOM.posterRole.textContent = appState.formData.role;
    
    // Update admin settings
    DOM.posterHeadline.textContent = appState.adminSettings.headline;
    DOM.posterFooterText.textContent = appState.adminSettings.footer;
    DOM.posterLogo.hidden = !appState.adminSettings.showLogo;
    DOM.posterQR.hidden = !appState.adminSettings.showQR;
    
    // Adjust caption band opacity based on image brightness
    adjustCaptionOpacity();
}

/**
 * Adjust caption band opacity for better text legibility
 */
function adjustCaptionOpacity() {
    // This is a simplified version
    // In production, you might analyze the image's bottom portion brightness
    // and adjust the gradient accordingly
    const defaultGradient = 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.65) 100%)';
    DOM.posterCaption.style.background = defaultGradient;
}

// ===================================
// Admin Mode
// ===================================

/**
 * Toggle admin mode
 */
function toggleAdminMode() {
    appState.isAdminMode = DOM.adminToggle.checked;
    DOM.adminControls.hidden = !appState.isAdminMode;
    saveAdminSettings();
}

/**
 * Handle admin settings change
 */
function handleAdminSettingsChange() {
    appState.adminSettings.headline = DOM.headlineInput.value;
    appState.adminSettings.footer = DOM.footerInput.value;
    appState.adminSettings.showLogo = DOM.showLogoToggle.checked;
    appState.adminSettings.showQR = DOM.showQRToggle.checked;
    
    updatePosterPreview();
    saveAdminSettings();
}

/**
 * Save admin settings to localStorage
 */
function saveAdminSettings() {
    try {
        localStorage.setItem('safetycircle_admin_settings', JSON.stringify(appState.adminSettings));
        localStorage.setItem('safetycircle_admin_mode', appState.isAdminMode);
    } catch (error) {
        console.error('Failed to save admin settings:', error);
    }
}

/**
 * Load admin settings from localStorage
 */
function loadAdminSettings() {
    try {
        const savedSettings = localStorage.getItem('safetycircle_admin_settings');
        const savedMode = localStorage.getItem('safetycircle_admin_mode');
        
        if (savedSettings) {
            appState.adminSettings = { ...appState.adminSettings, ...JSON.parse(savedSettings) };
            DOM.headlineInput.value = appState.adminSettings.headline;
            DOM.footerInput.value = appState.adminSettings.footer;
            DOM.showLogoToggle.checked = appState.adminSettings.showLogo;
            DOM.showQRToggle.checked = appState.adminSettings.showQR;
        }
        
        if (savedMode) {
            appState.isAdminMode = savedMode === 'true';
            DOM.adminToggle.checked = appState.isAdminMode;
            DOM.adminControls.hidden = !appState.isAdminMode;
        }
    } catch (error) {
        console.error('Failed to load admin settings:', error);
    }
}

// ===================================
// Export Functions
// ===================================

/**
 * Export poster as PNG
 */
async function exportPNG() {
    try {
        // Show loading state
        DOM.downloadPNGBtn.disabled = true;
        DOM.downloadPNGBtn.innerHTML = '<span aria-hidden="true">⏳</span> Generating...';
        
        // Use html2canvas to capture the poster
        const canvas = await html2canvas(DOM.posterPreview, {
            scale: 3, // High quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
        });
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `SafetyCircle-Poster-${appState.formData.name.replace(/\s+/g, '-')}-${Date.now()}.png`;
            link.click();
            URL.revokeObjectURL(url);
            
            showToast(strings.exportPNGSuccess, 'success', DOM.exportToast);
            
            // Reset button
            DOM.downloadPNGBtn.disabled = false;
            DOM.downloadPNGBtn.innerHTML = '<span aria-hidden="true">📥</span> Download PNG';
        }, 'image/png');
        
    } catch (error) {
        console.error('PNG export error:', error);
        showToast(strings.exportError, 'error', DOM.exportToast);
        
        // Reset button
        DOM.downloadPNGBtn.disabled = false;
        DOM.downloadPNGBtn.innerHTML = '<span aria-hidden="true">📥</span> Download PNG';
    }
}

/**
 * Export poster as PDF (A4)
 */
async function exportPDF() {
    try {
        // Show loading state
        DOM.downloadPDFBtn.disabled = true;
        DOM.downloadPDFBtn.innerHTML = '<span aria-hidden="true">⏳</span> Generating...';
        
        // Use html2canvas to capture the poster
        const canvas = await html2canvas(DOM.posterPreview, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
        });
        
        // Get jsPDF from global
        const { jsPDF } = window.jspdf;
        
        // Create PDF (A4 portrait: 210mm x 297mm)
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });
        
        // Convert canvas to image
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Add image to PDF (full bleed, no margins)
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        
        // Download PDF
        pdf.save(`SafetyCircle-Poster-${appState.formData.name.replace(/\s+/g, '-')}-${Date.now()}.pdf`);
        
        showToast(strings.exportPDFSuccess, 'success', DOM.exportToast);
        
        // Reset button
        DOM.downloadPDFBtn.disabled = false;
        DOM.downloadPDFBtn.innerHTML = '<span aria-hidden="true">📄</span> Download PDF (A4)';
        
    } catch (error) {
        console.error('PDF export error:', error);
        showToast(strings.exportError, 'error', DOM.exportToast);
        
        // Reset button
        DOM.downloadPDFBtn.disabled = false;
        DOM.downloadPDFBtn.innerHTML = '<span aria-hidden="true">📄</span> Download PDF (A4)';
    }
}

// ===================================
// Draft Save/Restore
// ===================================

/**
 * Save draft to localStorage
 */
function saveDraft() {
    try {
        const draft = {
            formData: appState.formData,
            croppedImageDataURL: appState.croppedImageDataURL,
            currentStep: appState.currentStep,
            timestamp: Date.now(),
        };
        
        localStorage.setItem('safetycircle_draft', JSON.stringify(draft));
        showToast(strings.draftSaved, 'success', DOM.exportToast);
    } catch (error) {
        console.error('Failed to save draft:', error);
        showToast('Failed to save draft. Storage might be full.', 'error', DOM.exportToast);
    }
}

/**
 * Auto-save draft on form changes
 */
function autoSaveDraft() {
    // Debounced save
    if (autoSaveDraft.timeout) {
        clearTimeout(autoSaveDraft.timeout);
    }
    
    autoSaveDraft.timeout = setTimeout(() => {
        saveDraft();
    }, 2000);
}

/**
 * Restore draft from localStorage
 */
function restoreDraft() {
    try {
        const savedDraft = localStorage.getItem('safetycircle_draft');
        if (!savedDraft) return false;
        
        const draft = JSON.parse(savedDraft);
        
        // Restore form data
        appState.formData = draft.formData;
        DOM.messageInput.value = draft.formData.message;
        DOM.nameInput.value = draft.formData.name;
        DOM.roleInput.value = draft.formData.role;
        
        // Restore cropped image
        if (draft.croppedImageDataURL) {
            appState.croppedImageDataURL = draft.croppedImageDataURL;
            
            // Show cropped image in step 1
            DOM.uploadArea.style.display = 'none';
            DOM.cropperContainer.hidden = false;
            DOM.cropperImage.src = draft.croppedImageDataURL;
            
            // Initialize cropper with saved image
            initializeCropper(draft.croppedImageDataURL);
        }
        
        // Update character counter
        updateCharCounter();
        
        // Update validation
        updateNextButton(1);
        updateNextButton(2);
        updateNextButton(3);
        
        showToast(strings.draftRestored, 'success');
        
        return true;
    } catch (error) {
        console.error('Failed to restore draft:', error);
        return false;
    }
}

/**
 * Reset all data
 */
function resetAll() {
    if (!confirm(strings.resetConfirm)) {
        return;
    }
    
    try {
        // Clear localStorage
        localStorage.removeItem('safetycircle_draft');
        
        // Reset state
        appState.currentStep = 1;
        appState.croppedImageDataURL = null;
        appState.formData = { message: '', name: '', role: '' };
        
        // Destroy cropper
        if (appState.cropper) {
            appState.cropper.destroy();
            appState.cropper = null;
        }
        
        // Reset UI
        DOM.messageInput.value = '';
        DOM.nameInput.value = '';
        DOM.roleInput.value = '';
        DOM.cropperContainer.hidden = true;
        DOM.uploadArea.style.display = '';
        updateCharCounter();
        
        // Go to step 1
        goToStep(1);
        
        showToast(strings.resetSuccess, 'success', DOM.exportToast);
    } catch (error) {
        console.error('Reset error:', error);
    }
}

// ===================================
// Help Modal
// ===================================

/**
 * Open help modal
 */
function openHelpModal() {
    DOM.helpModal.hidden = false;
    DOM.modalClose.focus();
}

/**
 * Close help modal
 */
function closeHelpModal() {
    DOM.helpModal.hidden = true;
    DOM.helpBtn.focus();
}

// ===================================
// Event Listeners
// ===================================

function attachEventListeners() {
    // Step 1: Upload & Crop
    DOM.uploadArea.addEventListener('click', () => DOM.imageInput.click());
    DOM.uploadArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            DOM.imageInput.click();
        }
    });
    
    DOM.imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageSelect(e.target.files[0]);
        }
    });
    
    // Drag and drop
    DOM.uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        DOM.uploadArea.classList.add('drag-over');
    });
    
    DOM.uploadArea.addEventListener('dragleave', () => {
        DOM.uploadArea.classList.remove('drag-over');
    });
    
    DOM.uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        DOM.uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
            handleImageSelect(e.dataTransfer.files[0]);
        }
    });
    
    // Cropper controls
    DOM.zoomInBtn.addEventListener('click', () => zoomCropper(0.1));
    DOM.zoomOutBtn.addEventListener('click', () => zoomCropper(-0.1));
    DOM.resetCropBtn.addEventListener('click', resetCropper);
    
    // Step navigation
    DOM.nextStep1.addEventListener('click', () => goToStep(2));
    DOM.prevStep2.addEventListener('click', () => goToStep(1));
    DOM.nextStep2.addEventListener('click', () => goToStep(3));
    DOM.prevStep3.addEventListener('click', () => goToStep(2));
    DOM.nextStep3.addEventListener('click', () => goToStep(4));
    DOM.prevStep4.addEventListener('click', () => goToStep(3));
    
    // Step 2: Message
    DOM.messageInput.addEventListener('input', () => {
        handleMessageInput();
        autoSaveDraft();
    });
    
    // Step 3: Details
    DOM.nameInput.addEventListener('input', () => {
        handleNameInput();
        autoSaveDraft();
    });
    DOM.nameInput.addEventListener('blur', handleNameBlur);
    
    DOM.roleInput.addEventListener('input', () => {
        handleRoleInput();
        autoSaveDraft();
    });
    DOM.roleInput.addEventListener('blur', handleRoleBlur);
    
    // Admin mode
    DOM.adminToggle.addEventListener('change', toggleAdminMode);
    DOM.headlineInput.addEventListener('input', handleAdminSettingsChange);
    DOM.footerInput.addEventListener('input', handleAdminSettingsChange);
    DOM.showLogoToggle.addEventListener('change', handleAdminSettingsChange);
    DOM.showQRToggle.addEventListener('change', handleAdminSettingsChange);
    
    // Export
    DOM.downloadPNGBtn.addEventListener('click', exportPNG);
    DOM.downloadPDFBtn.addEventListener('click', exportPDF);
    
    // Draft
    DOM.saveDraftBtn.addEventListener('click', saveDraft);
    DOM.resetBtn.addEventListener('click', resetAll);
    
    // Help modal
    DOM.helpBtn.addEventListener('click', openHelpModal);
    DOM.modalClose.addEventListener('click', closeHelpModal);
    DOM.closeModalBtn.addEventListener('click', closeHelpModal);
    
    // Modal overlay click
    DOM.helpModal.addEventListener('click', (e) => {
        if (e.target === DOM.helpModal || e.target.classList.contains('modal-overlay')) {
            closeHelpModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape to close modal
        if (e.key === 'Escape' && !DOM.helpModal.hidden) {
            closeHelpModal();
        }
    });
}

// ===================================
// Initialization
// ===================================

function init() {
    console.log('SafetyCircle Poster Generator initialized');
    
    // Attach event listeners
    attachEventListeners();
    
    // Load admin settings
    loadAdminSettings();
    
    // Try to restore draft
    restoreDraft();
    
    // Initialize step validation
    updateNextButton(1);
    updateNextButton(2);
    updateNextButton(3);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

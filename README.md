# SafetyCircle® Poster Generator

A modern React web application built with Vite that allows users to create personalized safety posters following the SafetyCircle® brand guidelines. The app guides users through a 4-step process to create, preview, and share their safety messages.

## 🎯 Project Goals

Create a modern, intuitive React web application that enables employees to:
- Generate personalized safety posters with their photos and safety messages
- Share their commitment to workplace safety
- Distribute posters to organizations for printing and display
- Promote safety culture through personal storytelling

## ✨ Currently Completed Features

### ✅ Core Functionality
- **4-Step Workflow**: Streamlined user experience from form input to poster distribution
- **Navigation Controls**: Back buttons on all steps (2-4) for easy navigation
- **Form Input**: Capture user details (name, role, safety message)
- **Image Upload**: Support for up to 4 images with drag-and-drop functionality
- **Poster Preview**: Real-time poster generation matching SafetyCircle branding
- **Image Selection**: Interactive thumbnails to preview poster with different uploaded images
- **Email Distribution**: Independent sending to organization and personal emails with individual success tracking

### ✅ Design & UX
- **SafetyCircle® Branding**: Official SafetyCircle.com.au logo, colors, typography, and visual identity
- **Responsive Design**: Optimized for mobile and desktop devices
- **Modern UI**: Clean, intuitive interface with step-by-step guidance
- **Interactive Preview**: Thumbnail-based image selection for dynamic poster preview
- **Progress Indicators**: Visual feedback showing user progress
- **Print Optimization**: CSS optimized for A4/A3 printing

### ✅ Technical Implementation
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Component Architecture**: Modular, reusable React components
- **State Management**: React useState and props for data flow
- **Image Handling**: File upload, preview, and base64 conversion
- **Email Integration**: EmailJS setup for email distribution
- **PDF Generation**: HTML2Canvas + jsPDF for high-quality poster PDF creation
- **Email Attachments**: Posters generated as PDF files for professional distribution

## 📋 Functional Entry Points

### Main Application Flow
- **Entry Point**: `index.html` - Main application interface
- **Step 1**: Form input (`/` - Form section) 
- **Step 2**: Image upload (`/` - Image upload section)
- **Step 3**: Poster preview with image selection (`/` - Preview section)
  - Interactive thumbnails for multiple uploaded images
  - Real-time poster update when selecting different images
  - PDF download functionality for testing
  - Smooth transitions and visual feedback
- **Step 4**: Email distribution (`/` - Send section)
  - Independent sending to organization and personal emails
  - Individual success messages and status tracking
  - Option to send to both destinations separately

### Required Setup Parameters
- **EmailJS Configuration**: Update `YOUR_PUBLIC_KEY` in `js/app.js`
- **Email Addresses**: Users input both organization and personal email addresses in the app
- **Logo Assets**: Official SafetyCircle® logo from safetycircle.com.au included in header

## 🛠 Technical Stack

### Frontend Technologies
- **React 18**: Modern React with hooks and functional components
- **Vite**: Next-generation frontend build tool
- **CSS3**: Custom properties, Grid, Flexbox, responsive design
- **JavaScript ES6+**: Modern JavaScript with React JSX
- **Font Awesome**: Icon library via CDN
- **Google Fonts**: Inter font family

### Dependencies
- **React**: ^18.2.0 - UI library
- **React DOM**: ^18.2.0 - React DOM renderer
- **html2canvas**: ^1.4.1 - Canvas generation for PDF creation
- **jsPDF**: ^2.5.1 - PDF generation and download functionality
- **emailjs-com**: ^3.2.0 - Email sending service
- **Vite**: ^5.0.8 - Build tool and dev server
- **ESLint**: Code linting and formatting

### Browser Compatibility
- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile Support**: iOS Safari 13+, Android Chrome 80+
- **Required Features**: ES6 Modules, Canvas, FileReader, React 18
- **Development**: Vite dev server with hot module replacement

## 📁 Project Structure

```
safetycircle-poster-generator/
├── index.html              # Vite entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.jsx            # React application entry
│   ├── App.jsx             # Main App component
│   ├── index.css           # Global styles with SafetyCircle branding
│   └── components/         # React components
│       ├── Header.jsx
│       ├── FormStep.jsx
│       ├── ImageUploadStep.jsx
│       ├── PreviewStep.jsx
│       ├── PosterPreview.jsx
│       ├── ImageSelector.jsx
│       ├── SendStep.jsx
│       └── StepNavigation.jsx
├── public/
│   └── images/
│       └── safetycircle-logo.png
└── README.md              # Project documentation
```

## 🚀 Development

### Standalone Version (Current)
The application is currently configured to run directly in the browser using React via CDN. Simply open `index.html` in a modern web browser and the application will work immediately.

**Features:**
- **No Build Process**: Works directly in browser
- **React 18**: Via CDN for immediate functionality  
- **Babel**: In-browser JSX transformation
- **Hot Reload**: Manual refresh to see changes

### Full Development Setup (Optional)
For a full development environment with Vite:

**Prerequisites:**
- **Node.js**: Version 16+ required
- **npm** or **yarn**: Package manager

**Installation:**
```bash
# Clone the repository
git clone <repository-url>
cd safetycircle-poster-generator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Development Scripts:**
- `npm run dev` - Start Vite development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🔧 Configuration Requirements

### EmailJS Setup
1. Sign up at [EmailJS.com](https://emailjs.com)
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template for organization and personal emails
4. Replace `YOUR_USER_ID` in `js/app.js` with your EmailJS user ID
5. Update email template IDs in the email functions

### Organization Configuration
- Users enter organization email addresses directly in the application
- Customize email templates for organization branding in EmailJS
- Set up email service to handle incoming poster submissions
- No hardcoded email addresses - flexible for different organizations

## 🚀 Features Not Yet Implemented

### 🔄 Planned Enhancements
- **QR Code Generation**: Generate QR codes for easy app access
- **Template Variations**: Multiple poster layouts and styles
- **Bulk Operations**: Handle multiple poster submissions
- **Analytics Dashboard**: Track poster creation and engagement
- **Social Sharing**: Direct social media integration
- **Offline Support**: Progressive Web App (PWA) capabilities

### 🔧 Technical Improvements
- **QR Code Integration**: Add QR code generation for easy app access
- **Backend Integration**: Server-side processing and storage
- **Database Storage**: Store poster data and user submissions
- **Authentication**: User accounts and session management
- **File Management**: Server-side image storage and optimization
- **API Integration**: Connect with existing safety management systems

### 📈 Advanced Features
- **AI Integration**: Auto-generate safety messages
- **Multi-language**: Internationalization support
- **Advanced Analytics**: Detailed usage statistics
- **Custom Branding**: White-label solutions for different organizations
- **Integration APIs**: Connect with HR and safety systems

## 🎨 Design System

### Color Palette
- **Primary Green**: #8BC34A (SafetyCircle brand color)
- **Dark Green**: #689F38 (Hover states, emphasis)
- **Light Green**: #DCEDC8 (Background highlights)
- **Accent Orange**: #FF9800 (Call-to-action elements)
- **Neutral Grays**: #2E2E2E, #757575, #F5F5F5

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700
- **Hierarchy**: Clear heading and body text relationships

### Layout Principles
- **Mobile-First**: Responsive design starting from 320px
- **Grid System**: CSS Grid and Flexbox for flexible layouts
- **Spacing**: Consistent 8px base unit spacing system
- **Accessibility**: WCAG 2.1 AA compliance considerations

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 480px
- **Tablet**: 481px - 768px  
- **Desktop**: 769px - 1200px+
- **Print**: A4/A3 optimized layouts

## 🔒 Privacy & Security

### Data Handling
- **Client-Side Processing**: No server-side data storage by default
- **Image Privacy**: Images processed locally in browser
- **Email Security**: Emails sent through EmailJS service
- **Camera Access**: Temporary access for QR scanning only

### Recommended Security Measures
- **HTTPS Deployment**: Secure connection required for camera access
- **Email Validation**: Server-side email verification recommended
- **Rate Limiting**: Implement email sending limits
- **Content Filtering**: Validate and sanitize user inputs

## 📋 Recommended Next Steps

### Immediate (Phase 1)
1. **EmailJS Configuration**: Set up actual email service integration
2. **Testing**: Comprehensive testing across devices and browsers
3. **Content Review**: Validate safety messaging and branding alignment
4. **Deployment**: Deploy to production environment with HTTPS

### Short-term (Phase 2)
1. **QR Code Integration**: Generate and distribute QR codes for app access
2. **Analytics**: Implement basic usage tracking
3. **Error Handling**: Enhanced error reporting and user feedback
4. **Performance**: Optimize image processing and loading times

### Long-term (Phase 3)
1. **Backend Development**: Server-side processing and storage
2. **Database Integration**: Store and manage poster submissions
3. **Admin Dashboard**: Organization management interface
4. **API Development**: Integration with existing safety systems

## 🚀 Deployment

### Development Deployment
To deploy your SafetyCircle® Poster Generator and make it live, please go to the **Publish tab** where you can publish your project with one click. The Publish tab will handle all deployment processes automatically and provide you with the live website URL.

### Production Deployment
For production deployment to platforms like Vercel, Netlify, or GitHub Pages:

```bash
# Build the application
npm run build

# The dist/ folder contains the production-ready files
# Upload the contents of dist/ to your hosting provider
```

### Deployment Platforms
- **Vercel**: Connect your Git repository for automatic deployments
- **Netlify**: Drag and drop the `dist/` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions to build and deploy
- **Traditional Hosting**: Upload `dist/` contents to your web server

## 📞 Support & Contact

For technical support or questions about the SafetyCircle Poster Generator:
- Review this README for configuration guidance
- Check browser console for error messages
- Ensure all required CDN libraries are accessible
- Verify camera and email service permissions

---

*Created for SafetyCircle - Promoting workplace safety through personal storytelling and visual communication.*
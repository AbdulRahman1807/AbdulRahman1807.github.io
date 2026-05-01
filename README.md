# Abdul Rahman — Portfolio

A neo-brutalist, cinematic personal portfolio built with React, GSAP, and Tone.js.

## Local Development

```bash
npm install
npm run dev
```

## Deployment

To deploy to GitHub Pages manually:

```bash
npm run deploy
```

The site is also configured for automatic deployment via GitHub Actions on every push to the `main` branch.

## Setup Required

### 1. Sound Assets
Add your custom mechanical keyboard "thock" sounds to `public/sounds/`. The application expects:
- `thock.mp3`
- `click.mp3`
- `chime.mp3`

### 2. EmailJS Configuration
1. Create an account at [EmailJS](https://www.emailjs.com).
2. Create an Email Service (e.g., Gmail).
3. Create an Email Template with variables: `{{from_name}}`, `{{from_email}}`, and `{{message}}`.
4. Copy your **Service ID**, **Template ID**, and **Public Key**.
5. Replace the placeholders in `src/components/Contact.jsx`.

### 3. Resume
Replace the placeholder `public/resume.pdf` with your actual CV, or update the Google Drive link in `src/components/Navbar.jsx`.

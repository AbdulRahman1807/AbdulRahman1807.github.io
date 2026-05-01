import { useState, useEffect } from 'react'
import gsap from 'gsap'

const THEME_BG = {
  dark: '#0D0D0D',
  light: '#F5F0EB',
}

export function useTheme(toggleRef) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
    } else {
      root.classList.remove('light')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const toggleElement = toggleRef?.current

    if (prefersReducedMotion || !toggleElement) {
      setTheme(nextTheme)
      return
    }

    const rect = toggleElement.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Create the "Bloom" effect with multiple layers
    const accentRing = document.createElement('div')
    accentRing.className = 'theme-ink-overlay'
    accentRing.style.left = `${centerX}px`
    accentRing.style.top = `${centerY}px`
    accentRing.style.border = '2px solid var(--accent-primary)'
    accentRing.style.background = 'transparent'
    accentRing.style.zIndex = '9997'
    document.body.appendChild(accentRing)

    const mainOverlay = document.createElement('div')
    mainOverlay.className = 'theme-ink-overlay'
    mainOverlay.style.left = `${centerX}px`
    mainOverlay.style.top = `${centerY}px`
    mainOverlay.style.background = THEME_BG[nextTheme]
    mainOverlay.style.zIndex = '9996'
    document.body.appendChild(mainOverlay)

    const tl = gsap.timeline({
      onComplete: () => {
        // Delay removal slightly after state update to prevent the "flash" glitch
        setTimeout(() => {
          accentRing.remove()
          mainOverlay.remove()
        }, 50) 
      }
    })

    // Calculate max possible distance (diagonal) to guarantee 100% coverage
    const maxDist = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)
    const requiredScale = (maxDist / 8) * 1.2 // 8 is the radius (width 16 / 2)

    // Cinematic expansion
    tl.to(accentRing, {
      scale: requiredScale,
      opacity: 0,
      duration: 1.1,
      ease: "power2.inOut"
    }, 0)

    tl.to(mainOverlay, {
      scale: requiredScale,
      duration: 0.9,
      ease: "expo.inOut",
      onComplete: () => setTheme(nextTheme)
    }, 0.05)
  }

  return { theme, toggleTheme }
}

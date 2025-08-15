class QualitySelector {
  constructor() {
    this.qualityValues = ['160', '360', '480', '720', '1080']
    this.currentQualityIndex = 4 // Default to 1080p
    this.init()
  }

  init() {
    this.setupElements()
    this.setupEventListeners()
    this.loadSavedQuality()
    this.updateUI()
  }

  setupElements() {
    this.currentQualityText = document.getElementById('currentQualityText')
    this.qualityButtons = document.querySelectorAll('.quality-btn')
  }

  setupEventListeners() {
    // Quality button clicks
    this.qualityButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        this.currentQualityIndex = index
        this.updateUI()
        this.applyQuality()
      })
    })

    // Donate button click
    const donateBtn = document.getElementById('donateBtn')
    if (donateBtn) {
      donateBtn.addEventListener('click', () => {
        this.openPayPalDonation()
      })
    }
  }

  updateUI() {
    const currentQuality = this.qualityValues[this.currentQualityIndex]

    // Update current quality display
    this.currentQualityText.textContent = `${currentQuality}p`
    this.currentQualityText.classList.add('quality-change-animation')

    // Remove animation after it completes
    setTimeout(() => {
      this.currentQualityText.classList.remove('quality-change-animation')
    }, 400)

    // Update active button
    this.qualityButtons.forEach((button, index) => {
      if (index === this.currentQualityIndex) {
        button.classList.add('active')
      } else {
        button.classList.remove('active')
      }
    })
  }

  async loadSavedQuality() {
    try {
      console.log('Popup: Loading saved quality...')

      // First try to load cached quality from extension storage
      const result = await chrome.storage.local.get(['lastQualitySelection'])
      console.log('Popup: Storage result:', result)

      if (result.lastQualitySelection) {
        const qualityIndex = this.qualityValues.indexOf(
          result.lastQualitySelection
        )
        console.log(
          `Popup: Found cached quality ${result.lastQualitySelection}, index: ${qualityIndex}`
        )

        if (qualityIndex !== -1) {
          this.currentQualityIndex = qualityIndex
          this.updateUI()
          console.log(
            `Popup: Set currentQualityIndex to ${qualityIndex} (${this.qualityValues[qualityIndex]}p)`
          )

          // Update badge to show cached quality
          await this.updateExtensionBadge(result.lastQualitySelection)

          // Silently load cached value
          return
        }
      } else {
        console.log('Popup: No cached quality found, using default')
      }

      // Fallback: try to get quality from current tab's session storage
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })

      if (tab && tab.url) {
        const response = await chrome.tabs.sendMessage(tab.id, {
          action: 'getStoredQuality',
        })

        if (response && response.quality) {
          const qualityIndex = this.qualityValues.indexOf(response.quality)
          if (qualityIndex !== -1) {
            this.currentQualityIndex = qualityIndex
            this.updateUI()
          }
        }
      }
    } catch (error) {
      console.log('Could not load saved quality:', error)
    }
  }

  async applyQuality() {
    const currentQuality = this.qualityValues[this.currentQualityIndex]

    try {
      // Cache the selection in extension storage
      await chrome.storage.local.set({ lastQualitySelection: currentQuality })
      console.log(`Popup: Cached quality selection: ${currentQuality}`)

      // Update extension badge to show current quality
      await this.updateExtensionBadge(currentQuality)

      // Also send message to background script to ensure badge is updated
      try {
        await chrome.runtime.sendMessage({
          action: 'updateBadge',
          quality: currentQuality,
        })
      } catch (error) {
        console.log('Could not send badge update to background:', error)
      }

      // Verify it was saved
      const verification = await chrome.storage.local.get([
        'lastQualitySelection',
      ])
      console.log(`Popup: Verification - stored value:`, verification)

      // Get current active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })

      if (!tab) {
        this.showStatus('No active tab found', 'error')
        return
      }

      // Send message to content script to update session storage
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'setQuality',
        quality: currentQuality,
      })

      // Silently handle success/failure - no need for status messages
    } catch (error) {
      console.error('Failed to apply quality:', error)
      // Only show error if there's a real connection issue
    }
  }

  async updateExtensionBadge(quality) {
    try {
      // Send message to background script to update badge
      await chrome.runtime.sendMessage({
        action: 'updateBadge',
        quality: quality,
      })

      console.log(`Popup: Requested badge update to ${quality}`)
    } catch (error) {
      console.error('Failed to request badge update:', error)
    }
  }

  openPayPalDonation() {
    // PayPal donation URL for benmelih1327@gmail.com
    const paypalUrl =
      'https://www.paypal.com/donate/?business=benmelih1327%40gmail.com&no_recurring=0&currency_code=USD'

    try {
      // Open PayPal donation page in new tab
      chrome.tabs.create({ url: paypalUrl })
      console.log('Opened PayPal donation page')
    } catch (error) {
      console.error('Failed to open PayPal donation page:', error)
      // Fallback: copy to clipboard if opening tab fails
      navigator.clipboard
        .writeText(paypalUrl)
        .then(() => {
          console.log('PayPal URL copied to clipboard')
        })
        .catch((err) => {
          console.error('Failed to copy URL to clipboard:', err)
        })
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new QualitySelector()
})

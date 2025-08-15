// Simple Kick Quality Selector Content Script
class KickQualityStorage {
  constructor() {
    this.init()
  }

  init() {
    console.log('Content Script: Loading on', window.location.hostname)
    this.setupMessageListener()

    // Trigger badge setting from background script
    this.triggerBadgeUpdate()

    // Auto-apply cached quality if we're on kick.com
    if (window.location.hostname.includes('kick.com')) {
      console.log('Content Script: On kick.com, will auto-apply cached quality')
      // Add small delay to ensure page is ready
      setTimeout(() => {
        this.autoApplyCachedQuality()
      }, 500)
    } else {
      console.log('Content Script: Not on kick.com, applying stored quality')
      // For other sites, just apply any stored quality
      this.applyStoredQuality()
    }
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('Kick Quality Selector: Received message:', request)

      switch (request.action) {
        case 'setQuality':
          this.setQualityInStorage(request.quality)
          sendResponse({ success: true })
          break

        case 'getStoredQuality':
          const quality = this.getQualityFromStorage()
          sendResponse({ success: true, quality: quality })
          break

        case 'autoApplyCached':
          this.autoApplyCachedQuality()
          sendResponse({ success: true })
          break

        case 'ping':
          sendResponse({ success: true, status: 'alive' })
          break

        default:
          sendResponse({ success: false, error: 'Unknown action' })
      }
    })
  }

  async triggerBadgeUpdate() {
    try {
      console.log(
        'Content Script: Triggering badge update via background script'
      )

      // Send message to background script to update badge
      await chrome.runtime.sendMessage({
        action: 'forceBadgeUpdate',
        source: 'contentScript',
      })

      console.log('Content Script: Badge update request sent')
    } catch (error) {
      console.log('Content Script: Could not trigger badge update:', error)
    }
  }

  async getCurrentQuality() {
    try {
      // First try to get from extension storage
      const result = await chrome.storage.local.get(['lastQualitySelection'])
      if (result.lastQualitySelection) {
        return result.lastQualitySelection
      }

      // Fallback to session storage
      const sessionQuality = this.getQualityFromStorage()
      if (sessionQuality) {
        return sessionQuality
      }

      // Default to 1080p
      return '1080'
    } catch (error) {
      console.error('Content Script: Failed to get current quality:', error)
      return '1080'
    }
  }

  setQualityInStorage(quality) {
    try {
      console.log(`Kick Quality Selector: Setting stream_quality to ${quality}`)

      // Set the quality in session storage with the key 'stream_quality'
      sessionStorage.setItem('stream_quality', quality)

      // Also try some variations that Kick might use
      const possibleKeys = ['stream_quality']

      possibleKeys.forEach((key) => {
        sessionStorage.setItem(key, quality)
        console.log(`Kick Quality Selector: Set ${key} = ${quality}`)
      })

      // Try to trigger any video reload/quality change events
      this.triggerQualityUpdate(quality)

      console.log(
        `Kick Quality Selector: Successfully set quality to ${quality}`
      )
      return true
    } catch (error) {
      console.error('Kick Quality Selector: Failed to set quality:', error)
      return false
    }
  }

  getQualityFromStorage() {
    try {
      // Check for stored quality in session storage
      const possibleKeys = [
        'stream_quality',
        'video_quality',
        'player_quality',
        'quality',
        'preferred_quality',
      ]

      for (const key of possibleKeys) {
        const quality = sessionStorage.getItem(key)
        if (quality) {
          console.log(
            `Kick Quality Selector: Found quality ${quality} in ${key}`
          )
          return quality
        }
      }

      return null
    } catch (error) {
      console.error('Kick Quality Selector: Failed to get quality:', error)
      return null
    }
  }

  async autoApplyCachedQuality() {
    try {
      console.log('Content Script: Auto-applying cached quality for kick.com')

      // Get cached quality from extension storage
      const result = await chrome.storage.local.get(['lastQualitySelection'])
      console.log('Content Script: Storage result:', result)

      if (result.lastQualitySelection) {
        console.log(
          `Content Script: Found cached quality: ${result.lastQualitySelection}`
        )
        this.setQualityInStorage(result.lastQualitySelection)

        // Double check what was actually set
        const verification = this.getQualityFromStorage()
        console.log(
          `Content Script: After setting, session storage contains: ${verification}`
        )
      } else {
        console.log('Content Script: No cached quality found, falling back...')
        // Fallback to any stored quality in session storage
        this.applyStoredQuality()
      }
    } catch (error) {
      console.error(
        'Content Script: Failed to auto-apply cached quality:',
        error
      )
      // Fallback to session storage
      this.applyStoredQuality()
    }
  }

  applyStoredQuality() {
    // Apply any stored quality on page load
    const quality = this.getQualityFromStorage()
    if (quality) {
      console.log(`Kick Quality Selector: Applying stored quality: ${quality}`)
      this.setQualityInStorage(quality)
    }
  }

  triggerQualityUpdate(quality) {
    try {
      console.log(
        `Kick Quality Selector: Triggering quality update events for ${quality}`
      )

      // Dispatch custom events that might trigger quality changes
      const qualityChangeEvent = new CustomEvent('qualitychange', {
        detail: { quality: quality },
        bubbles: true,
      })

      const storageChangeEvent = new CustomEvent('storage', {
        detail: { key: 'stream_quality', newValue: quality },
        bubbles: true,
      })

      // Try to dispatch on various elements
      const targets = [
        document,
        window,
        document.body,
        document.querySelector('video'),
        document.querySelector('#video-player'),
        document.querySelector('[class*="player"]'),
        document.querySelector('[class*="video"]'),
      ].filter(Boolean)

      targets.forEach((target) => {
        try {
          target.dispatchEvent(qualityChangeEvent)
          target.dispatchEvent(storageChangeEvent)
        } catch (e) {
          // Ignore errors
        }
      })

      // Also trigger storage event on window
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'stream_quality',
          newValue: quality,
          storageArea: sessionStorage,
        })
      )

      console.log('Kick Quality Selector: Quality update events dispatched')
    } catch (error) {
      console.error(
        'Kick Quality Selector: Failed to trigger quality update:',
        error
      )
    }
  }

  // Monitor for URL changes (SPA navigation)
  monitorNavigation() {
    let lastUrl = window.location.href

    const observer = new MutationObserver(() => {
      const currentUrl = window.location.href
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl
        console.log(
          'Kick Quality Selector: Navigation detected, reapplying quality'
        )

        // If we navigated to kick.com, auto-apply cached quality
        if (window.location.hostname.includes('kick.com')) {
          this.autoApplyCachedQuality()
        } else {
          this.applyStoredQuality()
        }
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }
}

// Initialize on all websites
console.log('Kick Quality Selector: Initializing on', window.location.hostname)
const qualityStorage = new KickQualityStorage()
qualityStorage.monitorNavigation()

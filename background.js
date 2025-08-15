// Kick Quality Selector - Simplified & Persistent Background Script

const BADGE_COLOR = '#00e701' // Kick green background
const BADGE_TEXT_COLOR = '#0b0e0f' // Kick black text

// --- Core Badge Logic ---

async function updateBadge() {
  try {
    // Get current active tab to check if we're on Kick
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    if (!tab || !tab.url) {
      console.log('No active tab found, hiding badge')
      await chrome.action.setBadgeText({ text: '' })
      return
    }

    // Only show badge if we're on Kick.com
    if (!tab.url.includes('kick.com')) {
      console.log('Not on Kick.com, hiding badge')
      await chrome.action.setBadgeText({ text: '' })
      return
    }

    const result = await chrome.storage.local.get('lastQualitySelection')
    const quality = result.lastQualitySelection || '1080'

    // Set badge text (1080 shows as HD, others show as numbers)
    const badgeText = quality === '1080' ? 'HD' : quality
    await chrome.action.setBadgeText({ text: badgeText })

    // Set badge background color to Kick green
    await chrome.action.setBadgeBackgroundColor({ color: BADGE_COLOR })

    // Set badge text color to Kick black
    await chrome.action.setBadgeTextColor({ color: BADGE_TEXT_COLOR })

    console.log(
      `Badge updated to: ${badgeText} with Kick green background and black text (on Kick.com)`
    )
  } catch (error) {
    // Log error but don't crash the script
    console.log('Failed to update badge:', error.message)
  }
}

// --- Event Listeners ---

// Fired when the extension is first installed, when the extension is updated to a new version, and when Chrome is updated to a new version.
chrome.runtime.onInstalled.addListener(updateBadge)

// Fired when the browser first starts up.
chrome.runtime.onStartup.addListener(updateBadge)

// Update badge when tabs are updated (page loads, navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    updateBadge()
  }
})

// Update badge when switching between tabs
chrome.tabs.onActivated.addListener(updateBadge)

// Fired when a message is sent from the popup.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateBadge') {
    if (request.quality) {
      // If quality is provided, update storage and badge
      chrome.storage.local
        .set({ lastQualitySelection: request.quality })
        .then(() => {
          updateBadge()
        })
    } else {
      // Just update badge with current stored quality
      updateBadge()
    }
    sendResponse({ success: true })
  }
  return true // Keep message channel open for async response
})

chrome.alarms.create('badge-update-alarm', {
  delayInMinutes: 0.1, // Check shortly after startup
  periodInMinutes: 1, // And then every minute
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'badge-update-alarm') {
    updateBadge()
  }
})
setTimeout(updateBadge, 200)

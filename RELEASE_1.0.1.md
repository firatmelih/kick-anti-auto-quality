# 🎉 Release v1.0.1 - Chrome Compatibility Fix

## 📅 Release Date
August 15, 2024

## 🔧 What's Fixed
**CRITICAL BUG FIX**: The extension now works properly with Chrome!

### 🐛 Previous Issue
- **Manifest Version Error**: Version 1.0.0 had `manifest_version: 1` which caused Chrome to reject the extension
- **Installation Failed**: Users got "Invalid value for 'manifest_version'. Must be an integer either 2 or 3" error
- **Extension Unusable**: The extension couldn't be loaded into Chrome

### ✅ Current Fix
- **Updated to Manifest V3**: Now uses `manifest_version: 3` (latest Chrome standard)
- **Fully Compatible**: Works with all current Chrome versions
- **Installation Success**: Users can now drag & drop the extension successfully

## 🚀 Features
- **Quality Persistence**: Automatically saves your chosen stream quality preference
- **Eliminates "Auto" Quality**: Prevents Kick from resetting to Auto quality
- **One-Time Setup**: Set your quality once and forget about it
- **Smart Caching**: Remembers your preference across browser sessions
- **Instant Application**: Quality is applied immediately when visiting Kick.com

## 🎯 Supported Qualities
- 160p (Low bandwidth)
- 360p (Standard definition)
- 480p (DVD quality)
- 720p (HD)
- 1080p (Full HD)

## 📥 Installation Instructions

### Quick Install
1. **Download** the ZIP file below
2. **Extract** to any folder on your computer
3. **Open Chrome** and go to `chrome://extensions/`
4. **Enable** "Developer mode" (toggle in top-right)
5. **Click** "Load unpacked" and select the extracted folder
6. **Done!** Extension icon appears in your toolbar

### First Time Setup
1. **Click** the extension icon
2. **Drag** the slider to your preferred quality (720p, 1080p, etc.)
3. **Quality is saved** and will automatically apply on Kick.com

## 🔍 Technical Details
- **Manifest Version**: 3 (Chrome compatible)
- **Permissions**: storage, activeTab, scripting, tabs, alarms
- **Target**: All websites (with special handling for Kick.com)
- **Storage**: Persistent quality preference storage

## 📋 What's Included
- `manifest.json` - Extension configuration (Manifest V3)
- `popup.html/css/js` - User interface
- `content-script.js` - Website integration
- `background.js` - Background processes
- `icons/` folder - Extension icons (16px, 48px, 128px)
- `README.md` - User documentation
- `LICENSE` - MIT license

## 🆚 Version Comparison

| Feature | v1.0.0 | v1.0.1 ✅ |
|---------|---------|-----------|
| Manifest Version | 1 (❌ Broken) | 3 (✅ Working) |
| Chrome Compatibility | ❌ No | ✅ Yes |
| Installation | ❌ Fails | ✅ Success |
| Functionality | ❌ Unusable | ✅ Fully Functional |

## 🎯 Target Users
- **Kick.com streamers** who want consistent quality
- **Users frustrated** with Kick's quality reset issue
- **Anyone who wants** to eliminate "Auto" quality selection
- **Chrome users** looking for a quality management solution

## 🔮 Future Plans
- Chrome Web Store publication
- Mobile browser support
- Additional quality options
- User interface improvements

## 📞 Support
- **GitHub Issues**: [Report bugs or request features](https://github.com/firatmelih/kick-anti-auto-quality/issues)
- **Documentation**: See [README.md](README.md) for detailed information

## 🙏 Acknowledgments
Thank you to all users who reported the manifest issue! This release wouldn't have been possible without your feedback.

---

## ⚠️ Important Notes
- **Previous v1.0.0 users**: Please update to v1.0.1 for Chrome compatibility
- **First-time users**: This version works immediately with Chrome
- **Open Source**: Licensed under MIT License - feel free to contribute!

**Download the working extension below and enjoy persistent quality on Kick.com! 🎉**

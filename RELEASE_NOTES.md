# Release Notes - Version 1.0.0

## 🎉 Initial Stable Release

**Release Date**: August 15, 2024  
**Version**: 1.0.0  
**Download**: [kick-anti-auto-quality-v1.0.0.zip](kick-anti-auto-quality-v1.0.0.zip)

## ✨ What's New

This is the initial stable release of the Kick Anti Auto Quality Chrome Extension.

### 🚀 Features
- **Quality Persistence**: Automatically saves your chosen stream quality preference
- **Eliminates "Auto" Quality**: Prevents Kick from resetting to Auto quality
- **One-Time Setup**: Set your quality once and forget about it
- **Smart Caching**: Remembers your preference across browser sessions
- **Instant Application**: Quality is applied immediately when visiting Kick.com

### 🎯 Supported Qualities
- 160p (Low bandwidth)
- 360p (Standard definition)  
- 480p (DVD quality)
- 720p (HD)
- 1080p (Full HD)

### 🔧 Technical Details
- **Manifest Version**: 1
- **Permissions**: storage, activeTab, scripting, tabs, alarms
- **Target**: All websites (with special handling for Kick.com)
- **Storage**: Persistent quality preference storage

## 📥 Installation

### Quick Install (Recommended)
1. Download the ZIP file above
2. Extract the ZIP to a folder on your computer
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" (toggle in top-right)
5. Click "Load unpacked" and select the extracted folder
6. The extension icon will appear in your toolbar

### Manual Installation
- Follow the detailed instructions in [INSTALLATION.md](INSTALLATION.md)

## 🐛 Known Issues
- None reported in this release

## 🔮 Future Plans
- Chrome Web Store publication
- Mobile browser support
- Additional quality options
- User interface improvements

## 📞 Support
- **GitHub Issues**: [Report bugs or request features](https://github.com/firatmelih/kick-anti-auto-quality/issues)
- **Documentation**: See [README.md](README.md) for detailed information

## 🙏 Acknowledgments
Thank you to all users who provided feedback and suggestions during development!

---

**Note**: This extension is open source and licensed under the MIT License. See [LICENSE](LICENSE) for details.

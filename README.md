# Nexus P2P Marketplace Module

A comprehensive peer-to-peer marketplace module for Nexus Wallet, built with React and Redux. This module enables users to browse tokens, create trading pairs, and manage marketplace transactions with an enhanced user interface and improved color scheme.

## 🚀 Features

### **Quick Token Browser - Trading Ready**
- **Token Discovery**: Browse available tokens with real-time filtering
- **Enhanced Search**: Search tokens by name, ticker, or address
- **Smart Pagination**: Navigate through token listings with improved visibility
- **Token Selection**: Add tokens to your trading pairs with one click
- **Visual Indicators**: Clear status indicators for token availability and actions

### **Trading Pair Management**
- **Selected Trading Pairs**: Manage your chosen trading pairs
- **Pair Status Tracking**: Monitor active and inactive trading pairs
- **Quick Actions**: Trade, remove, or modify trading pairs instantly
- **Date Tracking**: View creation and last activity dates

### **Cross-Token Pair Creator**
- **Advanced Filtering**: Create custom token combinations
- **Filtered Results**: Enhanced visibility for search results
- **Token Pairing**: Intelligent pairing suggestions
- **Comprehensive Listings**: Access to extensive token databases

### **Enhanced User Experience**
- **Modern Dark Theme**: Professional dark interface with vibrant accents
- **Improved Typography**: Enhanced readability with optimized font weights
- **Color-Coded Elements**: Intuitive color scheme for better navigation
- **Responsive Design**: Seamless experience across different screen sizes

## 🎨 Recent Enhancements

### **Color Improvements**
- **"Available Tokens"** text: Enhanced with purple accent (`#a78bfa`) and bold styling
- **Pagination**: Improved visibility with slate gray (`#94a3b8`) styling
- **Token Information**: Bright text (`#f1f5f9`) for better contrast
- **"Filtered Results"**: Enhanced with amber (`#fbbf24`) and light gray (`#cbd5e1`) for optimal visibility
- **Trading Pair Names**: Vibrant cyan (`#06b6d4`) for active pairs
- **Action Buttons**: Consistent styling with improved contrast

### **Visual Elements**
- **Custom P2P Icon**: Unique marketplace icon with gradient design
- **Trading Arrows**: Visual representation of peer-to-peer trading
- **Connection Lines**: Network visualization for trading relationships
- **Status Indicators**: Clear visual feedback for all actions

## 🛠️ Development

### **Prerequisites**
- Node.js (v14 or higher)
- npm or yarn package manager
- Nexus Wallet (latest version)

### **Installation & Setup**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Nexus-p2p-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Development mode**
   ```bash
   npm run dev
   ```
   Access at `http://localhost:5000`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Create module package**
   ```bash
   node build-nexus-module.js
   ```

### **Module Installation**

1. **Download** the latest `Nexus-p2p-marketplace.zip` from releases
2. **Open Nexus Wallet** → Settings → Modules
3. **Drag and drop** the zip file into "Add module" section
4. **Click "Install module"** when prompted
5. **Access the module** from the bottom navigation bar after wallet refresh

## 📁 Module Structure

```
Nexus-p2p-marketplace.zip
├── dist/
│   ├── js/
│   │   └── app.js              # Main application bundle
│   ├── index.html              # Module entry point
│   └── react.svg               # Custom P2P marketplace icon
├── nxs_package.json            # Module configuration
└── repo_info.json              # Repository information
```

## 🔧 Technical Details

- **Framework**: React 18 with Redux for state management
- **Styling**: Emotion CSS-in-JS with custom theme
- **Build Tool**: Webpack with Babel transpilation
- **API Integration**: Nexus blockchain API integration
- **Module System**: Compatible with Nexus Wallet module architecture

## 📝 API Integration

The module integrates with various Nexus APIs:
- **Assets API**: Token and asset management
- **Market API**: Trading pair and market data
- **Finance API**: Transaction and balance information
- **Supply API**: Token supply and distribution data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built for the Nexus Ecosystem** 🌐

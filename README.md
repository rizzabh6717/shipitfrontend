# ShipIT - Decentralized P2P Delivery Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)

A blockchain-powered peer-to-peer delivery platform built on the Avalanche network, enabling secure and transparent deliveries through smart contract escrow.

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Project Structure](#-project-structure)
- [Backend Integration](#-backend-integration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Features

- **Decentralized Escrow**: Smart contracts hold delivery fees securely until confirmation
- **Real-time Tracking**: Live updates on parcel status and driver details
- **Dual User Roles**: Separate interfaces for Senders and Drivers
- **Route Optimization**: AI-powered matching between parcels and driver routes
- **Secure Payments**: MetaMask integration with Avalanche network
- **Responsive Design**: Beautiful dark theme optimized for all devices

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Maps**: Leaflet.js with React-Leaflet

### Blockchain Integration
- **Web3 Library**: ethers.js v6
- **Wallet**: MetaMask integration
- **Network**: Avalanche (configurable)
- **Smart Contracts**: Solidity-based escrow system

### Development Tools
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing with Autoprefixer

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shipit-delivery-platform.git
   cd shipit-delivery-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration values
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure the following variables:

```env
# Google Maps API Key for mapping functionality
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# WebSocket server URL for real-time tracking
VITE_WEBSOCKET_URL=ws://localhost:3001

# Avalanche Network Configuration
VITE_AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
VITE_CONTRACT_ADDRESS=your_contract_address_here
VITE_CHAIN_ID=43114
```

### Getting API Keys

1. **Google Maps API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Maps JavaScript API and Places API
   - Create credentials (API Key)
   - Restrict the key to your domain for security

2. **Avalanche Network**:
   - For testnet: Use Fuji testnet RPC URL
   - For mainnet: Use the provided mainnet RPC URL
   - Deploy your smart contract and update the contract address

### MetaMask Setup
1. Install MetaMask browser extension
2. Add Avalanche network:
   - Network Name: Avalanche Network
   - RPC URL: https://api.avax.network/ext/bc/C/rpc
   - Chain ID: 43114
   - Symbol: AVAX
   - Explorer: https://snowtrace.io/

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navbar.tsx      # Navigation component
├── contexts/           # React contexts
│   └── WalletContext.tsx # Web3 wallet management
├── pages/              # Main application pages
│   ├── LandingPage.tsx # Landing page with wallet connection
│   ├── SenderDashboard.tsx # Sender interface
│   ├── DriverDashboard.tsx # Driver interface
│   └── CreateParcel.tsx # Parcel creation form
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## 🔗 Backend Integration

### Smart Contract Integration

The frontend is designed to integrate with Avalanche smart contracts. Key integration points:

1. **Contract ABI**: Place your contract ABI in `src/contracts/`
2. **Contract Address**: Configure in environment variables
3. **Web3 Provider**: Managed through WalletContext

### Required Smart Contract Functions

Your smart contract should implement these functions:

```solidity
// Create new delivery request
function createDelivery(
    string memory fromAddress,
    string memory toAddress,
    string memory itemDescription,
    uint256 itemValue,
    uint256 deliveryFee
) external payable;

// Accept delivery (driver)
function acceptDelivery(uint256 deliveryId) external;

// Confirm delivery (sender)
function confirmDelivery(uint256 deliveryId) external;

// Get delivery details
function getDelivery(uint256 deliveryId) external view returns (DeliveryStruct memory);
```

### API Integration Points

For additional backend services, integrate at these points:

1. **User Authentication**: Extend WalletContext
2. **Real-time Updates**: Add WebSocket connections
3. **Geolocation Services**: Integrate mapping APIs
4. **Notification System**: Add push notifications
5. **Analytics**: Track user interactions and delivery metrics

### Database Schema (if using off-chain storage)

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    role VARCHAR(10) NOT NULL, -- 'sender' or 'driver'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Deliveries table
CREATE TABLE deliveries (
    id UUID PRIMARY KEY,
    contract_delivery_id INTEGER UNIQUE,
    sender_id UUID REFERENCES users(id),
    driver_id UUID REFERENCES users(id),
    from_address TEXT NOT NULL,
    to_address TEXT NOT NULL,
    item_description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Deployment

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy `dist/` folder to your hosting service
3. Configure environment variables on your hosting platform

### Recommended Hosting Platforms
- **Vercel**: Automatic deployments with GitHub integration
- **Netlify**: Easy static site hosting
- **AWS S3 + CloudFront**: Scalable cloud hosting
- **IPFS**: Decentralized hosting option

## 🔐 Security Considerations

1. **Smart Contract Audits**: Ensure contracts are audited before mainnet deployment
2. **Input Validation**: All user inputs are validated client-side and should be validated on-chain
3. **Private Key Management**: Never store private keys in the application
4. **HTTPS**: Always use HTTPS in production
5. **Content Security Policy**: Implement CSP headers

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build test
npm run build
```

## 🐛 Troubleshooting

### Common Issues

1. **Vite command not found**
   ```bash
   npm install
   ```

2. **Import resolution errors**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **MetaMask connection issues**
   - Ensure MetaMask is installed and unlocked
   - Check if the correct network is selected
   - Clear browser cache and cookies

4. **Google Maps not loading**
   - Verify your API key is correct
   - Check if Maps JavaScript API is enabled
   - Ensure API key restrictions allow your domain

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) to Purple (#8B5CF6) gradient
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Background**: Gray-900 (#111827)
- **Surface**: Gray-800 (#1F2937)

### Typography
- **Headings**: Inter font family, bold weights
- **Body**: Inter font family, regular weight
- **Code**: Fira Code, monospace

## 🤝 Contributing

We welcome contributions to ShipIT! Please follow these steps:

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

### Code Style

- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Use Tailwind CSS for styling
- Maintain consistent file and folder structure

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **Live Demo**: [https://shipit-delivery.vercel.app](https://shipit-delivery.vercel.app)
- **Documentation**: [https://docs.shipit-delivery.com](https://docs.shipit-delivery.com)
- **Discord Community**: [https://discord.gg/shipit](https://discord.gg/shipit)
- **Twitter**: [@ShipITDelivery](https://twitter.com/ShipITDelivery)

## 🆘 Support

For support and questions:
- [Create an issue](https://github.com/yourusername/shipit-delivery-platform/issues) on GitHub
- Join our [Discord community](https://discord.gg/shipit)
- Email: support@shipit-delivery.com

## 🙏 Acknowledgments

- [Avalanche](https://www.avax.network/) for the blockchain infrastructure
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the development framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for the icon system

## 🗺 Roadmap

- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] Mobile app development
- [ ] Advanced route optimization
- [ ] Insurance integration
- [ ] Reputation system
- [ ] Multi-language support
- [ ] API for third-party integrations
- [ ] Mobile app development (React Native)
- [ ] Advanced analytics and reporting
- [ ] Integration with major e-commerce platforms

---

**Built with ❤️ for the decentralized future of logistics.**

*Star ⭐ this repository if you find it helpful!*
# OrderKing Frontend

A modern React frontend for the OrderKing restaurant ordering system.

## Features

- 🛒 **Shopping Cart** - Add/remove items with quantity control
- 🔍 **Search & Filter** - Search menu items and filter by category
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive** - Works on desktop and mobile devices
- 🔐 **Authentication** - Staff login for order management
- ✨ **Modern UI** - Built with Tailwind CSS

## Tech Stack

- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:5173

### Building for Production

```bash
npm run build
npm run preview
```

### Docker

```bash
docker build -t orderking-frontend .
docker run -p 80:80 orderking-frontend
```

## Project Structure

```
src/
├── api/          # API client and endpoints
├── components/   # React components
│   ├── ui/       # Reusable UI components
│   ├── layout/   # Header, Footer, Layout
│   ├── products/ # Product components
│   ├── cart/     # Cart components
│   └── orders/   # Order components
├── context/      # React Context providers
├── hooks/        # Custom React hooks
├── pages/        # Page components
├── types/        # TypeScript types
└── utils/        # Utility functions
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `/api` |

## License

ISC# restaurant-ordering-system-frontend

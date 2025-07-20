# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains two main web projects for 云南耶氏体育文化发展有限公司 (Yunnan Yes Sports Culture Development Co., Ltd.):

1. **yeslocation.html** - Standalone interactive map showing 20 Yes Pool Hall store locations
2. **yes-sports-website/** - Full React-based company website with Context Engineering architecture

## Commands

### React Website Development (yes-sports-website/)
```bash
cd yes-sports-website

# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Architecture

### Context Engineering 5-Layer System
The React website implements a sophisticated Context Engineering architecture:

1. **Atoms** (`/src/context/atoms/`) - Basic data units (location, device, time, language)
2. **Molecules** (`/src/context/molecules/`) - Combined states (nearest stores, user interests, content priority)
3. **Cells** (`/src/context/cells/`) - Stateful memory (visit history, interaction patterns, engagement)
4. **Organs** (`/src/context/organs/`) - System features (recommendations, navigation suggestions, adaptive UI)
5. **Fields** (`/src/context/fields/`) - Global context (resonance, coherence, intention, user journey)

### Key Architectural Patterns

**Context Provider Pattern**: All context layers are wrapped in `ContextEngineProvider` which manages:
- State persistence to LocalStorage
- Map object serialization/deserialization
- Cross-layer communication

**Service Layer Architecture**: 
- `api.ts` - Unified API interface with protocol wrappers
- `mockApi.ts` - Mock data for development
- `recommendationService.ts` - Content recommendation engine
- `contentService.ts` - Content management and retrieval

**Behavior Tracking System**: Tracks user interactions for personalization:
- Page visits and duration
- Scroll depth tracking
- Click tracking with element identification
- Engagement level calculation

## Recent Technical Decisions

### Tailwind CSS v3 (not v4)
The project uses Tailwind CSS v3.4.17 due to React Scripts compatibility issues with v4. Do not upgrade to v4.

### TypeScript Configuration
- Strict mode enabled
- Target: ES5 for compatibility
- JSX: react-jsx

### Removed Features (2025-01-18)
The following advanced features were removed per user request:
- Neural Systems layer
- ResidueTracker
- ResonanceIndicator
- NeuralIndicator

## Project Structure

```
耶氏地址/
├── yeslocation.html          # Standalone store map
├── yes-sports-website/       # Main React website
│   ├── src/
│   │   ├── components/       # Atomic design UI components
│   │   ├── context/          # Context Engineering implementation
│   │   ├── services/         # API and business logic
│   │   ├── pages/            # 7 main page components
│   │   ├── types/            # TypeScript definitions
│   │   ├── hooks/            # Custom React hooks
│   │   ├── protocols/        # CE protocols
│   │   └── utils/            # Utility functions
│   └── public/
│       └── yeslocation.html  # Copy of map for deployment
```

## API Response Format

All API responses follow the ProtocolDocument format:
```typescript
{
  protocol: 'CE-1.0',
  timestamp: number,
  context: ContextMetadata,
  content: T,
  resonance?: number
}
```

## Deployment

The project is configured for Vercel deployment:
- SPA routing enabled in vercel.json
- Build output optimized (~139KB gzipped)
- Static assets in build/ directory

## Common Issues and Solutions

1. **Map Serialization Error**: Context Engine stores Map objects in LocalStorage. Always ensure proper deserialization in ContextEngine.tsx

2. **Import Path Errors**: Use `../types/models` not `../data/models`

3. **Missing Product Properties**: Product interface requires: `model`, `priceRange`, `features`, `warranty`

4. **Development Server**: If encountering issues, clear LocalStorage via Chrome DevTools > Application tab

## Business Context

- **Company**: 云南耶氏体育文化发展有限公司
- **Industry**: Billiards/Pool Hall Franchise
- **Stores**: 20 locations across Kunming
- **Services**: Pool hall operations, training, equipment sales, franchising
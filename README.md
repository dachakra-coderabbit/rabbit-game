![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/dachakra-coderabbit/rabbit-game?utm_source=oss&utm_medium=github&utm_campaign=dachakra-coderabbit%2Frabbit-game&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
# Rabbit Jump Game

A fun Flappy Bird-style game featuring a cute rabbit jumping through hurdles on grass! Built with React Native and Expo for cross-platform deployment on iOS, Android, and Web.

## Features

- Cute rabbit character with smooth animations
- Wooden hurdle obstacles with randomized gaps
- Beautiful grass and sky background
- Real-time score tracking
- Smooth physics and collision detection
- Responsive touch controls
- Cross-platform support (iOS, Android, Web)

## Tech Stack

- React Native
- Expo
- TypeScript
- React Native SVG

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on specific platforms:
```bash
# iOS
npm run ios

# Android
npm run android

# Web (Development)
npm run web

# Web (Production Build)
npm run build:web
# Then serve the dist folder:
npx serve dist
# Or use Python:
# cd dist && python3 -m http.server 8000
```

## How to Play

1. Tap anywhere on the screen to start the game
2. Tap to make the rabbit jump
3. Navigate through the hurdles without hitting them
4. Avoid hitting the ground or ceiling
5. Score points by passing through hurdles
6. Try to beat your high score!

## Game Controls

- **Tap/Click**: Make the rabbit jump
- **Tap "Play Again"**: Restart after game over

## Project Structure

```
rabbit-game/
├── src/
│   ├── components/
│   │   ├── Background.tsx       # Sky, clouds, and grass
│   │   ├── RabbitCharacter.tsx  # Rabbit sprite
│   │   └── HurdleObstacle.tsx   # Hurdle obstacles
│   ├── screens/
│   │   └── GameScreen.tsx       # Main game screen
│   ├── hooks/
│   │   └── useGameLoop.ts       # Game loop logic
│   ├── utils/
│   │   └── physics.ts           # Physics and collision
│   ├── constants/
│   │   └── game.ts              # Game constants
│   └── types/
│       └── game.ts              # TypeScript types
├── App.tsx                      # Main app entry
├── package.json
└── app.json
```

## Game Mechanics

- **Gravity**: The rabbit continuously falls with realistic gravity
- **Jump**: Tapping gives the rabbit an upward velocity
- **Rotation**: The rabbit rotates based on vertical velocity
- **Hurdles**: Scroll from right to left at constant speed
- **Collision**: Game ends if rabbit hits hurdles, ground, or ceiling
- **Scoring**: Points awarded when passing through hurdles

## Customization

You can customize the game by modifying constants in [src/constants/game.ts](src/constants/game.ts):

- `GRAVITY`: Control fall speed
- `JUMP_VELOCITY`: Control jump height
- `HURDLE_SPEED`: Control game difficulty
- `HURDLE_GAP`: Control gap size between hurdles
- `HURDLE_SPACING`: Control distance between hurdle pairs

## Building for Production

### iOS
```bash
npm run build:ios
```

### Android
```bash
npm run build:android
```

### Web
```bash
# Build and upload source maps to Sentry
npm run build:web

# Serve the production build locally
npx serve dist

# Or use Python's HTTP server
cd dist && python3 -m http.server 8000
```

**Note:** The production build includes source maps that are automatically uploaded to Sentry for error tracking. Access the build at `http://localhost:8000` (or the port shown by your server).

## License

MIT

## Credits

Built with React Native and Expo

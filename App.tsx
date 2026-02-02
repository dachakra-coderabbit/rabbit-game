import React from 'react';
import { GameScreen } from './src/screens/GameScreen';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://0a83098a1f81aa753a68973830886f77@o4510755458711552.ingest.us.sentry.io/4510756067934208',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable debug
  debug: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function App() {
  return <GameScreen />;
});
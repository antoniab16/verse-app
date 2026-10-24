# Verse

Verse is a small Expo app that offers a Bible verse for the way you feel. It is designed as a quiet, private moment with no accounts, tracking, or analytics.

## Run with Expo Go

1. Install [Node.js](https://nodejs.org/) and the Expo Go app on your phone.
2. From this project directory, install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npx expo start
   ```

4. Scan the QR code with Expo Go. On iPhone, use the Camera app; on Android, use the QR scanner inside Expo Go.
5. Keep the computer and phone on the same Wi-Fi network. If that is not possible, run `npx expo start --tunnel`.

## Useful commands

```bash
npm run ios
npm run android
npm run web
npx tsc --noEmit
npx expo-doctor
```

The app uses Expo Router with screens under `src/app`. Verse references will live in `src/data`, while API access and device caching will live in `src/services`.

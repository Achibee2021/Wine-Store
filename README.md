# Wine Store - Version 1.0

## A Premium E-Commerce Experience for Wine Connoisseurs.

This a high-performance, mobile-first application built with **React Native** and **Expo**. It demonstrates a full "Discovery-to-Checkout" user journey, featuring real-time filtering, golbal state managment, and a secure-flow authentication system.

## Key Features

**. Hierarchical Discovery:** Users browse by "Class" (Wine vs. Champagne) and "Type" (Red, White, Rose, Brut).
**.Real-time Global Cart:** Powered by React Context API, ensuring the shopping bag and totals stay synced across all screens.
**.Adaptative Search:** A high-speed search bar that filters the "DigitalShelf** instantly as you type.
**.Smart Authentication Gate:** Guests can build their cart freely, but are seamlessly redirected to a secure login flow before payment.
**.Multi-Step Checkout:** A structured 3-satge process (Review -> Payment Selection -> Success Confirmation).
**.Modern UX/UI:\*\* Built using useSafeAreaInsets for perfect layout on all modern notches and home indicators.

## Technical Stack

**.Framework:** Expo(SDK 50+)
**.Language:** TypeScript for type-safe business logic.
**.Navigation:** Expo Router(File-based routing).
**.State Management:** React Context API (Cart & Auth providers).
**.Icons:** Ionicons via @expo/vector-icons.

## How ToRun

1. Clone the repository
2. Install dependencies: npm install
3. Start the development server: npx expo start
4. Scan the QR code with **Expo Go** (iOS/Android).

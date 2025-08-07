# Phone Number Input Example

This is an Expo app that demonstrates the `expo-phone-number-input` component.

## Features Demonstrated

- International country picker with flags
- Phone number validation using Google's libphonenumber
- Dark theme support
- Shadow effects
- Disable/enable functionality
- Real-time validation feedback

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on your preferred platform:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## Usage

The example app shows:
- A phone number input with country picker
- Validation button to check if the number is valid
- Toggle button to enable/disable the input
- Real-time display of input values and validation status

## Component Props Used

- `defaultCode`: Sets initial country (US)
- `layout`: "first" layout style
- `withDarkTheme`: Enables dark theme
- `withShadow`: Adds shadow effects
- `autoFocus`: Auto-focuses on component mount
- `disabled`: Controls input state
- `onChangeText`: Handles text changes
- `onChangeFormattedText`: Handles formatted text changes
- `countryPickerProps`: Configures country picker

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser 
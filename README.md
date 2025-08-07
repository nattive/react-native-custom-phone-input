# React Native Phone Number Input

A comprehensive, feature-rich phone number input component for React Native with country picker, validation, theming, and customization options.

![Demo](./gif/Phone_Input_2.gif)

## Features

✅ **Comprehensive Country Support** - Built-in support for 250+ countries  
✅ **Phone Number Validation** - Real-time validation using Google LibPhoneNumber  
✅ **Customizable Theming** - Complete theme customization with sensible defaults  
✅ **Search Functionality** - Built-in country search with customizable placeholder  
✅ **Modern UI Design** - Clean, modern interface with rounded flags and inputs  
✅ **Flexible Layouts** - Multiple layout options to fit your design  
✅ **Custom Render Props** - Override any part of the component with custom renders  
✅ **TypeScript Support** - Full TypeScript definitions included  
✅ **Configurable Labels** - Customizable field labels  
✅ **Custom Modal Support** - Implement your own country selection modal  
✅ **Flag Shape Control** - Round or square flag options  
✅ **Custom Dropdown Icon** - Replace the default dropdown with your own icon  

## Installation

```bash
npm install react-native-custom-phone-input
# or
yarn add react-native-custom-phone-input
```

## Dependencies

```bash
npm install google-libphonenumber
# or  
yarn add google-libphonenumber
```

## Basic Usage

```tsx
import React, { useState, useRef } from 'react';
import PhoneInput from 'react-native-custom-phone-input';

export default function App() {
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const phoneInput = useRef<PhoneInput>(null);

  return (
    <PhoneInput
      ref={phoneInput}
      defaultValue={value}
      defaultCode="US"
      layout="codeInInput"
      onChangeText={(text) => {
        setValue(text);
      }}
      onChangeFormattedText={(text) => {
        setFormattedValue(text);
      }}
      withDarkTheme
      withShadow
      autoFocus
    />
  );
}
```

## Props

### Basic Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultCode` | `string` | `"US"` | Default country code |
| `value` | `string` | `""` | Phone number value |
| `defaultValue` | `string` | `""` | Default phone number value |
| `placeholder` | `string` | `"(415) 555-0132"` | Input placeholder text |
| `disabled` | `boolean` | `false` | Disable the input |
| `autoFocus` | `boolean` | `false` | Auto focus the input |
| `layout` | `"codeInInput"` \| `"codeInSelector"` \| `"codeWithFlag"` | `"codeInInput"` | Layout style |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `withShadow` | `boolean` | `false` | Add shadow to container |
| `withDarkTheme` | `boolean` | `false` | Use dark theme for keyboard |
| `containerStyle` | `StyleProp<ViewStyle>` | - | Container style |
| `textContainerStyle` | `StyleProp<ViewStyle>` | - | Text input container style |
| `textInputStyle` | `StyleProp<TextStyle>` | - | Text input style |
| `codeTextStyle` | `StyleProp<TextStyle>` | - | Country code text style |

### Search & Modal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showSearch` | `boolean` | `true` | Show search in country modal |
| `searchPlaceholder` | `string` | `"Search countries..."` | Search input placeholder |
| `disableArrowIcon` | `boolean` | `false` | Hide dropdown arrow |

### Labels

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `codeLabel` | `string` | `"Code"` | Label for country code section |
| `phoneNumberLabel` | `string` | `"Phone Number"` | Label for phone number section |

### Callbacks

| Prop | Type | Description |
|------|------|-------------|
| `onChangeText` | `(text: string) => void` | Called when phone number changes |
| `onChangeFormattedText` | `(text: string) => void` | Called with formatted number (includes country code) |
| `onChangeCountry` | `(country: Country) => void` | Called when country changes |

### Theme Customization

The `theme` prop allows you to customize the entire appearance:

```tsx
interface PhoneInputTheme {
  // Background colors
  containerBackground?: string;
  inputBackground?: string;
  modalBackground?: string;
  modalOverlay?: string;
  
  // Text colors
  labelTextColor?: string;
  inputTextColor?: string;
  placeholderTextColor?: string;
  codeTextColor?: string;
  dropdownTextColor?: string;
  
  // Border colors
  inputBorderColor?: string;
  modalBorderColor?: string;
  
  // Selection and focus colors
  selectionColor?: string;
  
  // Flag styling
  flagBorderRadius?: number;
  flagSize?: number;
  flagShape?: 'round' | 'square';
  
  // Dropdown arrow
  dropdownArrowColor?: string;
  dropdownArrowOpacity?: number;
}
```

#### Theme Example

```tsx
<PhoneInput
  theme={{
    containerBackground: 'transparent',
    inputBackground: '#F5F5F5',
    modalBackground: '#FFFFFF',
    labelTextColor: '#333333',
    inputTextColor: '#000000',
    flagShape: 'round',
    flagSize: 32,
  }}
/>
```

## Custom Render Props

Override any part of the component with custom implementations:

### Custom Flag Renderer

```tsx
<PhoneInput
  renderFlag={(country) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>{country.code}</Text>
    </View>
  )}
/>
```

### Custom Input Renderer

```tsx
<PhoneInput
  renderInput={(props) => (
    <TextInput
      {...props}
      style={[props.style, { borderWidth: 1, borderColor: 'blue' }]}
    />
  )}
/>
```

### Custom Dropdown Icon

```tsx
<PhoneInput
  renderDropdownIcon={() => (
    <Icon name="chevron-down" size={16} color="#666" />
  )}
/>
```

### Custom Country Modal

Implement your own country selection modal (e.g., for bottom sheets):

```tsx
<PhoneInput
  renderCountryModal={({ visible, onClose, onSelectCountry, countries, searchText, onSearchChange }) => (
    <Modal visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <TextInput
          value={searchText}
          onChangeText={onSearchChange}
          placeholder="Search countries..."
        />
        <FlatList
          data={countries}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelectCountry(item)}>
              <Text>{item.name} (+{item.callingCode})</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  )}
/>
```

### Custom Country Item

```tsx
<PhoneInput
  renderCountryItem={(country, onSelect) => (
    <TouchableOpacity onPress={() => onSelect(country)}>
      <Text>{country.name} - {country.code}</Text>
    </TouchableOpacity>
  )}
/>
```

## Layouts

### Layout "codeInInput" (default)
Country flag in selector + Country code in main input + Phone number

### Layout "codeInSelector"  
Country flag + Country code in selector (compact) + Phone number

### Layout "codeWithFlag"
Country flag + Country code together in selector + Phone number

## Methods

Access component methods via ref:

```tsx
const phoneInput = useRef<PhoneInput>(null);

// Get country code
const countryCode = phoneInput.current?.getCountryCode();

// Get calling code  
const callingCode = phoneInput.current?.getCurrentCallingCode();

// Validate number
const isValid = phoneInput.current?.isValidNumber(phoneNumber);

// Get formatted number
const { formattedNumber } = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
```

## Validation

Use the built-in validation or the standalone function:

```tsx
import { isValidNumber } from 'react-native-custom-phone-input';

// Using component method
const isValid = phoneInput.current?.isValidNumber(phoneNumber);

// Using standalone function  
const isValid = isValidNumber(phoneNumber, countryCode);
```

## TypeScript

Full TypeScript support with comprehensive type definitions:

```tsx
import PhoneInput, { Country, PhoneInputTheme } from 'react-native-custom-phone-input';

const customTheme: PhoneInputTheme = {
  flagShape: 'round',
  inputBackground: '#F0F0F0',
};

const handleCountryChange = (country: Country) => {
  console.log(country.name, country.code, country.callingCode);
};
```

## Complete Example

```tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PhoneInput from 'react-native-custom-phone-input';

export default function App() {
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const phoneInput = useRef<PhoneInput>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone Number Input</Text>
      
      <PhoneInput
        ref={phoneInput}
        defaultValue={value}
        defaultCode="US"
        layout="codeInInput"
        onChangeText={(text) => {
          setValue(text);
        }}
        onChangeFormattedText={(text) => {
          setFormattedValue(text);
          setValid(phoneInput.current?.isValidNumber(text) || false);
        }}
        onChangeCountry={(country) => {
          console.log('Country changed:', country);
        }}
        withDarkTheme
        withShadow
        autoFocus
        theme={{
          flagShape: 'round',
          inputBackground: '#F8F9FA',
          containerBackground: 'transparent',
        }}
        codeLabel="Country Code"
        phoneNumberLabel="Mobile Number"
        placeholder="Enter your phone number"
        searchPlaceholder="Search for country..."
      />
      
      {showMessage && (
        <View style={styles.message}>
          <Text>Value: {value}</Text>
          <Text>Formatted: {formattedValue}</Text>
          <Text>Valid: {valid ? 'true' : 'false'}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

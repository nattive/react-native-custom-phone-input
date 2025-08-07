import React, { Component } from "react";
import { TextInputProps, StyleProp, TextStyle, ViewStyle, ImageStyle } from "react-native";

export interface Country {
  code: string;
  name: string;
  callingCode: string;
}

export interface PhoneInputTheme {
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

export interface PhoneInputProps {
  defaultCode?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  withShadow?: boolean;
  withDarkTheme?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  disableArrowIcon?: boolean;
  layout?: "codeInInput" | "codeInSelector" | "codeWithFlag";
  showSearch?: boolean;
  searchPlaceholder?: string;
  codeLabel?: string;
  phoneNumberLabel?: string;
  onChangeCountry?: (country: Country) => void;
  onChangeText?: (text: string) => void;
  onChangeFormattedText?: (text: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  textContainerStyle?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  codeTextStyle?: StyleProp<TextStyle>;
  flagStyle?: StyleProp<ImageStyle>;
  flagContainerStyle?: StyleProp<ViewStyle>;
  countryButtonStyle?: StyleProp<ViewStyle>;
  countryButtonWrapperStyle?: StyleProp<ViewStyle>;
  textInputProps?: TextInputProps;
  theme?: PhoneInputTheme;
  // Custom render props
  renderFlag?: (country: Country) => React.ReactNode;
  renderInput?: (props: {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    disabled?: boolean;
    style?: StyleProp<TextStyle>;
  }) => React.ReactNode;
  renderCountryItem?: (country: Country, onSelect: (country: Country) => void) => React.ReactNode;
  renderDropdownIcon?: () => React.ReactNode;
  renderCountryModal?: (props: {
    visible: boolean;
    onClose: () => void;
    onSelectCountry: (country: Country) => void;
    countries: Country[];
    searchText: string;
    onSearchChange: (text: string) => void;
  }) => React.ReactNode;
}

export interface PhoneInputState {
  code: string;
  number: string;
  modalVisible: boolean;
  countryCode: string;
  disabled: boolean;
  searchText: string;
}

export default class PhoneInput extends Component<PhoneInputProps, PhoneInputState> {
  constructor(props: PhoneInputProps);

  getCallingCode: (countryCode: string) => string;
  getCountryCode: () => string;
  getCurrentCallingCode: () => string;
  isValidNumber: (number: string) => boolean;
  onSelectCountry: (country: Country) => void;
  onChangeText: (text: string) => void;
  getNumberAfterPossiblyEliminatingZero: () => { number: string; formattedNumber: string };
  renderDropdownImage: () => React.JSX.Element;
  renderCountryItem: ({ item }: { item: Country }) => React.JSX.Element;
  render: () => React.JSX.Element;
}

export function isValidNumber(number: string, countryCode: string): boolean;
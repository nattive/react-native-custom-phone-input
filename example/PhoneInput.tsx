import React, { JSX, PureComponent } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, Modal, FlatList, StyleProp, TextStyle, ViewStyle, ImageStyle } from "react-native";
import { PhoneNumberUtil } from "google-libphonenumber";
import * as flags from "./flagsIndex";

const phoneUtil = PhoneNumberUtil.getInstance();

// Types
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
  textInputProps?: any;
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

// Import countries data
const countriesData = require('./countries.json');

// Use the comprehensive countries data
const countries: Country[] = countriesData;

const dropDown = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAi0lEQVRYR+3WuQ6AIBRE0eHL1T83FBqU5S1szdiY2NyTKcCAzU/Y3AcBXIALcIF0gRPAsehgugDEXnYQrUC88RIgfpuJ+MRrgFmILN4CjEYU4xJgFKIa1wB6Ec24FuBFiHELwIpQxa0ALUId9wAkhCnuBdQQ5ngP4I9wxXsBDyJ9m+8y/g9wAS7ABW4giBshQZji3AAAAABJRU5ErkJggg==";

// Default theme
const defaultTheme: PhoneInputTheme = {
  // Background colors
  containerBackground: 'transparent',
  inputBackground: '#FFFFFF',
  modalBackground: '#FFFFFF',
  modalOverlay: 'rgba(0,0,0,0.5)',

  // Text colors
  labelTextColor: '#666666',
  inputTextColor: '#000000',
  placeholderTextColor: '#999999',
  codeTextColor: '#666666',
  dropdownTextColor: '#666666',

  // Border colors
  inputBorderColor: '#E5E5E5',
  modalBorderColor: '#EEEEEE',

  // Selection and focus colors
  selectionColor: '#007AFF',

  // Flag styling
  flagBorderRadius: 999,
  flagSize: 30,
  flagShape: 'round',

  // Dropdown arrow
  dropdownArrowColor: '#666666',
  dropdownArrowOpacity: 0.6,
};

// Helper function to get flag image
const getFlagImage = (countryCode: string) => {
  const code = countryCode.toLowerCase();
  return (flags as any)[code] || flags.us;
};

export default class PhoneInput extends PureComponent<PhoneInputProps, PhoneInputState> {
  constructor(props: PhoneInputProps) {
    super(props);
    const defaultCountry = countries.find(c => c.code === props.defaultCode) || countries[0];
    this.state = {
      code: defaultCountry.callingCode,
      number: props.value
        ? props.value
        : props.defaultValue
          ? props.defaultValue
          : "",
      modalVisible: false,
      countryCode: props.defaultCode ? props.defaultCode : "US",
      disabled: props.disabled || false,
      searchText: "",
    };
  }

  getCallingCode = (countryCode: string): string => {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.callingCode : "1";
  };

  getCountryCode = (): string => {
    return this.state.countryCode;
  };

  getCurrentCallingCode = (): string => {
    return this.state.code;
  };

  isValidNumber = (number: string): boolean => {
    try {
      const { countryCode } = this.state;
      const parsedNumber = phoneUtil.parse(number, countryCode);
      return phoneUtil.isValidNumber(parsedNumber);
    } catch (err) {
      return false;
    }
  };

  onSelectCountry = (country: Country): void => {
    const { onChangeCountry } = this.props;
    this.setState(
      {
        countryCode: country.code,
        code: country.callingCode,
        modalVisible: false,
      },
      () => {
        const { onChangeFormattedText } = this.props;
        if (onChangeFormattedText) {
          if (country.callingCode) {
            onChangeFormattedText(
              `+${country.callingCode}${this.state.number}`
            );
          } else {
            onChangeFormattedText(this.state.number);
          }
        }
      }
    );
    if (onChangeCountry) {
      onChangeCountry(country);
    }
  };

  onChangeText = (text: string): void => {
    this.setState({ number: text });
    const { onChangeText, onChangeFormattedText } = this.props;
    if (onChangeText) {
      onChangeText(text);
    }
    if (onChangeFormattedText) {
      const { code } = this.state;
      if (code) {
        onChangeFormattedText(text.length > 0 ? `+${code}${text}` : text);
      } else {
        onChangeFormattedText(text);
      }
    }
  };

  getNumberAfterPossiblyEliminatingZero = (): { number: string; formattedNumber: string } => {
    let { number, code } = this.state;
    if (number.length > 0 && number.startsWith("0")) {
      number = number.substr(1);
      return { number, formattedNumber: code ? `+${code}${number}` : number };
    } else {
      return { number, formattedNumber: code ? `+${code}${number}` : number };
    }
  };

  renderDropdownImage = (): JSX.Element => {
    const { theme = {} } = this.props;
    const mergedTheme = { ...defaultTheme, ...theme };

    return (
      <Image
        source={{ uri: dropDown }}
        resizeMode="contain"
        style={{
          height: 12,
          width: 8,
          opacity: mergedTheme.dropdownArrowOpacity,
          tintColor: mergedTheme.dropdownArrowColor
        }}
      />
    );
  };

  renderCountryItem = ({ item }: { item: Country }): JSX.Element => {
    const { theme = {} } = this.props;
    const mergedTheme = { ...defaultTheme, ...theme };

    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          padding: 15,
          borderBottomWidth: 1,
          borderBottomColor: mergedTheme.modalBorderColor,
          alignItems: 'center',
        }}
        onPress={() => this.onSelectCountry(item)}
      >
        <Image
          source={getFlagImage(item.code)}
          style={{
            width: 20,
            height: 15,
            marginRight: 10,
            borderRadius: mergedTheme.flagShape === 'round' ? 7.5 : 0
          }}
          resizeMode="cover"
        />
        <Text style={{ flex: 1, fontSize: 16, color: mergedTheme.inputTextColor }}>{item.name}</Text>
        <Text style={{ fontSize: 16, color: mergedTheme.dropdownTextColor }}>+{item.callingCode}</Text>
      </TouchableOpacity>
    );
  };

  render(): JSX.Element {
    const {
      withShadow,
      withDarkTheme,
      codeTextStyle,
      textInputProps,
      autoFocus,
      placeholder,
      disableArrowIcon,
      containerStyle,
      textContainerStyle,
      textInputStyle,
      flagStyle,
      flagContainerStyle,
      countryButtonStyle,
      layout = "codeInInput",
      showSearch = true,
      searchPlaceholder = "Search countries...",
      renderFlag,
      renderInput,
      renderCountryItem,
      renderDropdownIcon,
      renderCountryModal,
      theme = {},
    } = this.props;
    const { modalVisible, code, countryCode, number, disabled, searchText } = this.state;
    const selectedCountry = countries.find(c => c.code === countryCode);

    // Filter countries based on search text
    const filteredCountries = searchText
      ? countries.filter(country =>
        country.name.toLowerCase().includes(searchText.toLowerCase()) ||
        country.callingCode.includes(searchText) ||
        country.code.toLowerCase().includes(searchText.toLowerCase())
      )
      : countries;

    // Merge theme with defaults
    const mergedTheme = { ...defaultTheme, ...theme };

    return (
      <View>
        {/* Labels */}
        <View style={{ flexDirection: 'row', marginBottom: 8, gap: 10 }}>

          <Text style={{
            fontSize: 14,
            color: mergedTheme.labelTextColor,
            fontWeight: '500',
            flex: 1,
          }}>
            Mobile number
          </Text>
        </View>

        <View
          style={[
            {
              width: '100%',
              backgroundColor: mergedTheme.containerBackground,
              flexDirection: 'row',
              gap: 10,
            },
            containerStyle ? containerStyle : {},
          ]}
        >
          <View>

          </View>
          <TouchableOpacity
            style={[
              {
                width: '35%',
                backgroundColor: mergedTheme.inputBackground,
                borderRadius: 12,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 15,
                gap: 8,
              },
              layout === "codeInSelector" ? { width: '25%' } : {},
              layout === "codeWithFlag" ? { width: '35%' } : {},
              countryButtonStyle,
            ]}
            disabled={disabled}
            onPress={() => this.setState({ modalVisible: true })}
          >
            {renderFlag && selectedCountry ? (
              renderFlag(selectedCountry)
            ) : (
              <View style={[{ alignItems: 'center', flexDirection: 'row', gap: 5 }, flagContainerStyle]}>
                <Image
                  source={getFlagImage(selectedCountry ? selectedCountry.code : "us")}
                  style={[{
                    width: mergedTheme.flagSize || 30,
                    height: mergedTheme.flagSize || 30,
                    borderRadius: mergedTheme.flagShape === 'round' ? (mergedTheme.flagSize || 30) / 2 : mergedTheme.flagBorderRadius
                  }, flagStyle]}
                  resizeMode="cover"
                />
                {layout === "codeWithFlag" && selectedCountry && (
                  <Text style={[{
                    fontSize: 16,
                    color: mergedTheme.codeTextColor,
                    fontWeight: '500',
                  }, codeTextStyle ? codeTextStyle : {}]}>
                    +{selectedCountry.callingCode}
                  </Text>
                )}
              </View>
            )}
            {code && layout === "codeInSelector" && (
              <Text style={[{
                fontSize: 16,
                marginRight: 10,
                fontWeight: '500',
                color: '#000000',
              }, codeTextStyle ? codeTextStyle : {}]}>
                {`+${code}`}
              </Text>
            )}
            {!disableArrowIcon && (renderDropdownIcon ? renderDropdownIcon() : this.renderDropdownImage())}
          </TouchableOpacity>
          <View
            style={[
              {
                flex: 1,
                backgroundColor: mergedTheme.inputBackground,
                borderRadius: 12,
                paddingHorizontal: 15,
                paddingVertical: 5,
                flexDirection: 'row',
                alignItems: 'center',
              },
              textContainerStyle ? textContainerStyle : {},
            ]}
          >
            {code && layout === "codeInInput" && (
              <Text style={[{
                fontSize: 16,
                fontWeight: '400',
                color: mergedTheme.codeTextColor,
                marginRight: 10,
              }, codeTextStyle ? codeTextStyle : {}]}>
                {`+${code}`}
              </Text>
            )}
            {renderInput ? (
              renderInput({
                value: number,
                onChangeText: this.onChangeText,
                placeholder: placeholder || "Phone Number",
                disabled: disabled,
                style: textInputStyle,
              })
            ) : (
              <TextInput
                style={[{
                  fontSize: 16,
                  color: mergedTheme.inputTextColor,
                  flex: 1,
                }, textInputStyle ? textInputStyle : {}]}
                placeholder={placeholder ? placeholder : "(415) 555-0132"}
                placeholderTextColor={mergedTheme.placeholderTextColor}
                onChangeText={this.onChangeText}
                value={number}
                editable={disabled ? false : true}
                selectionColor={mergedTheme.selectionColor}
                keyboardAppearance={withDarkTheme ? "dark" : "default"}
                keyboardType="number-pad"
                autoFocus={autoFocus}
                {...textInputProps}
              />
            )}
          </View>
        </View>

        {renderCountryModal ? (
          renderCountryModal({
            visible: modalVisible,
            onClose: () => this.setState({ modalVisible: false, searchText: "" }),
            onSelectCountry: this.onSelectCountry,
            countries: filteredCountries,
            searchText: searchText,
            onSearchChange: (text: string) => this.setState({ searchText: text }),
          })
        ) : (
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => this.setState({ modalVisible: false, searchText: "" })}
          >
            <View style={{
              flex: 1,
              backgroundColor: mergedTheme.modalOverlay,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <View style={{
                backgroundColor: mergedTheme.modalBackground,
                borderRadius: 10,
                width: '90%',
                maxHeight: '80%',
              }}>
                <View style={{
                  padding: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: mergedTheme.modalBorderColor,
                }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: mergedTheme.inputTextColor
                  }}>
                    Select Country
                  </Text>
                </View>

                {showSearch && (
                  <View style={{
                    padding: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: mergedTheme.modalBorderColor,
                  }}>
                    <TextInput
                      style={{
                        fontSize: 16,
                        color: mergedTheme.inputTextColor,
                        backgroundColor: mergedTheme.inputBackground,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                      }}
                      placeholder={searchPlaceholder}
                      placeholderTextColor={mergedTheme.placeholderTextColor}
                      value={searchText}
                      onChangeText={(text: string) => this.setState({ searchText: text })}
                    />
                  </View>
                )}

                <FlatList
                  data={filteredCountries}
                  renderItem={({ item }) => {
                    if (renderCountryItem) {
                      const customItem = renderCountryItem(item, this.onSelectCountry);
                      return customItem ? <>{customItem}</> : this.renderCountryItem({ item });
                    }
                    return this.renderCountryItem({ item });
                  }}
                  keyExtractor={(item) => item.code}
                  style={{ maxHeight: 400 }}
                />
                <TouchableOpacity
                  style={{
                    padding: 15,
                    alignItems: 'center',
                    borderTopWidth: 1,
                    borderTopColor: mergedTheme.modalBorderColor,
                  }}
                  onPress={() => this.setState({ modalVisible: false, searchText: "" })}
                >
                  <Text style={{ fontSize: 16, color: mergedTheme.dropdownTextColor }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    );
  }
}

export const isValidNumber = (number: string, countryCode: string): boolean => {
  try {
    const parsedNumber = phoneUtil.parse(number, countryCode);
    return phoneUtil.isValidNumber(parsedNumber);
  } catch (err) {
    return false;
  }
}; 
import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, Modal, FlatList } from "react-native";
import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

// Simple country data
const countries = [
  { code: "US", name: "United States", callingCode: "1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", callingCode: "44", flag: "🇬🇧" },
  { code: "CA", name: "Canada", callingCode: "1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", callingCode: "61", flag: "🇦🇺" },
  { code: "DE", name: "Germany", callingCode: "49", flag: "🇩🇪" },
  { code: "FR", name: "France", callingCode: "33", flag: "🇫🇷" },
  { code: "IN", name: "India", callingCode: "91", flag: "🇮🇳" },
  { code: "JP", name: "Japan", callingCode: "81", flag: "🇯🇵" },
  { code: "BR", name: "Brazil", callingCode: "55", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", callingCode: "52", flag: "🇲🇽" },
];

const dropDown = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAi0lEQVRYR+3WuQ6AIBRE0eHL1T83FBqU5S1szdiY2NyTKcCAzU/Y3AcBXIALcIF0gRPAsehgugDEXnYQrUC88RIgfpuJ+MRrgFmILN4CjEYU4xJgFKIa1wB6Ec24FuBFiHELwIpQxa0ALUId9wAkhCnuBdQQ5ngP4I9wxXsBDyJ9m+8y/g9wAS7ABW4giBshQZji3AAAAABJRU5ErkJggg==";

export default class PhoneInput extends PureComponent {
  constructor(props) {
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
    };
  }

  getCallingCode = (countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.callingCode : "1";
  };

  getCountryCode = () => {
    return this.state.countryCode;
  };

  getCallingCode = () => {
    return this.state.code;
  };

  isValidNumber = (number) => {
    try {
      const { countryCode } = this.state;
      const parsedNumber = phoneUtil.parse(number, countryCode);
      return phoneUtil.isValidNumber(parsedNumber);
    } catch (err) {
      return false;
    }
  };

  onSelectCountry = (country) => {
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

  onChangeText = (text) => {
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

  getNumberAfterPossiblyEliminatingZero() {
    let { number, code } = this.state;
    if (number.length > 0 && number.startsWith("0")) {
      number = number.substr(1);
      return { number, formattedNumber: code ? `+${code}${number}` : number };
    } else {
      return { number, formattedNumber: code ? `+${code}${number}` : number };
    }
  }

  renderDropdownImage = () => {
    return (
      <Image
        source={{ uri: dropDown }}
        resizeMode="contain"
        style={{ height: 14, width: 12 }}
      />
    );
  };

  renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
      }}
      onPress={() => this.onSelectCountry(item)}
    >
      <Text style={{ fontSize: 20, marginRight: 10 }}>{item.flag}</Text>
      <Text style={{ flex: 1, fontSize: 16 }}>{item.name}</Text>
      <Text style={{ fontSize: 16, color: '#666' }}>+{item.callingCode}</Text>
    </TouchableOpacity>
  );

  render() {
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
      layout = "first",
    } = this.props;
    const { modalVisible, code, countryCode, number, disabled } = this.state;
    const selectedCountry = countries.find(c => c.code === countryCode);

    return (
      <View>
        <View
          style={[
            {
              width: '100%',
              backgroundColor: 'white',
              flexDirection: 'row',
            },
            withShadow ? {
              shadowColor: 'rgba(0,0,0,0.4)',
              shadowOffset: { width: 1, height: 5 },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,
              elevation: 10,
            } : {},
            containerStyle ? containerStyle : {},
          ]}
        >
          <TouchableOpacity
            style={[
              {
                width: 80,
                height: '100%',
                minWidth: 32,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
              },
              layout === "second" ? { width: 90 } : {},
            ]}
            disabled={disabled}
            onPress={() => this.setState({ modalVisible: true })}
          >
            <Text style={{ fontSize: 20, marginRight: 5 }}>
              {selectedCountry ? selectedCountry.flag : "🇺🇸"}
            </Text>
            {code && layout === "second" && (
              <Text style={[{
                fontSize: 16,
                marginRight: 10,
                fontWeight: '500',
                color: '#000000',
              }, codeTextStyle ? codeTextStyle : {}]}>
                {`+${code}`}
              </Text>
            )}
            {!disableArrowIcon && this.renderDropdownImage()}
          </TouchableOpacity>
          <View
            style={[
              {
                flex: 1,
                backgroundColor: '#F8F9F9',
                paddingHorizontal: 15,
                paddingVertical: 10,
                textAlign: 'left',
                flexDirection: 'row',
                alignItems: 'center',
              },
              textContainerStyle ? textContainerStyle : {},
            ]}
          >
            {code && layout === "first" && (
              <Text style={[{
                fontSize: 16,
                marginRight: 10,
                fontWeight: '500',
                color: '#000000',
              }, codeTextStyle ? codeTextStyle : {}]}>
                {`+${code}`}
              </Text>
            )}
            <TextInput
              style={[{
                fontSize: 16,
                color: '#000000',
                flex: 1,
              }, textInputProps ? textInputProps : {}]}
              placeholder={placeholder ? placeholder : "Phone Number"}
              onChangeText={this.onChangeText}
              value={number}
              editable={disabled ? false : true}
              selectionColor="black"
              keyboardAppearance={withDarkTheme ? "dark" : "default"}
              keyboardType="number-pad"
              autoFocus={autoFocus}
              {...textInputProps}
            />
          </View>
        </View>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 10,
              width: '90%',
              maxHeight: '80%',
            }}>
              <View style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                  Select Country
                </Text>
              </View>
              <FlatList
                data={countries}
                renderItem={this.renderCountryItem}
                keyExtractor={(item) => item.code}
                style={{ maxHeight: 400 }}
              />
              <TouchableOpacity
                style={{
                  padding: 15,
                  alignItems: 'center',
                  borderTopWidth: 1,
                  borderTopColor: '#eee',
                }}
                onPress={() => this.setState({ modalVisible: false })}
              >
                <Text style={{ fontSize: 16, color: '#666' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export const isValidNumber = (number, countryCode) => {
  try {
    const parsedNumber = phoneUtil.parse(number, countryCode);
    return phoneUtil.isValidNumber(parsedNumber);
  } catch (err) {
    return false;
  }
};
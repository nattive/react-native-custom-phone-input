import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, TextInput, Modal, FlatList } from 'react-native';
import PhoneInput from './PhoneInput';

export default function App() {
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [disabled, setDisabled] = useState(false);
  const phoneInput = useRef<any>(null);

  // Custom flag renderer
  const renderCustomFlag = (country: any) => (
    <View style={styles.customFlag}>
      <Text style={styles.flagEmoji}>{country.flag}</Text>
      <Text style={styles.flagText} numberOfLines={1}>{country.code}</Text>
    </View>
  );

  // Custom input renderer
  const renderCustomInput = (props: any) => (
    <TextInput
      {...props}
      style={[styles.customInput, props.style]}
      placeholderTextColor="#999"
    />
  );

  // Custom country item renderer
  const renderCustomCountryItem = (country: any, onSelect: any) => (
    <TouchableOpacity
      style={styles.customCountryItem}
      onPress={() => onSelect(country)}
    >
      <Text style={styles.countryFlag}>{country.flag}</Text>
      <View style={styles.countryInfo}>
        <Text style={styles.countryName}>{country.name}</Text>
        <Text style={styles.countryCode}>+{country.callingCode}</Text>
      </View>
    </TouchableOpacity>
  );

  // Custom dropdown icon renderer
  const renderCustomDropdownIcon = () => (
    <View style={styles.customDropdownIcon}>
      <Text style={styles.dropdownText}>▼</Text>
    </View>
  );

  // Custom country modal renderer
  const renderCustomCountryModal = ({ visible, onClose, onSelectCountry, countries, searchText, onSearchChange }: any) => {
    if (!visible) return null;
    
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.customModalOverlay}>
          <View style={styles.customModal}>
            <View style={styles.customModalHeader}>
              <Text style={styles.customModalTitle}>Choose Country ({countries?.length || 0} countries)</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.customSearchInput}
              placeholder="Search countries..."
              value={searchText}
              onChangeText={onSearchChange}
            />
            
            {countries && countries.length > 0 ? (
              <FlatList
                data={countries}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.customCountryItem}
                    onPress={() => onSelectCountry(item)}
                  >
                    <View style={styles.countryInfo}>
                      <Text style={styles.countryName}>{item.name}</Text>
                      <Text style={styles.countryCode}>+{item.callingCode}</Text>
                    </View>
                    <Text style={styles.countryCode}>{item.code}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.code}
                style={{ flex: 1, backgroundColor: '#f0f0f0' }}
                showsVerticalScrollIndicator={true}
              />
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#666' }}>No countries found</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Phone Number Input Demo</Text>
        
        {showMessage && (
          <View style={styles.message}>
            <Text style={styles.messageText}>Country Code: {countryCode}</Text>
            <Text style={styles.messageText}>Value: {value}</Text>
            <Text style={styles.messageText}>Formatted Value: {formattedValue}</Text>
            <Text style={styles.messageText}>Valid: {valid ? 'true' : 'false'}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.sectionTitle}>Layout "codeInInput" (Default):</Text>
          {/* @ts-ignore */}
          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="US"
            layout="codeInInput"
            onChangeText={(text: string) => {
              setValue(text);
            }}
            onChangeFormattedText={(text: string) => {
              setFormattedValue(text);
              setCountryCode(phoneInput.current?.getCountryCode() || '');
            }}
            disabled={disabled}
            withDarkTheme
            withShadow
            autoFocus
            placeholder="Enter phone number"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.sectionTitle}>Layout "codeInSelector" (Compact):</Text>
          {/* @ts-ignore */}
          <PhoneInput
            defaultValue={value}
            defaultCode="GB"
            layout="codeInSelector"
            onChangeText={(text: string) => {
              setValue(text);
            }}
            onChangeFormattedText={(text: string) => {
              setFormattedValue(text);
            }}
            renderFlag={renderCustomFlag}
            renderInput={renderCustomInput}
            renderCountryItem={renderCustomCountryItem}
            renderDropdownIcon={renderCustomDropdownIcon}
            withShadow
            placeholder="Custom styled input"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.sectionTitle}>Round Flag Theme:</Text>
          {/* @ts-ignore */}
          <PhoneInput
            defaultValue={value}
            defaultCode="US"
            layout="codeInInput"
            onChangeText={(text: string) => {
              setValue(text);
            }}
            onChangeFormattedText={(text: string) => {
              setFormattedValue(text);
            }}
            theme={{
              inputBackground: '#F8F9FA',
              inputTextColor: '#2C3E50',
              placeholderTextColor: '#95A5A6',
              codeTextColor: '#34495E',
              selectionColor: '#3498DB',
              flagSize: 25,
              flagShape: 'round',
            }}
            placeholder="Round flag input"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.sectionTitle}>Square Flag Theme:</Text>
          {/* @ts-ignore */}
          <PhoneInput
            defaultValue={value}
            defaultCode="GB"
            layout="codeInInput"
            onChangeText={(text: string) => {
              setValue(text);
            }}
            onChangeFormattedText={(text: string) => {
              setFormattedValue(text);
            }}
            theme={{
              inputBackground: '#E8F5E8',
              inputTextColor: '#2C3E50',
              placeholderTextColor: '#95A5A6',
              codeTextColor: '#27AE60',
              selectionColor: '#27AE60',
              flagSize: 25,
              flagShape: 'square',
              flagBorderRadius: 4,
            }}
            placeholder="Square flag input"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.sectionTitle}>Layout "codeWithFlag" (Flag + Code):</Text>
          {/* @ts-ignore */}
          <PhoneInput
            defaultValue={value}
            defaultCode="FR"
            layout="codeWithFlag"
            onChangeText={(text: string) => {
              setValue(text);
            }}
            onChangeFormattedText={(text: string) => {
              setFormattedValue(text);
            }}
            withShadow
            placeholder="Phone number only"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.sectionTitle}>Custom Modal with Search:</Text>
          {/* @ts-ignore */}
          <PhoneInput
            defaultValue={value}
            defaultCode="US"
            layout="codeInInput"
            showSearch={true}
            searchPlaceholder="Find your country..."
            renderCountryModal={renderCustomCountryModal}
            onChangeText={(text: string) => {
              setValue(text);
            }}
            onChangeFormattedText={(text: string) => {
              setFormattedValue(text);
            }}
            theme={{
              inputBackground: '#FFF5F5',
              inputTextColor: '#2C3E50',
              placeholderTextColor: '#95A5A6',
              codeTextColor: '#E53E3E',
              selectionColor: '#E53E3E',
            }}
            placeholder="Custom modal example"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const checkValid = phoneInput.current?.isValidNumber(value);
            setShowMessage(true);
            setValid(checkValid ? checkValid : false);
            setCountryCode(phoneInput.current?.getCountryCode() || '');
            const numberInfo = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
            console.log('Number info:', numberInfo);
          }}
        >
          <Text style={styles.buttonText}>Validate Phone Number</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, disabled ? styles.activateButton : styles.disableButton]}
          onPress={() => {
            setDisabled(!disabled);
          }}
        >
          <Text style={styles.buttonText}>
            {disabled ? 'Activate' : 'Disable'} Input
          </Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Features:</Text>
          <Text style={styles.infoText}>• International country picker</Text>
          <Text style={styles.infoText}>• Phone number validation</Text>
          <Text style={styles.infoText}>• Dark theme support</Text>
          <Text style={styles.infoText}>• Shadow effects</Text>
          <Text style={styles.infoText}>• Customizable styling</Text>
          <Text style={styles.infoText}>• TypeScript support</Text>
          <Text style={styles.infoText}>• Custom render props</Text>
          <Text style={styles.infoText}>• Three layout options: codeInInput, codeInSelector, codeWithFlag</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  button: {
    marginTop: 15,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disableButton: {
    backgroundColor: '#FF6B6B',
  },
  activateButton: {
    backgroundColor: '#4ECDC4',
  },
  message: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  infoContainer: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  // Custom styles
  customFlag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  flagEmoji: {
    fontSize: 18,
    marginRight: 3,
  },
  flagText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
    flexShrink: 1,
  },
  customInput: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  customCountryItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    justifyContent: 'space-between',
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  countryCode: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  customDropdownIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  dropdownText: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
  },
  customModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '90%',
    height: '80%',
    padding: 20,
  },
  customModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  customModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  customSearchInput: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 15,
  },
});

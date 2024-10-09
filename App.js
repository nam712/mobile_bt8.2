import React, { createContext, useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Tạo một Context để lưu trữ số điện thoại
const PhoneNumberContext = createContext();

// Provider để chia sẻ giá trị của số điện thoại
const PhoneNumberProvider = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  return (
    <PhoneNumberContext.Provider value={{ phoneNumber, setPhoneNumber }}>
      {children}
    </PhoneNumberContext.Provider>
  );
};

// SignInScreen Component
const SignInScreen = ({ navigation }) => {
  const [inputPhoneNumber, setInputPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setPhoneNumber } = useContext(PhoneNumberContext); // Sử dụng Context để lưu số điện thoại

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[0-9]+$/;
    return phoneRegex.test(number) && number.length === 10;
  };

  const formatPhoneNumber = (number) => {
    return number.replace(/\s?/g, '').replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  const handleContinue = () => {
    const cleanedPhoneNumber = inputPhoneNumber.replace(/\s/g, '');
    if (validatePhoneNumber(cleanedPhoneNumber)) {
      console.log('Số điện thoại:', inputPhoneNumber);
      setPhoneNumber(inputPhoneNumber); // Lưu số điện thoại vào Context
      Alert.alert('Thông báo', 'Đăng nhập thành công');
      navigation.navigate('Home'); // Điều hướng tới HomeScreen
    } else {
      Alert.alert('Lỗi', 'Số điện thoại không đúng định dạng. Vui lòng nhập lại!');
    }
  };

  const handlePhoneNumberChange = (text) => {
    const cleanText = text.replace(/\D/g, '');
    setInputPhoneNumber(formatPhoneNumber(cleanText));
    if (validatePhoneNumber(cleanText)) {
      setErrorMessage('');
    } else {
      setErrorMessage('Số điện thoại không hợp lệ.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>Đăng nhập</Text>
      <View style={styles.separator} />
      <Text style={styles.subtitle}>Nhập số điện thoại</Text>
      <Text style={styles.description}>
        Dùng số điện thoại để đăng nhập hoặc đăng ký tài khoản tại OneHousing Pro
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập số điện thoại của bạn"
        placeholderTextColor="#a9a9a9"
        keyboardType="phone-pad"
        value={inputPhoneNumber}
        onChangeText={handlePhoneNumberChange}
        maxLength={13}
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <TouchableOpacity
        style={[styles.button, { marginTop: 40 }, inputPhoneNumber.length === 0 || errorMessage ? { backgroundColor: '#ccc' } : { backgroundColor: '#D2691E' }]}
        onPress={handleContinue}
        disabled={inputPhoneNumber.length === 0 || errorMessage !== ''}
      >
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

// HomeScreen Component
const HomeScreen = ({ navigation }) => {
  const { phoneNumber } = useContext(PhoneNumberContext); // Truy cập số điện thoại từ Context

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng đến với HomeScreen</Text>
      <Text style={styles.subtitle}>Số điện thoại của bạn: {phoneNumber}</Text>
      <TouchableOpacity
        style={[styles.button, { marginTop: 40, backgroundColor: '#4CAF50', height: 40, width: 200 }]}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={styles.buttonText}>Quay lại Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

// Stack Navigator Setup
const Stack = createStackNavigator();

const App = () => {
  return (
    <PhoneNumberProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'SignInScreen' }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'HomeScreen' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PhoneNumberProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 50,
    flex: 1,
    justifyContent: 'auto',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'left',
    marginTop: 16,
  },
  description: {
    textAlign: 'left',
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 16,
    fontSize: 16,
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: -15,
    marginBottom: 10,
  },
  button: {
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default App;

import Reac, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  StatusBar,
  StyleSheet,
  ToastAndroid,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Input,
  FormControl,
  WarningOutlineIcon,
  Center,
  NativeBaseProvider,
  Box,
  Image,
} from 'native-base';
import CustomButton from '../components/Button/Button';
import {PRIMARY_COLOR} from '../styles/style';
import {env} from '../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WalletButton from './WalletLogin';

function Login({navigation}) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getToken();
  }, []);
  async function getToken() {
    if (
      (await AsyncStorage.getItem('token')) &&
      (await AsyncStorage.getItem('is_new'))
    ) {
      navigation.navigate('Home');
    } else if (
      (await AsyncStorage.getItem('token')) &&
      (await AsyncStorage.getItem('is_new')) === null
    ) {
      navigation.navigate('Details');
    } else {
      return;
    }
  }

  //getting the phone number
  const handleChange = e => {
    setPhoneNumber(e);
    if (e.length < 10) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  };

  //submitting the phone number
  const handleSubmit = async () => {
    if (phoneNumber.length < 10) {
      setIsError(true);
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('phone_number', `+91${phoneNumber}`);
    const response = await fetch(`${env.url}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    let data = await response.json();
    if (data && data?.data?.otp_sent === true) {
      setIsLoading(false);
      ToastAndroid.show('OTP sent...', ToastAndroid.LONG);
      navigation.navigate('Verification', {
        number: phoneNumber,
      });
    } else {
      ToastAndroid.show(data.message, ToastAndroid.LONG);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        alt="logo"
        style={{
          marginTop: 50,
          alignSelf: 'center',
        }}
      />
      <View style={{marginTop: 50, marginBottom: 40}}>
        <Text style={styles.heading}>Sign In</Text>
        <Text style={styles.subHeading}>
          Enter your phone number to proceed
        </Text>
      </View>
      <FormControl isInvalid={false}>
        {isError && (
          <Text style={styles.label}>Enter 10 digit phone number</Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
          }}>
          <Box w="10%">
            <Input value="+91" variant={'underlined'} isDisabled isReadOnly />
          </Box>
          <Box w="90%">
            <Input
              placeholder="Enter phone number"
              style={{width: '90%'}}
              variant={'underlined'}
              focusOutlineColor={PRIMARY_COLOR}
              onChangeText={e => handleChange(e)}
              maxLength={10}
              keyboardType="phone-pad"
            />
          </Box>
        </View>
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          Try different from previous passwords.
        </FormControl.ErrorMessage>
      </FormControl>
      <CustomButton
        title={'Sign-In'}
        onPress={() => handleSubmit()}
        customStyle={{marginTop: 60}}
      />
      <WalletButton navigation={navigation} />
    </SafeAreaView>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 18,
    color: '#f24940',
    fontWeight: 'bold',
  },
  subHeading: {
    fontSize: 14,
    color: '#f24940',
  },
  label: {fontSize: 10, color: 'red', marginBottom: 5},
});

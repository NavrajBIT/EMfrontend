import {useEffect, useState} from 'react';
import {sha256} from 'js-sha256';
import CustomButton from '../components/Button/Button';
import {env} from '../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {Platform, Linking} from 'react-native';
import {
  StatusBar,
  StyleSheet,
  ToastAndroid,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function WalletButton({navigation}) {
  const [walletSocket, setWalletSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isWalletAvailable, setIsWalletAvailable] = useState(false);


  useEffect(() => { 
    connect();
  }, []);

  const walletLogin = async (wallet_address) => {
    console.log(wallet_address)
    let postData = {"wallet_address": wallet_address}
    console.log(typeof postData)

    const response = await fetch(`${env.url}/auth/walletlogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    let data = await response.json();
    console.log('Data received dadsfdf', data);
  
    if(data && data?.data){
      let token = JSON.stringify(data?.data?.token)
      console.log(token)
      await AsyncStorage.setItem('token', data?.data?.token)
      ToastAndroid.show("Login successfully", ToastAndroid.LONG)
       navigation.navigate('Home');
    }else{
      alert('Login Failed')
    }
  };

  const getFingerPrint = async () => {
    console.log('Calling ip address');
    const response = await fetch('https://api.ipify.org/?format=json');
    let {ip} = await response.json();
    console.log('IP address: ', ip);
    let sha = sha256(ip);
    return sha;
  };

  const connect = async () => {
    const fingerPrint = await getFingerPrint();

    const chatSocket = new WebSocket(`${env.socketUrl}${fingerPrint}/`);

    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);

      if (data.message === 'Wallet found') {
        
        setIsWalletAvailable(true);
      }
      if (data.message === 'login_accepted') {
        walletLogin(data.address);}

      if (data.message === 'login_rejected') alert('Login request rejected');
    };

    chatSocket.onclose = function (e) {
      setIsConnected(false);
      console.error('Chat socket closed unexpectedly');
    };
    chatSocket.onopen = function (e) {
      setWalletSocket(chatSocket);
      setIsConnected(true);
      chatSocket.send(
        JSON.stringify({
          message: 'Wallet_discovery',
        }),
      );
    };
  };

  const login = () => {
    ToastAndroid.show('Please accept the request from bitwallet', ToastAndroid.LONG)
    walletSocket.send(
      JSON.stringify({
        message: 'login_request',
        from: 'East Mojo',
      }),
    );
  };

  const downloadWallet = () => {
    const url =
      Platform.OS === 'ios'
        ? 'https://itunes.apple.com/app/be-imagine-technology-wallet/id6443855034'
        : 'https://play.google.com/store/apps/details?id=beimagine.tech&pli=1';
    Linking.openURL(url);
  };

  if (!isWalletAvailable)
    return (
      <>
        <View
          style={{
            marginTop: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Text style={styles.heading}>OR</Text>
          <Text style={styles.subHeading}>
            Login anonymously with bitwallet.
          </Text>
        </View>

        <CustomButton
          title={'Download BitWallet'}
          onPress={() => downloadWallet()}
          customStyle={{marginTop: 20, color: 'green'}}
        />
      </>
    );

  if (!isConnected) return <></>;

  return (
    <CustomButton
      title={'Login Anonymously'}
      onPress={() => login()}
      customStyle={{marginTop: 20, color: 'green'}}
    />
  );
}

export default WalletButton;

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

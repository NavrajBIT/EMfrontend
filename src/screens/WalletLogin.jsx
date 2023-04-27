import {useEffect, useState} from 'react';
import {sha256} from 'js-sha256';
import CustomButton from '../components/Button/Button';
import {env} from '../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

function WalletButton({navigation}) {
  const [walletSocket, setWalletSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    connect();
  }, []);

  const walletLogin = async wallet_address => {
    let formdata = new FormData();
    formdata.append('wallet_address', wallet_address);

    const response = await fetch(`${env.url}/auth/walletlogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    });
    let data = await response.json();
    console.log('Data received ', data);

    let token = data['data']['token'];
    console.log(token);
    await AsyncStorage.setItem('token', token);

    navigation.navigate('Home');

    return data;
  };

  const getFingerPrint = async () => {
    console.log('Calling ip address');
    const response = await fetch('https://api.ipify.org/?format=json');
    console.log(response);
    let {ip} = await response.json();
    console.log(ip);
    let deviceProp;
    try {
      deviceProp = navigator.userAgent.toString();
    } catch {
      deviceProp = DeviceInfo.getUniqueId();
    }
    let fingerPrint = ip + '_' + deviceProp;
    let sha = sha256(fingerPrint);
    return sha;
  };

  const connect = async () => {
    // const fingerPrint = await getFingerPrint();
    const fingerPrint = 'navrajDevice';

    const chatSocket = new WebSocket(`${env.socketUrl}${fingerPrint}/`);

    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      console.log(data);

      if (data.message === 'login_accepted')
        // alert('Logged in. Wallet address: ' + data.address);
        walletLogin(data.address);

      if (data.message === 'login_rejected') alert('Login request rejected');
    };

    chatSocket.onclose = function (e) {
      setIsConnected(false);
      console.error('Chat socket closed unexpectedly');
    };
    chatSocket.onopen = function (e) {
      setWalletSocket(chatSocket);
      setIsConnected(true);
    };
  };

  const login = () => {
    walletSocket.send(
      JSON.stringify({
        message: 'login_request',
        from: 'East Mojo',
      }),
    );
  };

  if (!isConnected) return <></>;

  return (
    <CustomButton
      title={'Wallet-Login'}
      onPress={() => login()}
      customStyle={{marginTop: 20, color: 'green'}}
    />
  );
}

export default WalletButton;

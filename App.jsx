
import React, { useState } from 'react';
import {

  StyleSheet,
  Text,ActivityIndicator,
  useColorScheme,
  Linking, SafeAreaView, View, Image
} from 'react-native';
import { NativeBaseProvider } from 'native-base';
import Navigation from './src/navigation/navigation';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContextProvider } from './src/context/AuthContext';
import { persistor, store } from './src/redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { CategoryContextProvider } from './src/context/categoryContext';
import NetInfo from '@react-native-community/netinfo';
// import linking from './src/utils/linking';
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://a29ae6ae36804511a165bc79e9c0b55a@o4505396038926336.ingest.sentry.io/4505396181598208",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});



function App() {



  const linking = {
    prefixes: ['peoplesapp://']
  };


  const [isOnline, setIsOnline] = useState(true);
  React.useEffect(() => {
    // Fetch connection status first time when app loads as listener is added afterwards
    NetInfo.fetch().then(state => {
      if (isOnline !== state.isConnected) {
        setIsOnline(!!state.isConnected && !!state.isInternetReachable);
      }
    });
  }, []);//r


  NetInfo.configure({
    reachabilityUrl: 'https://google.com',
    reachabilityTest: async response => response.status === 200,
    reachabilityLongTimeout: 30 * 1000, // 60s
    reachabilityShortTimeout: 5 * 1000, // 5s
    reachabilityRequestTimeout: 15 * 1000, // 15s
  });

  const containerStyle = {
    flex: 1,
  };// states/ effects
  // listeners
  NetInfo.addEventListener(state => {
    if (isOnline !== state.isConnected) {
      setIsOnline(!!state.isConnected && !!state.isInternetReachable);
    }
  });
  if (!isOnline) {
    return (
      <SafeAreaView style={containerStyle}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ fontSize: 24, color: 'black' }}>
            {!isOnline && 'No Internet Connection!!!'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NativeBaseProvider>
          <CategoryContextProvider>
            <AuthContextProvider>
              <NavigationContainer linking={linking}
                fallback={<ActivityIndicator color="blue" size="large" />}>
                <Navigation />
              </NavigationContainer>
            </AuthContextProvider>
          </CategoryContextProvider>
        </NativeBaseProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default Sentry.wrap(App);

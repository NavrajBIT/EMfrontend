
import React from 'react';
import {
  
  StyleSheet,
  Text,
  useColorScheme,
  Linking,
} from 'react-native';
import { NativeBaseProvider } from 'native-base';
import Navigation from './src/navigation/navigation';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContextProvider } from './src/context/AuthContext';
import { persistor, store } from './src/redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { CategoryContextProvider } from './src/context/categoryContext';
// import linking from './src/utils/linking';

function App() {

  const [deepLink, setDeepLink] = React.useState(null);

  const handleDeepLink = ({ url }) => {
    // Parse the URL
    const route = url.replace(/.*?:\/\//g, '');
    const id = route.match(/\/([^\/]+)\/?$/)[1];
  
    // Navigate to the appropriate screen
    if (route.includes('myapp.com/postdetails') && id) {
      navigateToDetailsScreen(id);
    }
  };
  
  const navigateToDetailsScreen = (id) => {
    // Navigate to the details screen for the specified ID
    console.log(`Navigating to details screen for ID ${id}`);
    // add your navigation logic here
  };

  // Listen for incoming deep links
  React.useEffect(() => {
  

    Linking.addEventListener('url', handleDeepLink);

    // Remove the event listener on cleanup
    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, []);

  // // Check if the app was opened from a deep link
  // React.useEffect(() => {
  //   Linking.getInitialURL().then((url) => {
  //     setDeepLink(url);
  //   });
  // }, []);

  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <NativeBaseProvider>
    <CategoryContextProvider>
    <AuthContextProvider>
    <NavigationContainer>
      <Navigation/>
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

export default App;

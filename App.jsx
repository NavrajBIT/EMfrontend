
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { NativeBaseProvider } from 'native-base';
import Login from './src/screens/Login';
import Verification from './src/screens/Verification';
import PersonalDetails from './src/screens/PersonalDetails';
import CreatePost from './src/screens/CreatePost';
import Profile from './src/screens/Account/Profile';
import HomeScreen from './src/screens/HomeScreen';
import Navigation from './src/navigation/navigation';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContextProvider } from './src/context/AuthContext';

function App() {
  return (
    <NativeBaseProvider>
    <AuthContextProvider>
    <NavigationContainer>
      <Navigation/>
    </NavigationContainer>
    </AuthContextProvider>
    </NativeBaseProvider>
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

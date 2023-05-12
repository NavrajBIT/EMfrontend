import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import Image from 'react-native'
import Login from '../screens/Login';
import BackButton from '../components/Button/BackButton';
import Verification from '../screens/Verification';
import PersonalDetails from '../screens/PersonalDetails';
import Profile from '../screens/Account/Profile';
import { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostDetails from '../screens/PostDetails';
import { AuthContext } from '../context/AuthContext';
import AccountInfo from '../screens/Account/AccountInfo';
import CreatePost from '../screens/CreatePost';
import Category from '../screens/Category';
import Comment from '../screens/Comment';
import TopNewsPostDetails from '../screens/TopNewsPostDetails';

const Stack = createNativeStackNavigator()

const Navigation = () => {
      const {login} = useContext(AuthContext)
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen}
                options={{
                    title: "",
                    headerShadowVisible: false,
                }}
            />
             <Stack.Screen name="Login" component={Login}
                options={(navigation, route) => ({
                    headerLeft: (props) => (<BackButton {...props} title={'Login'} onPress={() => navigation.navigation.goBack()} />),
                    title: "",
                    headerShadowVisible: false,

                })}
            />
            <Stack.Screen name="Verification" component={Verification}
                options={(navigation, route) => ({
                    headerLeft: (props) => (<BackButton {...props} title={'Verification'} onPress={() => navigation.navigation.goBack()} />),
                    title: "",
                    headerShadowVisible: false,


                })}
            />
            <Stack.Screen name="Details" component={PersonalDetails}
                options={(navigation, route) => ({
                    headerLeft: (props) => (<BackButton {...props} title={'Personal Details'} onPress={() => navigation.navigation.goBack()} />),
                    title: "",
                    headerShadowVisible: false,

                })}
            />
            <Stack.Screen name="Profile" component={Profile}
                options={(navigation, route) => ({
                    headerLeft: (props) => (<BackButton {...props} title={'Account'} onPress={() => navigation.navigation.goBack()} />),
                    title: "",
                    headerShadowVisible: false,

                })}
            />
                <Stack.Screen name="AccountInfo" component={AccountInfo}
                options={(navigation, route) => ({
                    headerLeft: (props) => (<BackButton {...props} title={'Account'} onPress={() => navigation.navigation.goBack()} />),
                    title: "",
                    headerShadowVisible: false,

                })}
            />
            <Stack.Screen name="PostDetails" component={PostDetails}
                    options={{headerShown:false}}
            />
              <Stack.Screen name="TopNewsPostDetails" component={TopNewsPostDetails}
                    options={{headerShown:false}}
            />
              <Stack.Screen name="CreatePost" component={CreatePost}
                options={(navigation, route) => ({
                    headerLeft: (props) => (<BackButton {...props} title={`Create Post`} onPress={() => navigation.navigation.goBack()} />),
                    title: "",
                    headerShadowVisible: false,

                })}
            />
             <Stack.Screen name="Category" component={Category}
             options={{
                headerShown:false
             }} 
            />
            <Stack.Screen name="Comments" component={Comment}
             options={(navigation, route) => ({
                headerLeft: (props) => (<BackButton {...props} title={`Comments`} onPress={() => navigation.navigation.goBack()} />),
                title: "",
                headerShadowVisible: false,

            })}
            />
        </Stack.Navigator>
    )
}

export default Navigation;
import { Text, TextArea, View, Image, Pressable } from 'native-base'
import React, { useLayoutEffect, useEffect, useContext } from 'react'
import { useWindowDimensions, Dimensions, ToastAndroid, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import ForYou from './home_tabs/ForYou';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { PRIMARY_COLOR } from '../styles/style';

function HomeScreen({ navigation }) {

    const { login, setIsLoggedIn } = useContext(AuthContext)

    useEffect(() => {
        getToken()
    }, [])


    async function getToken() {
        setIsLoggedIn(await AsyncStorage.getItem('token'))
    }


    const handleNavigation = async () => {
        let token = await AsyncStorage.getItem('token')
        if (token) {
            navigation.navigate('Profile')
        }
        else {
            navigation.navigate('Login')
        }

    }

    async function handleUserNavigation() {
        let token = await AsyncStorage.getItem('token')
        if (!token) {
            navigation.navigate('Login')
        } else {
            navigation.navigate('CreatePost')
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => <Image
                style={{ width: 148, height: 32, marginTop: 20 }}
                source={require('../../assets/images/logo.png')}
                alt=""
                resizeMode='contain' />,
            headerRight: () => <View style={{
                flexDirection: 'row', alignItems: "center"
            }}>
                <TouchableOpacity onPress={handleUserNavigation}>
                    <Image source={require('../../assets/images/create.png')} alt="" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNavigation} style={{ marginLeft: 10 }}>
                    <Icon name="user" size={23} color={PRIMARY_COLOR} />
                </TouchableOpacity>
            </View>
        });
    }, [navigation]);

    const renderScene = SceneMap({
        topnews: ForYou,
        newregion: ForYou,
        nePositive: ForYou,
        videos: ForYou,

    });

    const renderTabBar = props => (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: 'white',
        }}>
            <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: "rgba(242, 73, 64, 0.5)" }}
                style={{ backgroundColor: 'white', color: 'black', width: Dimensions.get('window').width - 35, elevation: 0 }}
                labelStyle={{
                    color: 'rgba(0, 0, 0, 0.4)',
                    fontSize: 12,
                    padding: 0,
                    textTransform: 'capitalize'
                }}
                activeColor={'black'}

            />
            <Pressable onPress={async () => navigation.navigate('Category')}>
                <Icon name="dots-three-vertical" size={20} style={{ marginLeft: 0 }} color="black" />
            </Pressable>
        </View>
    );

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'topnews', title: 'For You' },
        { key: 'newregion', title: 'NE Region' },
        { key: 'nePositive', title: 'NE Positive' },
        { key: 'videos', title: 'Videos' },
    ]);

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={renderTabBar}
            swipeEnabled={false}
            initialLayout={{ width: Dimensions.get('window').width }}
        />
    );
}

export default HomeScreen
import { Text, TextArea, View, Image, Pressable } from 'native-base'
import React, { useLayoutEffect, useEffect, useContext, useState } from 'react'
import { useWindowDimensions, Dimensions, ToastAndroid, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import ForYou from './home_tabs/ForYou';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { PRIMARY_COLOR } from '../styles/style';
import { CategoryContext } from '../context/categoryContext';

function HomeScreen({ navigation }) {


    const [status, setStatus] = useState("All")    
    const {activeTab,setActiveTab, category } = useContext(CategoryContext)

    useEffect(() => {
        getToken()        
    }, [])

    const { login, setIsLoggedIn } = useContext(AuthContext)
    const getToken = async () => {
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
                    <Image source={require('../../assets/images/profile.png')} alt="" style={{ width: 26, height: 26 }} />
                </TouchableOpacity>
            </View>
        });
    }, []);

    return (

        <SafeAreaView style={styles.container}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: "auto",
                justifyContent: 'flex-start',
                backgroundColor: 'white',
            }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[{
                    elevation: 5,
                    shadowColor: 'black'
                }]}>
                    {category.length > 0 && category.map((e, i) => (
                        <TouchableOpacity
                            onPress={() => setActiveTab(e.name)}
                            style={[
                                styles.btnTab, activeTab === e.name && styles.btnTabActive
                            ]}
                        >
                            <Text
                                style={[
                                    styles.textTab, activeTab === e.name && styles.textTabActive
                                ]}
                            >
                                {e.name}
                            </Text>
                        </TouchableOpacity>
                    ))}



                </ScrollView>
                <Pressable onPress={async () => navigation.navigate('Category')}>
                    <Icon name="dots-three-vertical" size={20} style={{ marginRight: 15, padding: 10 }} color="black" />
                </Pressable>
            </View>
            {
                category.map((el) => {
                    if (el.name === activeTab) {
                        return <ForYou item={el} />
                    }
                })
            }
        </SafeAreaView>


    );
}

export default HomeScreen
const deviceWidth = Math.round(Dimensions.get('window').width)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    btnTab: {
        backgroundColor: "white",
        width: 100,
        height: 45,
        textAlign: "center",
        justifyContent: "center",
    },
    btnTabActive: {
        borderBottomColor: PRIMARY_COLOR,
        borderBottomWidth: 3
    },
    textTab: {
        color: "rgba(0,0,0,0.4)",
        textAlign: "center",
        fontSize: 12,

    },
    textTabActive: {
        color: "black",
    },

});
import { Image, Text, TextArea, View, Menu, Pressable, Button } from 'native-base'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useWindowDimensions, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { PRIMARY_COLOR } from '../../styles/style';
import CustomButton from '../../components/Button/Button';
import Posted from '../post_screens/Posted';
import Rejected from '../post_screens/Rejected';
import Pending from '../post_screens/Pending';
import { getProfileData } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from '../Login';
import { env } from '../../../env';


function Profile({ navigation }) {

    const [profileData, setProfileData] = useState([])
    const getUserData = async () => {
        const response = await getProfileData();
        if (response.status === 200 && response?.data) {
            await AsyncStorage.setItem('user_type', JSON.stringify(response?.data?.user_type))
            setProfileData(response?.data)
        }

    }
    useEffect(() => {
        getUserData()
    }, [])


    const renderScene = SceneMap({
        pending: Pending,
        posted: Posted,
        rejected: Rejected,

    });

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
            headerRight: () => <View style={{
                flexDirection: 'row', alignItems: "center"
            }}>
                <TouchableOpacity onPress={handleUserNavigation}>
                    <Image source={require('../../../assets/images/create.png')} alt="" />
                </TouchableOpacity>
            </View>
        });
    }, []);

    

    const renderTabBar = props => (
        <View style={{
            marginTop: 35,
            alignItems: 'center',
            borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 1,
        }}>
            <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: PRIMARY_COLOR, height: 3, }}
                style={{ backgroundColor: 'white', color: 'black', width: '85%', elevation: 0 }}
                labelStyle={{
                    color: PRIMARY_COLOR,
                    fontSize: 15,
                    padding: 0,
                    textTransform: 'capitalize'
                }}
                activeColor={PRIMARY_COLOR}
            />
        </View>
    );

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'pending', title: 'Pending' },
        { key: 'posted', title: 'Posted' },
        { key: 'rejected', title: 'Rejected' },
    ]);

    if (!profileData) {
        navigation.navigate('Login')
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: 'white'
        }}>
            <View style={{ paddingHorizontal: 30 }}>
                <View style={{
                    width: '100%', backgroundColor: 'white',
                    marginTop: 30,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{
                            width: 75,
                            height: 75,
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 5,
                            borderRadius: 20,
                            borderWidth: 1,
                            borderColor: PRIMARY_COLOR
                        }}>
                            {profileData?.display_picture ? <Image source={{ uri: `${env.imageUri}${profileData?.display_picture}` }} alt="" 
                            style={{width:'100%', height:'100%', borderRadius:20}}
                            /> : <Image source={require('../../../assets/images/profile_img.png')} alt="" />}
                        </View>
                        <View style={{
                            marginLeft: 15,
                            paddingVertical: 5
                        }}>
                            <Text style={{
                                fontSize: 20,
                                color: PRIMARY_COLOR
                            }}>{profileData?.name || "NA"}</Text>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{
                                    fontSize: 13,
                                    lineHeight: 15,
                                    color: 'rgba(0,0,0,0.4)'
                                }}>{profileData?.phone_number}</Text>
                                <Text style={{
                                    fontSize: 13,
                                    lineHeight: 15,
                                    color: 'rgba(0,0,0,0.4)'
                                }}>{profileData?.email || "NA"}</Text>
                            </View>
                        </View>
                    </View>
                    <Menu w="200"
                        placement='top'
                        style={{ postion: 'relative', bottom: 40, right: 35 }}
                        trigger={triggerProps => {
                            return <Pressable {...triggerProps}>
                                <Icon name="dots-three-vertical" size={20} style={{ position: 'relative', top: 2, color: PRIMARY_COLOR }} />
                            </Pressable>
                        }}>
                        <Menu.Item onPress={() => navigation.navigate('Details', {
                            data: profileData
                        })}>
                            Edit Profile
                        </Menu.Item>
                        <Menu.Item>About Us</Menu.Item>
                        <Menu.Item>
                            <Button
                                style={{ width: '100%', marginTop: 30, borderWidth: 1, borderColor: PRIMARY_COLOR }}
                                size="sm"
                                _text={{
                                    color: PRIMARY_COLOR
                                }}
                                variant={"outline"}
                                onPress={async () => {
                                    await AsyncStorage.clear();
                                    navigation.navigate('Home')
                                    ToastAndroid.show('User logged out', ToastAndroid.LONG)
                                }}>
                                Logout
                            </Button>


                        </Menu.Item>
                    </Menu>

               </View>
             </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={renderTabBar}
                initialLayout={{ width: Dimensions.get('window').width }}
            />
        </View>
    );
}

export default Profile
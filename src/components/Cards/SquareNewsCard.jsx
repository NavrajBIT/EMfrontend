import { ImageBackground, StyleSheet, ToastAndroid, View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Box, AspectRatio, Image, Center } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { env } from '../../../env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { handleDate } from '../../utils'
// import { ToastAndroid } from 'react-native/Libraries/Components/ToastAndroid/ToastAndroid'

const SquareNewsCard = ({data}) => {
    const navigation = useNavigation();

    async function handleNavigation() {
        let token = await AsyncStorage.getItem('token')
        if (token) {
            navigation.navigate('PostDetails', {data})
        } else {
            ToastAndroid.show('Please login first...', ToastAndroid.LONG)
            navigation.navigate('Login')
        }
    }

    return (
        <TouchableOpacity onPress={() => handleNavigation()}>
        <Box w="170" rounded="lg" overflow="hidden" mr="4">
            <AspectRatio w="170" ratio={1 / 1}>
            { data?.display_picture ? <Image source={{uri: `${env.imageUri}${data?.display_picture}`}} alt="image" 
                    width={"100%"}
                    height={"100%"}
                    /> : 
                    <Image source={require('../../../assets/images/Rectangle_6.jpg')} alt="image" 
                    width={"100%"}
                    height={"100%"}
                    />
                    }
            </AspectRatio>
            <Box style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                justifyContent: 'flex-end'
            }}

                position="absolute" bottom="0" top="0" right="0" left="0" px="3" py="1.5">
                <Text style={{
                    zIndex: 10,
                    color: 'white',
                    fontSize: 12,
                    fontWeight: '500',
                    lineHeight: 14,
                }}>
                   {data?.title}
                </Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 5
                }}>
                    <Text style={{
                        fontWeight: '500',
                        fontSize: 9,
                        color: 'white'
                    }}>{data?.location}</Text>
                    <Text style={{
                        fontWeight: '400',
                        fontSize: 9,
                        color: 'white'
                    }}>{handleDate(data?.created_at)}</Text>
                </View>
            </Box>
        </Box>
        </TouchableOpacity>
    )
}

export default SquareNewsCard


const styles = StyleSheet.create({
    container: {
        width: 175,
        height: 175,
    }
})


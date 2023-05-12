import { ImageBackground, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Box, AspectRatio, Image, Center } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Entypo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { env } from '../../../env'
import { handleDate } from '../../utils'
import HTMLView from "react-native-htmlview";



const RectNewsCard = ({data}) => {
    const navigation = useNavigation();
    async function handleNavigation() {
        let token = await AsyncStorage.getItem('token')
        if (token) {
            navigation.navigate('TopNewsPostDetails', {
                data: data
            })
        } else {
            navigation.navigate('Login')
        }
    }


    return (
        <TouchableOpacity onPress={() => handleNavigation()} style={{marginVertical: 15,  height: 192}}>
            <Box rounded="lg" overflow="hidden" style={{
                width: '100%',
                height: 192,
            }}>
                <AspectRatio>
                  { data && data?.image ? <Image source={{uri:`${data?.image.split(".jpg")[0]}.jpg`}} alt="image" 
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
                        textAlignVertical: 'center'
                    }}><Icon name="dot-single" size={15} color={'#ffffff'} />{handleDate(data?.date)}</Text>
                    {data?.title &&
                        <View><HTMLView value={`<p>${data?.title}</p>`} stylesheet={styles}/></View>
                    }
                </Box>
            </Box>
        </TouchableOpacity>
    )
}

export default RectNewsCard



const styles = StyleSheet.create({
 
    p: {
      color: 'white',
    fontWeight:"600"    }
  })
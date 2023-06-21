import { ImageBackground, StyleSheet, ToastAndroid, View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Box } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PRIMARY_COLOR } from '../../styles/style'
import Icon from 'react-native-vector-icons/AntDesign'

const CreatPostIcons = ({ data }) => {
    const navigation = useNavigation();

    async function handleNavigation() {
        let token = await AsyncStorage.getItem('token')
        if (token) {

            navigation.navigate('CreatePost')
        } else {
            ToastAndroid.show('Please login first...', ToastAndroid.SHORT)
            navigation.navigate('Login')
        }
    }

    return (
        <TouchableOpacity onPress={handleNavigation}
        >
            <Box w="170" rounded="lg" overflow="hidden" mr="4"
                h="170"
                style={{
                    borderColor: PRIMARY_COLOR,
                    borderWidth: 2,
                    padding: 12,
                    justifyContent: 'center',
                    alignItem: 'center'
                }}
            >
                <Icon name="pluscircle" size={30} style={{ alignSelf: 'center' }}
                    color={PRIMARY_COLOR}
                />
                <Text style={{
                    zIndex: 10,
                    color: 'black',
                    fontSize: 14,
                    marginTop: 20,
                    fontWeight: '600',
                    lineHeight: 16,
                    textAlign: 'center'
                }}>
                    Contribute a Story
                </Text>
            </Box>
        </TouchableOpacity>
    )
}

export default CreatPostIcons


const styles = StyleSheet.create({
    container: {
        width: 175,
        height: 175,
    }
})


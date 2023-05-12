import { View, Text, TouchableHighlight, StyleSheet, ToastAndroid } from 'react-native'
import React from 'react'
import CustomButton from '../../components/Button/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AccountInfo = ({ navigation }) => {
    return (
        <View style={{
            flex: 1,
            backgroundColor: 'white',
            paddingHorizontal: 30,
            paddingTop: 60
        }}>
            <TouchableHighlight
                onPress={() => navigation.navigate("Details")}
                style={styles.buttonContainer}>
                <Text style={{ fontSize: 18, color: '#333333' }}>Edit Profile</Text>
            </TouchableHighlight>

            <TouchableHighlight
                style={styles.buttonContainer}>
                <Text style={{ fontSize: 18, color: '#333333' }}>About Us</Text>
            </TouchableHighlight>
            <CustomButton title={"Logout"} customStyle={{ position: 'absolute', bottom: 20, width: '100%', marginLeft: 30 }}
                onPress={async () => {
                    await AsyncStorage.clear();
                    navigation.navigate('Home')
                    ToastAndroid.show('User logged out', ToastAndroid.LONG)
                }}
            />
        </View>
    )
}

export default AccountInfo


const styles = StyleSheet.create({
    buttonContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 30
    }
})
import React, { useRef, useState, useEffect } from 'react'
import { SafeAreaView, View, Text, StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native'
import { Image, Pressable, ScrollView } from 'native-base'
import { BLUE_COLOR, PRIMARY_COLOR } from '../styles/style'
import OTPTextInput from 'react-native-otp-textinput'
import CustomButton from '../components/Button/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { verifyOtp, resendOtp } from '../services/api'
import { env } from '../../env'


function Verification({ navigation, route }) {
    const [otp, setOtp] = useState("")

    //state to get the Time
    const [count, setCount] = useState(60);
    const [isCounting, setIsCounting] = useState(true);
    const [loading, setIsLoading] = useState(false)

    // function to convert tiume into minutes
    const toTime = (duration) => {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration - minutes * 60);
        return `${minutes < 10 ? `${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
    }

    // function to start timer for resend code
    useEffect(() => {
        let interval = null;
        if (count > 0) {
            interval = setInterval(() => {
                setCount(count => count - 1);
            }, 1000);
        } else if (count === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isCounting, count]);


    //function to verify the OTP
    const handleVerifyOtp = async () => {
        const formData = new FormData();
        formData.append('otp', otp)
        formData.append('phone_number', `+91${route.params.number}`)
        let response = await verifyOtp(formData);
        console.log(response)
        if (response && response.data?.token) {
            await AsyncStorage.setItem("token", response?.data?.token)
            await AsyncStorage.setItem("is_new", JSON.stringify(response?.data?.is_new))
            await AsyncStorage.setItem("user_type", JSON.stringify(response?.data?.user_type))
            if (response?.data?.is_new === false) {
                ToastAndroid.show(response?.message, ToastAndroid.LONG)
                navigation.navigate("Home")
            } else {
                ToastAndroid.show(response?.message, ToastAndroid.LONG)
                navigation.navigate("Details")
            }
        } else {
            ToastAndroid.show(response?.message, ToastAndroid.LONG)
        }
    }


    //function to resend the Otp 
    const handleSubmit = async () => {
        setIsLoading(true)
        const formData = new FormData();
        formData.append('phone_number', `+91${route.params.number}`)
        const response = await fetch(`${env.url}/auth/signin`, {
            method: 'POST',
            headers: {
                "Content-Type": "multipart/form-data"
            },
            body: formData
        })

        let data = await response.json()
        if (data && data?.data?.otp_sent === true) {
            setIsLoading(false)
            ToastAndroid.show('OTP sent...', ToastAndroid.LONG)
        } else {
            ToastAndroid.show(data.message, ToastAndroid.LONG)
        }
    }

    return (<ScrollView style={styles.container}>
         <Image source={require('../../assets/images/logo.png')}  alt="logo" style={{
                marginTop:40,
                alignSelf:'center'
            }}/>

        <Text style={[styles.heading, { marginTop: 50 }]}>We've sent a verification code to</Text>
        <Text
            style={[styles.heading, { color: PRIMARY_COLOR }]}
        >{`${route?.params?.number.substring(0, 2)}******${route?.params?.number.substring(8, 10)}`}</Text>
        <Pressable onPress={() => navigation.goBack()}>
        <Text style={
            {
                color: BLUE_COLOR,
                fontSize: 15,
                marginTop: 7
            }}>Edit number</Text>
        </Pressable>
        <Text style={[styles.heading, { marginTop: 40 }]}>Enter the 6-digit verification code to Sign-in</Text>
        <View style={{
            alignItems: 'center',
            marginBottom: 18
        }}>
            <OTPTextInput inputCount={6} handleTextChange={(e) => setOtp(e)}
                containerStyle={[styles.textInputContainer, { marginTop: 24 }]}
                textInputStyle={[styles.roundedTextInput, { borderWidth: 1, borderBottomWidth: 1, margin: 4 }]}
                tintColor="#000000"
                offTintColor="#000000"
                keyboardType="numeric"

            />
            <Text style={{
                marginTop: 20,
                fontSize: 16,
                color: PRIMARY_COLOR
            }}>Paste verification code here</Text>
        </View>
        <CustomButton title={"Verify"} customStyle={otp.length === 6 ? styles.button : styles.disabledButton} disabled={otp.length < 6}
            onPress={() => handleVerifyOtp()} />
        {<TouchableOpacity style={{ marginTop: 20 }} onPress={() => { setCount(60); setOtp(''); handleSubmit()}}
            disabled={count !== 0}
        >
            <Text style={{
                textAlign: "center",
                fontSize: 15,
                fontWeight: '400',
                color: BLUE_COLOR
            }}>{count !== 0 ? "Resend verification code" : "Resend Code"}</Text>
            {count !== 0 && <Text style={{
                textAlign: "center",
                marginTop: 6,
                fontSize: 15,
                color: "rgba(25,6,167,0.6)"
            }}>after {count} seconds</Text>}
        </TouchableOpacity>}
    </ScrollView>
    )
}

export default Verification

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,
        backgroundColor: 'white'
        // backgroundColor:'red'
    },
    heading: {
        fontSize: 20,
        color: 'black',
        fontWeight: '500',
    }, roundedTextInput: {
        borderRadius: 5,
        borderWidth: 1,

    },
})
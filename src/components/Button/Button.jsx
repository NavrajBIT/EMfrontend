import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { PRIMARY_COLOR } from '../../styles/style'
import { Button } from 'native-base'

function CustomButton({title, customStyle, customTextStyle, onPress}) {
    return (
    <Button onPress={onPress} style={[styles.button, customStyle]}>
     <Text style={[styles.buttonText, customTextStyle]}>{title}</Text>
    </Button>
    )
}

export default CustomButton

const styles = StyleSheet.create({
    button:{
        backgroundColor: PRIMARY_COLOR, 
        height: 54,
        paddingVertical: 16,
    },
    buttonText:{ color: 'white', fontSize: 18, }
})
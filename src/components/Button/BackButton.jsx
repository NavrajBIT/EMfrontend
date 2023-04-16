import { View, Text } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Entypo'
import { Pressable } from 'native-base'

const BackButton = ({props, title, onPress}) => {

  return (
    <View style={{
        flexDirection:'row',
        alignItems:'center'
    }}>
    <Pressable onPress={onPress}>
    <Icon name="chevron-left"  size={30} color="rgba(0,0,0,0.4)"/>
    </Pressable>
      <Text style={{
        fontSize:20,
        color:'rgba(0,0,0,0.4)'
      }}>{title}</Text>
    </View>
  )
}

export default BackButton
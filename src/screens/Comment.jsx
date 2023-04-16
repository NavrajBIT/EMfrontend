import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { ScrollView } from 'native-base'
import { PRIMARY_COLOR } from '../styles/style'

const Comment = ({ navigation, route }) => {
    let comments = route.params.data;
    const renderItem = ({ item }) => <View style={{
        marginVertical: 10
    }}>
        <Text style={{
            color: PRIMARY_COLOR,
            fontSize: 13,
            fontWeight: 400,
            textAlign: 'justify'
        }}>{`@${item.user?.name}`} <Text style={{
            color: 'black'
        }}>{item.content}</Text></Text>
    </View>
    return (
        <ScrollView style={{paddingHorizontal:30, paddingVertical:10}}>
            <FlatList
                data={comments}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}

            />
        </ScrollView>
    )
}

export default Comment
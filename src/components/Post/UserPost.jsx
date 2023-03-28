import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image, Divider } from 'native-base'
import { PRIMARY_COLOR } from '../../styles/style'
import Icon from 'react-native-vector-icons/EvilIcons'
import { handleDate } from '../../utils'
import { env } from '../../../env'
import { useNavigation } from '@react-navigation/native'

const UserPost = ({ data }) => {
    const navigation  = useNavigation()
    return (<>
        <TouchableOpacity 
        onPress={() => navigation.navigate('PostDetails', {
            data:data
        })}
        style={{
            flexDirection: 'row',
            width: '100%'
        }}>
            {data?.display_picture ? <Image source={{ uri: `${env.imageUri}${data?.display_picture}` }}
                style={{
                    width: 125,
                    height: 125,
                    borderRadius: 5
                }}
                alt=""
            /> : <Image source={require("../../../assets/images/post_image.png")}
                style={{
                    width: 125,
                    height: 125,
                    borderRadius: 5
                }}
                alt=""
            />}
            <View style={{
                marginLeft: 15,
                justifyContent: 'space-between',
                width: Dimensions.get('window').width - 125,
            }}>
                <Text style={{
                    fontSize: 15,
                    marginTop: 5,
                    width: '70%',
                    color: '#000000',
                    fontWeight: '500',
                }}>{data?.title}</Text>
                <View style={{
                    flexDirection: 'row',
                    width: '70%',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    height: 30
                }}>
                    <View >
                        <Text style={{
                            color: PRIMARY_COLOR,
                            fontSize: 14,
                            fontWeight: '400',
                        }}>{handleDate(data?.created_at)}</Text>
                    </View>
                    <View>
                        <Icon name="like" size={25} color={PRIMARY_COLOR} />
                        <Text style={{
                            fontSize: 10, color: PRIMARY_COLOR,
                            textAlign: 'center'
                        }}>{data?.likes}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
        <Divider style={{ marginTop: 20, marginBottom: 20 }} />
    </>
    )
}

export default UserPost
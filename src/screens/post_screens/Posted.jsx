import { Divider } from 'native-base'
import React, { useState, useEffect } from 'react'
import {
  FlatList,
  View,
  ScrollView, Text
} from 'react-native'
import { ActivityIndicator } from 'react-native-paper';
import UserPost from '../../components/Post/UserPost'
import { getUserPost } from '../../services/api';
import { PRIMARY_COLOR } from '../../styles/style';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Posted() {

  const [post, setPost] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("")

  useEffect(() => {
    getUserType()
     getUserPostData()
  }, []);

  const getUserType =async  () =>{
    console.log(typeof await AsyncStorage.getItem('user_type'))
    setUserType(await AsyncStorage.getItem('user_type'))
 }

  const getUserPostData = async  () =>{
    setIsLoading(true)
    const response = userType === "1" ?  await getUserPost("3", offset) :  await getUserPost("1,3", offset);

    if (response && response?.data?.length > 0) {
        //After the response increasing the offset for the next API call.
        setPost([...response.data]);
        setIsLoading(false);
    }
  }

  const loadMoreItem = async () => {
    setOffset(offset + 10);
    const response = userType === "1" ?  await getUserPost("3", offset) :  await getUserPost("1,3", offset);
    if (response && response?.data?.length > 0) {
        //After the response increasing the offset for the next API call.
        if (post.length > 10) {
          setPost([...post, ...response.data]);
      } else {
          return;
      }
    }
};


const renderItem = ({ item }) => {
  return (<View key={item.id}>
    <UserPost data={item}/>
    </View>
  );
};

  const renderLoader =() => <ActivityIndicator color={PRIMARY_COLOR} size="small"/>

  return (
    <View style={{
      paddingHorizontal: 25,
      paddingTop: 40,
      marginBottom: 20
    }}>
      {post && post.length > 0 ? <FlatList
        data={post}
        renderItem={renderItem}
        keyExtractor={item => item?.id?.toString()}
        onEndReached={loadMoreItem}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderLoader}
      />: <Text style={{fontSize:16, fontWeight:'500', textAlign:'center', color:'black'}}>Posts not available...</Text>}
    </View>
  );

}

export default Posted
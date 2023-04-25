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

function Rejected() {

  const [post, setPost] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
     getUserPostData()
  }, []);

  const getUserPostData = async  () =>{
    setIsLoading(true)
    const response = await getUserPost(4, offset)
    if (response && response?.data?.length > 0) {
        //After the response increasing the offset for the next API call.
        setPost([...response.data]);
        setIsLoading(false);
    }
  }

  const loadMoreItem = async () => {
    setOffset(offset + 10);
    const response = await getUserPost(4, offset)
    if (response && response?.data?.length > 0) {
        //After the response increasing the offset for the next API call.
        setPost([...post, ...response.data]);
    }
};

  const renderItem = ({ item }) => {
    return (<>
      <UserPost data={item} />
    </>
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

export default Rejected
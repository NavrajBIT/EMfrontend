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

function Pending() {

  const [post, setPost] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
     getUserPostData()
  }, []);

  const getUserPostData = async  () =>{
    const response = await getUserPost(0,10)
  console.log(response)
     setPost(response.data)
  }
  const fetchMore = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const nextPage = currentPage + 1;
    const newData = await getUserPost(2,10, nextPage);

    setCurrentPage(nextPage);
    setIsLoading(false);
    setPost(prevData => [...prevData, ...newData]);
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
        keyExtractor={item => item?.id.toString()}
        // onEndReached={fetchMore}
        // onEndReachedThreshold={0.1}
        // ListFooterComponent={renderLoader}
      />: <Text style={{fontSize:16, fontWeight:'500', textAlign:'center', color:'black'}}>Posts not available...</Text>}
    </View>
  );

}

export default Pending
import { View, Text, StyleSheet, FlatList, Dimensions,ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { ariaAttr, Divider, ScrollView } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { PRIMARY_COLOR } from '../../styles/style'
import SquareNewsCard from '../../components/Cards/SquareNewsCard'
import RectNewsCard from '../../components/Cards/RectNewsCard'
import { useNavigation } from '@react-navigation/native'
import Carousel from 'react-native-snap-carousel'
import { getAllPost } from '../../services/api'

const { width } = Dimensions.get("window");

const ForYou = () => {

    const [post, setPost] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation()

    useEffect(() => {
        getUserPostData()
    }, []);

    const getUserPostData = async () => {
        setIsLoading(true)
        const response = await getAllPost()
        setIsLoading(false)
        console.log(response.data)
        setPost(response?.data)
    }
    // const fetchMore = async () => {
    //     if (isLoading) return;

    //     setIsLoading(true);

    //     const nextPage = currentPage + 1;
    //     const newData = await getAllPost(2, 10, nextPage);

    //     setCurrentPage(nextPage);
    //     setIsLoading(false);
    //     // setPost(prevData => [...prevData, ...newData]);
    // };

    const renderItem = ({ item }) => {
        return (<>
             <RectNewsCard data={item} />
        </>
        );
    };
    const renderLoader =() => <ActivityIndicator color={PRIMARY_COLOR} size="small"/>


    if (isLoading) {
        return <SafeAreaView>
          <ActivityIndicator size="large" color={PRIMARY_COLOR}
            style={{
              marginTop: 40
            }}
          />
        </SafeAreaView>
      }

    return (<>
        {post && post.length > 0 ?
            <ScrollView style={styles.container}>
                {/* <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 20,
                }}><Text style={{
                    fontWeight: '500',
                    fontSize: 15,
                    color: '#000000'
                }}>Top News</Text>

                </View>

                <ScrollView horizontal>
                    <SquareNewsCard />
                    <SquareNewsCard />
                    <SquareNewsCard />
                    <SquareNewsCard />
                </ScrollView> */}
                <FlatList
                    data={post}
                    renderItem={renderItem}
                    keyExtractor={item => item?.id?.toString()}
                    // onEndReached={fetchMore}
                    // onEndReachedThreshold={0.1}
                    // ListFooterComponent={renderLoader}
                /> 
            </ScrollView> : <Text style={{ fontSize: 16,marginTop:30, fontWeight: '500', textAlign: 'center', color: 'black' }}>Posts not available...</Text>}
    </>
    )
}

export default ForYou


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        backgroundColor: 'white',
    }
})
import { View, Text, StyleSheet, FlatList, Dimensions, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { ariaAttr, Divider, ScrollView } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { PRIMARY_COLOR } from '../../styles/style'
import SquareNewsCard from '../../components/Cards/SquareNewsCard'
import RectNewsCard from '../../components/Cards/RectNewsCard'
import { useNavigation } from '@react-navigation/native'
import Carousel from 'react-native-snap-carousel'
import { getAllPost } from '../../services/api'
import { useSelector } from 'react-redux'
import { categoryState } from '../../features/categorySlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PostDetails from '../PostDetails'


const { width } = Dimensions.get("window");

const ForYou = ({ item }) => {
    const [post, setPost] = useState([]);
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [topNews, setTopNews] = useState([])

    const navigation = useNavigation()


    useEffect(() => {
        getUserPostData()
    }, [item]);

    const getUserPostData = async () => {
        setIsLoading(true);
        const response = await getAllPost(item.name, 0)
        setIsLoading(false);
        if (response && response?.data?.length > 0) {
            //After the response increasing the offset for the next API call.
            let topPost = response.data.length > 0 && response.data?.slice(0, 4);
            setTopNews(topPost)
            let finalPosts = response?.data.slice(4)
            setPost([...finalPosts])
        }
    }

    const loadMoreItem = async () => {
        setOffset(offset + 10);
        const response = await getAllPost(item.name, offset)
        if (response && response?.data?.length > 0) {
            //After the response increasing the offset for the next API call.
            setPost([...post, ...response.data]);
        }
    };

    const renderItem = ({ item }) => {
        return (<>
            <RectNewsCard data={item} />
        </>
        );
    };
    const renderLoader = () => <ActivityIndicator color={PRIMARY_COLOR} size="small" />


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
            {topNews.length > 0 ?   <ScrollView style={styles.container}>
                <View style={{
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

                <ScrollView horizontal style={{ marginBottom: 15 }}>
                    {topNews.length > 0 && topNews.map(el => <SquareNewsCard data={el} />)}
                </ScrollView>

                <FlatList
                    data={post}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => String(index)}
                    onEndReached={loadMoreItem}
                    onEndReachedThreshold={0}
                    ListFooterComponent={renderLoader}
                />
            </ScrollView>
            : <Text style={{ fontSize: 16, marginTop: 30, fontWeight: '500', textAlign: 'center', color: 'black' }}>Posts not available...</Text>}

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
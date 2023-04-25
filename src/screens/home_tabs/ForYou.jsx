import { Animated, Text, StyleSheet, FlatList, Dimensions,View, ActivityIndicator, SafeAreaView, Easing, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Select, Box, CheckIcon, ScrollView, useSafeArea } from 'native-base'
import Icon from 'react-native-vector-icons/Entypo'
import { PRIMARY_COLOR } from '../../styles/style'
import SquareNewsCard from '../../components/Cards/SquareNewsCard'
import RectNewsCard from '../../components/Cards/RectNewsCard'
import { useNavigation } from '@react-navigation/native'
import Carousel from 'react-native-snap-carousel'
import { getAllLocation, getAllPost } from '../../services/api'
import ChevronButton from '../../components/AnimatedChevron'
import CreatPostIcons from '../../components/Cards/CreatePostIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ForYou = ({ item }) => {

    const navigation = useNavigation()
    const [post, setPost] = useState([]);
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [topNews, setTopNews] = useState([])
    const [location, setLocation] = useState([])
    const [showFloatIcon, setShowFloatIcon] = useState(false)
    const [initialLocation, setInitialLocation] = useState("all")
    const [showIcon, setShowIcon] = useState({
        right: true,
        left: false,
    })

    const animatedValue = useRef(new Animated.Value(0)).current;

    const getRegions = async () => {
        const response = await getAllLocation('city', "");
        if (response && response?.data.length > 0) {
            setLocation(response?.data)
        }
    }

    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ).start()
    }, [animatedValue])

    const interpolateValue = animatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 10, 0]
    })

    useEffect(() => {
        getRegions()
    }, [])

    useEffect(() => {
        getUserPostData()
        console.log('yo')
    }, [item]);

    useEffect(() =>{
        getUserPostData()
    }, [initialLocation])

    const getUserPostData = async () => {
        setIsLoading(true);
        const response = await getAllPost(item.name, 0, initialLocation)
        console.log(response, "sadfasd")
        setIsLoading(false);
        if (response && response?.data?.length > 0) {
            console.log(response, 'iser data')
            //After the response increasing the offset for the next API call.
            let topPost = response.data.length > 0 && response.data?.slice(0, 4);
            setTopNews(topPost)
            console.log(response?.data.slice(4).length)
            let finalPosts = response?.data.slice(4)
            setPost(finalPosts)
        }else{
           setTopNews([])
        }
    }


    const loadMoreItem = async () => {
        setOffset(offset + 10);
        const response = await getAllPost(item.name, offset, initialLocation)
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

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        if (scrollPosition > 0) {
            setShowIcon({ left: true, right: false })
        } else if (scrollPosition <= 0) {
            console.log(scrollPosition)
            setShowIcon({ left: false, right: true })

        }
    }

    const handleVerticallScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.y;
        if (scrollPosition > 0) {
            setShowFloatIcon(true)
        } else if (scrollPosition === 0) {
            console.log(scrollPosition, "position")
            setShowFloatIcon(false)

        }
    }

    async function handleUserNavigation() {
        let token = await AsyncStorage.getItem('token')
        if (!token) {
            navigation.navigate('Login')
        } else {
            navigation.navigate('CreatePost')
        }
    }


    return (<>
        {topNews.length > 0 ? <>
            {showFloatIcon && <TouchableOpacity
                onPress={() => handleUserNavigation()}
                style={[{
                    width: 50,
                    height: 50,
                    borderColor: PRIMARY_COLOR,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5',
                    borderWidth: 2,
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    zIndex: 2
                }, {
                    elevation: 5, shadowColor: 'black'
                }]}>
                <Icon name="plus" size={25} color={PRIMARY_COLOR} />
            </TouchableOpacity>}
            <ScrollView style={styles.container} onScroll={handleVerticallScroll}>
                <Box maxW="120" style={{ paddingVertical: 10 }}>
                    <Select selectedValue={initialLocation} minWidth="100" height={"10"} accessibilityLabel="Choose Service" placeholder="Your region"
                        size={'xs'}
                        _selectedItem={{
                            bg: "gray.400",
                            borderRadius:10,
                            endIcon: <Icon name="chevron-small-down" size={10} />
                        }} mt={1} onValueChange={itemValue => {setInitialLocation(itemValue)}}>
                        <Select.Item label="Your Region" value={"all"} />
                        {
                            location.map(el => <Select.Item label={el} value={el} />)
                        }
                    </Select>
                </Box>
                {showIcon.right &&
                    <Animated.View style={[{
                        position: 'absolute',
                        top: 120,
                        right: -5,
                        zIndex: 3
                    }, { transform: [{ translateY: interpolateValue }] }]}>
                        <Icon name="chevron-right" size={50} color="white"

                        />
                    </Animated.View>}
                {showIcon.left &&
                    <Animated.View style={[{
                        position: 'absolute',
                        top: 120,
                        left: -5,
                        zIndex: 3
                    }, { transform: [{ translateY: interpolateValue }] }]}>
                        <Icon name="chevron-left" size={50} color="white"

                        />
                    </Animated.View>
                }
                <ScrollView horizontal style={{ marginBottom: 15 }} onScroll={handleScroll}

                >
                    <CreatPostIcons />
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
            </ScrollView >
        </>
            :
            <View style={styles.container}>
                <Box maxW="120" style={{ paddingVertical: 10 }}>
                    <Select selectedValue={initialLocation} minWidth="100" height={"10"} accessibilityLabel="Choose Service" placeholder="Your region"
                        size={'xs'}
                        _selectedItem={{
                            bg: "gray.400",
                            borderRadius: 10,
                            endIcon: <Icon name="chevron-small-down" size={10} />
                        }} mt={1} onValueChange={itemValue => { setInitialLocation(itemValue) }}>
                        <Select.Item label="Your Region" value={"all"} />
                        {
                            location.map(el => <Select.Item label={el} value={el} />)
                        }
                    </Select>
                </Box>
                <CreatPostIcons />
            </View>
            }

    </>
    )
}

export default ForYou


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        backgroundColor: 'white',
    },
    input: { height: 50, fontSize: 18, color: 'rgba(0,0,0,0.5)' },
})
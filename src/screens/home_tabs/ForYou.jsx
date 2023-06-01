import { Animated, Text, StyleSheet, FlatList, Dimensions, View, ActivityIndicator, SafeAreaView, Easing, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Select, Box, CheckIcon, ScrollView, useSafeArea } from 'native-base'
import Icon from 'react-native-vector-icons/Entypo'
import { PRIMARY_COLOR } from '../../styles/style'
import SquareNewsCard from '../../components/Cards/SquareNewsCard'
import RectNewsCard from '../../components/Cards/RectNewsCard'
import { useNavigation } from '@react-navigation/native'
import Carousel from 'react-native-snap-carousel'
import { getAllLocation, getAllPost, getRecentNews } from '../../services/api'
import ChevronButton from '../../components/AnimatedChevron'
import CreatPostIcons from '../../components/Cards/CreatePostIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { height: screenHeight } = Dimensions.get('window');

const ForYou = ({ item }) => {

    console.log(item)
    const navigation = useNavigation()
    const [post, setPost] = useState([{ item: true, id: 0 }]);
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [topNews, setTopNews] = useState([])
    const [location, setLocation] = useState([])
    const [showFloatIcon, setShowFloatIcon] = useState(false)
    const [initialLocation, setInitialLocation] = useState("all")
    const [recentPostLoading, setRecentPostLoading] = useState(false)
    const [showIcon, setShowIcon] = useState({
        right: true,
        left: false,
    })
    const [page, setPage] = useState(1);
    const [isEndReached, setIsEndReached] = useState(false);

    const animatedValue = useRef(new Animated.Value(0)).current;

    const getRegions = async () => {
        const response = await getAllLocation('city', "");
        if (response && response?.data.length > 0) {
            setLocation(response?.data)
        }
    }

    useEffect(() => {
        getTopNews()
    }, [page, item.wordpress_id]);

    const getTopNews = async () => {
        setRecentPostLoading(true);
        const response = await getRecentNews(item.wordpress_id || 0,10, page);
        if (response && response.length > 0) {
            setRecentPostLoading(false);
            let finalData = response.map(el => {
                let obj = {
                    id: el.id,
                    title: el?.title?.rendered,
                    content: el?.content?.rendered,
                    date: el?.date,
                    image: el?.yoast_head_json?.og_image[0]?.url,
                    author: el?.yoast_head_json?.author,
                    description: el?.yoast_head_json?.description
                }
                return obj
            })
            setPost([...post, ...finalData])
            if (response.length === 0) {
                setIsEndReached(true);
            }
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




    const handleEndReached = () => {
        if (!recentPostLoading && !isEndReached) {
            setPage(page + 1);
        }
    };



    useEffect(() => {
        getRegions()
    }, [])

    useEffect(() => {
        getUserPostData()
    }, [item]);

    useEffect(() => {
        getUserPostData()
    }, [initialLocation])

    const getUserPostData = async () => {
        setIsLoading(true);
        const response = await getAllPost(item.name, 0, initialLocation)
        setIsLoading(false);
        if (response && response?.data?.length > 0) {
            setTopNews(response?.data)
        } else {
            setTopNews([])
        }
    }


    const loadMoreItem = async () => {
        setOffset(offset + 10);
        const response = await getAllPost(item.name, offset, initialLocation)
        if (response && response?.data?.length > 0) {
            //After the response increasing the offset for the next API call.
            if (topNews.length > 10) {
                setTopNews([...topNews, ...response.data]);
            } else {
                return;
            }
        }
    };

    const renderItem = ({ item, index }) => {

        const MemoizedItemComponent = React.memo(() => (
            <RectNewsCard data={item} />
        ));

        return index === 0 ? <HorizontalList /> : <MemoizedItemComponent />
    };

    const renderSquareItem = ({ item }) => {
        return (
            <>
                <SquareNewsCard data={item} />
            </>
        )
    }
    const renderLoader = () => <View style={{ height: '100%', justifyContent: 'center' }}><ActivityIndicator color={PRIMARY_COLOR} size="small" /></View>
    const RecentLoader = () => <View style={{ marginTop: 20, marginBottom: 20, width: "100%" }}><ActivityIndicator color={PRIMARY_COLOR} size="small" /></View>


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
        console.log(scrollPosition)
        if (scrollPosition > 0) {
            setShowIcon({ left: true, right: false })
        } else if (scrollPosition <= 0) {
            setShowIcon({ left: false, right: true })

        }
    }

    const handleVerticallScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.y;
        if (scrollPosition > 0) {
            setShowFloatIcon(true)
        } else if (scrollPosition === 0) {
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

    const renderFooter = () => {
        if (!recentPostLoading) {
            return null;
        }

        return <RecentLoader />;
    };


    const HorizontalList = () => <View style={{
        height: 200
    }}>
        {showIcon.right &&
            <Animated.View style={[{
                position: 'absolute',
                top: 55,
                right: -5,
                zIndex: 3
            }, { transform: [{ translateY: interpolateValue }] }]}>
                <Icon name="chevron-right" size={50} color="white"

                />
            </Animated.View>}
        {showIcon.left &&
            <Animated.View style={[{
                position: 'absolute',
                top: 55,
                left: -5,
                zIndex: 3
            }, { transform: [{ translateY: interpolateValue }] }]}>
                <Icon name="chevron-left" size={50} color="white"

                />
            </Animated.View>
        }
        <ScrollView horizontal style={{ marginBottom: 0, height: 200, width: '100%' }}

        >
            <CreatPostIcons />
       {topNews.length > 0 &&    <FlatList
                data={topNews}
                contentContainerStyle={{ minWidth: '100%' }}
                renderItem={renderSquareItem}
                keyExtractor={(item, index) => item.id.toString()}
                onEndReached={loadMoreItem}
                onEndReachedThreshold={0}
                horizontal
                onScroll={event  => handleScroll(event)}
                ListFooterComponent={renderLoader}
            />}
        </ScrollView>
    </View>


    return (<>
        {topNews.length > 0 || post.length > 0 ? <>
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
            <SafeAreaView style={styles.container}  >
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
                <View style={{
                    height: screenHeight - 200
                }}>
                    <FlatList
                        data={post}
                        onScroll={(event) => { handleVerticallScroll(event) }}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReached={handleEndReached}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                    />
                </View>

            </SafeAreaView>
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
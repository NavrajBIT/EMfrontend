import { Text, ScrollView, View, Pressable,  TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Entypo'
import { PRIMARY_COLOR } from '../styles/style'
import {Input, Menu, CheckIcon, TextArea, FormControl,  WarningOutlineIcon, Box, Center, NativeBaseProvider, Divider, Image, Button } from 'native-base'
import { commentApi, getPostById, verifyPost } from '../services/api'
import { SafeAreaView } from 'react-native-safe-area-context'
import { handleDate } from '../utils'
import { env } from '../../env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { reactPost } from '../services/api'
const PostDetails = ({ navigation, route }) => {

  const [postDetails, setPostDetails] = useState(null)
  const [loading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState(null)
  const [isReject, setIsReject] = useState(false)
  const [rejectMessage, setRejectMessage] = useState("")
  const [rejectError, setRejectError] = useState(false)
  const [comment, setComment] = useState("")
  const [commentList, setCommentList] = useState([])
  const [isCommented, setIsCommented] = useState(false)

  useEffect(() => {
    getPostDetails()
  }, [isCommented])


  const getPostDetails = async () => {
    setIsLoading(true);
    setUserType(await AsyncStorage.getItem('user_type'))
    const response = await getPostById(route?.params?.data?.id);
    setIsLoading(false)
    console.log(response)
    if (response.status === 200) {
      setPostDetails(response?.data)
    }
  }

  const commentPost = async () =>{
     const response = await commentApi(route?.params?.data?.id, comment)
     if(response.status  === 201){
       setComment("")
       setIsCommented(true)
        ToastAndroid.show('Comment Posted', ToastAndroid.LONG);  
     }
  }

  const approveRejectPost = async (status, status_message) => {

    if (status === 2 && !rejectMessage) {
      setRejectError(true)
      return;
    }

    let data = {
      status,
      status_message
    }
    const response = await verifyPost(route?.params?.data?.id, data)
    console.log(response)
    if (response.status === 200) {
      ToastAndroid.show(response?.message, ToastAndroid.LONG)
      navigation.navigate('Profile')
    }

  }
  console.log(postDetails?.comments)


  const likeSharePost = async (status) => {
    const response = await reactPost(route?.params?.data?.id, status)
    if (response?.status === 200) {
      ToastAndroid.show(response?.message, ToastAndroid.LONG)
    }
  }

  if (loading) {
    return <SafeAreaView>
      <ActivityIndicator size="large" color={PRIMARY_COLOR}
        style={{
          marginTop: 40
        }}
      />
    </SafeAreaView>
  }
  return (
    <ScrollView style={{ flex: 1, marginBottom:20 }}>
      <View style={{ flexDirection: 'row', marginTop: 20, paddingHorizontal: 10, }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={30} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <Box w={"95%"}>
          <Text style={{
            fontSize: 20,
            marginLeft: 20,
            fontWeight: '500',
            letterSpacing: 0.5,
            paddingRight: 12,
            color: 'black'
          }}>{postDetails?.title || "#NA#"}</Text>
        </Box>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%' }}>
        <View style={{ paddingHorizontal: 50, marginTop: 10 }}>
          <Text style={{ color: PRIMARY_COLOR, fontWeight: '400' }}>{handleDate(postDetails?.created_at) || "#NA#"}</Text>
          <Text style={{ color: 'rgba(0,0,0,0.4)' }}>{postDetails?.location || "#NA#"} <Icon name="dot-single" size={15} /><Text>{`${postDetails?.user?.name || "#NA#"}`}</Text></Text>
        </View>
        <View>
          <Icon name="thumbs-up" size={25} color={PRIMARY_COLOR} />
          <Text style={{
            fontSize: 10, color: PRIMARY_COLOR,
            textAlign: 'center'
          }}>{postDetails?.likes || "0"}</Text>
        </View>
      </View>
     {   postDetails?.status === 2 && <View style={{paddingHorizontal:30, marginVertical:15}}>
   <Menu w="340"
        placement='bottom'
        style={{ postion: 'relative', top:20,}}
        trigger={triggerProps => {
          return <Pressable {...triggerProps}>
            <View variant="subtle" style={{
              backgroundColor: PRIMARY_COLOR,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 5
            }}>
              <Text style={{ fontWeight: '500', fontSize: 16, color: 'white' }}>Rejection Details</Text>
              <Icon name="chevron-down" size={25} color={"white"} />
            </View>
          </Pressable>
        }}>
        <Menu.Item>
          <ScrollView >
            <Text style={{color:PRIMARY_COLOR}}>{postDetails?.status_message}</Text>
          </ScrollView>
        </Menu.Item>
      </Menu>
      </View>}
      {postDetails?.display_picture &&  <Image
        source={{ uri: `${env.imageUri}${postDetails?.display_picture}` }}
        style={{ width: "100%", height: 200, marginTop: 10 }}
        alt=""
      />}
      <View style={{
        marginTop: 20, paddingHorizontal: 40,
        flexDirection: 'row'
      }}>
        <Divider orientation="vertical" thickness={"3"} bg="red.500" />
        <Text style={{
          marginLeft: 10, fontWeight: '500',
          color: 'black'
        }}>{postDetails?.description}</Text>
      </View>
      <Text style={{ fontWeight: '400', paddingHorizontal: 40, lineHeight: 29, marginTop: 30, color:'rgba(0,0,0,0.7)'}}>
        {postDetails?.content}
      </Text>
      <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:30}}>
        <Image source={require('../../assets/images/Rectangle_6.jpg')}
        style={{width:45, height:45, borderRadius:50}}
        alt=""
        />
        <Text style={{
          fontWeight:'500',
          color:'black',
          marginLeft:15,
          fontSize:16
        }}>Press Trust of India</Text>
        <TouchableOpacity style={{
          backgroundColor:PRIMARY_COLOR,
          paddingHorizontal:16,
          paddingVertical:4,
          borderRadius:5,
          marginLeft:15
        }}>
            <Text style={{
              fontWeight:'400',
              color:'white',
              fontSize:12
            }}>Follow</Text>
        </TouchableOpacity>
      </View>
      {(postDetails?.status === 1) &&
      <>
       <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 30,
        paddingHorizontal: 30
      }}>
        <Button variant="outline" width={"45%"}
          onPress={() => likeSharePost('like')}
          style={{
            borderWidth: 1, borderColor: PRIMARY_COLOR
          }}>
          <Icon name="thumbs-up" size={30} color={PRIMARY_COLOR} />
        </Button>
        <Button variant="outline" width={"45%"}
          onPress={() => likeSharePost('share')}
          style={{
            borderWidth: 1, borderColor: PRIMARY_COLOR
          }}>
          <Icon name="share" size={30} color={PRIMARY_COLOR} />
        </Button>
      </View>
      </>
      }
      <View style={{
        paddingHorizontal:30
      }}>
      <Box alignItems="center" mt={3}>
      <FormControl>
        <Input placeholder={"Comment"}
          style={{ height: 46, fontSize: 12, color: 'rgba(0,0,0,0.5)' }}
          onChangeText={e => {setIsCommented(false); setComment(e)}}
          onSubmitEditing={()=> commentPost()}
          value={comment}
        />
      </FormControl>
    </Box>
    <View style={{
      flexDirection:'row',
      alignItems:'center',
      marginVertical:20,
    }}>
    <Text style={{
      fontWeight:"500",
      color:'#000000'
    }}>Comments </Text>
    <Text style={{
      borderWidth:1,
      paddingHorizontal:5,
      borderRadius:5,
      textAlign:'center',
      color:PRIMARY_COLOR,
      borderColor:PRIMARY_COLOR,
    }}>{postDetails?.comments?.length}</Text>
    </View>
    {postDetails?.comments?.length > 0 && postDetails?.comments?.map(el =>{
     return <View style={{
      marginBottom:10
     }}>
          <Text style={{
            color:PRIMARY_COLOR, 
            fontSize:13,
            fontWeight:400,
            textAlign:'justify'
          }}>{`@${el?.user?.name}`} <Text style={{
            color:'black'
          }}>{el?.content}</Text></Text>
        </View>
    }) 
    }
     {/* <Button variant="outline" width={"70%"}
          style={{
            borderWidth: 1, borderColor: "black"
          }}
          _text={{
            color: 'black'
          }}
          onPress={() => approveRejectPost(1)}
        >
          View All Comments
        </Button> */}
    </View>
      {(userType === "2" && postDetails?.status === 0) && <><View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 30,
        paddingHorizontal: 30
      }}>
        <Button variant="outline" width={"45%"}
          style={{
            borderWidth: 1, borderColor: "black"
          }}
          _text={{
            color: 'black'
          }}
          onPress={() => approveRejectPost(1)}
        >
          Post
        </Button>
        <Button variant="outline" width={"45%"}
          onPress={() => setIsReject(!isReject)}
          _text={{
            color: 'black'
          }}
          style={{
            borderWidth: 1, borderColor: "black"
          }}>
          Reject
        </Button>
      </View>
        {isReject && <>
          <Box alignItems="center" style={{ marginTop: 15, paddingHorizontal: 30 }}>
            <FormControl isInvalid={rejectError}>
              <TextArea placeholder={"Rejection Reason"} style={{ fontSize: 18, color: 'rgba(0,0,0,0.5)' }}
                h={200}
                numberOfLines={4}
                onChangeText={(e) => setRejectMessage(e)}
                // onBlur={handleBlur('content')}
                value={rejectMessage}
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Please enter the rejection reason
              </FormControl.ErrorMessage>
            </FormControl>
            <Button style={{
              marginVertical: 20,
              width: '100%',
              backgroundColor: PRIMARY_COLOR,
            }}
              onPress={() => approveRejectPost(2, rejectMessage)}
            >Submit</Button>
          </Box>
        </>}
      </>}
    </ScrollView>
  )
}


export default PostDetails

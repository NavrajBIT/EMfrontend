import { Text, ScrollView, View, Pressable, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Icon from 'react-native-vector-icons/Entypo'
import { PRIMARY_COLOR } from '../styles/style'
import { Input, Menu, CheckIcon, TextArea, FormControl, WarningOutlineIcon, Box, Center, NativeBaseProvider, Divider, Image, Button, Popover, Checkbox } from 'native-base'
import { commentApi, getPostById, verifyPost } from '../services/api'
import { SafeAreaView } from 'react-native-safe-area-context'
import { handleDate } from '../utils'
import { env } from '../../env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { reactPost } from '../services/api'
import HTMLView from "react-native-htmlview";
import Video from 'react-native-video'
import { StyleSheet } from 'react-native'
import VideoPlayer from 'react-native-video-player'
import DocumentPicker from 'react-native-document-picker'


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
  const [postFiles, setPostFiles] = useState([])
  const [paused, setPaused] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [postAuthenticate, setPostAuthenticate] = useState(false)
  const [verifiedDocument, setVerifiedDocument] = useState([])
  const [postMessage, setPostMessage] = useState("")
  const [statusLoading, setStatusLoading] = useState(false)
  const videoRef = useRef(null)
  useEffect(() => {
    getPostDetails()
  }, [isCommented])



  const getPostDetails = async () => {
    setIsLoading(true);
    setUserType(await AsyncStorage.getItem('user_type'))
    const response = await getPostById(route?.params?.data?.id);
    setIsLoading(false)
    if (response.status === 200) {
      setCommentList(response?.data?.comments)
      setPostDetails(response?.data)
      setPostFiles(response?.data?.display_files)
    }
  }



  const commentPost = async () => {
    const response = await commentApi(route?.params?.data?.id, comment)
    if (response.status === 201) {
      setComment("")
      setIsCommented(true)
      ToastAndroid.show('Comment Posted', ToastAndroid.LONG);
    }
  }

  const rejectPost = async (status, status_message) => {

    if (status === 2 && !rejectMessage) {
      setRejectError(true)
      return;
    }
    setStatusLoading(true)
    const formData = new FormData();
    formData.append('status', status)
    formData.append("status_message", status_message)
    const response = await verifyPost(route?.params?.data?.id, formData)
    setStatusLoading(false)
    if (response.status === 200) {
      ToastAndroid.show(response?.message, ToastAndroid.LONG)
      navigation.navigate('Profile')
    }
  }

  const approvePost = async (status, status_message) => {
    setStatusLoading(true)
    const formData = new FormData()
    formData.append('status', status)
    formData.append("survey_message", status_message)

    if (postAuthenticate === true) {
      for (let x of verifiedDocument) {
        formData.append('survey_files', x)
      }
    }

    const response = await verifyPost(route?.params?.data?.id, formData)
    setStatusLoading(false)
    if (response.status === 200) {
      ToastAndroid.show(response?.message, ToastAndroid.LONG)
      navigation.navigate('Profile')
    }

  }


  const handlePostFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.audio, DocumentPicker.types.video, DocumentPicker.types.pdf]
      })
      setVerifiedDocument([...verifiedDocument, res[0]])
    }
    catch (err) {
      if (DocumentPicker.isCancel) {
        ToastAndroid.show('Cancelled from doc picker', ToastAndroid.LONG)
      } else {
        alert('Unkonwn Error', + JSON.stringify(err))
        throw err;
      }
    }
  }

  const likeSharePost = async (status) => {
    const response = await reactPost(route?.params?.data?.id, status)
    if (response?.status === 200) {
      ToastAndroid.show(response?.message, ToastAndroid.LONG)
    }
  }

  const deleteFile = (index, type) => {
    let tempData = [...verifiedDocument];
    tempData.splice(index, 1)
    setVerifiedDocument(tempData)
  }

  // let postContent = postDetails?.content?.replace(/<article>(.*?)<\/article>/g


  async function handleUserNavigation() {
    let token = await AsyncStorage.getItem('token')
    if (!token) {
      navigation.navigate('Login')
    } else {
      navigation.navigate('CreatePost')
    }
  }

  const renderNode = (node, index, siblings, parent, defaultRenderer) => {
    if (node.name === 'article') {
      console.log('working');
      // Return null to prevent rendering the element
      return null;
    }
    return defaultRenderer(node.children, parent);
  };
  

  if (loading) {
    return <SafeAreaView>
      <ActivityIndicator size="large" color={PRIMARY_COLOR}
        style={{
          marginTop: 40
        }}
      />
    </SafeAreaView>
  }
  return (<>
    <TouchableOpacity
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
    </TouchableOpacity>
    <ScrollView style={{ flex: 1, marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', marginTop: 20, paddingHorizontal: 10, justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={30} color={PRIMARY_COLOR} />
          </TouchableOpacity>
          <Box >
            <Text style={{
              fontSize: 20,
              marginLeft: 10,
              fontWeight: '500',
              letterSpacing: 0.5,
              paddingRight: 12,
              color: 'black'
            }}>{postDetails?.title || "#NA#"}</Text>
          </Box>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%', marginTop: 10 }}>
        <View style={{ paddingHorizontal: 50, marginTop: 10, width:'70%' }}>
          <Text style={{ color: PRIMARY_COLOR, fontWeight: '400' }}>{handleDate(postDetails?.created_at) || "#NA#"}</Text>
          <Text style={{ color: 'rgba(0,0,0,0.4)' }}>{postDetails?.location || "#NA#"} <Icon name="dot-single" size={15} /><Text>{`${postDetails?.user?.name || "#NA#"}`}</Text></Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ marginRight: 10 }}>
            <Icon name="thumbs-up" size={25} color={PRIMARY_COLOR} />
            <Text style={{
              fontSize: 10, color: PRIMARY_COLOR,
              textAlign: 'center'
            }}>{postDetails?.likes || "0"}</Text>
          </View>
          <View>
            <Icon name="share" size={25} color={PRIMARY_COLOR} />
            <Text style={{
              fontSize: 10, color: PRIMARY_COLOR,
              textAlign: 'center'
            }}>{postDetails?.shares || "0"}</Text>
          </View>
        </View>
      </View>
      {postDetails?.status === 4 && <View style={{ paddingHorizontal: 30, marginVertical: 15 }}>
        <Menu w="340"
          placement='bottom'
          style={{ postion: 'relative', top: 20, }}
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
              <Text style={{ color: PRIMARY_COLOR }}>{postDetails?.status_message}</Text>
            </ScrollView>
          </Menu.Item>
        </Menu>
      </View>}
      {postDetails?.display_picture && <Image
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
      {postDetails?.content && <View style={{ paddingHorizontal: 30, marginTop: 30 }}><HTMLView value={postDetails?.content} stylesheet={styles} 
      renderNode={renderNode}
      /></View>}
      <View style={{ paddingHorizontal: 20 }}>
        {
          postFiles.length > 0 && postFiles.map((el, index) => {
            if (el?.file.includes('.jpg' || '.png')) {
              return <Image source={{ uri: `${env.imageUri}${el.file}` }} style={{ width: '100%', height: 150, marginVertical: 10, borderRadius: 5 }} alt="" key={index} />
            } else if (el?.file.includes('.mp4')) {
              return <View style={{ width: '100%', marginVertical: 10, borderRadius: 5 }}>
                <VideoPlayer
                  video={{ uri: `${env.videoUri}${el.file}` }}
                  videoWidth={1600}
                  videoHeight={900}
                  thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
                />
              </View>
            }
            else if (el?.file?.includes('.mp3')) {
              return <View style={{ backgroundColor: '#e7d2cc', paddingVertical: 10, paddingHorizontal: 20, marginTop: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 5 }}>
                <Text style={{ color: '#171710', width: '80%' }}>{el.file.split('/')[3]}</Text>
                <Video
                  key={index}
                  source={{ uri: `${env.videoUri}${el.file}` }}
                  paused={paused}
                  isLooping
                />
                <Button onPress={() => setPaused(!paused)} style={{ alignSelf: 'center', backgroundColor: PRIMARY_COLOR }}>
                  <Icon name={paused ? 'controller-play' : "controller-stop"} />
                </Button>
              </View>
            }
          })
        }
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, marginTop: 20 }}>
        <Image source={require('../../assets/images/Rectangle_6.jpg')}
          style={{ width: 45, height: 45, borderRadius: 50 }}
          alt=""
        />
        <Text style={{
          fontWeight: '500',
          color: 'black',
          marginLeft: 15,
          fontSize: 16
        }}>{postDetails?.user?.name || "#NA#"}</Text>

      </View>
      {(postDetails?.status === 1 || postDetails?.status === 3) &&
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
        paddingHorizontal: 30
      }}>
        <Box alignItems="center" mt={3}>
          <FormControl>
            <Input placeholder={"Comment"}
              style={{ height: 46, fontSize: 12, color: 'rgba(0,0,0,0.5)' }}
              onChangeText={e => { setIsCommented(false); setComment(e) }}
              onSubmitEditing={() => commentPost()}
              value={comment}
            />
          </FormControl>
        </Box>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 20,
        }}>
          <Text style={{
            fontWeight: "500",
            color: '#000000'
          }}>Comments </Text>
          <Text style={{
            borderWidth: 1,
            paddingHorizontal: 5,
            borderRadius: 5,
            textAlign: 'center',
            color: PRIMARY_COLOR,
            borderColor: PRIMARY_COLOR,
          }}>{postDetails?.comments?.length}</Text>
        </View>
        {commentList?.length > 0 && commentList?.map((el, index) => {
          if (index <= 2) {
            return <View style={{
              marginBottom: 10
            }}>
              <Text style={{
                color: PRIMARY_COLOR,
                fontSize: 13,
                fontWeight: 400,
                textAlign: 'justify'
              }}>{`@${el?.user?.name}`} <Text style={{
                color: 'black'
              }}>{el?.content}</Text></Text>
            </View>
          }
        })

        }
        {commentList.length > 3 && <Button variant="outline" width={"100%"}
          style={{
            borderWidth: 1, borderColor: PRIMARY_COLOR,
            marginTop: 20
          }}
          _text={{
            color: PRIMARY_COLOR
          }}

          onPress={() => navigation.navigate('Comments', {
            data: commentList
          })}
        >
          View All Comments
        </Button>}
      </View>
      {(userType === "2" && postDetails?.status === 0) && <><View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        paddingHorizontal: 30
      }}>
        <Button variant="outline" width={"45%"}
          style={{
            borderWidth: 1, borderColor: "black"
          }}
          _text={{
            color: 'black'
          }}
          onPress={() => {
            setIsAuthenticated(!isAuthenticated); if (isReject) {
              setIsReject(false)
            }
          }}
        >
          Post
        </Button>
        <Button variant="outline" width={"45%"}
          onPress={() => {
            setIsReject(!isReject); if (isAuthenticated) {
              setIsAuthenticated(false)
            }
          }}
          _text={{
            color: 'black'
          }}
          style={{
            borderWidth: 1, borderColor: "black"
          }}>
          Reject
        </Button>
      </View>
        {
          isAuthenticated && <>
            <View style={{ paddingHorizontal: 30 }}>
              <Checkbox my="2" value={postAuthenticate} onChange={() => setPostAuthenticate(!postAuthenticate)}
                colorScheme={"success"}
              >
                Authenticate
              </Checkbox>
            </View>
            <Box style={{ marginTop: 10, paddingHorizontal: 30 }}>
              <FormControl isInvalid={rejectError}>
                <Input placeholder={"Enter review"} style={{ fontSize: 18, color: 'rgba(0,0,0,0.5)' }}
                  onChangeText={(e) => setPostMessage(e)}
                  value={postMessage}
                />
                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                  Please enter your review
                </FormControl.ErrorMessage>
              </FormControl>

              {postAuthenticate === true && <>
                <Box style={{ marginTop: 25, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: "center", width: '100%' }}>
                    <Text style={{ color: '#333333' }}>Survey Document</Text>
                    <Button
                      leftIcon={<Icon name="upload" size={15} color="#e7625f" />}
                      size={'xs'}
                      color={'#e7625f'}
                      variant={'outline'}
                      _text={{
                        color: "#e7625f"
                      }}
                      borderColor={'#e7625f'}
                      onPress={() => handlePostFile()}
                      style={{ fontSize: 12 }}>Upload</Button>
                  </View>
                </Box>
                {
                  verifiedDocument && verifiedDocument.length > 0 ? verifiedDocument.map((el, index) => <Box shadow="5" key={index} style={{ paddingHorizontal: 10, paddingVertical: 10, marginTop: 20, padding: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", borderRadius: 5, backgroundColor: "#ACB4A0" }}>
                    <Text style={{ color: "#252827", width: '80%' }}>{el.name}</Text>
                    <TouchableOpacity onPress={() => deleteFile(index, 'post')}><Icon name="trash" size={20} color="#EF3340" /></TouchableOpacity>
                  </Box>)

                    :
                    <View style={{ height: 20, marginTop: 20, marginBottom: 20 }}><Text style={{ color: '#333333', fontWeight: '400', textAlign: 'center', }}>Please select files to upload</Text>
                    </View>
                }
              </>}

              {statusLoading ? <Button style={{
                marginVertical: 20,
                width: '100%',
                backgroundColor: PRIMARY_COLOR,
              }}
                isDisabled={statusLoading}
              >
                <ActivityIndicator size={"small"} color={"white"} />
              </Button> : <Button style={{
                marginVertical: 20,
                width: '100%',
                backgroundColor: PRIMARY_COLOR,
              }}
                onPress={() => approvePost(1, postMessage)}
              >Submit</Button>}
            </Box>
          </>
        }
        {isReject && <>
          <Box alignItems="center" style={{ marginTop: 15, paddingHorizontal: 30 }}>
            <FormControl isInvalid={rejectError}>
              <TextArea placeholder={"Enter rejection reason"} style={{ fontSize: 18, color: 'rgba(0,0,0,0.5)' }}
                h={150}
                numberOfLines={4}
                onChangeText={(e) => setRejectMessage(e)}
                value={rejectMessage}
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Please enter the rejection reason
              </FormControl.ErrorMessage>
            </FormControl>
            {statusLoading ? <Button style={{
              marginVertical: 20,
              width: '100%',
              backgroundColor: PRIMARY_COLOR,
            }}
              isDisabled={statusLoading}
            >
              <ActivityIndicator size={"small"} color={"white"} />
            </Button> : <Button style={{
              marginVertical: 20,
              width: '100%',
              backgroundColor: PRIMARY_COLOR,
            }}
              onPress={() => rejectPost(2, rejectMessage)}
            >Submit</Button>}

          </Box>
        </>}
      </>}
    </ScrollView>
  </>
  )
}


export default PostDetails

const styles = StyleSheet.create({
  div: {
    color: 'red'
  },
  p: {
    color: 'black'
  },
  article:{
    display:'none',
    backgroundColor:'red'
  }
})
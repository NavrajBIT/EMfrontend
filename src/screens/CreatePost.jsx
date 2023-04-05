import React, { useState, useEffect } from 'react'
import { Button, View, Text, Image } from 'native-base'
import CustomTextBox from '../components/CustomInput/CustomTextBox'
import { StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native'
import CustomButton from '../components/Button/Button'
import { PRIMARY_COLOR } from '../styles/style'
import Icon from 'react-native-vector-icons/Entypo'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DocumentPicker from 'react-native-document-picker';
import { launchCamera } from 'react-native-image-picker'
import { Select, CheckIcon, TextArea, FormControl, WarningOutlineIcon, Box, Center, NativeBaseProvider } from "native-base";
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useNavigation } from '@react-navigation/native'
import { createPost, getAllCategories } from '../services/api'

function CreatePost() {
    const [imageFile, setImageFile] = useState(null)
    const [imageError, setImageError] = useState(false)
    const [category, setCategory] = useState([])
    const navigation = useNavigation()

    useEffect(() => {
        getCategory()
      }, [])
    

    const getCategory = async () => {
        const response = await getAllCategories();
        if (response && response.data?.length > 0) {
          setCategory(response?.data)
        }
      }

    //selecting file from gallery
    const handleChoosePhoto = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images]
            })
            console.log(res)
            setImageFile(res[0])
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

    /// capturing image from camera
    const captureCamera = () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },

        };

        launchCamera(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                setImageError(false)
                console.log('response', JSON.stringify(response));
                setImageFile(response)
            }
        });
    }

    function handleImageUri(imageFile) {
        if (imageFile && imageFile?.uri) {
            return imageFile.uri
        } else {
            return imageFile?.assets[0]?.uri
        }
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        content: Yup.string().required('Content is required'),
        category: Yup.string().required('Category is required'),
        location: Yup.string().required('Location is required'),
    })

    return (
        <Formik
            initialValues={{
                title: "",
                description: "",
                content: "",
                location: "",
                category: ""
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
                console.log(values)
                console.log(imageFile)
                console.log(values)
                if (!imageFile) {
                    setImageError(true)
                    return;
                }
                else {
                    // let finalImage = imageFile && imageFile?.assets ? imageFile?.assets[0]  : imageFile
                    
                    const formData = new FormData()
                    setImageError(false)
                    formData.append('title', values.title)
                    formData.append('description', values.description)
                    formData.append('content', values.content)
                    formData.append('location', values.location)
                    formData.append('category', values.category)
                    formData.append('display_picture', imageFile)
                    console.log("after pciture")

                    const response = await createPost(formData);
                    console.log(response)
                 if(response?.status === 201){
                    ToastAndroid.show("Your content successfully posted", ToastAndroid.LONG)
                    navigation.navigate('Home')
                 }
                 else{
                    ToastAndroid.show(response?.message, ToastAndroid.LONG)
                 }
                }

            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.container}>
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

                        {imageFile ? <Image source={{ uri: handleImageUri(imageFile) }} alt="" style={{
                            height: 150,
                            borderColor: "rgba(0,0,0,0.5)",
                            marginTop: 25,
                            borderRadius: 5,
                            paddingVertical: 10,
                            width: '100%',
                            flex: 1,
                            marginTop: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }} /> :
                            <View
                                style={{
                                    height: 150,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'white',
                                    borderColor: "rgba(0,0,0,0.5)",
                                    marginTop: 25,
                                    borderRadius: 5,
                                    borderStyle: 'dotted',
                                    borderWidth: 1,
                                    paddingVertical: 10
                                }}
                            >
                                <TouchableOpacity>
                                    <Icon name="camera" size={50} color={PRIMARY_COLOR} />
                                </TouchableOpacity>
                                <Button variant={"outline"}
                                    onPress={() => handleChoosePhoto()}
                                    style={{
                                        borderColor: PRIMARY_COLOR,
                                        marginTop: 15
                                    }}><Text style={{ color: PRIMARY_COLOR }}>Upload Thumbnail</Text></Button>
                            </View>}
                        {imageError && <Text style={styles.error}>Please choose the Thumbnail</Text>}
                        <Box alignItems="center" style={{ marginTop: 25 }}>
                            <FormControl isInvalid={errors.title && touched.title}>
                                <Text style={{
                                    fontSize: 15,
                                    color: 'rgba(0,0,0,0.3)'
                                }}>Title</Text>
                                <TextArea placeholder={"Enter title"} style={{ fontSize: 18, color: 'rgba(0,0,0,0.5)' }}
                                    h={100}
                                    numberOfLines={4}
                                    onChangeText={handleChange('title')}
                                    onBlur={handleBlur('title')}
                                    value={values.title}
                                />
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {errors.title}
                                </FormControl.ErrorMessage>
                            </FormControl>
                        </Box>
                        <Box alignItems="center" style={{ marginTop: 25 }}>
                            <FormControl isInvalid={errors.description && touched.description}>
                                <Text style={{
                                    fontSize: 15,
                                    color: 'rgba(0,0,0,0.3)'
                                }}>Description</Text>
                                <TextArea placeholder={"Enter description"} style={{ fontSize: 18, color: 'rgba(0,0,0,0.5)' }}
                                    h={150}
                                    numberOfLines={4}
                                    onChangeText={handleChange('description')}
                                    onBlur={handleBlur('description')}
                                    value={values.description}
                                />
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {errors.description}
                                </FormControl.ErrorMessage>
                            </FormControl>
                        </Box>
                        <Box alignItems="center" style={{ marginTop: 25 }}>
                            <FormControl isInvalid={errors.content && touched.content}>
                                <Text style={{
                                    fontSize: 15,
                                    color: 'rgba(0,0,0,0.3)'
                                }}>Content</Text>
                                <TextArea placeholder={"Enter content"} style={{ fontSize: 18, color: 'rgba(0,0,0,0.5)' }}
                                    h={200}
                                    numberOfLines={4}
                                    onChangeText={handleChange('content')}
                                    onBlur={handleBlur('content')}
                                    value={values.content}
                                />
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {errors.content}
                                </FormControl.ErrorMessage>
                            </FormControl>
                        </Box>
                        <Box style={{ marginTop: 25, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <FormControl w="45%" isInvalid={errors.category && touched.category}>
                                <FormControl.Label>Category</FormControl.Label>
                                <Select accessibilityLabel="Choose Service" placeholder="Select Category"
                                    onValueChange={handleChange('category')}
                                    _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <CheckIcon size={5} />
                                    }} mt="1">
                                    {category.length > 0 && category.map((el, index)  => <Select.Item label={el.name} value={el.name} key={index} />)}
                                   
                                </Select>
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    Please make a selection!
                                </FormControl.ErrorMessage>
                            </FormControl>
                            <FormControl w="45%" isInvalid={errors.location && touched.location}>
                                <FormControl.Label>Location</FormControl.Label>
                                <Select accessibilityLabel="Select Location" placeholder="Choose Service"
                                    onValueChange={handleChange('location')}
                                    _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <CheckIcon size={5} />
                                    }} mt="1">
                                    <Select.Item label="New Delhi" value="delhi" />
                                    <Select.Item label="Mumbai" value="mumbai" />
                                </Select>
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    Please make a selection!
                                </FormControl.ErrorMessage>
                            </FormControl>
                        </Box>
                        <CustomButton title={"Submit"} customStyle={{ zIndex: 10, width: '100%', alignSelf: 'center', marginVertical: 30 }}
                            onPress={handleSubmit}
                        />
                    </KeyboardAwareScrollView>
                </View>)}
        </Formik>
    )
}

export default CreatePost

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingHorizontal: 30,
        // backgroundColor:'red'
    },

    error: {
        marginTop: 5, fontSize: 10, color: 'red'
    }
})
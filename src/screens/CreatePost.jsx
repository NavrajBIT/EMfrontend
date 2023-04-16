import React, { useState, useEffect, useRef } from 'react'
import { Button, View, Text, Image, Input, DeleteIcon, ScrollView, Divider } from 'native-base'
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
import { createPost, getAllCategories, getAllLocation } from '../services/api'
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import FileItem from '../components/fileItem/FileItem';

const handleHead = ({ tintColor }) => <Text style={{ color: tintColor }}>H1</Text>

function CreatePost() {
    const [imageFile, setImageFile] = useState(null)
    const [imageError, setImageError] = useState(false)
    const [category, setCategory] = useState([])
    const [content, setContent] = useState(null)
    const navigation = useNavigation()
    const richText = React.useRef();
    const [postDocument, setPostDocument] = useState([])
    const [proofDocument, setProofDocument] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [location, setLocation] = useState([])

    useEffect(() => {
        getCategory();
        getLocation()
    }, [])


    const getCategory = async () => {
        const response = await getAllCategories();
        if (response && response.data?.length > 0) {
            setCategory(response?.data)
        }
    }

    const getLocation = async () => {
        const response = await getAllLocation("city", "")
        if (response && response.data) {
            setLocation([...response.data])
        }
    }

    //selecting file from gallery
    const handleChoosePhoto = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images]
            })
            setImageFile(res[0])
            setImageError(false)
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


    const handlePostFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images, DocumentPicker.types.audio, DocumentPicker.types.video, DocumentPicker.types.pdf]
            })
            setPostDocument([...postDocument, res[0]])
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

    const handleProofFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images, DocumentPicker.types.audio, DocumentPicker.types.video, DocumentPicker.types.pdf]
            })
            setProofDocument([...proofDocument, res[0]])
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

    const deleteFile = (index, type) => {
        if (type === 'post') {
            let tempData = [...postDocument];
            tempData.splice(index, 1)
            setPostDocument(tempData)
        } else {
            let tempData = [...proofDocument];
            tempData.splice(index, 1)
            setProofDocument(tempData)
        }
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
        category: Yup.string().required('Category is required'),
        location: Yup.string().required('Location is required'),
    })

    return (
        <Formik
            initialValues={{
                title: "",
                description:"",
                location: "",
                category: ""
            }}
            // validationSchema={validationSchema}
            onSubmit={async (values) => {
                if(!imageFile){
                    setImageError(true)
                    return;
                }
                setIsLoading(true)
                const formData = new FormData()

                setImageError(false)
                formData.append('title', values.title)
                formData.append('description', values.description)
                formData.append('content', content)
                formData.append('location', values.location)
                formData.append('category', values.category)
                formData.append('display_picture', imageFile)
                for (let x of postDocument) {
                    formData.append('display_files', x)
                }
                for (let x of proofDocument) {
                    formData.append('proof_files', x)
                }
                const response = await createPost(formData);
                setIsLoading(false)
                if (response?.status === 201) {
                    ToastAndroid.show("Your content successfully posted", ToastAndroid.LONG)
                    navigation.navigate('Home')
                }
                else {
                    ToastAndroid.show(response?.message, ToastAndroid.LONG)
                }

            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <ScrollView >
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
                                <FormControl >
                                    <Text style={{
                                        fontSize: 15,
                                        color: 'rgba(0,0,0,0.3)'
                                    }}>Content</Text>
                                    <RichEditor
                                        containerStyle={{ backgrondColor: 'red', borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)', maxHeight: 200, borderRadius: 5 }}
                                        ref={richText}
                                        onChange={descriptionText => {
                                            setContent(descriptionText)
                                        }}
                                    />

                                    <RichToolbar
                                        style={{ marginTop: 5, color: 'black' }}
                                        editor={richText}
                                        actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1, actions.insertBulletsList, actions.insertOrderedList, actions.checkboxList,
                                        actions.insertLink, actions.setStrikthrough]}
                                        iconMap={{ [actions.heading1]: handleHead }}
                                    />
                                </FormControl>
                            </Box>
                            <Box style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <FormControl w="45%" isInvalid={errors.category && touched.category}>
                                    <FormControl.Label>Category</FormControl.Label>
                                    <Select accessibilityLabel="Choose Service" placeholder="Select Category"
                                        onValueChange={handleChange('category')}
                                        _selectedItem={{
                                            bg: "teal.600",
                                            endIcon: <CheckIcon size={5} />
                                        }} mt="1">
                                        {category.length > 0 && category.map((el, index) => {
                                            if (el.name === 'All') {
                                                return;
                                            } else
                                                return <Select.Item label={el.name} value={el.name} key={index} />
                                        })}

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
                                        {location.length > 0 && location.map((el, index) => {

                                            return <Select.Item label={el} value={el} key={index} />
                                        })}
                                    </Select>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        Please make a selection!
                                    </FormControl.ErrorMessage>
                                </FormControl>
                            </Box>
                            <Box style={{ marginTop: 25, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: "center", width: '100%' }}>
                                    <Text>Post Document</Text>
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
                                postDocument && postDocument.length > 0 ? postDocument.map((el, index) => <Box shadow="5" key={index} style={{paddingHorizontal:10, paddingVertical:10, marginTop: 20, padding: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", borderRadius:5, backgroundColor: "#ACB4A0"}}>
                                <Text style={{ color: "#252827", width:'80%' }}>{el.name}</Text>
                                <TouchableOpacity onPress={() => deleteFile(index, 'post')}><Icon name="trash" size={20} color="#EF3340" /></TouchableOpacity>
                              </Box>)

                                    :
                                    <View style={{ height: 20, marginTop: 10, marginBottom: 20 }}><Text style={{ color: 'black', fontWeight: '600', textAlign: 'center', }}>Please select files to upload</Text>
                                    </View>
                            }
                            <Divider />
                            <Box style={{ marginTop: 25, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: "center", width: '100%' }}>
                                    <Text>Proof Document</Text>
                                    <Button
                                        leftIcon={<Icon name="upload" size={15} color="#e7625f" />}
                                        size={'xs'}
                                        color={'#e7625f'}
                                        variant={'outline'}
                                        _text={{
                                            color: "#e7625f"
                                        }}
                                        borderColor={'#e7625f'}
                                        onPress={() => handleProofFile()}
                                        style={{ fontSize: 12 }}>Upload</Button>
                                </View>
                            </Box>
                            {
                                proofDocument && proofDocument.length > 0 ?
                                    proofDocument.map((el, index) => <Box shadow="5" key={index} style={{paddingHorizontal:10, paddingVertical:10, marginTop: 20, padding: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", borderRadius:5, backgroundColor: "#ACB4A0"}}>
                                    <Text style={{ color: "#252827", width:'80%' }}>{el.name}</Text>
                                    <TouchableOpacity onPress={() => deleteFile(index, '')}><Icon name="trash" size={20} color="#EF3340" /></TouchableOpacity>
                                  </Box>)
                                    :
                                    <View style={{ height: 20, marginVertical: 10 }}><Text style={{ color: 'black', fontWeight: '600', textAlign: 'center', }}>Please select files to upload</Text>
                                    </View>
                            }
                            <CustomButton title={"Submit"} isLoading={isLoading} customStyle={{ zIndex: 10, width: '100%', alignSelf: 'center', marginVertical: 30 }}
                                onPress={() => handleSubmit()}
                            />


                        </KeyboardAwareScrollView>

                    </View>
                </ScrollView>)}

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
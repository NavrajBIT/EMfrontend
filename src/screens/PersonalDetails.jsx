import React, { useState, useEffect } from 'react'
import { StyleSheet, ToastAndroid, View, TouchableOpacity } from 'react-native'
import CustomInput from '../components/CustomInput/CustomInput'
import CustomButton from '../components/Button/Button'
import { Input, FormControl, WarningOutlineIcon, Image, Text, Button, Box, Select, CheckIcon } from "native-base";
import { Formik, useField } from 'formik'
import * as Yup from 'yup'
import DocumentPicker from 'react-native-document-picker';
import { launchCamera } from 'react-native-image-picker'
import { getAllLocation, registerUser } from '../services/api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Entypo'
import { PRIMARY_COLOR } from '../styles/style';
import { env } from '../../env';

function PersonalDetails({ navigation, route }) {

  const [imageFile, setImageFile] = useState(null)
  const [imageError, setImageError] = useState(false)
  const [stateList, setStateList] = useState([])
  const [cityList, setCityList] = useState([])

  let userData = route?.params?.data

  useEffect(() => {
    getAllState()
  }, [])

  const getAllState = async () => {
    const response = await getAllLocation('state', "")
    if (response && response?.data.length > 0) {
      setStateList([...response.data])
    } else {
      console.log(response)
    }
  }

  const getCity = async (state) => {
    const response = await getAllLocation('city', state)
    if (response && response?.data.length > 0) {
      setCityList([...response.data])
    } else {
      console.log(response)
    }
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').min(2, 'Name must be greater than 2').max(20, 'name must be less than 20'),
    email: Yup.string().required('Email is required').email("Please enter a valid email"),
    address: Yup.string().required('Address is required'),
    pincode: Yup.string().required('Pincode is required').length(6, "Please enter a valid pincode"),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
  })


  //selecting file from gallery
  const handleChoosePhoto = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images]
      })
      setImageFile(res[[0]])
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

  return (
    <Formik
      initialValues={{
        name: userData?.name,
        email: userData?.email,
        address: userData?.address,
        pincode: userData?.pincode,
        city: userData?.city,
        state: userData?.state
      }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        if (!imageFile) {
          setImageError(true)
          return;
        }

        let finalImage = imageFile && imageFile?.assets ?
          { "fileName": imageFile?.assets[0]?.fileName, "fileSize": 197758, "type": imageFile?.assets[0]?.type, "uri": imageFile?.assets[0]?.uri }
          : imageFile
        const formData = new FormData()
        formData.append('name', values.name)
        formData.append('email', values.email)
        formData.append('address', values.address)
        formData.append('pincode', values.pincode)
        formData.append('state', values.state)
        formData.append('city', values.city)
        formData.append('display_picture', finalImage)
        const response = await registerUser(formData)
        if (response && response?.status === 200) {
          ToastAndroid.show(response?.message, ToastAndroid.LONG)
          navigation.navigate('Home')
        } else {

        }
      }
      }
    >

      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <>
          <KeyboardAwareScrollView style={styles.container}>
            {imageFile ? <Image source={{ uri: handleImageUri(imageFile) }} alt="" style={{
              height: 150,
              borderColor: "rgba(0,0,0,0.5)",
              marginTop: 15,
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
                <TouchableOpacity onPress={() => console.log('Camera Triggered')}>
                  <Icon name="camera" size={50} color={PRIMARY_COLOR} />
                </TouchableOpacity>
                <Button variant={"outline"}
                  onPress={() => handleChoosePhoto()}
                  style={{
                    borderColor: PRIMARY_COLOR,
                    marginTop: 15
                  }}><Text style={{ color: PRIMARY_COLOR }}>Upload Profile Picture</Text></Button>
              </View>}
            {imageError && <Text style={styles.error}>Please upload the profile picture</Text>}
            <Box alignItems="center" mt={6}>
              <FormControl>
                <Text style={{
                  fontSize: 10,
                  color: 'rgba(0,0,0,0.3)'
                }}>{"Full Name"}</Text>
                <Input placeholder={"Full Name"}
                  style={styles.input}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur('name')}
                  value={values.name}
                // defaultValue={userData?.name}
                />
                {errors.name && touched.name && <Text style={styles.error}>
                  {errors.name}
                </Text>}
              </FormControl>
            </Box>
            <Box alignItems="center" mt={3}>
              <FormControl>
                <Text style={{
                  fontSize: 10,
                  color: 'rgba(0,0,0,0.3)'
                }}>{"Email"}</Text>
                <Input placeholder={"Email"}
                  style={styles.input}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                {errors.email && touched.email && <Text style={styles.error}>
                  {errors.email}
                </Text>}
              </FormControl>
            </Box>
            <Box alignItems="center" mt={3}>
              <FormControl>
                <Text style={{
                  fontSize: 10,
                  color: 'rgba(0,0,0,0.3)'
                }}>{"Address"}</Text>
                <Input placeholder={"Address"}
                  style={styles.input}
                  onChangeText={handleChange("address")}
                  onBlur={handleBlur('address')}
                  value={values.address}
                />
                {errors.address && touched.address && <Text style={styles.error}>
                  {errors.address}
                </Text>}
              </FormControl>
            </Box>
            <Box alignItems="center" mt={3}>
              <FormControl>
                <Text style={{
                  fontSize: 10,
                  color: 'rgba(0,0,0,0.3)'
                }}>{"Pincode"}</Text>
                <Input placeholder={"Pincode"}
                  style={styles.input}
                  onChangeText={handleChange("pincode")}
                  onBlur={handleBlur('pincode')}
                  value={values.pincode}
                />
                {errors.pincode && touched.pincode && <Text style={styles.error}>
                  {errors.pincode}
                </Text>}
              </FormControl>
            </Box>
            <Box alignItems="center" mt={3}>
              <FormControl isInvalid={errors.state && touched.state}>
                <Text style={{
                  fontSize: 10,
                  color: 'rgba(0,0,0,0.3)'
                }}>{"State"}</Text>
                <Select accessibilityLabel="Select Location" placeholder="Choose State"
                  onValueChange={(e) => { handleChange('state')(e); getCity(e) }}
                  defaultValue={userData.state}
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />
                  }} mt="1"
                  style={[styles.input, { width: '100%' }]}
                >
                  {stateList.length > 0 && stateList.map((el, index) => {
                    return <Select.Item label={el} value={el} key={index} />
                  })}
                </Select>
                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                  Please select a state
                </FormControl.ErrorMessage>
              </FormControl>
            </Box>
            <Box alignItems="center" mt={3}>
              <FormControl isInvalid={errors.state && touched.state}>
                <Text style={{
                  fontSize: 10,
                  color: 'rgba(0,0,0,0.3)'
                }}>{"City"}</Text>
                <Select accessibilityLabel="Select Location" placeholder="Choose City"
                  onValueChange={(e) => { handleChange('city')(e); }}
                  defaultValue={userData.city}
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />
                  }} mt="1"
                  style={[styles.input, { width: '100%' }]}
                >
                  {cityList.length > 0 && cityList.map((el, index) => {
                    return <Select.Item label={el} value={el} key={index} />
                  })}
                </Select>
                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                  Please select a state
                </FormControl.ErrorMessage>
              </FormControl>
            </Box>
            <CustomButton title="Submit" customStyle={{ marginTop: 40, marginBottom: 40 }}
              onPress={handleSubmit}
            />
          </KeyboardAwareScrollView>
        </>)}
    </Formik>
  )
}

export default PersonalDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
    backgroundColor: '#ffffff'
  },
  input: { height: 54, fontSize: 18, color: 'rgba(0,0,0,0.5)' },
  error: {
    marginTop: 5, fontSize: 10, color: 'red'
  }
})

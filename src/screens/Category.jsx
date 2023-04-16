import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect } from 'react'
import { Checkbox } from 'native-base'
import { useDispatch, useSelector } from 'react-redux';
import { addCategories, removeCategories } from '../features/categorySlice';
import { categoryState } from '../features/categorySlice';
import { getAllCategories } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CategoryContext } from '../context/categoryContext';
import BackButton from '../components/Button/BackButton';
import { PRIMARY_COLOR } from '../styles/style';

const Category = ({ navigation }) => {

  const [groupValue, setGroupValue] = React.useState([]);
  const dispatch = useDispatch()
  const [categories, setCategory] = React.useState([])
  const { category, setCategories, setActiveTab } = useContext(CategoryContext)
  const [loading, setLoading] = React.useState(false)
  const updatedValue = []
  useEffect(() => {
    getCategory()
  }, [])

  const getCategory = async () => {
    setLoading(true)
    const response = await getAllCategories();
    setLoading(false)
    if (response && response.data?.length > 0) {
      response.data.forEach(el => {
        if (el.name === 'All' || el.name === 'Sports' || el.name === 'Technology' || el.name === 'Education') {
          el.isChecked = true
        }
        else {
          el.isChecked = false
        }
      })
      setCategory(response?.data)
    }
  }

  return (
    <>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
        elevation: 2
      }}>
        <BackButton title="Categories"
          onPress={() => navigation.goBack()}
        />
        <TouchableOpacity
          style={{ paddingRight: 10 }}
          onPress={() => {
            setActiveTab(groupValue[0].name)
            setCategories(groupValue)
            navigation.navigate('Home')
          }
          }><Text style={{ color: 'rgba(0,0,0,0.4)', fontSize: 16 }}>Save</Text></TouchableOpacity></View>

    {loading ? <ActivityIndicator size="large" color={PRIMARY_COLOR} style={{marginTop:40}} /> :
      <View style={{ backgroundColor: '#ffffff', flex: 1, paddingHorizontal: 30 }}>
        <Text style={{
          textAlign: 'center', marginVertical: 20,
        }}>Add categories to homepage</Text>
        <View>
          {
            categories.map((el) => {
              return <Checkbox index={el.name} value={el.name}
                onChange={async (event) => {
                  if (event) {
                    el.isChecked = true;
                    setGroupValue((prev) => [...prev, el])
                  }
                  else {
                    let tempArray = groupValue;
                    setGroupValue(tempArray.filter(item => item.name !== el.name))
                  }
                }}
                my={2} colorScheme="danger">
                {el.name}
              </Checkbox>
            })
          }
        </View>
      </View>
        }
    </>
  )
}

export default Category


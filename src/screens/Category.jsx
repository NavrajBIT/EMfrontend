import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect } from 'react'
import { Checkbox } from 'native-base'
import { useDispatch, useSelector } from 'react-redux';
import { addCategories, removeCategories } from '../features/categorySlice';
import { categoryState } from '../features/categorySlice';
import { getAllCategories } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CategoryContext } from '../context/categoryContext';
import BackButton from '../components/Button/BackButton';

const Category = ({ navigation }) => {

  const [groupValue, setGroupValue] = React.useState([]);
  const dispatch = useDispatch()
  const [categories, setCategory] = React.useState([])
  const {category,setCategories} = useContext(CategoryContext)
  const updatedValue = []
  console.log(groupValue)
  useEffect(() => {
    getCategory()
  }, [])

  const getCategory = async () => {
    const response = await getAllCategories();
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
      flexDirection:'row', 
      alignItems:'center', 
      justifyContent:'space-between',
      paddingHorizontal:10,
      paddingVertical:10,
      backgroundColor:'#ffffff',
      elevation:2
    }}>
    <BackButton title="Categories" 
    onPress={() => navigation.goBack()}
    />
    <TouchableOpacity
        onPress={() => {
           setCategories(groupValue)
           navigation.navigate('Home')
        } 
        }><Text style={{ color: 'rgba(0,0,0,0.4)' }}>Save</Text></TouchableOpacity></View>
    <View style={{ backgroundColor: '#ffffff', flex: 1, paddingHorizontal: 30 }}>
      <Text style={{
        textAlign: 'center', marginVertical: 20,
      }}>Add categories to homepage</Text>
      <View>
        {
          categories.map((el) => {
            return <Checkbox index={el.name} value={el.name}
              onChange={async (event) => {
                if (event){
                el.isChecked = true;
                 setGroupValue((prev)=> [...prev, el])
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
    </>
  )
}

export default Category


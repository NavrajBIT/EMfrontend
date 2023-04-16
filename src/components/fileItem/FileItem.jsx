import { View, Text } from 'react-native'
import { Select, CheckIcon, TextArea, FormControl, WarningOutlineIcon, Box, Center, NativeBaseProvider, DeleteIcon } from "native-base";
import React from 'react'

const FileItem = () => {
  return (
    <Box shadow="5" style={{ marginTop: 25,padding:5, flexDirection: 'row', justifyContent: 'space-between',alignItems:"center",backgroundColor:"gray",}}>
 
    <Text style={{color:"white" }}>File name</Text>
    <Text > <DeleteIcon style={{color:"white" }}/> </Text>
    
    </Box>
  )
}

export default FileItem
import React from 'react'
import { TextArea, FormControl, Text, WarningOutlineIcon, Box, Center, NativeBaseProvider } from "native-base";

function CustomTextBox({label, placeholder, height}) {
  return (
        <Box alignItems="center"style={{marginTop:25}}>
            <FormControl>
                <Text style={{
                    fontSize: 15,
                    color: 'rgba(0,0,0,0.3)'
                }}>{label}</Text>
                <TextArea placeholder={placeholder} style={{ fontSize: 18, color: 'rgba(0,0,0,0.5)' }}
                h={height}
                numberOfLines={4}
                 />
                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                    Try different from previous passwords.
                </FormControl.ErrorMessage>
            </FormControl>
        </Box>
  )
}

export default CustomTextBox
import React from 'react'
import { Input, FormControl, Text, WarningOutlineIcon, Box, Center, NativeBaseProvider } from "native-base";

function CustomInput({ label, placeholer, onChangeText, onBlur, value}) {
    return (
        <Box alignItems="center" mt={3}>
            <FormControl>
                <Text style={{
                    fontSize: 10,
                    color: 'rgba(0,0,0,0.3)'
                }}>{label}</Text>
                <Input placeholder={placeholer} style={{ height: 54, fontSize: 18, color: 'rgba(0,0,0,0.5)' }}
                onChange={onChangeText}
                 />
                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                    Try different from previous passwords.
                </FormControl.ErrorMessage>
            </FormControl>
        </Box>
    )
}

export default CustomInput
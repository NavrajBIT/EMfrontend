import AsyncStorage from '@react-native-async-storage/async-storage';
import { env } from '../../env';

export const verifyOtp = async formData => {
  console.log(`${env.url}/auth/login`)
  const response = await fetch(`${env.url}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  let data = await response.json();
  return data;
}


export const resendOtp = async formData => {
  const response = await fetch(`${env.url}/resend-otp/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  let data = await response.json();
  return data;
};

export const verifyEmailOtp = async formData => {
  let token = await AsyncStorage.getItem('token')
  const response = await fetch(`${env.url}/veify-email/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Token ${token}`
    },
    body: formData,
  });
  let data = await response.json();
  return data;
}




export const registerUser = async (formData)=> {
  console.log(formData)
  let token = await AsyncStorage.getItem('token')
  console.log(token)
  const response = await fetch(`${env.url}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Token ${token}`
    },
    body: formData,
  });
  let data = await response.json();
  return data;
};


export const getUserDetails = async () =>{
  try {
    const response = await fetch(`${env.url}/get-authenticated-user/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${await AsyncStorage.getItem('token')}`
      },
    });
    let data = await response.json();
    return data;
  } catch (error) {
    return error;
  }  
}

export const getProfileData = async () =>{
  console.log(await AsyncStorage.getItem('token'))
  try {
    const response = await fetch(`${env.url}/auth/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${await AsyncStorage.getItem('token')}`
      },
    });
    let data = await response.json();
    return data;
  } catch (error) {
    return error;
  }  
}


export const createPost = async (formData)=> {
  let token = await AsyncStorage.getItem('token')
  console.log(token)
  const response = await fetch(`${env.url}/post/post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Token ${token}`
    },
    body: formData,
  });
  let data = await response.json();
  return data;
};


export const getUserPost = async (type, limit= "10", offset) =>{
  console.log(type)
  console.log(await AsyncStorage.getItem('token'))
  try {
    const response = await fetch(`${env.url}/post/post?status=${type}&limit=${10}&offset=0`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${await AsyncStorage.getItem('token')}`
      },
    });
    let data = await response.json();
    return data;
  } catch (error) {
    return error;
  }  
}


export const getAllPost = async () =>{
  try {
    const response = await fetch(`${env.url}/post/post`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${await AsyncStorage.getItem('token')}`
      },
    });
    let data = await response.json();
    return data;
  } catch (error) {
    return error;
  }  
}


export const getPostById = async (id) =>{
  try {
    const response = await fetch(`${env.url}/post/post/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${await AsyncStorage.getItem('token')}`
      },
    });
    let data = await response.json();
    return data;
  } catch (error) {
    return error;
  }  
}

export const verifyPost = async (id, statuData) =>{
  console.log(JSON.stringify(statuData))
  try {
    const response = await fetch(`${env.url}/post/post/${id}/verify`, {
      method: 'PATCH',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Token ${await AsyncStorage.getItem('token')}`
      },
      body: JSON.stringify(statuData)
    });
    let data = await response.json();
    return data;
  } catch (error) {
    return error;
  }  
}


export const reactPost = async (id, type) =>{
  try {
    const response = await fetch(`${env.url}/post/post/${id}/reaction`, {
      method: 'PATCH',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Token ${await AsyncStorage.getItem('token')}`
      },
      body: JSON.stringify({type})
    });
    let data = await response.json();
    return data;
  } catch (error) {
    return error;
  }  
}





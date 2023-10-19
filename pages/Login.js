import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native'
import { setIsLogedIn, setUserName } from '../redux/slices/todoDataSlice';

function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginBox, setShowLoginBox] = useState(true);
  const [showForgetPasswordBox, setShowForgetPasswordBox] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [showNewPsswordBox, setShowNewPasswordBox] = useState(false);


  const dispatch = useDispatch();

  const handleLogin = () => {
    // Alert.alert('Alert Title','My Alert Msg',[{text: 'ok'}],{cancelable: true});

    if (!email || !password) {
      Alert.alert('All fields are required', 'Please fill all the fields', [{ text: 'ok' }], { cancelable: true });
      return;
    }

    const storeInLocalStorage = async (data) => {
      try {
        await AsyncStorage.setItem("token", data);
      } catch (error) {
        console.log(error.message);
      }
    }

    // fetch("http://10.0.2.2:8000/user/login", {
    fetch("https://todo-app-backend-at9n.onrender.com/user/login", {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    }).then((response) => {
      return response.json();
    }).then((response) => {
      console.log(response);
      if (response.status === "success") {
        console.log(response.message);
        dispatch(setIsLogedIn(true));
        dispatch(setUserName(response.data.name));
        // localStorage.setItem("token", response.token);
        storeInLocalStorage(response.token);
        navigation.navigate("Home");
      } else {
        // toast.error(response.message);
        console.log(response.message);
        Alert.alert('Fail', response.message, [{ text: 'ok' }], { cancelable: true });

      }
    }).catch((error) => {
      console.log(error.message);
      Alert.alert('Internal Error', error.message, [{ text: 'ok' }], { cancelable: true });

    })

    setEmail("");
    setPassword("");
  }

  const goToRegisterPage = () => {
    navigation.navigate("Register");
  }

  const handleShowPasswordBox = () => {
    setShowLoginBox(false);
    setShowForgetPasswordBox(true);
  }

  const handleSendOtp = () => {
    let text = email.trim();
    if (text == "") {
      Alert.alert('Empty Field', "please enter your email", [{ text: 'ok' }], { cancelable: true });

      return;
    }
    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let gotp = ""

    for (let i = 0; i < 6; i++) {
      let r = Math.floor(Math.random() * 10);
      gotp += arr[r];
    }

    setGeneratedOtp(gotp);

    // fetch("http://localhost:8000/user/sendotp",{
    fetch("https://todo-app-backend-at9n.onrender.com/user/sendotp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: gotp })
    }).then((response) => {
      return response.json();
    }).then((response) => {
      if (response.status === "success") {
        setShowOtpBox(true);
      } else {
        console.log(response.message);
      Alert.alert('Fail', response.message, [{ text: 'ok' }], { cancelable: true });
        
      }
    }).catch((error) => {
      console.log(error.message);
      Alert.alert('Enternal Error', error.message, [{ text: 'ok' }], { cancelable: true });

    })

  }

  const handleOtpSubmit = () => {
    
    let text = otp.trim();
    if (text === "") {
      Alert.alert('All fields requird', "Please enter OTP", [{ text: 'ok' }], { cancelable: true });

      return;
    }

    if (otp !== generatedOtp) {
      Alert.alert('OTP verification', "OTP does not match", [{ text: 'ok' }], { cancelable: true });

      return;
    }

    setShowForgetPasswordBox(false);
    setShowNewPasswordBox(true);
    setShowOtpBox(false);
  }

  const handleSaveNewPasswod = () => {
    let text1 = newPassword.trim();
    let text2 = newPassword2.trim();

    Alert.alert('Fail', "its working", [{ text: 'ok' }], { cancelable: true });

    if (text1 === "") {
      Alert.alert('All fields required', "Please enter new password", [{ text: 'ok' }], { cancelable: true });

      return;
    }
    if (text2 === "") {
      Alert.alert('All fields required', "Please reenter new password", [{ text: 'ok' }], { cancelable: true });

      return;
    }

    if (text1 !== text2) {
      Alert.alert('Matching password', "Password does not match", [{ text: 'ok' }], { cancelable: true });

      return;
    }

    // fetch("http://localhost:8000/user/savenewpassword", {
    fetch("https://todo-app-backend-at9n.onrender.com/user/savenewpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword })
    }).then((response) => {
      return response.json();
    }).then((response) => {
      if (response.status === "success") {
        // toast.success(response.message);
      Alert.alert('Success', response.message, [{ text: 'ok' }], { cancelable: true });

        setEmail("");
        setOtp("");
        setNewPassword("");
        setNewPassword2("");
        setGeneratedOtp("");
      } else {
        console.log(response.message);
      Alert.alert('Fail', response.message, [{ text: 'ok' }], { cancelable: true });
        
      }
    }).catch((error) => {
      console.log(error.message);
    })

  }

  const handleClickHereForLogin = () =>{
    setShowNewPasswordBox(false);
    setShowLoginBox(true);
  }



  return (
    <ScrollView>
      <View style={{ width: "100%", alignItems: "center" }}>

        {/* Login view */}
        {showLoginBox ? <View style={{ width: "90%", padding: "4px", backgroundColor: "#Dadad1", marginVertical: 100, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 20 }}>
          <Text style={{ fontSize: 30, textAlign: "center" }}>Login</Text>
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Text>Email:</Text>
            <TextInput style={{ borderWidth: 2, borderColor: "gray", marginTop: 5, borderRadius: 10, paddingLeft: 10 }} onChangeText={(newEmail) => setEmail(newEmail)} defaultValue={email} />
            <Text style={{ marginTop: 20 }}>Password:</Text>
            <TextInput style={{ borderWidth: 2, borderColor: "gray", marginTop: 5, borderRadius: 10, paddingLeft: 10 }} onChangeText={(newPassword) => setPassword(newPassword)} defaultValue={password} />
            <Text style={{ textAlign: 'right', color: "#2477dc" }} onPress={handleShowPasswordBox}>Forget password?</Text>
          </View>
          <Button title='Login' style={{}} onPress={handleLogin} />

          <Text style={{ marginTop: 20 }}>Don't have an account? <Text style={{ color: "#2477dc" }} onPress={goToRegisterPage}>Register</Text></Text>
        </View> : ""}

        {/* Forget password view  */}
        {showForgetPasswordBox ? <View style={{ width: "90%", padding: "4px", backgroundColor: "#Dadad1", marginVertical: 100, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 20 }}>
          <Text style={{ fontSize: 30, textAlign: "center" }}>Forget Password</Text>
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Text>Enter your email:</Text>
            <TextInput style={{ borderWidth: 2, borderColor: "gray", marginTop: 5, borderRadius: 10, paddingLeft: 10 }} onChangeText={(newEmail) => setEmail(newEmail)} defaultValue={email} />

          </View>
          <Button title='Send OTP' style={{}} onPress={handleSendOtp} />

          {showOtpBox ? <View>
          <Text style={{ marginTop: 10 }}>We have send an OTP to this<Text style={{ fontWeight: "bold" }}>{email}</Text> email.</Text>

          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Text>Enter OTP:</Text>
            <TextInput style={{ borderWidth: 2, borderColor: "gray", marginTop: 5, borderRadius: 10, paddingLeft: 10 }} onChangeText={(newOtp) => setOtp(newOtp)} defaultValue={otp} />
          </View>
          <Button title='Submit' style={{}} onPress={handleOtpSubmit} />
          </View> : ""}

        </View> : ""}


        {/* New password Box  */}
        {showNewPsswordBox ? <View style={{ width: "90%", padding: "4px", backgroundColor: "#Dadad1", marginVertical: 100, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 20 }}>
          <Text style={{ fontSize: 30, textAlign: "center" }}>Update Password</Text>
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Text>Enter new password:</Text>
            <TextInput style={{ borderWidth: 2, borderColor: "gray", marginTop: 5, borderRadius: 10, paddingLeft: 10 }} onChangeText={(newPass) => setNewPassword(newPass)} defaultValue={newPassword} />
            <Text>Reenter new password:</Text>
            <TextInput style={{ borderWidth: 2, borderColor: "gray", marginTop: 5, borderRadius: 10, paddingLeft: 10 }} onChangeText={(newpass2) => setNewPassword2(newpass2)} defaultValue={newPassword2} />

          </View>
          <Button title='Save' style={{}} onPress={handleSaveNewPasswod} />
          <Text style={{marginTop:15, color:"#2477dc"}} onPress={handleClickHereForLogin}>Click here for Login</Text>
        </View> : ""}
      </View>
    </ScrollView>
  )
}

export default Login
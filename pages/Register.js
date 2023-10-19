import React, { useState } from 'react'
import { View,ScrollView, Text, Button, TextInput, Alert } from 'react-native'


function Register({ navigation }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const handleRegister = () => {
    if (!name || !email || !password) {
      Alert.alert('All fields are required', 'Please fill all the fields', [{ text: 'ok' }], { cancelable: true });
      return;
    }

    // fetch("http://localhost:8000/user/register", {
    fetch("https://todo-app-backend-at9n.onrender.com/user/register", {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    }).then((response) => {
      return response.json();
    }).then((response) => {
      console.log(response);
      if (response.status === "success") {
        // toast.success(response.message);
        Alert.alert('Success', 'User Registerd successfully', [{ text: 'ok' }], { cancelable: true });
      } else {
        Alert.alert('Fail', response.message, [{ text: 'ok' }], { cancelable: true });
      }
    }).catch((error) => {
      console.log(error.message);
      Alert.alert('Error', error.message, [{ text: 'ok' }], { cancelable: true });
    })

  

    setName("");
    setEmail("");
    setPassword("");
  }

  return (
    <ScrollView>
    <View style={{ width: "100%", alignItems: "center" }}>
      <View style={{ width: "90%", padding: "4px", backgroundColor: "#Dadad1", marginVertical: 100, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 20 }}>
        <Text style={{ fontSize: 30, textAlign: "center" }}>Register</Text>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text>Name:</Text>
          <TextInput style={{ borderWidth: 2, borderColor: "gray", marginTop: 5, borderRadius: 10, paddingLeft: 10 }} defaultValue={name} onChangeText={(newName) => setName(newName)} />
          <Text style={{ marginTop: 20 }}>Email:</Text>
          <TextInput style={{ borderWidth: 2, borderColor: "gray", marginTop: 5, borderRadius: 10, paddingLeft: 10 }} defaultValue={email} onChangeText={(newEmail) => setEmail(newEmail)} />
          <Text style={{ marginTop: 20 }}>Password:</Text>
          <TextInput style={{ borderWidth: 2, borderColor: "gray", marginTop: 5, borderRadius: 10, paddingLeft: 10 }} defaultValue={password} onChangeText={(newPassword) => setPassword(newPassword)} />

        </View>
        <Button title='Register' style={{}} onPress={handleRegister}/>
        <Text style={{ marginTop: 20 }}>Already have an account? <Text style={{ color: "#2477dc" }} onPress={() => navigation.navigate("Login")}>Login</Text></Text>
      </View>
      <View style={{ height: 60 }} />
    </View>
    </ScrollView>
  )
}

export default Register
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from './redux/store';

import { View, Text, Pressable, Alert, BackHandler  } from 'react-native';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAllTodos, setIsLogedIn } from './redux/slices/todoDataSlice';
import { useDispatch, useSelector } from 'react-redux';


const rightHeader = () => {
  const { isLogedIn } = useSelector((state:any) => state.todos);

  let dispatch = useDispatch();

  const handleLogout = async() => {
    let value = await AsyncStorage.removeItem("token");
    dispatch(setIsLogedIn(false));
    dispatch(setAllTodos([]));
  }

  return(
    <View>
      {isLogedIn?<Pressable style={{paddingHorizontal:10, paddingVertical:5, backgroundColor:"white", borderRadius:10}} onPress={handleLogout}>
        <Text>Logout</Text>
      </Pressable>:""}
    </View>
  )
}


function App(): JSX.Element {

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress",():any=>BackHandler.exitApp());
  }, []);
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{
          headerStyle: {
            backgroundColor: '#2477dc',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight:(rightHeader),
          headerBackVisible:false,
        }}>
        <Stack.Screen name="Home" component={Home} options={{title:"Todoapp"}}/>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;

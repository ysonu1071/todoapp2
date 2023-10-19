import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { View, Text, Button, TextInput, Pressable, Alert } from 'react-native'
import Todo from '../components/Todo'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAllTodos, setUserName, setIsLogedIn } from '../redux/slices/todoDataSlice';


function Home({ navigation }) {
    const [todo, setTodo] = useState("");
    const [deletingTodo, setDeletingTodo] = useState('');
    const [showTodos, setShowTodos] = useState(true);
    const [showCompletedTodos, setShowCompletedTodos] = useState(false);
    const [showDeleteBox, setShowDeleteBox] = useState(false);
    const [filterdTodo, setFilterdTodo] = useState([]);

    const { isLogedIn, allTodos } = useSelector((state) => state.todos);

    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const handleAddTodo = async () => {

        let text = todo.trim();
        if (text === "") {
            Alert.alert('All fields required', 'Please write somethig in todo box', [{ text: 'ok' }], { cancelable: true });
            return;
        }

        let token = "";
        try {
            let value = await AsyncStorage.getItem("token");
            if (value !== null) {
                token = value;
            } else {
                navigation.navigate("Login");
            }
        } catch (error) {
            console.log(error.message);
            navigation.navigate("Login");
        }


        // fetch("http://localhost:8000/todo/add", {
        fetch("https://todo-app-backend-at9n.onrender.com/todo/add", {
            method: "POST",
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ todo: text })
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.status === 'success') {
                let temp = [...allTodos, response.data];
                dispatch(setAllTodos(temp));
            } else {
                console.log(response.message);
                Alert.alert('Alert', 'Could not add todo!', [{ text: 'ok' }], { cancelable: true });
            }
        }).catch((error) => {
            console.log(error.message);
            Alert.alert('Alert', error.message, [{ text: 'ok' }], { cancelable: true });

        })

        setTodo("");
    }

    const handleFilterdTodo = () => {
        let temp;
        if (showTodos) {
            temp = allTodos.filter((todo) => todo.completed === false)
        } else {
            temp = allTodos.filter((todo) => todo.completed === true)
        }
        setFilterdTodo(temp);
    }

    const handleShowTodo = () => {
        setShowTodos(true);
        setShowCompletedTodos(false)
    }

    const handleShowCompltedTodo = () => {
        setShowTodos(false);
        setShowCompletedTodos(true)
    }

    // const handleDeleteBox = () => {
    //     setShowDeletBox(true);
    // }

    const handleDeleteBox = (todo, show) => {

        if (show) {
            setShowDeleteBox(true);
            setDeletingTodo(todo);
        } else {
            setShowDeleteBox(false);
            setDeletingTodo("");
        }
    }

    const handleDeleteTodo = () => {
        // fetch("http://localhost:8000/todo/delete", {
        fetch("https://todo-app-backend-at9n.onrender.com/todo/delete", {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: deletingTodo._id })
        }).then((response) => {
            return response.json();
        }).then((response) => {
            console.log(response.message);

        }).catch((error) => {
            console.log(error.message);
        });

        let temp = JSON.parse(JSON.stringify([...allTodos]));
        let arr = temp.filter((data) => data._id != deletingTodo._id);
        dispatch(setAllTodos(arr));

        handleDeleteBox("", false);
    }

    const fetchAllTodo = async () => {

        let token = "";

        try {
            let value = await AsyncStorage.getItem("token");
            if (value !== null) {
                token = value;
                dispatch(setIsLogedIn(true));
            } else {
                navigation.navigate("Login");
                return;
            }
        } catch (error) {
            console.log(error.message);
            return;
        }

        // fetch("http://localhost:8000/todo/", {
        fetch("https://todo-app-backend-at9n.onrender.com/todo/", {
            method: "GET",
            credentials: "include",
            headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.status === 'fail') {
                if (response.message === "Token is not found!" || response.message === "Wrong token found!") {
                    console.log(response.message)

                    navigate("/login");
                } else {
                    // toast.error(response.message);
                    console.log(response.message)

                }
            } else {
                dispatch(setAllTodos(response.data));
                dispatch(setUserName(response.userName));
                dispatch(setIsLogedIn(true));
            }
        }).catch((error) => {
            console.log(error.message);
        })
    }


    useEffect(() => {
        fetchAllTodo();
    }, [isFocused])

    useEffect(() => {
        handleFilterdTodo();
    }, [showTodos, showCompletedTodos, allTodos]);

    useEffect(()=>{
        if(!isLogedIn){
            navigation.navigate("Login");
        }
    },[isLogedIn, isFocused])

    return (
        <View style={{ width: "100%", alignItems: "center" }}>
            <View style={{ width: "100%", alignItems: "center", marginVertical: 20, borderRadius: 20, }}>
                <View style={{ backgroundColor: "#Dadad1", paddingHorizontal: 20, paddingVertical: 20, flexDirection: "row", borderRadius: 20, alignItems: "center" }}>

                    <TextInput style={{ borderWidth: 2, borderColor: "gray", borderTopLeftRadius: 5, borderBottomLeftRadius: 5, paddingLeft: 10, width: "70%", height: 50 }} defaultValue={todo} onChangeText={(newTodo) => setTodo(newTodo)} />
                    <Pressable style={{ backgroundColor: "#2477dc", justifyContent: "center", height: 50, paddingHorizontal: 5, borderTopRightRadius: 10, borderBottomRightRadius: 5 }} onPress={handleAddTodo}>
                        <Text style={{ fontWeight: "bold" }}>ADDTODO</Text>
                    </Pressable>

                </View>

                <View style={{ flexDirection: "row", gap: 20, marginTop: 10 }}>
                    <Pressable style={{ paddingHorizontal: 10, paddingVertical: 5, borderBottomWidth: (showTodos ? 2 : 0), borderBottomColor: "#2477dc" }} onPress={handleShowTodo}>
                        <Text style={{ fontWeight: "bold" }}>Todos</Text>
                    </Pressable>
                    <Pressable style={{ paddingHorizontal: 10, paddingVertical: 5, borderBottomWidth: (showCompletedTodos ? 2 : 0), borderBottomColor: "#2477dc" }} onPress={handleShowCompltedTodo}>
                        <Text style={{ fontWeight: "bold" }}>Completed Todos</Text>
                    </Pressable>


                </View>

                {/* <Todo handleDeleteBox={handleDeleteBox} /> */}
                {filterdTodo.length == 0 ? showCompletedTodos ? <Text style={{marginTop:80}}>You don't have any completed Todo yet.</Text> : <Text style={{marginTop:80}}>You don't have any Todo yet.</Text> : filterdTodo.map((todo) => <Todo key={todo._id} todo={todo} showTodos={showTodos} handleDeleteBox={handleDeleteBox} />)}


            </View>


            {/* Delete box */}

            {showDeleteBox ? <View style={{ width: "100%", height: 800, alignItems: "center", backgroundColor: "#Dadad1", opacity: 0.9, position: "absolute", top: 0, left: 0 }}>
                <View style={{ width: "90%", backgroundColor: "white", marginTop: 80, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10 }}>
                    <Text style={{ fontSize: 22, color: "red", paddingVertical: 5, borderBottomWidth: 2, borderBottomColor: "black" }}>Deleting Todo</Text>
                    <View>
                        <Text style={{ height: 100, paddingVertical: 10 }}>{deletingTodo.todo}</Text>
                        <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "flex-end", gap: 50 }}>
                            <Pressable style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#Dadad1", borderRadius: 10 }} onPress={() => setShowDeleteBox(false)}>
                                <Text>Cancel</Text>
                            </Pressable>
                            <Pressable style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "red", borderRadius: 10 }} onPress={handleDeleteTodo}>
                                <Text>Delete</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View> : ""}



        </View>
    )
}


export default Home
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, Pressable, Text, TextInput, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { setAllTodos } from '../redux/slices/todoDataSlice';


function Todo({ todo, showTodos, handleDeleteBox }) {
    const [updatedText, setUpdatedText] = useState(todo.todo);
    const [showEditBox, setShowEditBox] = useState(false);
    const { allTodos } = useSelector((state) => state.todos);

    const dispatch = useDispatch();

    const handleCloseEditBox = () => {
        setShowEditBox(false);
    }
    const handleOpenEditBox = () => {
        setShowEditBox(true);
    }

    const handleComplete = (id) => {
        // fetch("http://localhost:8000/todo/complete", {
        fetch("https://todo-app-backend-at9n.onrender.com/todo/complete", {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id, completed: true })
        }).then((response) => {
            return response.json();
        }).then((response) => {
            console.log(response.message);

        }).catch((error) => {
            console.log(error.message);
        });

        let temp = JSON.parse(JSON.stringify([...allTodos]));
        let arr = [];

        for (let todo of temp) {
            if (todo._id === id) {
                todo["completed"] = true;
            }
            arr.push(todo);
        }
        dispatch(setAllTodos(arr));
    }

    const handleIncomplete = (id) => {
        // fetch("http://localhost:8000/todo/complete", {
        fetch("https://todo-app-backend-at9n.onrender.com/todo/complete", {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id, completed: false })
        }).then((response) => {
            return response.json();
        }).then((response) => {
            console.log(response.message);

        }).catch((error) => {
            console.log(error.message);
        });

        let temp = JSON.parse(JSON.stringify([...allTodos]));
        let arr = [];

        for (let todo of temp) {
            if (todo._id === id) {
                todo["completed"] = false;
            }
            arr.push(todo);
        }
        dispatch(setAllTodos(arr));
    }

    const handleUpdate = (id) => {
        let text = updatedText.trim();
        if(text === ''){
            alert("please write something in todo");
            return;
        }

        // fetch("http://localhost:8000/todo/update", {
        fetch("https://todo-app-backend-at9n.onrender.com/todo/update", {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id, todo:updatedText })
        }).then((response) => {
            return response.json();
        }).then((response) => {
            console.log(response.message);

        }).catch((error) => {
            console.log(error.message);
        });

        let temp = JSON.parse(JSON.stringify([...allTodos]));
        let arr = [];

        for (let todo of temp) {
            if (todo._id === id) {
                todo["todo"] = updatedText;
            }
            arr.push(todo);
        }
        dispatch(setAllTodos(arr));
        setShowEditBox(false);
    }


    return (
        <View style={{ marginTop: 10, borderWidth: 2, borderColor: "#Dadad1", paddingVertical: 4 }}>
            {!showEditBox ? <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ width: "60%", paddingLeft: 10 }}>{todo.todo}</Text>
                <View style={{ flexDirection: "row", width: "40%", justifyContent: "center", gap: 15 }}>
                    <Pressable onPress={handleOpenEditBox}>
                        <Icon name="pencil" style={{ fontSize: 20 }} />
                    </Pressable>
                    <Pressable onPress={()=>handleDeleteBox(todo, true)}>
                        <Icon name="trash" style={{ fontSize: 20 }} />
                    </Pressable>
                    {showTodos ? <Pressable onPress={() => handleComplete(todo._id)}>
                        <Text>Complete</Text>
                    </Pressable> :
                        <Pressable onPress={() => handleIncomplete(todo._id)}>
                            <Text>Incomplete</Text>
                        </Pressable>}
                </View>
            </View> : ""}

            {showEditBox ? <View style={{ flexDirection: "row", paddingHorizontal: 5, paddingVertical: 10, alignItems: "center" }}>
                <TextInput style={{ width: "80%", height: 40, paddingLeft: 10, borderWidth: 2, borderColor: "#Dadad1" }} onChangeText={(newText)=> setUpdatedText(newText)} defaultValue={updatedText}></TextInput>
                <View style={{ flexDirection: "row", justifyContent: "center", gap: 15, paddingLeft: 5 }}>
                    <Pressable onPress={()=> handleUpdate(todo._id)}>
                        <Icon name="check" style={{ fontSize: 20 }} />
                    </Pressable>
                    <Pressable onPress={handleCloseEditBox}>
                        <Icon name="remove" style={{ fontSize: 20 }} />
                    </Pressable>
                </View>
            </View> : ""}

        </View>
    )
}

export default Todo
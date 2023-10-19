import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLogedIn: false,
    userName: "",
    allTodos: [],
}


const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers:{
        setIsLogedIn: (state, action) => {
            state.isLogedIn = action.payload;
        },
        setUserName: (state, action) => {
            state.userName = action.payload;
        },
        setAllTodos: (state, action) => {
            if(Array.isArray(action.payload)){
                state.allTodos = action.payload;
            }else{
                state.allTodos = []
            }
        }

    }
})

export const {setIsLogedIn, setAllTodos, setUserName } = todoSlice.actions;
export default todoSlice.reducer;
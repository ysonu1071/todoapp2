import { configureStore } from '@reduxjs/toolkit';
import todoSliceReducer from './slices/todoDataSlice';

const store = configureStore({
    reducer:{
        todos: todoSliceReducer,
    }
})

export default store;
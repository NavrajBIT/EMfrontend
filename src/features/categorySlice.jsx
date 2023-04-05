import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    category: []
}

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        addCategories: (state, action) => {
            state.category.push(action.payload)
        },
        removeCategories: (state, action) =>{
            let filteredData = state.category.filter(el => el.name === action.payload.name);
            state.category = [...filteredData]
        }
    }
})

export const { addCategories, removeCategories } = categorySlice.actions;
export const categoryState = state => state;
export default categorySlice.reducer
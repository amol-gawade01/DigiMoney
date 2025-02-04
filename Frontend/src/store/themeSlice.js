import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    theme:JSON.parse(localStorage.getItem("theme"))||"light"
}

const themeSlice = createSlice({
    name:"theme",
    initialState,
    reducers:{
        changeTheme:(state,action) => {
            state.theme = action.payload ? "dark":"light";
            localStorage.setItem("theme", JSON.stringify(state.theme))
        }
    }
})

export const {changeTheme} = themeSlice.actions;
export default themeSlice.reducer;

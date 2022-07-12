import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogService from "./blogService";

const initialState = {
    blogs: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const createPost = createAsyncThunk(
    'blog/create',
    async(data, thunkAPI) => {
        try{
            const token = thunkAPI.getState().auth.user.token
            return await blogService.createPost(data, token)
        }catch(e){
            const message = (e.respone && e.respone.data && e.respone.data.message) || e.message || e.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getPosts = createAsyncThunk(
    'blog/getAll', 
    async(_, thunkAPI) => {
        try{
            return await blogService.getPosts()
        }
        catch(e){
            const message = (e.respone && e.respone.data && e.respone.data.message) || e.message || e.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const updatePost = createAsyncThunk(
    'blog/update',
    async(id, data, thunkAPI) => {
        try{
            const token = thunkAPI.getState().auth.user.token
            return await blogService.updatePost(id, data, token)
        }catch(e){
            const message = (e.respone && e.respone.data && e.respone.data.message) || e.message || e.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const deletePost = createAsyncThunk(
    'blog/delete', 
    async(id, thunkAPI) => {
        try{
            const token = thunkAPI.getState().auth.user.token
            return await blogService.deletePost(id, token)
        }catch(e){
            const message = (e.respone && e.respone.data && e.respone.data.message) || e.message || e.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers:{
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPost.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.blogs.push(action.payload)
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getPosts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.goals = action.payload
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deletePost.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.blogs = state.goals.filter(
                    (goal) => goal._id !== action.payload.id
                )
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(updatePost.pending, (state) => {
                state.isLoading = false
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                for(let i = 0; i < state.blogs.length; i++){
                    if(state.blogs[i]._id === action.payload.id){
                        state.blogs[i] = action.payload
                    }
                }
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const { reset } = blogSlice.actions
export default blogSlice.reducer
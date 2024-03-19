import { createSlice } from "@reduxjs/toolkit";

const pushSlice = createSlice({
	name: "push",

	initialState: {
		user: null,
		chats: null,
		requests: null,
		stream: null,
		data: null,
		addDialog: false,
	},

	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setChats: (state, action) => {
			state.chats = action.payload;
		},
		setRequests: (state, action) => {
			state.requests = action.payload;
		},
		setStream: (state, action) => {
			state.stream = action.payload;
		},
		setData: (state, action) => {
			state.data = action.payload;
		},
		handleAddDialog: (state, action) => {
			state.addDialog = !state.addDialog;
		},
		clearUser: (state) => {
			state.user = null;
		}
	},
});

export const {
	setUser,
	setChats,
	setRequests,
	setStream,
	setData,
	handleAddDialog,
	clearUser
} = pushSlice.actions;

export default pushSlice.reducer;

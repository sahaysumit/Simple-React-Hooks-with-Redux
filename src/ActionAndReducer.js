import {createStore, applyMiddleware} from "redux";



export const FETCH_TYPES = {
	START_FETCH: "START_FETCH",
	FAIL_FETCH: "FAIL_FETCH",
	FINISH_FETCH: "FINISH_FETCH"
}

export const startFetch = () =>({
	type:FETCH_TYPES.START_FETCH,
});

export const finishFetch = (data) =>({
	type:FETCH_TYPES.FINISH_FETCH,
	payload:data,
});

export const failFetch = (error) =>({
	type:FETCH_TYPES.FAIL_FETCH,
	payload:error,
});

const initialFetchState = {
	data:null,
	loading:false,
	error:null
}


const fetchReducer = (state=initialFetchState, action)=>{
	switch(action.type){
		case FETCH_TYPES.START_FETCH:
			return {...state, loading:true}
		case FETCH_TYPES.FINISH_FETCH:
			return {...state, loading:false, data:action.payload}
		case FETCH_TYPES.FAIL_FETCH:
			return {...state, loading:false, error:action.payload}
		default:
			return state;

	}
}
export const fetchStore = createStore(fetchReducer);


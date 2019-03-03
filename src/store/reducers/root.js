import { SAVE_TOKEN } from '../actions/actionTypes';

const initialState = {
    name: '',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_TOKEN:
            return {
                ...state,
                name: action.name
            };  
        default:
            return state;
    }
};

export default reducer;
import { Action } from "redux";
import { OPEN_MODAL, CLOSE_MODAL, GET_AVAILABLE_TIME_ERROR, GET_AVAILABLE_TIME_REQUEST, GET_AVAILABLE_TIME_SUCCESS } from "@constants/time";

interface PayloadAction extends Action {
    payload: any;
}

interface IState {
    openModal: boolean;
    loading: boolean;
}

const initialState: IState = {
    openModal: false,
    loading: true,
};

const staff = (state = initialState, action: PayloadAction) => {
    switch (action.type) {
        case OPEN_MODAL: {
            const newState: IState = {
                ...state,
                openModal: true,
                loading: true,
            };
            return newState;
        }
        case CLOSE_MODAL: {
            const newState: IState = {
                ...state,
                openModal: false,
                loading: false,
            };
            return newState;
        }
        case GET_AVAILABLE_TIME_REQUEST: {
            const newState: IState = {
                ...state,
                loading: true,
            };
            return newState;
        }
        case GET_AVAILABLE_TIME_SUCCESS: {
            const newState: IState = {
                ...state,
                loading: false,
            };
            return newState;
        }
        case GET_AVAILABLE_TIME_ERROR: {
            const newState: IState = {
                ...state,
                loading: false,
            };
            return newState;
        }
        default:
            return state;
    }
};
export default staff;

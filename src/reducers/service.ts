import { Action } from "redux";
import { SAVE_SERVICES } from "@constants/service";
import IService from "@interfaces/IService";

interface PayloadAction extends Action {
    payload: any;
}

interface IState {
    services: IService[];
}

const initialState: IState = {
    services: [],
};

const service = (state = initialState, action: PayloadAction) => {
    switch (action.type) {
        case SAVE_SERVICES: {
            const newState: IState = {
                ...state,
                services: action?.payload,
            };
            return newState;
        }
        default:
            return state;
    }
};
export default service;

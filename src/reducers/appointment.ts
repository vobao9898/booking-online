import IAppointment from "@interfaces/IAppointment";
import {
    CREATE_APPOINTMENT_REQUEST,
    CREATE_APPOINTMENT_SUCCESS,
    CREATE_APPOINTMENT_ERROR,
    CANCEL_DEPOSIT_REQUEST,
    CANCEL_DEPOSIT_SUCCESS,
    CANCEL_DEPOSIT_ERROR,
    PAYMENT_DEPOSIT_REQUEST,
    PAYMENT_DEPOSIT_SUCCESS,
    PAYMENT_DEPOSIT_ERROR,
} from "@constants/appointment";
import { Action } from "redux";

interface PayloadAction extends Action {
    payload: any;
}

interface IState {
    loading: boolean;
    isDeposit: boolean;
    depositData: IAppointment | null;
    appointmentId: number;
}

const initialState: IState = {
    loading: false,
    isDeposit: false,
    depositData: null,
    appointmentId: 0,
};

const appointment = (state = initialState, action: PayloadAction) => {
    switch (action.type) {
        case CREATE_APPOINTMENT_REQUEST: {
            const newState: IState = {
                ...state,
                loading: true,
            };
            return newState;
        }

        case CREATE_APPOINTMENT_SUCCESS: {
            const { isDeposit, depositData, appointmentId } = action.payload;
            const newState: IState = {
                ...state,
                isDeposit: isDeposit,
                depositData: depositData,
                appointmentId: appointmentId,
                loading: false,
            };
            return newState;
        }

        case CREATE_APPOINTMENT_ERROR: {
            const newState: IState = {
                ...state,
                loading: false,
            };
            return newState;
        }

        case CANCEL_DEPOSIT_REQUEST: {
            const newState: IState = {
                ...state,
                loading: true,
            };
            return newState;
        }

        case CANCEL_DEPOSIT_SUCCESS: {
            const newState: IState = {
                ...state,
                loading: false,
                depositData: null,
                appointmentId: 0,
                isDeposit: false,
            };
            return newState;
        }

        case CANCEL_DEPOSIT_ERROR: {
            const newState: IState = {
                ...state,
                loading: true,
            };
            return newState;
        }

        case PAYMENT_DEPOSIT_REQUEST: {
            const newState: IState = {
                ...state,
                loading: true,
            };
            return newState;
        }

        case PAYMENT_DEPOSIT_SUCCESS: {
            const newState: IState = {
                ...state,
                loading: false,
                depositData: null,
                appointmentId: 0,
                isDeposit: false,
            };
            return newState;
        }

        case PAYMENT_DEPOSIT_ERROR: {
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
export default appointment;

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
import IAppointment from "@interfaces/IAppointment";

const createAppointmentRequest = () => {
    return {
        type: CREATE_APPOINTMENT_REQUEST,
        payload: null,
    };
};

const createAppointmentSuccess = (isDeposit: boolean, depositData?: IAppointment, appointmentId?: number) => {
    return {
        type: CREATE_APPOINTMENT_SUCCESS,
        payload: {
            isDeposit,
            depositData,
            appointmentId,
        },
    };
};

const createAppointmentError = () => {
    return {
        type: CREATE_APPOINTMENT_ERROR,
        payload: null,
    };
};

const cancelDepositRequest = () => {
    return {
        type: CANCEL_DEPOSIT_REQUEST,
        payload: null,
    };
};

const cancelDepositSuccess = () => {
    return {
        type: CANCEL_DEPOSIT_SUCCESS,
        payload: null,
    };
};

const cancelDepositError = () => {
    return {
        type: CANCEL_DEPOSIT_ERROR,
        payload: null,
    };
};

const paymentDepositRequest = () => {
    return {
        type: PAYMENT_DEPOSIT_REQUEST,
        payload: null,
    };
};

const paymentDepositSuccess = () => {
    return {
        type: PAYMENT_DEPOSIT_SUCCESS,
        payload: null,
    };
};

const paymentDepositError = () => {
    return {
        type: PAYMENT_DEPOSIT_ERROR,
        payload: null,
    };
};

export {
    createAppointmentRequest,
    createAppointmentSuccess,
    createAppointmentError,
    cancelDepositRequest,
    cancelDepositSuccess,
    cancelDepositError,
    paymentDepositRequest,
    paymentDepositSuccess,
    paymentDepositError,
};

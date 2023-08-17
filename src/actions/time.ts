import { CLOSE_MODAL, OPEN_MODAL, GET_AVAILABLE_TIME_REQUEST, GET_AVAILABLE_TIME_SUCCESS, GET_AVAILABLE_TIME_ERROR } from "@constants/time";

const openModal = () => {
    return {
        type: OPEN_MODAL,
        payload: true,
    };
};

const closeModal = () => {
    return {
        type: CLOSE_MODAL,
        payload: false,
    };
};

const getAvailableTimeRequest = () => {
    return {
        type: GET_AVAILABLE_TIME_REQUEST,
        payload: null,
    };
};

const getAvailableTimeSuccess = () => {
    return {
        type: GET_AVAILABLE_TIME_SUCCESS,
        payload: null,
    };
};

const getAvailableTimeError = () => {
    return {
        type: GET_AVAILABLE_TIME_ERROR,
        payload: null,
    };
};

export { closeModal, openModal, getAvailableTimeRequest, getAvailableTimeSuccess, getAvailableTimeError };

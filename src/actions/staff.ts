import { CLOSE_MODAL, OPEN_MODAL, GET_STAFFS_ERROR, GET_STAFFS_REQUEST, GET_STAFFS_SUCCESS } from "@constants/staff";

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

const getStaffsRequest = () => {
    return {
        type: GET_STAFFS_REQUEST,
        payload: null,
    };
};

const getStaffsSuccess = () => {
    return {
        type: GET_STAFFS_SUCCESS,
        payload: null,
    };
};

const getStaffsError = () => {
    return {
        type: GET_STAFFS_ERROR,
        payload: null,
    };
};

export { closeModal, openModal, getStaffsRequest, getStaffsSuccess, getStaffsError };

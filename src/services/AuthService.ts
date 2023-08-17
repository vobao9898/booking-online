import ICustomer from "@interfaces/ICustomer";
import AuthRepository from "@repositories/AuthRepository";
import { handleResponseError } from "@utils/index";

const AuthService = {
    getCustomer: async (phone: string): Promise<ICustomer> => {
        try {
            const response = await AuthRepository.getCustomer(phone);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    verifyOTP: async (verifyId: number, otp: string) => {
        try {
            const response = await AuthRepository.verifyOTP(verifyId, otp);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    sendOTP: async (phone: string) => {
        try {
            const response = await AuthRepository.sendOTP(phone);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    postCustomer: async (isSignin: number, firstName: string, lastName: string, phone: string): Promise<ICustomer> => {
        try {
            const response = await AuthRepository.postCustomer(isSignin, firstName, lastName, phone);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
};

export default AuthService;

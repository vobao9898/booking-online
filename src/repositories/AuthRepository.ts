import axiosClient from "@api/axiosClient";
import ICustomer from "@interfaces/ICustomer";

const AuthRepository = {
    verifyOTP: (verifyId: number, otp: string) => {
        return new Promise((resolve, reject) => {
            const body = {
                codeNumber: otp,
            };
            axiosClient.put(`/verifyPhoneCode/${verifyId}?api-version=2.0`, body).then(
                (resp: any) => {
                    if (resp && resp.codeNumber === 200) {
                        resolve(resp.data);
                    } else {
                        reject(resp?.message);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },
    sendOTP: (phone: string) => {
        return new Promise((resolve, reject) => {
            axiosClient.post(`/customer/sendOTP?phone=${phone}`).then(
                (resp) => {
                    resolve(resp.data);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },
    getCustomer: (phone: string): Promise<ICustomer> => {
        return new Promise((resolve, reject) => {
            axiosClient.get(`/customer/getbyphone/${phone}`).then(
                (resp) => {
                    resolve(resp.data);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },
    postCustomer: (isSignin: number, firstName: string, lastName: string, phone: string): Promise<ICustomer> => {
        return new Promise((resolve, reject) => {
            const body = {
                firstName,
                lastName,
                phone: `+${phone}`,
                isSignin,
                referrerPhone: "",
            };
            axiosClient.post(`/customer`, body).then(
                (resp) => {
                    resolve(resp.data);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },
};

export default AuthRepository;

import axiosClient from "@api/axiosClient";
import IAppointment from "@interfaces/IAppointment";
import { IPaging } from "@interfaces/IPaging";

const AppointmentRepository = {
    getHistoriesByCustomer: (customerId: number, page: number, row: number): Promise<IPaging<IAppointment>> => {
        return new Promise((resolve, reject) => {
            axiosClient.get(`/PaymentBookingOnline/getAppointmentHistoryByCustomer/${customerId}?page=${page}&row=${row}`).then(
                (resp: any) => {
                    resolve(resp);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },
    getById: (id: number): Promise<IAppointment> => {
        return new Promise((resolve, reject) => {
            axiosClient.get(`/Appointment/${id}`).then(
                (resp: any) => {
                    resolve(resp.data);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },
    checkDeposit: (body: any): Promise<IAppointment> => {
        return new Promise((resolve, reject) => {
            const url = `/PaymentBookingOnline/checkdeposit`;
            axiosClient.put(url, body).then(
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
    create: (body: any): Promise<number> => {
        return new Promise((resolve, reject) => {
            axiosClient.post("/appointment", body).then(
                (resp: any) => {
                    if (resp && resp.codeNumber === 200) {
                        resolve(resp.data);
                    } else {
                        reject(resp.message);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },
    cancelPayDeposit: (id: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            const url = `/PaymentBookingOnline/cancelpaydeposit/${id}`;
            axiosClient.put(url).then(
                (resp: any) => {
                    if (resp && resp.codeNumber === 200) {
                        resolve(resp.data);
                    } else {
                        reject(resp.message);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },
    sendNotify: (id: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            const url = `/Appointment/sendnotify/${id}`;
            axiosClient.put(url).then(
                (resp: any) => {
                    resolve(resp);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },
    payment: (id: number, deposit: string, signature: string, ticks: number, data: any): Promise<void> => {
        return new Promise((resolve, reject) => {
            const url = `/paymentBookingOnline/${id}?depositAppointment=${deposit}&signature=${signature}`;
            axiosClient
                .post(url, data, {
                    headers: {
                        "Content-Type": "application/json",
                        RequestTime: `${ticks}`,
                    },
                })
                .then(
                    (resp: any) => {
                        if (resp && resp.codeNumber === 200) {
                            resolve(resp?.data);
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
};

export default AppointmentRepository;

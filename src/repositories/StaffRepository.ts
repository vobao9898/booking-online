import axiosClient from "@api/axiosClient";
import IStaff from "@interfaces/IStaff";
import IBlockTime from "@interfaces/IBlockTime";

const ServiceRepository = {
    getStaffByService: (serviceId: number, merchantId: number): Promise<IStaff[]> => {
        return new Promise((resolve, reject) => {
            axiosClient.get(`/staff/byService/${serviceId}?merchantId=${merchantId}`).then(
                (resp: any) => {
                    resolve(resp.data);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },
    getAvaliableTime: (staffId: number, date: string, merchantId: number): Promise<IBlockTime[]> => {
        const body = {
            appointmentId: 0,
            date: date,
            merchantId: merchantId,
        };
        return new Promise((resolve, reject) => {
            axiosClient.put(`/staff/getavailabletime/${staffId}`, body).then(
                (resp: any) => {
                    resolve(resp.data);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },
};

export default ServiceRepository;

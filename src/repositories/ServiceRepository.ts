import axiosClient from "@api/axiosClient";
import IService from "@interfaces/IService";

const ServiceRepository = {
    getServices: (): Promise<IService[]> => {
        return new Promise((resolve, reject) => {
            axiosClient.get(`/service`).then(
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

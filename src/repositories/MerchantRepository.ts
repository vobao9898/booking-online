import axiosClient from "@api/axiosClient";
import IMerchant from "@interfaces/IMerchant";

const MerchantRepository = {
    getById: (id: number): Promise<IMerchant> => {
        return new Promise((resolve, reject) => {
            axiosClient.get(`/merchant/${id}`).then(
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

export default MerchantRepository;

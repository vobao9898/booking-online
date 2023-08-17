import IMerchant from "@interfaces/IMerchant";
import MerchantRepository from "@repositories/MerchantRepository";
import { handleResponseError } from "@utils/index";

const MerchantService = {
    getById: async (id: number): Promise<IMerchant> => {
        try {
            const response = await MerchantRepository.getById(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
};

export default MerchantService;

import IService from "@interfaces/IService";
import ServiceRepository from "@repositories/ServiceRepository";
import { handleResponseError } from "@utils/index";

const Service = {
    getServices: async (): Promise<IService[]> => {
        try {
            const response = await ServiceRepository.getServices();
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
};

export default Service;

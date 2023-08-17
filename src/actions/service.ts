import { SAVE_SERVICES } from "@constants/service";
import IService from "@interfaces/IService";

const saveServices = (services: IService[]) => {
    return {
        type: SAVE_SERVICES,
        payload: services,
    };
};

export { saveServices };

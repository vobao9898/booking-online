import IStaff from "@interfaces/IStaff";
import IBlockTime from "@interfaces/IBlockTime";
import StaffRepository from "@repositories/StaffRepository";
import { handleResponseError } from "@utils/index";

const StaffService = {
    getStaffByService: async (serviceId: number, merchantId: number): Promise<IStaff[]> => {
        try {
            const response = await StaffRepository.getStaffByService(serviceId, merchantId);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    getAvaliableTime: async (staffId: number, date: string, merchantId: number): Promise<IBlockTime[]> => {
        try {
            const response = await StaffRepository.getAvaliableTime(staffId, date, merchantId);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
};

export default StaffService;

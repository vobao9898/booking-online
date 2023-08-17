import IExtra from "./IExtra";
import IStaff from "./IStaff";

interface IService {
    serviceId: number;
    appointmentId: number;
    bookingServiceId: number;
    categoryId: number;
    imageUrl: string;
    serviceName: string;
    duration: number;
    staff: IStaff;
    staffId: number;
    status: number;
    isDisabled: number;
    name: string;
    price: string;
    extras: IExtra[];
}

export default IService;

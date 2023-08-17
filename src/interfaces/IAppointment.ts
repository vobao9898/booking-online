import IExtra from "./IExtra";
import IGiftCard from "./IGiftCard";
import IProduct from "./IProduct";
import IService from "./IService";

interface IAppointment {
    appointmentId: number;
    status: string;
    subTotal: string;
    discount: string;
    tax: string;
    total: string;
    services: IService[];
    extras: IExtra[];
    products: IProduct[];
    giftCards: IGiftCard[];
    fromTime: Date;
    toTime: Date;
    duration: number;
    depositAmount: string;
}

export default IAppointment;

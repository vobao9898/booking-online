import IExtra from "./IExtra";
import IService from "./IService";
import IStaff from "./IStaff";

interface ICart {
    cartId: string;
    service?: IService;
    extras?: IExtra[];
    staff?: IStaff;
    time?: string;
    date?: Date;
}

export default ICart;

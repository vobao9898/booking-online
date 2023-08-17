import { SAVE_CUSTOMER } from "@constants/customer";
import ICustomer from "@interfaces/ICustomer";

const saveCustomer = (customer: ICustomer) => {
    return {
        type: SAVE_CUSTOMER,
        payload: customer,
    };
};

export { saveCustomer };

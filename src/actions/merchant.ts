import { SAVE_MERCHANT } from "@constants/merchant";
import IMerchant from "@interfaces/IMerchant";

const saveMerchant = (merchant: IMerchant) => {
    return {
        type: SAVE_MERCHANT,
        payload: merchant,
    };
};

export { saveMerchant };

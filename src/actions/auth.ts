import { SAVE_TOKEN } from "@constants/auth";

const saveToken = (token: string) => {
    return {
        type: SAVE_TOKEN,
        payload: token,
    };
};

export { saveToken };

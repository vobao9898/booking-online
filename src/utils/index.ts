import CancelIcon from "@assets/images/cencle.svg";
import CheckIcon from "@assets/images/check.svg";
import ConfirmIcon from "@assets/images/comfirm.svg";
import NoShowIcon from "@assets/images/noshow.svg";
import PaidIcon from "@assets/images/paid.svg";
import RefundIcon from "@assets/images/refund.svg";
import UnconfirmIcon from "@assets/images/uncomfirm.svg";
import VoidIcon from "@assets/images/void.svg";
import WaitingIcon from "@assets/images/waiting.svg";
import IBlockTime from "@interfaces/IBlockTime";
import moment from "moment";
import { toast } from "react-toastify";
import ICart from "@interfaces/ICart";

interface Map {
    [key: string]: {
        color: string;
    };
}

export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function handleResponseError(error: any) {
    showToastError(error);
}

export function convertMinsToHrsMins(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    const hourStr = h;
    const minutesStr = m < 10 ? "0" + m : m;

    if (h <= 0) {
        return `${minutesStr} min`;
    }

    return `${hourStr} hour ${minutesStr} min`;
}

export function formatMoney(currency: string): string {
    const money = currency.replace(/[^0-9.-]+/g, "");
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });
    return money ? formatter.format(Number(money)).replace("$", "$ ") : "";
}

export function isNumeric(value: string): boolean {
    return /^-?\d+$/.test(value);
}

export function converStrToNumber(value: string) {
    const format = value.replace(/[^0-9.-]+/g, "");
    return Number(format);
}

export function getDepositType(depositPercent?: string, depositFixedAmount?: string) {
    if (!depositPercent || !depositFixedAmount) {
        return "";
    }

    if (parseFloat(depositFixedAmount) === 0 && parseFloat(depositPercent) !== 0) {
        return ` (${depositPercent}%)`;
    }

    if (parseFloat(depositPercent) === 0 && parseFloat(depositFixedAmount) !== 0) {
        return ` ($${depositFixedAmount})`;
    }
    return "";
}

export function statusShow(text: string) {
    const status = text.toLowerCase();

    const STATUS_SETTING: Map = {
        cancel: {
            color: "bg-[#EA4335]",
        },
        unconfirm: {
            color: "bg-[#FBA705]",
        },
        paid: {
            color: "bg-[#2EBE03]",
        },
        complete: {
            color: "bg-[#DFDFDF]",
        },
        waiting: {
            color: "bg-[#82A2C1]",
        },
        refund: {
            color: "bg-[#0CAEAE]",
        },
        processing: {
            color: "bg-[#FEDC32]",
        },
        "transaction fail": {
            color: "bg-[#FEDC32]",
        },
        checkin: {
            color: "bg-[#19A9EC]",
        },
        incomplete: {
            color: "bg-[#19A9EC]",
        },
        "no show": {
            color: "bg-[#767676]",
        },
        pending: {
            color: "bg-[#FFF3DD]",
        },
        canceled: {
            color: "bg-[#EA4335]",
        },
        shipped: {
            color: "bg-[#19A9EC]",
        },
        return: {
            color: "bg-[#B73B36]",
        },
        void: {
            color: "bg-[#EA4335]",
        },
        confirm: {
            color: "bg-[#00ABC5]",
        },
        wait: {
            color: "bg-[#82A2C1]",
        },
    };

    return STATUS_SETTING[status] ? `${STATUS_SETTING[status].color}` : "bg-black";
}

export function handleCheckStatus(text: string) {
    switch (text) {
        case "paid":
            return PaidIcon;
        case "processing":
            return PaidIcon;
        case "checkin":
            return CheckIcon;
        case "waiting":
            return WaitingIcon;
        case "cancel":
            return CancelIcon;
        case "confirm":
            return ConfirmIcon;
        case "void":
            return VoidIcon;
        case "refund":
            return RefundIcon;
        case "unconfirm":
            return PaidIcon;
        case "no show":
            return NoShowIcon;
        default:
            return UnconfirmIcon;
    }
}

export const showToastError = (message: string) => {
    toast.error(message, {
        toastId: message,
    });
};

export const showToastSuccess = (message: string) => {
    toast.success(message, {
        toastId: message,
    });
};

export const showToastWarning = (message: string) => {
    toast.warning(message, {
        toastId: message,
    });
};

export function getTimeAvaible(staff_available_time: IBlockTime[]) {
    const time12PM = `${moment().format("YYYY-MM-DD")}T12:00:00`;
    const time05PM = `${moment().format("YYYY-MM-DD")}T17:00:00`;

    const morning = staff_available_time?.filter((obj) => {
        const timeFilter = `${moment().format("YYYY-MM-DD")}T${moment(obj.time, ["h:mm A"]).format("HH:mm:ss")}`;
        return moment(timeFilter).isSameOrBefore(time12PM);
    });

    const afternoon = staff_available_time?.filter((obj) => {
        const timeFilter = `${moment().format("YYYY-MM-DD")}T${moment(obj.time, ["h:mm A"]).format("HH:mm:ss")}`;
        return moment(timeFilter).isAfter(time12PM) && moment(timeFilter).isBefore(time05PM);
    });

    const evening = staff_available_time?.filter((obj) => {
        const timeFilter = `${moment().format("YYYY-MM-DD")}T${moment(obj.time, ["h:mm A"]).format("HH:mm:ss")}`;
        return moment(timeFilter).isSameOrAfter(time05PM);
    });

    return {
        morning,
        afternoon,
        evening,
    };
}

export const showDateTime = (cart: ICart, isShowDefault = true) => {
    if (cart?.date && cart?.time?.trim()) {
        return `${moment(`${moment(cart.date).format("MMMM DD,yyyy")} ${moment(cart.time, "HH:mm").format("hh:mm A")}`).format("MMMM DD,yyyy hh:mm A")}`;
    }
    return isShowDefault ? "Select Date/Time" : "";
};

export const checkCanEditStaff = (cart: ICart[], isEdit = false) => {
    if (isEdit && cart && cart.length === 1 && cart[0] && (cart[0].staff?.staffId === 0 || cart[0].staff?.staffId === -1)) return true;

    if ((cart[0] && cart[0].staff?.staffId === -1) || (cart[0] && cart[0].staff?.staffId === 0)) {
        return false;
    }
    return true;
};

export const checkCanEditTime = (cart: ICart[], isEdit = false, cartItem: ICart | null) => {
    if (isEdit === false && cartItem && cartItem.staff?.staffId === -1) return false;

    if (isEdit && cartItem?.staff?.staffId === -1) return false;

    if (isEdit && cart && cart.length === 1 && cartItem && cartItem.staff?.staffId !== -1) return true;

    if (isEdit && cartItem && cartItem.staff?.staffId === 0) return true;

    if ((cart[0] && cart[0].staff?.staffId === -1) || (cart[0] && cart[0].staff?.staffId === 0)) {
        return false;
    }
    return true;
};

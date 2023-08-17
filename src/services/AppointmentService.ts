import AppointmentRepository from "@repositories/AppointmentRepository";
import { handleResponseError } from "@utils/index";
import { IPaging } from "@interfaces/IPaging";
import IAppointment from "@interfaces/IAppointment";
import ICart from "@interfaces/ICart";
import ICustomer from "@interfaces/ICustomer";
import moment from "moment";
import hmacSha256 from "crypto-js/hmac-sha256";

const getCustomerId = (customer: ICustomer) => {
    const customerId = customer.customerId;
    return customerId;
};

const getUserId = (customer: ICustomer) => {
    const userID = customer.userId;
    return userID;
};

const getFromTime = (cart: ICart[]) => {
    if (cart && cart.length) {
        const fromTime =
            cart[0]?.staff?.staffId === -1
                ? `${moment(new Date()).format("YYYY-MM-DD")} 00:00 AM`
                : `${moment(`${moment(cart[0].date).format("MMMM DD,yyyy")} ${moment(cart[0].time, "HH:mm").format("hh:mm A")}`).format("YYYY-MM-DD hh:mm A")}`;
        return fromTime;
    }
};

const getServices = (cart: ICart[], firstStaffId: number | undefined) => {
    const services: { serviceId: number | undefined; staffId: number | undefined }[] = [];
    cart.forEach((item) => {
        const staffId = firstStaffId === -1 ? -1 : firstStaffId === 0 ? 0 : item.staff?.staffId;
        services.push({ serviceId: item.service?.serviceId, staffId: staffId });
    });
    return services;
};

const getExtras = (cart: ICart[]) => {
    const extras: { extraId: number }[] = [];
    cart.forEach((item) => {
        item.extras?.forEach((extra) => {
            extras.push({ extraId: extra.extraId });
        });
    });
    return extras;
};

const getTicks = () => {
    const date = new Date();
    const epochOffset = 621355968000000000;
    const ticksPerMillisecond = 10000;
    const ticks = date.getTime() * ticksPerMillisecond + epochOffset;
    return ticks;
};

const hashData = (paymentBody: any) => {
    if (!paymentBody) return "";
    const hash = hmacSha256(JSON.stringify(paymentBody), import.meta.env.VITE_BOOKING_ONLINE_SECRET_KEY);
    return hash.toString();
};

const getValue = (value: any) => {
    return value !== undefined ? value : null;
};

const mapPaymentModel = (paymentBody: any) => {
    return {
        tokenType: getValue(paymentBody?.tokenType),
        token: getValue(paymentBody?.token),
        initiatedBy: getValue(paymentBody?.initiatedBy),
        card: {
            number: getValue(paymentBody?.card?.number),
            bin: getValue(paymentBody?.card?.bin),
            exp: getValue(paymentBody?.card?.exp),
            type: getValue(paymentBody?.card?.type),
            hash: getValue(paymentBody?.card?.hash),
        },
        check: {
            name: getValue(paymentBody?.check?.name),
            account: getValue(paymentBody?.check?.account),
            aba: getValue(paymentBody?.check?.aba),
            hash: getValue(paymentBody?.check?.hash),
        },
        wallet: {
            cardDetails: getValue(paymentBody?.wallet?.cardDetails),
            cardNetwork: getValue(paymentBody?.wallet?.cardNetwork),
            email: getValue(paymentBody?.wallet?.email),
            billingInfo: {
                address1: getValue(paymentBody?.wallet?.billingInfo?.address1),
                address2: getValue(paymentBody?.wallet?.billingInfo?.address2),
                firstName: getValue(paymentBody?.wallet?.billingInfo?.firstName),
                lastName: getValue(paymentBody?.wallet?.billingInfo?.lastName),
                postalCode: getValue(paymentBody?.wallet?.billingInfo?.postalCode),
                city: getValue(paymentBody?.wallet?.billingInfo?.city),
                state: getValue(paymentBody?.wallet?.billingInfo?.state),
                country: getValue(paymentBody?.wallet?.billingInfo?.country),
                phone: getValue(paymentBody?.wallet?.billingInfo?.phone),
            },
            shippingInfo: {
                address1: getValue(paymentBody?.wallet?.shippingInfo?.address1),
                address2: getValue(paymentBody?.wallet?.shippingInfo?.address2),
                firstName: getValue(paymentBody?.wallet?.shippingInfo?.firstName),
                lastName: getValue(paymentBody?.wallet?.shippingInfo?.lastName),
                postalCode: getValue(paymentBody?.wallet?.shippingInfo?.postalCode),
                city: getValue(paymentBody?.wallet?.shippingInfo?.city),
                state: getValue(paymentBody?.wallet?.shippingInfo?.state),
                country: getValue(paymentBody?.wallet?.shippingInfo?.country),
                phone: getValue(paymentBody?.wallet?.shippingInfo?.phone),
            },
        },
    };
};

const AppointmentService = {
    getHistoriesByCustomer: async (customerId: number, page: number, row: number): Promise<IPaging<IAppointment>> => {
        try {
            const response = await AppointmentRepository.getHistoriesByCustomer(customerId, page, row);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    getById: async (id: number): Promise<IAppointment> => {
        try {
            const response = await AppointmentRepository.getById(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    checkDeposit: async (cart: ICart[], customer: ICustomer, merchantId: number): Promise<IAppointment> => {
        try {
            const staffId = cart[0].staff?.staffId;
            const customerId = getCustomerId(customer);
            const userID = getUserId(customer);
            const fromTime = getFromTime(cart);
            const firstStaffId = cart[0]?.staff?.staffId;

            const services: any = getServices(cart, firstStaffId);
            const extras: any = getExtras(cart);

            const body = {
                services: services,
                extras: extras,
                products: [],
                fromTime: fromTime,
                merchantId: merchantId,
                userId: userID,
                toTime: fromTime,
                staffId: staffId,
                giftCards: [],
                customerId: customerId,
                appointmentId: 0,
                depositAmount: 0,
            };

            const response = await AppointmentRepository.checkDeposit(body);

            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    create: async (merchantId: number, cart: ICart[], customer: ICustomer, note: string) => {
        try {
            const staffId = cart[0].staff?.staffId;
            const customerId = getCustomerId(customer);
            const userID = getUserId(customer);
            const fromTime = getFromTime(cart);
            const firstStaffId = cart[0]?.staff?.staffId;

            const services: any = getServices(cart, firstStaffId);
            const extras: any = getExtras(cart);

            const body = {
                staffId: staffId,
                merchantId: merchantId,
                userId: userID,
                customerId: customerId,
                fromTime: fromTime,
                toTime: fromTime,
                status: "unconfirm",
                isSignIn: 1,
                categories: [],
                services: services,
                extras: extras,
                products: [],
                IsBookingPlugin: 1,
                notes: note.trim() ? [{ note }] : "",
            };

            const response = await AppointmentRepository.create(body);

            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    cancelPayDeposit: async (id: number) => {
        try {
            const response = await AppointmentRepository.cancelPayDeposit(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    sendNotify: async (id: number) => {
        try {
            const response = await AppointmentRepository.sendNotify(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    payment: async (id: number, deposit: string, paymentBody: any) => {
        try {
            const data = mapPaymentModel(paymentBody);
            const signature = hashData(data);
            const ticks = getTicks();

            const response = await AppointmentRepository.payment(id, deposit, signature, ticks, data);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
};

export default AppointmentService;

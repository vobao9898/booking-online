import { ReactComponent as FlagUS } from "@assets/images/us.svg";
import { ReactComponent as FlagCA } from "@assets/images/ca.svg";
import { ReactComponent as FlagVN } from "@assets/images/vn.svg";
import { ReactComponent as CloseIcon } from "@assets/images/close-phone.svg";
import { Select } from "antd";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { saveToken } from "@actions/auth";
import { saveMerchant } from "@actions/merchant";
import { saveCustomer } from "@actions/customer";
import AuthService from "@services/AuthService";
import MerchantService from "@services/MerchantService";
import useAppDispatch from "@hooks/useAppDispatch";
import useAppSelector from "@hooks/useAppSelector";
import Button from "@components/Button";
import InputMask from "react-input-mask";
import classNames from "classnames";
import LocationIcon from "@assets/images/locationWhite.svg";

enum CODE_PHONES {
    VN = "VN",
    US = "US",
    CA = "CA",
}

const PHONE_OPTIONS = [
    {
        id: 1,
        flag: <FlagVN width={35} height={25} />,
        codePhone: 84,
        value: CODE_PHONES.VN,
    },
    {
        id: 2,
        flag: <FlagUS width={35} height={25} />,
        codePhone: 1,
        value: CODE_PHONES.US,
    },
    {
        id: 3,
        flag: <FlagCA width={35} height={25} />,
        codePhone: 1,
        value: CODE_PHONES.CA,
    },
];

const Login = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const merchant = useAppSelector((state) => state.merchant.merchant);

    const merchantId = searchParams.get("merchantId") || "258";
    const token =
        searchParams.get("token") ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjaGFudElkIjoiMjU4IiwiZGlnaXRhbFR5cGUiOiJib29raW5nX3BsdWdpbiIsInJvbGUiOiJEaWdpdGFsV2Vic2l0ZSIsIm5iZiI6MTY3OTM5NDU3MCwiZXhwIjoxOTk1MDEzNzcwLCJpYXQiOjE2NzkzOTQ1NzAsImlzcyI6Imh0dHBzOi8vc3RhZ2luZy5oYXJtb255cGF5bWVudC5jb20vYXBpLyIsImF1ZCI6IkhQX0FQSV9DbGllbnQifQ.1noxhNutTBh16ph2EAaThLV4Sla_rObHpzjBbba9TZ8";

    const [codePhone, setCodePhone] = useState<CODE_PHONES>(CODE_PHONES.US);
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (token) {
            dispatch(saveToken(token));
        }
    }, [token, dispatch]);

    useEffect(() => {
        const fetchMerchant = async (id: string) => {
            try {
                const data = await MerchantService.getById(parseInt(id));
                dispatch(saveMerchant(data));
            } catch (error) {
                console.log(error);
            }
        };
        if (merchantId) {
            fetchMerchant(merchantId);
        }
    }, [merchantId, dispatch]);

    const handleChangePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPhoneNumber(value);
    };

    const handleClearPhone = () => {
        setPhoneNumber("");
    };

    const handleChangeCodePhone = (value: CODE_PHONES) => {
        setCodePhone(value);
    };

    const phoneFormat = (phone: string) => {
        const cleaned = phone.replace(/\D/g, "");
        const forMatchOne = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
        const forMatchTwo = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (forMatchOne) {
            return forMatchOne[1] + `-` + forMatchOne[2] + `-` + forMatchOne[3];
        }
        if (forMatchTwo) {
            return forMatchTwo[1] + `-` + forMatchTwo[2] + `-` + forMatchTwo[3];
        }
        return phone;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();

            const code = getCodePhoneNumber(codePhone);

            let phone = `${code}${phoneFormat(phoneNumber)}`;

            if (phoneNumber && phoneNumber[0] === "0") {
                phone = `${code}${phoneFormat(phoneNumber.slice(1))}`;
            }

            setLoading(true);

            const customer = await AuthService.getCustomer(phone);

            if (customer) {
                dispatch(saveCustomer(customer));
                navigate(`/welcome-back?merchant_id=${merchantId}&token=${token}`);
            } else {
                const data: any = await AuthService.sendOTP(phone);
                if (data) {
                    navigate(`/verify?merchant_id=${merchantId}&token=${token}`, { state: { verifyId: data.verifyId, phone } });
                }
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const getCodePhoneNumber = (codePhone: CODE_PHONES) => {
        if (codePhone === CODE_PHONES.VN) return 84;
        return 1;
    };

    const validatePhone = (phone: string) => {
        const replacePhone = phone.replaceAll("-", "");
        return replacePhone.length < 9 ? false : true;
    };

    const isPhoneValid = validatePhone(phoneNumber);

    return (
        <div className="w-full h-[100svh] flex flex-col bg-gradient-to-r from-[#5E8AB4]  to-[#00ABC5]">
            <div className="w-full h-auto">
                <div className="pt-13.25 pb-12.25 text-center lg:pt-18.5 lg:pb-11.75">
                    <h5 className="font-normal text-5 leading-6 text-white lg:text-6 lg:leading-7.25">Welcome to</h5>
                    <h3 className="font-bold pt-2.5 text-8 leading-9.75 text-white lg:text-10.5 lg:leading-12.75 lg:pt-3">{merchant?.businessName || "BOOKING APPOINTMENT FORM"}</h3>
                    {merchant && (
                        <div className="pt-0.5 flex gap-1.25 items-start justify-center px-2">
                            <p className="text-sm leading-4.5 font-normal text-white flex items-start">
                                <img src={LocationIcon} className="mt-0.5"/>
                                {merchant.addressFull}
                            </p>
                        </div>
                    )}
                    <p className="font-norma pt-3.75 text-3.25 leading-4 text-white lg:text-4 lg:leading-4.75 lg:pt-1.5">Book your appointment with a few simple steps!</p>
                </div>
            </div>
            <div className="w-full h-full flex flex-col items-center relative">
                <div className="absolute w-full h-full bg-white rounded-t-[30px] max-w-4xl lg:h-[510px] lg:shadow-card lg:rounded-b-[30px]">
                    <form onSubmit={handleSubmit}>
                        <div className="px-5 py-10 text-center flex  flex-col items-center">
                            <h5 className="font-semibold text-5.5 leading-6.75 text-black-primary">Enter your phone number</h5>
                            <p className="mt-3.25 font-normal text-3.75 leading-5.25 text-black-secondary" id="nameMerchant">
                                {merchant?.businessName || "Nailsoft"} - New will send an SMS to verify your phone number.
                            </p>
                            <p className="mt-2.25 font-semibold text-base leading-4.75 text-black">What's your number?</p>
                            <div className="mt-3.75 max-w-sm w-full">
                                <div className="flex items-center border border-blue-secondary rounded-md px-3 py-2">
                                    <Select
                                        className="flex-shrink-0"
                                        onChange={(value: CODE_PHONES) => {
                                            handleChangeCodePhone(value);
                                        }}
                                        style={{ marginLeft: -10 }}
                                        bordered={false}
                                        defaultValue={codePhone}
                                    >
                                        {PHONE_OPTIONS.map((item) => {
                                            return (
                                                <Select.Option key={item.id} value={item.value}>
                                                    <div className="flex items-center h-full space-x-1.25">
                                                        {item.flag}
                                                        <span className="text-3.75 leading-4.5 font-normal text-black-secondary">+{item.codePhone}</span>
                                                    </div>
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                    <div className="flex justify-between items-center">
                                        <InputMask mask="999-999-9999" maskChar={null} value={phoneNumber} onChange={handleChangePhone}>
                                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                            {/* @ts-ignore */}
                                            {(inputProps) => <input {...inputProps} className="outline-none w-full" id="btn-login" />}
                                        </InputMask>
                                        <div>
                                            <CloseIcon
                                                onClick={handleClearPhone}
                                                className={classNames({
                                                    hidden: !phoneNumber,
                                                    block: phoneNumber,
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="max-w-sm w-full mt-7.5">
                                <Button
                                    type="submit"
                                    disabled={!isPhoneValid || loading}
                                    loading={loading}
                                    className={classNames({
                                        "opacity-50": !isPhoneValid,
                                        "opacity-100": isPhoneValid,
                                    })}
                                    variant={"contained"}
                                >
                                    <span className="font-bold text-base leading-4.75 text-white btn-login">Continue</span>
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="flex-[1] bg-white w-full h-full bg-gradient-to-r from-[#5E8AB4]  to-[#00ABC5]" />
                <div className="flex-[2] bg-white w-full h-full" />
            </div>
        </div>
    );
};

export default Login;

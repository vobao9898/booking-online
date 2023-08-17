import Button from "@components/Button";
import useAppSelector from "@hooks/useAppSelector";
import { useState, useMemo, useEffect } from "react";
import { ReactComponent as BackIcon } from "@assets/images/black-back-icon.svg";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { showToastError } from "@utils/index";
import ThreeDotsLoading from "@components/ThreeDotsLoading/ThreeDotsLoading";
import AuthService from "@services/AuthService";

const OTP_LENGTH = 4;
const RE_DIGIT = new RegExp(/^\d+$/);

const Verify = () => {
    const merchant = useAppSelector((state) => state.merchant.merchant);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const merchantId = searchParams.get("merchant_id");
    const token = searchParams.get("token");

    const { state } = useLocation();

    const [otp, setOtp] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [verifyId, setVerifyId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const valueItems = useMemo(() => {
        const valueArray = otp.split("");
        const items: Array<string> = [];

        for (let i = 0; i < OTP_LENGTH; i++) {
            const char = valueArray[i];

            if (RE_DIGIT.test(char)) {
                items.push(char);
            } else {
                items.push("");
            }
        }

        return items;
    }, [otp]);

    useEffect(() => {
        if (state) {
            setPhone(state.phone);
            setVerifyId(state.verifyId);
        } else {
            navigate(`/login/?merchant_id=${merchantId}&token=${token}`);
        }
    }, [merchantId, navigate, state, token]);

    const onChange = (value: string) => {
        setOtp(value);
    };

    const focusToNextInput = (target: HTMLElement) => {
        const nextElementSibling = target.nextElementSibling as HTMLInputElement | null;
        if (nextElementSibling) {
            nextElementSibling.focus();
        }
    };

    const focusToPrevInput = (target: HTMLElement) => {
        const previousElementSibling = target.previousElementSibling as HTMLInputElement | null;
        if (previousElementSibling) {
            previousElementSibling.focus();
        }
    };

    const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const target = e.target;
        let targetValue = target.value.trim();
        const isTargetValueDigit = RE_DIGIT.test(targetValue);

        if (!isTargetValueDigit && targetValue !== "") {
            return;
        }

        const nextInputEl = target.nextElementSibling as HTMLInputElement | null;

        if (!isTargetValueDigit && nextInputEl && nextInputEl.value !== "") {
            return;
        }

        targetValue = isTargetValueDigit ? targetValue : " ";

        const targetValueLength = targetValue.length;

        if (targetValueLength === 1) {
            const newValue = otp.substring(0, idx) + targetValue + otp.substring(idx + 1);

            onChange(newValue);

            if (!isTargetValueDigit) {
                return;
            }

            focusToNextInput(target);
        } else if (targetValueLength === OTP_LENGTH) {
            onChange(targetValue);

            target.blur();
        }
    };
    const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { key } = e;
        const target = e.target as HTMLInputElement;

        if (key === "ArrowRight" || key === "ArrowDown") {
            e.preventDefault();
            return focusToNextInput(target);
        }

        if (key === "ArrowLeft" || key === "ArrowUp") {
            e.preventDefault();
            return focusToPrevInput(target);
        }

        const targetValue = target.value;

        target.setSelectionRange(0, targetValue.length);

        if (e.key !== "Backspace" || targetValue !== "") {
            return;
        }

        focusToPrevInput(target);
    };

    const inputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const { target } = e;

        const prevInputEl = target.previousElementSibling as HTMLInputElement | null;

        if (prevInputEl && prevInputEl.value === "") {
            return prevInputEl.focus();
        }

        target.setSelectionRange(0, target.value.length);
    };

    const handleResendCode = async () => {
        setLoading(true);
        const data: any = await AuthService.sendOTP(phone);
        setVerifyId(data.verifyId);
        setLoading(false);
    };

    const handleSubmit = async () => {
        try {
            const data: any = await AuthService.verifyOTP(verifyId, otp);
            if (data) {
                navigate(`/signup?merchant_id=${merchantId}&token=${token}`, { state: { isSignin: data, phone } });
            }
        } catch (error: any) {
            showToastError(error);
        }
    };

    return (
        <div className="w-full h-[100svh] flex flex-col bg-gradient-to-r from-[#5E8AB4]  to-[#00ABC5]">
            <div className="w-full h-auto">
                <div className="pt-13.25 pb-12.25 text-center lg:pt-18.5 lg:pb-11.75">
                    <h5 className="font-normal text-5 leading-6 text-white lg:text-6 lg:leading-7.25">Welcome to</h5>
                    <h3 className="font-bold pt-2.5 text-8 leading-9.75 text-white lg:text-10.5 lg:leading-12.75 lg:pt-3">{merchant?.businessName || "BOOKING APPOINTMENT FORM"}</h3>
                    <p className="font-norma pt-3.75 text-3.25 leading-4 text-white lg:text-4 lg:leading-4.75 lg:pt-1.5">Book your appointment with a few simple steps!</p>
                </div>
            </div>
            <div className="w-full h-full flex flex-col items-center relative">
                <div className="absolute w-full h-full bg-white rounded-t-[30px] max-w-4xl lg:h-[510px] lg:shadow-card lg:rounded-b-[30px]">
                    <div className="px-5 py-10 text-center flex  flex-col items-center">
                        <h5 className="font-semibold text-6.5 leading-6.75 text-black-primary uppercase">just one more step,</h5>
                        <h5 className="font-semibold text-6.5 leading-6.75 text-black-primary uppercase">let verify your phone number</h5>
                        <p className="mt-3.25 font-normal text-3.75 leading-5.25 text-black-secondary">Enter verification code that has been sent on your mobile</p>
                        <div className="pt-5 w-full max-w-full flex justify-center gap-x-4">
                            {valueItems.map((digit, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    pattern="\d{1}"
                                    maxLength={OTP_LENGTH}
                                    className="border w-13.75 h-10 text-center outline-none text-6 font-bold leading-1 rounded input-code"
                                    value={digit}
                                    onChange={(e) => inputOnChange(e, idx)}
                                    onKeyDown={inputOnKeyDown}
                                    onFocus={inputOnFocus}
                                />
                            ))}
                        </div>
                        {loading ? (
                            <ThreeDotsLoading />
                        ) : (
                            <p className="pt-4 text-4.5 font-medium text-text-primary cursor-pointer verify-code" onClick={handleResendCode}>
                                Resend code
                            </p>
                        )}
                        <div className="max-w-sm w-full pt-5">
                            <Button variant={"contained"} onClick={handleSubmit}>
                                <span className="font-bold text-base leading-4.75 text-white">Continue</span>
                            </Button>
                        </div>
                        <div className="pt-5 cursor-pointer flex items-center gap-x-1.25">
                            <BackIcon />
                            <div className="back" onClick={() => navigate(`/login/?merchant_id=${merchantId}&token=${token}`)}>
                                Another phone number?
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-[1] bg-white w-full h-full bg-gradient-to-r from-[#5E8AB4]  to-[#00ABC5]" />
                <div className="flex-[2] bg-white w-full h-full" />
            </div>
        </div>
    );
};

export default Verify;

import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { saveCustomer } from "@actions/customer";
import useAppDispatch from "@hooks/useAppDispatch";
import AuthService from "@services/AuthService";
import Button from "@components/Button";
import useAppSelector from "@hooks/useAppSelector";
import classNames from "classnames";
import ICustomer from "@interfaces/ICustomer";
import LocationIcon from "@assets/images/locationWhite.svg";

type FormInputs = {
    firstName: string;
    lastName: string;
};

const schema = yup.object({
    firstName: yup.string().required("First name is required").max(15, "First name must be no longer than 15 characters"),
    lastName: yup.string().required("Last name is required").max(20, "Last name must be no longer than 20 characters"),
});

const SignUp = () => {
    const merchant = useAppSelector((state) => state.merchant.merchant);
    const { state } = useLocation();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const merchantId = searchParams.get("merchant_id");
    const token = searchParams.get("token");

    const [phone, setPhone] = useState<string>("");
    const [isSignin, setIsSignin] = useState<number>(0);

    const dispatch = useAppDispatch();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: "",
            lastName: "",
        },
    });

    useEffect(() => {
        if (state) {
            setPhone(state.phone);
            setIsSignin(state.isSignin);
        } else {
            navigate(`/login/?merchant_id=${merchantId}&token=${token}`);
        }
    }, [merchantId, navigate, state, token]);

    const onSubmit = async () => {
        const data: ICustomer = await AuthService.postCustomer(isSignin, control._formValues.firstName, control._formValues.lastName, phone);
        if (data) {
            dispatch(saveCustomer(data));
            navigate(`/home/?merchant_id=${merchantId}&token=${token}`);
        } else {
            navigate(`/login/?merchant_id=${merchantId}&token=${token}`);
        }
    };

    return (
        <div className="w-full h-[100svh] flex flex-col bg-gradient-to-r from-[#5E8AB4]  to-[#00ABC5]">
            <div className="w-full h-auto">
                <div className="pt-13.25 pb-12.25 text-center lg:pt-18.5 lg:pb-11.75">
                    <h5 className="font-normal text-5 leading-6 text-white lg:text-6 lg:leading-7.25">Welcome to</h5>
                    <h3 className="font-bold pt-2.5 text-8 leading-9.75 text-white lg:text-10.5 lg:leading-12.75 lg:pt-3">{merchant?.businessName || "BOOKING APPOINTMENT FORM"}</h3>
                    {merchant && (
                        <div className="pt-0.5 flex gap-1.25 items-start justify-center px-2">
                            <p className="text-sm leading-4.5 font-normal text-white flex items-start">
                                <img src={LocationIcon} className="mt-0.5" />
                                {merchant.addressFull}
                            </p>
                        </div>
                    )}
                    <p className="font-norma pt-3.75 text-3.25 leading-4 text-white lg:text-4 lg:leading-4.75 lg:pt-1.5">Book your appointment with a few simple steps!</p>
                </div>
            </div>
            <div className="w-full h-full flex flex-col items-center relative">
                <div className="absolute w-full h-full bg-white rounded-t-[30px] max-w-4xl lg:h-[510px] lg:shadow-card lg:rounded-b-[30px]">
                    <div className="px-5 py-10 text-center flex flex-col items-center lg:justify-center lg:h-full">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <h5 className="font-semibold text-5.5 leading-6.75 text-black-primary lg:text-6.5 lg:leading-7.75">Please give us your informations</h5>
                            <div className="mt-3.75 max-w-sm w-full lg:max-w-lg lg:items-center">
                                <div className="grid gap-6 mb-6 lg:grid-cols-1">
                                    <div>
                                        <label className="text-start block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">First name</label>
                                        <Controller
                                            name="firstName"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    className={classNames(
                                                        "outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5",
                                                        {
                                                            "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500": errors.firstName?.message,
                                                        }
                                                    )}
                                                    placeholder="Enter first name"
                                                    value={field.value}
                                                />
                                            )}
                                        />
                                        {errors.firstName?.message ? (
                                            <p className="text-start mt-0.5 text-sm text-red-600 dark:text-red-500">{errors.firstName?.message ? errors.firstName.message : ""}</p>
                                        ) : null}
                                    </div>
                                    <div>
                                        <label className="text-start block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
                                        <Controller
                                            name="lastName"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    className={classNames(
                                                        "outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5",
                                                        {
                                                            "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500": errors.firstName?.message,
                                                        }
                                                    )}
                                                    placeholder="Enter first name"
                                                    value={field.value}
                                                />
                                            )}
                                        />
                                        {errors.lastName?.message ? (
                                            <p className="text-start mt-0.5 text-sm text-red-600 dark:text-red-500">{errors.lastName?.message ? errors.lastName.message : ""}</p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="w-full pt-4">
                                <Button loading={isSubmitting} disabled={isSubmitting} type="submit" variant={"contained"}>
                                    <span className="font-bold text-base leading-4.75 text-white">Continue</span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="flex-[1] bg-white w-full h-full bg-gradient-to-r from-[#5E8AB4]  to-[#00ABC5]" />
                <div className="flex-[2] bg-white w-full h-full" />
            </div>
        </div>
    );
};

export default SignUp;

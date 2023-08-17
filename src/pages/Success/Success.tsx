import useAppSelector from "@hooks/useAppSelector";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ReactComponent as SuccessIcon } from "@assets/images/success-icon.svg";
import { ReactComponent as LocationIcon } from "@assets/images/location.svg";

const Success = () => {
    const merchant = useAppSelector((state) => state.merchant.merchant);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const merchantId = searchParams.get("merchant_id");
    const token = searchParams.get("token");

    return (
        <div className="w-full h-screen flex flex-col bg-gradient-to-r from-[#5E8AB4]  to-[#00ABC5]">
            <div className="w-full h-auto">
                <div className="pt-13.25 pb-12.25 text-center lg:pt-18.5 lg:pb-11.75">
                    <h5 className="font-normal text-5 leading-6 text-white lg:text-6 lg:leading-7.25">Welcome to</h5>
                    <h3 className="font-bold pt-2.5 text-8 leading-9.75 text-white lg:text-10.5 lg:leading-12.75 lg:pt-3">{merchant?.businessName || "BOOKING APPOINTMENT FORM"}</h3>
                    <p className="font-norma pt-3.75 text-3.25 leading-4 text-white lg:text-4 lg:leading-4.75 lg:pt-1.5">Book your appointment with a few simple steps!</p>
                </div>
            </div>
            <div className="w-full h-full flex flex-col items-center relative">
                <div className="absolute w-full h-full bg-white rounded-t-[30px] max-w-4xl lg:h-[510px] lg:shadow-card lg:rounded-b-[30px]">
                    <div className="relative h-full px-5 py-10 text-center flex flex-col items-center">
                        <div>
                            <SuccessIcon />
                        </div>
                        <p className="pt-7 font-bold text-5.5 leading-6.75 text-black-primary">Booking Successful.</p>
                        <p className="pt-2.25 font-normal text-3.75 leading-5.25 text-black-secondary">Your booking was successful, look forward to seeing you!</p>
                        <div className="hidden pt-2.75 gap-x-3 items-center lg:flex">
                            <div className="flex-shrink-0 flex justify-center items-center w-14 h-14 rounded-lg bg-gray-dark">
                                <p className="text-white text-6.25 font-bold">S</p>
                            </div>
                            <div className="flex flex-col items-start">
                                <p className="text-black-primary font-semibold text-sm leading-4.5">{merchant?.businessName || ""}</p>
                                <div className="pt-0.5 flex gap-1.25 items-start">
                                    <div className="mt-0.5">
                                        <LocationIcon />
                                    </div>
                                    <p className="text-sm leading-4.5 font-normal text-black-secondary">{merchant?.addressFull || ""}</p>
                                </div>
                            </div>
                        </div>
                        <div className="pt-9.5 flex justify-center gap-x-2.5 w-full max-w-[432px] lg:gap-x-6">
                            <button
                                onClick={() => {
                                    navigate(`/histories/?merchant_id=${merchantId}&token=${token}`);
                                }}
                                className={"leading-none py-4 px-6 border border-blue-secondary w-full rounded-md"}
                            >
                                <span className="font-bold text-base leading-4.75 text-blue-secondary">My Booked</span>
                            </button>
                            <button
                                onClick={() => {
                                    navigate(`/home/?merchant_id=${merchantId}&token=${token}`);
                                }}
                                className={"leading-none py-4 px-6 bg-blue-secondary w-full rounded-md"}
                            >
                                <span className="font-bold text-base leading-4.75 text-white">Confirm</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex-[1] bg-white w-full h-full bg-gradient-to-r from-[#5E8AB4]  to-[#00ABC5]" />
                <div className="flex-[2] bg-white w-full h-full" />
            </div>
        </div>
    );
};

export default Success;

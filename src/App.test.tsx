import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import App from "./pages/Login/index";
import WelcomeBack from "@pages/WelcomeBack";
import Verify from "@pages/Verify";
import Histories from "@pages/Histories";
import Home from "@pages/Home";
import MerchantService from "@services/MerchantService";
import { vi, expect, test, beforeEach, describe } from "vitest";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router-dom";
import AuthService from "@services/AuthService";
import AppointmentService from "@services/AppointmentService";
import "@testing-library/jest-dom";

describe("Login", () => {
    beforeEach(() => {
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: vi.fn().mockImplementation((query) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(), // Deprecated
                removeListener: vi.fn(), // Deprecated
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });

        const resMerchant = {
            merchantId: 258,
            isApproved: 1,
            status: 0,
            businessName: "Jenny Beauty & Spa demo",
            email: "nhu.nguyen@risewithaurora.com",
            taxId: "2222",
            driverLicense: "621589",
            address: "7162 Edinger Ave&",
            city: "Anchorageaaaaaaagola&",
            password: null,
            phone: "+1 564 565-6456",
            cellPhone: "+1 234 234-2342",
            zip: "700000",
            isDisabled: 0,
            isRejected: 0,
            addressFull: "7162 Edinger Ave& Anchorageaaaaaaagola& Ho Chi Minh City",
            adminUser: null,
            distance: 0,
            rating: 0,
            ratingCount: 0,
            googleReview: null,
            expiredDate: "2025-12-23T00:00:00",
            bookingLink:
                "https://booking.nailsoft.com/?merchant_id=258&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjaGFudElkIjoiMjU4IiwiZGlnaXRhbFR5cGUiOiJib29raW5nX3BsdWdpbiIsInJvbGUiOiJEaWdpdGFsV2Vic2l0ZSIsIm5iZiI6MTY3OTM5NDU3MCwiZXhwIjoxOTk1MDEzNzcwLCJpYXQiOjE2NzkzOTQ1NzAsImlzcyI6Imh0dHBzOi8vc3RhZ2luZy5oYXJtb255cGF5bWVudC5jb20vYXBpLyIsImF1ZCI6IkhQX0FQSV9DbGllbnQifQ.1noxhNutTBh16ph2EAaThLV4Sla_rObHpzjBbba9TZ8",
            isAutoConfirmAppointment: false,
            isAutoCheckin: false,
            wareHouseBusinessName: null,
            extraConfigurationValue: {
                AmountEachDiscount: "0.00",
                DiscountValue: "0.00",
                DiscountExpired: 0,
            },
        };
        const mockSMerchant: any = vi.spyOn(MerchantService, "getById");
        mockSMerchant.mockResolvedValue(resMerchant);

        const resHistory = {
            codeStatus: 1,
            data: [
                {
                    appointmentId: 754565,
                    merchantId: 258,
                    userId: 0,
                    customerId: 256692,
                    tipPercent: "0.00",
                    createdDate: "2023-06-30T01:54:37.013675",
                    total: "70.00",
                    staffId: 0,
                    duration: 70,
                    fromTime: "2023-06-30T12:30:00",
                    toTime: "2023-06-30T13:40:00",
                    status: "cancel",
                    previousStatus: null,
                    isTax: 1,
                    tipAmount: "0.00",
                    discount: "0.00",
                    tax: "0.00",
                    giftCard: "0.00",
                    subTotal: "70.00",
                    isSignIn: 1,
                    customDiscountPercent: "0.00",
                    customDiscountFixed: "0.00",
                    code: "9876013580",
                    checkoutGroupId: 0,
                    bookingGroupId: "638236868770136902",
                    isMainBookingGroup: 1,
                    companionName: null,
                    companionPhone: null,
                    discountByOwner: "100.00",
                    isBookingPlugin: 1,
                    purchasePoint: "WebApp",
                    shippingAddressId: 0,
                    billingAddressId: 0,
                    didNotPay: false,
                    shippingFee: "0.00",
                    fee: "0.00",
                    depositAmount: "7.00",
                    appointmentDepositStatus: "NotPay",
                    payByStar: "0.00",
                    rewardStarRate: "0.00",
                    firstName: "Bao",
                    lastName: "Vo",
                    phoneNumber: "+84988-459-742",
                    totalRewardStar: 0,
                    isMain: 0,
                    waitingTime: 0,
                    categories: null,
                    services: [
                        {
                            bookingServiceId: 1049405,
                            appointmentId: 754565,
                            serviceId: 1350,
                            categoryId: 199,
                            duration: 40,
                            serviceName: "gel gel",
                            price: "15.00",
                            status: 1,
                            totalDiscount: "0.00",
                            tax: "0.00",
                            taxRate: "0.00",
                            staff: null,
                            tipAmount: "0.00",
                            tipAll: "0.00",
                            note: "",
                            staffId: 0,
                            fromTime: "2023-06-30T12:30:00",
                            isWarning: false,
                            fee: "0.00",
                            redeemStar: "0.00",
                            toTime: "0001-01-01T00:00:00",
                            description: "",
                            data: null,
                            imageUrl: "https://media.harmonypayment.com/1637291850673423724_be776646-8c81-4fd0-bf8f-17a6d640062a.JPG",
                            discounts: null,
                        },
                        {
                            bookingServiceId: 1049406,
                            appointmentId: 754565,
                            serviceId: 5378,
                            categoryId: 199,
                            duration: 15,
                            serviceName: "van van",
                            price: "50.00",
                            status: 1,
                            totalDiscount: "0.00",
                            tax: "0.00",
                            taxRate: "0.00",
                            staff: null,
                            tipAmount: "0.00",
                            tipAll: "0.00",
                            note: "",
                            staffId: 0,
                            fromTime: "2023-06-30T13:25:00",
                            isWarning: false,
                            fee: "0.00",
                            redeemStar: "0.00",
                            toTime: "0001-01-01T00:00:00",
                            description: "",
                            data: null,
                            imageUrl: "",
                            discounts: null,
                        },
                    ],
                    products: [],
                    extras: [
                        {
                            bookingExtraId: 49119,
                            appointmentId: 754565,
                            extraId: 460,
                            extraName: "gel",
                            price: "5.00",
                            duration: 15,
                            status: 1,
                            tax: "0.00",
                            taxRate: "0.00",
                            totalDiscount: "0.00",
                            redeemStar: "0.00",
                            bookingServiceId: 1049405,
                            fee: "0.00",
                            description: "",
                            data: null,
                            imageUrl: "https://media.harmonypayment.com/1637291851508923273_c8a583cd-5a65-431d-afce-8bdfaae93bf4.JPG",
                            byMainService: false,
                            discounts: null,
                        },
                    ],
                    giftCards: [],
                    notes: null,
                    apppointmentHistory: [],
                    promotionNotes: null,
                    reaction: null,
                    customerNote: null,
                    staff: null,
                    merchant: null,
                    paymentMethod: null,
                    paymentTransactionId: 0,
                    isVip: 0,
                    responses: null,
                    checkoutId: 0,
                    blockTimes: null,
                },
                {
                    appointmentId: 754457,
                    merchantId: 258,
                    userId: 0,
                    customerId: 256692,
                    tipPercent: "0.00",
                    createdDate: "2023-06-29T06:47:10.448229",
                    total: "43.00",
                    staffId: 2977,
                    duration: 52,
                    fromTime: "2023-06-29T12:45:00",
                    toTime: "2023-06-29T13:55:00",
                    status: "no show",
                    previousStatus: null,
                    isTax: 1,
                    tipAmount: "0.00",
                    discount: "0.00",
                    tax: "0.00",
                    giftCard: "0.00",
                    subTotal: "43.00",
                    isSignIn: 1,
                    customDiscountPercent: "0.00",
                    customDiscountFixed: "0.00",
                    code: "9876013547",
                    checkoutGroupId: 0,
                    bookingGroupId: "0",
                    isMainBookingGroup: 0,
                    companionName: null,
                    companionPhone: null,
                    discountByOwner: "100.00",
                    isBookingPlugin: 1,
                    purchasePoint: "WebApp",
                    shippingAddressId: 0,
                    billingAddressId: 0,
                    didNotPay: false,
                    shippingFee: "0.00",
                    fee: "0.00",
                    depositAmount: "0.00",
                    appointmentDepositStatus: "Default",
                    payByStar: "0.00",
                    rewardStarRate: "0.00",
                    firstName: "Bao",
                    lastName: "Vo",
                    phoneNumber: "+84988-459-742",
                    totalRewardStar: 0,
                    isMain: 0,
                    waitingTime: 0,
                    categories: null,
                    services: [
                        {
                            bookingServiceId: 1049271,
                            appointmentId: 754457,
                            serviceId: 11509,
                            categoryId: 3737,
                            duration: 40,
                            serviceName: "Nail KN 12",
                            price: "11.00",
                            status: 1,
                            totalDiscount: "0.00",
                            tax: "0.00",
                            taxRate: "0.00",
                            staff: null,
                            tipAmount: "0.00",
                            tipAll: "0.00",
                            note: "",
                            staffId: 2977,
                            fromTime: "2023-06-29T12:45:00",
                            isWarning: false,
                            fee: "0.00",
                            redeemStar: "0.00",
                            toTime: "0001-01-01T00:00:00",
                            description: "Nail KN 1",
                            data: null,
                            imageUrl: "https://storage.harmonypayment.com/1638182542490103360_047af053-05f8-45fa-af20-194cfce8800c.jpeg",
                            discounts: null,
                        },
                        {
                            bookingServiceId: 1049272,
                            appointmentId: 754457,
                            serviceId: 9512,
                            categoryId: 123,
                            duration: 2,
                            serviceName: "Test",
                            price: "10.00",
                            status: 1,
                            totalDiscount: "0.00",
                            tax: "0.00",
                            taxRate: "0.00",
                            staff: null,
                            tipAmount: "0.00",
                            tipAll: "0.00",
                            note: "",
                            staffId: 2978,
                            fromTime: "2023-06-29T13:35:00",
                            isWarning: false,
                            fee: "0.00",
                            redeemStar: "0.00",
                            toTime: "0001-01-01T00:00:00",
                            description: "1",
                            data: null,
                            imageUrl: "",
                            discounts: null,
                        },
                    ],
                    products: [],
                    extras: [
                        {
                            bookingExtraId: 49090,
                            appointmentId: 754457,
                            extraId: 3234,
                            extraName: "Extra test",
                            price: "11.00",
                            duration: 5,
                            status: 1,
                            tax: "0.00",
                            taxRate: "0.00",
                            totalDiscount: "0.00",
                            redeemStar: "0.00",
                            bookingServiceId: 1049271,
                            fee: "0.00",
                            description: "Test",
                            data: null,
                            imageUrl: "https://storage.harmonypayment.com/1638182542618359746_627dd285-d31b-4a27-a193-84e354a08912.jpeg",
                            byMainService: false,
                            discounts: null,
                        },
                        {
                            bookingExtraId: 49091,
                            appointmentId: 754457,
                            extraId: 3321,
                            extraName: "Extra test5",
                            price: "11.00",
                            duration: 5,
                            status: 1,
                            tax: "0.00",
                            taxRate: "0.00",
                            totalDiscount: "0.00",
                            redeemStar: "0.00",
                            bookingServiceId: 1049271,
                            fee: "0.00",
                            description: "Test",
                            data: null,
                            imageUrl: "https://storage.harmonypayment.com/1638182542618359746_627dd285-d31b-4a27-a193-84e354a08912.jpeg",
                            byMainService: false,
                            discounts: null,
                        },
                    ],
                    giftCards: [],
                    notes: null,
                    apppointmentHistory: [],
                    promotionNotes: null,
                    reaction: null,
                    customerNote: null,
                    staff: null,
                    merchant: null,
                    paymentMethod: null,
                    paymentTransactionId: 0,
                    isVip: 0,
                    responses: null,
                    checkoutId: 0,
                    blockTimes: null,
                },
            ],
            message: "Success.",
            codeNumber: 200,
            pages: 4,
            count: 40,
            summary: null,
        };
        const mockGetAppoitment: any = vi.spyOn(AppointmentService, "getHistoriesByCustomer");
        mockGetAppoitment.mockResolvedValue(resHistory);

        const resCustomer = {
            customerId: 256692,
            merchantId: 258,
            userId: 0,
            createdDate: "2023-02-10T03:46:25.906701",
            isDisabled: 0,
            isDeleted: 0,
            firstName: "Bao",
            lastName: "Vo",
            phone: "+84988-459-742",
            email: "",
            address: null,
            city: null,
            stateId: 0,
            street: null,
            referrerPhone: "",
            referrerBy: null,
            zip: null,
            favourite: null,
            note: null,
            isSignIn: 1,
            isVip: 0,
            isgetGiftCardFree: 0,
            birthdate: null,
            gender: null,
            totalRewardStar: 4256,
            defaultBillingAddress: null,
            defaultShippingAddress: null,
            rigisterPoint: null,
            imageUrl: null,
        };
        const mockGetCustomer: any = vi.spyOn(AuthService, "getCustomer");
        mockGetCustomer.mockResolvedValue(resCustomer);

        
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <App />
                    <WelcomeBack />
                    <Histories />
                    <Verify />
                    <Home />
                </BrowserRouter>
            </Provider>
        );
    });

    test("Login", async () => {
        // const h1Element1 = screen.getByText(/Welcome to/i);
        // expect(h1Element1.innerHTML).toBe("Welcome to");
        const submitBtn = document.querySelector<HTMLButtonElement>(".btn-login");
        const input = document.querySelector<HTMLInputElement>("#btn-login");
        if (input) {
            fireEvent.change(input, { target: { value: "0988459742" } });
        }
        await waitFor(() => {
            if (submitBtn) fireEvent.click(submitBtn);
        });
    });

    // test("Welcome", () => {
    //     const h1Element1 = document.querySelector<HTMLElement>(".displayName");
    //     if(h1Element1) expect(h1Element1.innerHTML).toBe("Welcome back Bao Vo!");
    // });

    test("My Booked", async () => {
        const h1Element1 = screen.getByText(/My Booked/i);
        expect(h1Element1.innerHTML).toBe("My Booked");
        const list = document.querySelectorAll(".history-status");
        expect(list[0].innerHTML).toBe("Cancel");
    });

    test("Login Fail", async () => {
        const resCustomer = null;
        const mockGetCustomer: any = vi.spyOn(AuthService, "getCustomer");
        mockGetCustomer.mockResolvedValue(resCustomer);
        const submitBtn = document.querySelector<HTMLButtonElement>(".btn-login");
        const input = document.querySelector<HTMLInputElement>("#btn-login");
        if (input) {
            fireEvent.change(input, { target: { value: "1232222222" } });
        }
        await waitFor(() => {
            if (submitBtn) fireEvent.click(submitBtn);
        });
    });

    test("Verify", async () => {
        const h1Element1 = document.querySelector<HTMLElement>(".verify-code");
        expect(h1Element1?.innerHTML).toBe("Resend code");
        const input = document.querySelectorAll<HTMLInputElement>(".input-code");
        if (input) {
            fireEvent.change(input[0], { target: { value: "1" } });
            fireEvent.change(input[1], { target: { value: "2" } });
            fireEvent.change(input[2], { target: { value: "3" } });
            fireEvent.change(input[3], { target: { value: "4" } });
        }
    });
});

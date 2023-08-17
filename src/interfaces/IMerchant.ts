interface IMerchant {
    address: string;
    addressFull: string;
    merchantId: string;
    businessName: string;
    type: string;
    isWareHouse: boolean;
    depositFixedAmount: string;
    depositPercent: string;
}

export default IMerchant;

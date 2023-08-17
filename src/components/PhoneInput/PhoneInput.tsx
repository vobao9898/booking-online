import React, { FC } from "react";
import InputMask from "react-input-mask";

interface IProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const PhoneInput: FC<IProps> = ({ value, onChange, onBlur }) => {
    return (
        <InputMask mask="999-999-9999" maskChar={null} value={value} onChange={onChange} onBlur={onBlur} maxLength={12}>
            <input className="border-none outline-0" placeholder={""} inputMode="decimal" type="text" />
        </InputMask>
    );
};

export default PhoneInput;

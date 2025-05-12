import { FormItem, Input } from "@vkontakte/vkui";
import { ChangeEvent, useState } from "react";

type NumericInputProps = {
    title: string;
    placeholder: string;
    id: string;
    maxLength?: number;
    value: string;
    onChange: (value: string) => void;
};

const NumericInput: React.FC<NumericInputProps> = ({ 
    title, 
    placeholder, 
    id,
    maxLength,
    value,
    onChange
}) => {
    const [error, setError] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        
        if (/^\d*$/.test(inputValue)) {
            if (maxLength && inputValue.length > maxLength) {
                setError(`Максимум ${maxLength} цифр`);
            } else {
                setError("");
                onChange(inputValue);
            }
        } else {
            setError("Можно вводить только цифры");
        }
    };

    return (
        <FormItem 
            top={title} 
            htmlFor={id}
            status={error ? "error" : "default"}
            bottom={error}
        >
            <Input
                id={id}
                type="text"
                inputMode="numeric"
                pattern="[1-4]*"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                maxLength={maxLength}
            />
        </FormItem>
    );
};
export default NumericInput;
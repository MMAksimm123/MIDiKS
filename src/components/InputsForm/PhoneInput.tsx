import { Input, FormItem } from '@vkontakte/vkui';
import { useState } from 'react';

type PhoneInputProps = {
    value: string;
    onChange: (value: string) => void;
};

const formatPhone = (value: string): string => {
    if (!value) return value;
    
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    
    if (!match) return value;
    
    let formatted = '';
    if (match[1]) formatted += `+7`;
    if (match[2]) formatted += ` (${match[2]}`;
    if (match[3]) formatted += `) ${match[3]}`;
    if (match[4]) formatted += `-${match[4]}`;
    if (match[5]) formatted += `-${match[5]}`;
    
    return formatted;
};

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange }) => {
    const [error, setError] = useState('');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setError('');
        onChange(inputValue);
    };

    return (
        <FormItem top="Номер телефона" status={error ? 'error' : 'default'} bottom={error}>
            <Input
                type="tel"
                value={formatPhone(value)}
                onChange={handlePhoneChange}
                placeholder="+7 (XXX) XXX-XX-XX"
            />
        </FormItem>
    );
};
export default PhoneInput;
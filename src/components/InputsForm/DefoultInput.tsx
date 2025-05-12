import { FormItem, Input } from "@vkontakte/vkui";

type InputProps = {
    title: string;
    placeholder: string;
    id: string;
    value: string;
    type: string;
    onChange: (value: string) => void;
}

const DefaultInput: React.FC<InputProps> = ({title, placeholder, id, value, type, onChange}) => {
    return (
        <FormItem top={title} htmlFor={id}>
            <Input 
                id={id} 
                type={type} 
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </FormItem>
    );
}
export default DefaultInput;
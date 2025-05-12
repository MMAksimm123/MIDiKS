import { FormItem, Textarea } from "@vkontakte/vkui";

type InputProps = {
    title: string;
    placeholder: string;
    id: string;
    value: string;
    onChange: (value: string) => void; 
}

const MultilineInput:React.FC<InputProps> = ({title, placeholder, id, value, onChange}) => {
    return (
        <FormItem top={title} htmlFor={id}>
            <Textarea
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </FormItem>
    );
}

export default MultilineInput;
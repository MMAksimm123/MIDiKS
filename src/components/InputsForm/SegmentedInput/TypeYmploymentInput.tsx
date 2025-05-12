import { FormItem, SegmentedControl } from "@vkontakte/vkui";

type SelectedInputProps = {
    value: string;
    onChange: (value: string) => void;
};

const TypeYmploymentInput: React.FC<SelectedInputProps> = ({value, onChange}) => {
    return (
        <FormItem top="Опыт работы">
            <SegmentedControl
                options={[
                    {label: 'Сезон', value: 'Сезон'},
                    {label: 'Практика', value: 'Практика'},
                    {label: 'Стажировка', value: 'Стажировка'},
                ]}
                value={value}
                onChange={(value) => {
                    if (typeof value === 'string') {
                        onChange(value);
                    }
                }}
            />
        </FormItem>
    );
};

export default TypeYmploymentInput;
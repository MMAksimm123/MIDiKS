import { FormItem, SegmentedControl } from "@vkontakte/vkui";

type SelectedInputProps = {
    value: string;
    onChange: (value: string) => void;
};

const WorkFormatInput: React.FC<SelectedInputProps> = ({value, onChange}) => {
    return (
        <FormItem top="Опыт работы">
            <SegmentedControl
                options={[
                    {label: 'Удаленно', value: 'Удаленно'},
                    {label: 'На месте работодателя', value: 'На месте работодателя'},
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

export default WorkFormatInput;
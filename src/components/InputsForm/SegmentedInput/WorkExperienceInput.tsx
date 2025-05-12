import { FormItem, SegmentedControl } from "@vkontakte/vkui";

type SelectedInputProps = {
    value: string;
    onChange: (value: string) => void;
};

const WorkExperienceInput: React.FC<SelectedInputProps> = ({value, onChange}) => {
    return (
        <FormItem top="Опыт работы">
            <SegmentedControl
                options={[
                    {label: 'Без опыта', value: 'Без опыта'},
                    {label: 'До года', value: 'До года'},
                    {label: 'От 1-3 лет', value: 'От 1-3 лет'},
                    {label: 'От 3 лет', value: 'От 3 лет'},
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

export default WorkExperienceInput;
import { FormItem, SegmentedControl } from '@vkontakte/vkui';

type SelectedInputProps = {
    value: string;
    onChange: (value: string) => void;
};

const SelectedInput: React.FC<SelectedInputProps> = ({ value, onChange }) => {
    return (
        <FormItem top="Образование">
            <SegmentedControl
                options={[
                    { label: 'ВО', value: 'higher' },
                    { label: 'СПО', value: 'secondary' },
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
export default SelectedInput;
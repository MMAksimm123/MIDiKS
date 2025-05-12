import { SelectionControl, Switch } from "@vkontakte/vkui"

interface PublicationConfirmationProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

const PublicationConfirmation = ({value, onChange}: PublicationConfirmationProps) => {
    return (
        <SelectionControl>
            <SelectionControl.Label>
                Отображать вакансию
            </SelectionControl.Label>
            <Switch checked={value}
                onChange={(e) => onChange(e.target.checked)}
            />
        </SelectionControl>
    )
}

export default PublicationConfirmation;
import { UniversalSelect } from "../UniversalSelected";

type SelectedDirectionProps = {
    value: string;
    onChange: (value: string) => void;
};

const SelectedDirection: React.FC<SelectedDirectionProps> = ({ value, onChange }) => {
    const cities = [
        { value: "Дизайн", label: "Дизайн" },
        { value: "IT - технологии", label: "IT - технологии" },
        { value: "Ресторанный и гостиничный бизнес", label: "Ресторанный и гостиничный бизнес" },
        { value: "Лингвистика", label: "Лингвистика" },
        { value: "Экономика и управлениеt", label: "Экономика и управление" },
    ];

    return (
        <UniversalSelect 
            options={cities} 
            value={value}
            onChange={onChange} 
            top="Направление"
        />
    );
};
export default SelectedDirection;
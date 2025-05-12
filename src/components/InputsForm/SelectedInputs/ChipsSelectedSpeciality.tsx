import { UniversalChipsSelect } from "../UniversalChipsSelect";

type SpecialityChipOption = {
    value: string;
    label: string;
};

type ChipsSelectedSpecialityProps = {
    value: SpecialityChipOption[];
    onChange: (value: SpecialityChipOption[]) => void;
};

const ChipsSelectedSpeciality: React.FC<ChipsSelectedSpecialityProps> = ({ value, onChange }) => {
    const availableTags: SpecialityChipOption[] = [
        { value: "Цифровая графика в индустрии компьютерных игр", label: "Цифровая графика в индустрии компьютерных игр" },
        { value: "Графический дизайн и брендинг", label: "Графический дизайн и брендинг" },
        { value: "Дизайн среды", label: "Дизайн среды" },
        { value: "Дизайн одежды и маркетинг в модной индустрии", label: "Дизайн одежды и маркетинг в модной индустрии" },
        { value: "Web-дизайн и мобильная разработкаи", label: "Web-дизайн и мобильная разработка" },
        { value: "Промышленный дизайн", label: "Промышленный дизайн" },
        { value: "Гастрономический дизайн", label: "Гастрономический дизайн" },  
        { value: "Менеджмент в ресторанном и гостиничном бизнесе", label: " Менеджмент в ресторанном и гостиничном бизнесе" },
        { value: "Управление бизнес-процессами в гастрономии", label: "Управление бизнес-процессами в гастрономии" },
        { value: "Управление в гостиничном бизнесе", label: "Управление в гостиничном бизнесе" },
        { value: "Разработка компьютерных игр и приложений с виртуальной и дополненной реальностью (VR/AR)", label: "Разработка компьютерных игр и приложений с виртуальной и дополненной реальностью (VR/AR)" },
        { value: "Разработка веб- и мобильных приложений", label: "Разработка веб- и мобильных приложений" },
        { value: "Управление IT-проектами", label: "Управление IT-проектами" },
        { value: "Перевод и международные бизнес-коммуникации", label: "Перевод и международные бизнес-коммуникации" },
        { value: "Управление бизнесом и интернет-маркетинг", label: "Управление бизнесом и интернет-маркетинг" },
        { value: "Продюсирование и маркетинг мероприятий", label: "Продюсирование и маркетинг мероприятий" },
    ];

    return (
        <UniversalChipsSelect
            initialOptions={availableTags}
            selectedOptions={value}
            onChange={onChange}
            formItemProps={{ top: "Специальность" }}
            placeholder=""
        />
    );
};
export default ChipsSelectedSpeciality;
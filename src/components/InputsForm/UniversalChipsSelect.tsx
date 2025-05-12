import { ChipsSelect, FormItem, ChipsSelectProps } from "@vkontakte/vkui";
import React, { useState } from "react";

// Используем ChipOption из VKUI, но уточняем тип value
type ChipOption = {
  value: string; // Явно указываем string вместо ChipOptionValue
  label: string;
  disabled?: boolean;
  [key: string]: any;
};

interface UniversalChipsSelectProps
  extends Omit<ChipsSelectProps<ChipOption>, "options" | "value" | "onChange"> {
  initialOptions: ChipOption[];
  selectedOptions: ChipOption[];
  onChange: (value: ChipOption[]) => void;
  formItemProps?: Omit<React.ComponentProps<typeof FormItem>, "children">;
  creatable?: boolean;
}

export const UniversalChipsSelect: React.FC<UniversalChipsSelectProps> = ({
  initialOptions,
  selectedOptions,
  onChange,
  formItemProps,
  creatable = false,
  ...chipsSelectProps
}) => {
  const [options, setOptions] = useState<ChipOption[]>(initialOptions);
  const [selected, setSelected] = useState<ChipOption[]>(selectedOptions);

  const handleChange = (newSelected: ChipOption[]) => {
    setSelected(newSelected);
    onChange(newSelected);
  };

  const handleCreateNewOption = (label: string): ChipOption => {
    const newOption = {
      value: label.toLowerCase().replace(/\s+/g, '-'),
      label: label,
    };
    setOptions([...options, newOption]);
    return newOption;
  };

  return (
    <FormItem {...formItemProps}>
      <ChipsSelect
        options={options}
        value={selected}
        onChange={handleChange}
        {...(creatable ? { onCreate: handleCreateNewOption } : {})}
        {...chipsSelectProps}
      />
    </FormItem>
  );
};
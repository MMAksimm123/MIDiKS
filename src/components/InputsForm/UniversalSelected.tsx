import { FormItem, NativeSelect, FormItemProps } from "@vkontakte/vkui";
import React from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface UniversalSelectProps extends Omit<FormItemProps, "children" | "onChange"> {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  withEmptyOption?: boolean;
  emptyOptionLabel?: string;
}

export const UniversalSelect: React.FC<UniversalSelectProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  withEmptyOption = true,
  emptyOptionLabel = "",
  ...formItemProps
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <FormItem {...formItemProps}>
      <NativeSelect
        value={value}
        onChange={handleChange}
        disabled={disabled}
      >
        {withEmptyOption && (
          <option value="" disabled>
            {emptyOptionLabel}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </NativeSelect>
    </FormItem>
  );
};
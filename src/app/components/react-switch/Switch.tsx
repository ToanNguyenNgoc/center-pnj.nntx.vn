import { FC } from "react";
import { ReactSwitch } from ".";

interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (check: boolean) => void;
}

export const Switch: FC<SwitchProps> = ({
  checked = false,
  disabled,
  onChange = () => null
}) => {
  return (
    <ReactSwitch
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      checkedIcon={false}
      uncheckedIcon={false}
    />
  )
}
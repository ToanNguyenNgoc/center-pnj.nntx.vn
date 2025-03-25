import { forwardRef } from "react";

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {

}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className = '', value = undefined, style, ...rest } = props;
  return (
    <input
      ref={ref}
      {...rest}
      value={value}
      className={`form-control form-control-solid w-100 ${className}`}
      style={style}
    />
  )
})
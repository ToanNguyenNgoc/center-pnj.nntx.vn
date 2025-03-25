import { FC } from "react";

interface ButtonLoadingProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  title?: string;
  loading?: boolean;
}

export const ButtonLoading: FC<ButtonLoadingProps> = (props) => {
  const { title = '', loading, className, ...rest } = props;
  return (
    <button {...rest} className={`btn btn-primary ${className}`} disabled={props.disabled || loading}>
      {!loading && title}
      {loading && (
        <span className='indicator-progress' style={{ display: 'block' }}>
          {title}...{' '}
          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
        </span>
      )}
    </button>
  )
}
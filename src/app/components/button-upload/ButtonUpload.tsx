import { FC, ReactElement } from "react";
import style from './button-upload.module.css';
import { toAbsoluteUrl } from "../../../_metronic/helpers";

interface Options extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> { }
interface ButtonUploadProps extends React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
  id?: string;
  size?: number;
  onChangeFile?: (file: FileList) => void;
  options?: Options;
  icon?: string | ReactElement
}

export const ButtonUpload: FC<ButtonUploadProps> = (props) => {
  const {
    id = 'media',
    size = 36,
    onChangeFile = () => null,
    options,
    icon = toAbsoluteUrl('/media/svg/files/camera.svg'),
    ...rest
  } = props
  return (
    <div style={{ width: 'fit-content' }}>
      <input type="file" id={id}
        hidden
        onChange={e => {
          if (e.target.files) {
            onChangeFile(e.target.files)
          }
        }}
        {...options}
      />
      <label htmlFor={id} style={{ width: size }} {...rest} className={`${style.container} ${props.className}`} >
        {
          typeof icon === 'string' ?
            <img
              style={{ width: '75%', aspectRatio: '1/1', objectFit: 'cover' }}
              src={icon} alt=""
            />
            :
            icon
        }
      </label>
    </div>
  )
}
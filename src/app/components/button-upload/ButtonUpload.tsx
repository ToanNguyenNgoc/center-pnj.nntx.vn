import { FC } from "react";
import style from './button-upload.module.css';
import { toAbsoluteUrl } from "../../../_metronic/helpers";

interface ButtonUploadProps extends React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
  id?: string;
  size?: number;
  onChangeFile?: (file: FileList) => void;
}

export const ButtonUpload: FC<ButtonUploadProps> = (props) => {
  const { id = 'media', size = 36, onChangeFile = () => null, ...rest } = props
  return (
    <div style={{ width: 'fit-content' }}>
      <input type="file" id={id} hidden onChange={e => {
        if (e.target.files) {
          onChangeFile(e.target.files)
        }
      }} />
      <label htmlFor={id} style={{ width: size }} {...rest} className={`${style.container} ${props.className}`} >
        <img
          style={{ width: '75%', aspectRatio: '1/1', objectFit: 'cover' }}
          src={toAbsoluteUrl('/media/svg/files/camera.svg')} alt=""
        />
      </label>
    </div>
  )
}
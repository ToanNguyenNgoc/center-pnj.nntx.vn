import { FC } from "react";
import style from './avatar.module.css';
import { onErrorAvatar } from "../../utils";

interface AvatarProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  imageUrl?: string;
  size?: number;
  type?: 'square' | 'circle'
}

export const Avatar: FC<AvatarProps> = (props) => {
  const { imageUrl='', type = 'square', size, ...rest } = props;
  return (
    <img
      src={imageUrl}
      alt={rest.alt}
      className={style.container}
      style={{
        borderRadius: type === 'circle' ? '100%' : undefined,
        width: size
      }}
      {...rest}
      onError={onErrorAvatar}
    />
  )
}
import { toAbsoluteUrl } from "../../_metronic/helpers";

export const onErrorAvatar = (e: any) => {
  e.target.src = toAbsoluteUrl('/media/avatars/blank.png');
  e.target.style.objectFit = "contain";
}
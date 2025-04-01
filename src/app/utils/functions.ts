import moment from "moment";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import locale from "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";

export const isDev = () => window.location.hostname === 'localhost';
export const formatDate = (date?: string) => {
  if (!date) return;
  return moment(date).format('YYYY-MM-DD HH:mm')
}
export const formatDateFromNow = (date: string) => {
  dayjs.extend(relativeTime);
  return dayjs(date).locale(locale.name).fromNow();
};

export class Toast {
  static success(message = 'Lưu thông tin thành công !') {
    return toast.success(message);
  }

  static error(message = 'Có lỗi xảy ra. Vui lòng thử lại !') {
    return toast.error(message)
  }
  static warning(message = 'Cảnh báo') {
    return toast.warning(message)
  }
}
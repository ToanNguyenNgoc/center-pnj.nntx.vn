/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createRef, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { ButtonLoading } from "../button-loading/ButtonLoading";

export interface ConfirmActionOptions {
  message?: string;
  callBack?: () => void;
}
export interface ConfirmActionHandler {
  open: (options?: ConfirmActionOptions) => void;
  close:()=>void;
}

export class ConfirmAction {
  //@ts-ignore
  private static confirmRef: React.RefObject<ConfirmActionHandler> = createRef();

  static register(ref: React.RefObject<ConfirmActionHandler>) {
    this.confirmRef = ref;
  }

  static open(options?: ConfirmActionOptions) {
    this.confirmRef.current?.open(options);
  }
  static close() {
    this.confirmRef.current?.close();
  }
}

export type ConfirmActionProps = object;

export const ConfirmActionComponent = forwardRef<ConfirmActionHandler, ConfirmActionProps>((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const callBackRef = useRef<(() => void) | null>(null);

  useImperativeHandle(ref, () => ({
    open: (options) => {
      setOpen(true);
      setMessage(options?.message || 'Bạn có muốn xóa không ?');
      callBackRef.current = options?.callBack || null;
    },
    close:()=>{
      setOpen(false);
      setMessage('')
    }
  }));

  const onAccept = () => {
    if (callBackRef.current) {
      callBackRef.current();
    }
    setOpen(false);
  };

  return (
    <Modal show={open} onBackdropClick={() => setOpen(false)} centered >
      <div className="p-6" style={{ width: '25vw' }}>
        <h3 className="fw-bold text-center">Thông báo</h3>
        <p className="text-center">{message}</p>
        <div className="w-100 d-flex justify-content-center mt-3">
          <ButtonLoading
            title="Xác nhận"
            className="me-2"
            onClick={onAccept}
          />
          <ButtonLoading
            title="Hủy"
            className="btn-secondary ms-2"
            onClick={() => setOpen(false)}
          />
        </div>
      </div>
    </Modal>
  );
});

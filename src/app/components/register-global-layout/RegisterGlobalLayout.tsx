import { createRef, FC, Fragment, useEffect } from "react";
import { ConfirmAction, ConfirmActionComponent, ConfirmActionHandler } from "../confirm-action/ConfirmAction";
import { ToastContainer, Zoom } from "react-toastify";

export const RegisterGlobalLayout: FC = () => {
  const confirmRef = createRef<ConfirmActionHandler>();
  useEffect(() => {
    ConfirmAction.register(confirmRef);
  }, [confirmRef])
  return (
    <Fragment>
      <ConfirmActionComponent ref={confirmRef} />
      <ToastContainer
        position='top-right'
        autoClose={2000}
        theme="colored"
        transition={Zoom}
        hideProgressBar={true}
      />
    </Fragment>
  )
}
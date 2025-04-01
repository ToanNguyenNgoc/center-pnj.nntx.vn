import { observer } from "mobx-react-lite";
import { TitlePage } from "../../components";
import { Message, Topic } from "./modules";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { aesEncode } from "../../utils";

const MessengerPage = observer(() => {
  return (
    <div className="card-p2">
      <TitlePage title="Tin nhắn" />
      <Routes>
        <Route
          element={
            <div className="d-flex flex-column flex-lg-row">
              <Topic />
              <Outlet />
            </div>
          }
        >
          <Route
            path=':id'
            element={
              <>
                <Message />
              </>
            }
          />
          <Route index element={<Navigate to={`/apps/messengers/${aesEncode('0')}`} />} />
        </Route>
      </Routes>
    </div>
  )
})

export default MessengerPage;
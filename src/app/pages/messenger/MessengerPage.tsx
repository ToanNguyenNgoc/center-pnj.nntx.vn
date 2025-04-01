import { observer } from "mobx-react-lite";
import { TitlePage } from "../../components";
import { Message, Topic } from "./modules";

const MessengerPage = observer(() => {
  return (
    <div className="card-p2">
      <TitlePage title="Tin nhắn" />
      <div className="d-flex flex-column flex-lg-row">
        <Topic />
        <Message />
      </div>
    </div>
  )
})

export default MessengerPage;
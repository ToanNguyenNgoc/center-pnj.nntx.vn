import { FC } from "react";
import { ITopic, IUserProfile } from "../../../interfaces";
import { onErrorAvatar } from "../../../utils";
import { DropMenu } from "../../../components";

interface MessageHeaderProps {
  profile: IUserProfile;
  topic: ITopic
}

export const MessageHeader: FC<MessageHeaderProps> = ({ profile, topic }) => {
  return (
    <div className='card-header' id='kt_chat_messenger_header'>
      <div className='card-title'>
        <div className='symbol-group symbol-hover'></div>
        <div className='d-flex justify-content-center flex-column me-3'>
          <div className='symbol-group symbol-hover'>
            {
              topic.users?.slice(0, 7).map(user => (
                <div key={user.id} className='symbol symbol-35px symbol-circle'>
                  <img className="object-fit-cover" alt={user?.fullname?.slice(0, 1)} src={user.media?.original_url || ''} onError={onErrorAvatar} />
                </div>
              ))
            }
            {
              topic.users?.length > 7 &&
              <div
                className='symbol symbol-35px symbol-circle'
              >
                <span
                  className='symbol-label fs-8 fw-bolder'
                  data-bs-toggle='tooltip'
                  data-bs-trigger='hover'
                  title='View more users'
                >
                  +{topic?.users?.length - 1}
                </span>
              </div>
            }
          </div>

          <div className='mb-0 lh-1'>
            <span className='badge badge-success badge-circle w-10px h-10px me-1'></span>
            <span className='fs-7 fw-bold text-gray-400'>Active</span>
          </div>
        </div>
      </div>

      <DropMenu>
        <div className="w-250px w-md-300px">
          <label className='form-label fw-bold'>Member Type:</label>
        </div>
      </DropMenu>
    </div>
  )
}
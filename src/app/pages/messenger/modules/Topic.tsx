import { observer } from "mobx-react-lite";
import { FC } from "react";
import { KTSVG } from "../../../../_metronic/helpers";
import { useQuery } from "react-query";
import { Const } from "../../../common";
import { useStores } from "../../../models/store";
import { useAuth, useQueryParams } from "../../../hooks";
import { ITopic, QrTopic } from "../../../interfaces";
import { Link } from "react-router-dom";
import { aesDecode, aesEncode } from "../../../utils";

export const GetTopicName = (topic: ITopic, profileId: number) => {
  let name = topic.group_name;
  const users = topic.users.filter(i => i.id !== profileId)
  if (topic.type === 'DUOS' && users.length > 0) {
    name = users[0].fullname
  }
  return name;
}

export const Topic: FC = observer(() => {
  const { profile } = useAuth()
  const { topicModel } = useStores();
  const { query } = useQueryParams<QrTopic>()
  const { data } = useQuery({
    queryKey: [Const.QueryKey.topics, query],
    queryFn: () => topicModel.getTopics(query)
  })
  const topics = data?.data || []
  return (
    <div className='flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0'>
      <div className='card card-flush'>
        <div className='card-header pt-7' id='kt_chat_contacts_header'>
          <form className='w-100 position-relative' autoComplete='off'>
            <KTSVG
              path='/media/icons/duotune/general/gen021.svg'
              className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute top-50 ms-5 translate-middle-y'
            />

            <input
              type='text'
              className='form-control form-control-solid px-15'
              name='search'
              placeholder='Search by username or email...'
            />
          </form>
        </div>

        <div className='card-body pt-5' id='kt_chat_contacts_body'>
          <div
            className='scroll-y me-n5 pe-5 h-200px h-lg-auto'
            data-kt-scroll='true'
            data-kt-scroll-activate='{default: false, lg: true}'
            data-kt-scroll-max-height='auto'
            data-kt-scroll-dependencies='#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header'
            data-kt-scroll-wrappers='#kt_content, #kt_chat_contacts_body'
            data-kt-scroll-offset='0px'
          >
            {
              topics.map(topic => (
                <Link to={`/apps/messengers?topic_id=${aesEncode(String(topic.id))}`} key={topic.id} className="pe-auto">
                  <div className='d-flex flex-stack py-4'>
                    <div className='d-flex align-items-center'>
                      <div className='symbol symbol-45px symbol-circle'>
                        <span className='symbol-label bg-light-danger text-danger fs-6 fw-bolder'>
                        {GetTopicName(topic, Number(profile?.id)).slice(0,1)}
                        </span>
                      </div>
                      <div className='ms-5'>
                        <div className='fs-5 fw-bolder text-gray-900 text-hover-primary mb-2'>
                          {GetTopicName(topic, Number(profile?.id))}
                        </div>
                        <div className='fw-bold text-gray-400'>{topic.msg}</div>
                      </div>
                    </div>
                    <div className='d-flex flex-column align-items-end ms-2'>
                      <span className='text-muted fs-7 mb-1'>5 hrs</span>
                    </div>
                  </div>
                  <div className='separator separator-dashed d-none'></div>
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
})
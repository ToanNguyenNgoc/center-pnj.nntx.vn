import { FC, memo } from "react";
import { toAbsoluteUrl } from "../../../_metronic/helpers";

interface TabletBufferZoneProps {
  isLoading?: boolean;
  isEmpty?: boolean;

}

export const TabletBufferZone: FC<TabletBufferZoneProps> = memo(({
  isLoading, isEmpty
}) => {
  if (!isLoading && !isEmpty) return null;
  return (
    <tr>
      <td colSpan={100}>
        <div className="w-100" style={{ height: '50vh' }}>
          <div className="w-100 h-100" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center' }}>
            {
              isLoading ?
                <>
                  <h1 className='fw-bold mb-10' style={{ color: '#A3A3C7' }}>
                    Đang tìm kiếm...
                  </h1>
                </>
                :
                <>
                  <img src={toAbsoluteUrl('/media/illustrations/sketchy-1/18.png')} alt="" className="h-50 w-50" style={{ objectFit: 'contain' }} />
                  <h1 className='fw-bold mb-10' style={{ color: '#A3A3C7' }}>
                    Không có dữ liệu
                  </h1>
                </>
            }
          </div>
        </div>
      </td>
    </tr>
  )
})
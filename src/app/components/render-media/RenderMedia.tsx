import { FC } from "react";
import { getFileType } from "../../utils";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import * as FileSaver from "file-saver";

interface RenderMediaProps {
  fileUrl?: string;
  fileType?: string;
}

export const RenderMedia: FC<RenderMediaProps> = ({
  fileUrl,
  fileType
}) => {
  const onSaveFile = () => {
    if (!fileUrl) return;
    FileSaver.saveAs(fileUrl, String(new Date().getTime()))
  }
  const renderMedia = () => {
    let el = (
      <div className="position-absolute top-0 start-0 w-100 h-100 rounded-2 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'var(--kt-light)' }}>
        <img className="w-50 h-50" src={toAbsoluteUrl('/media/svg/files/folder-document.svg')} alt="" />
      </div>
    );
    const type = getFileType(fileType);
    switch (type) {
      case 'IMAGE':
        el = <img className="position-absolute top-0 start-0 w-100 h-100 rounded-2 object-fit-cover" src={fileUrl} alt="" />
        break;
      case 'VIDEO':
        el = (
          <div className="position-absolute top-0 start-0 w-100 h-100 rounded-2" style={{ overflow: 'hidden' }}>
            <video className="w-100 h-100" controls style={{objectFit:'contain'}}>
              <source src={fileUrl} />
            </video>
          </div>
        )
        break;
      case 'PDF':
        el = (
          <div className="position-absolute top-0 start-0 w-100 h-100 rounded-2 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'var(--kt-light)' }}>
            <img className="w-50 h-50" src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt="" />
            <div
              className="position-absolute bg-secondary cursor-pointers rounded-2 d-flex justify-content-center align-items-center"
              style={{ zIndex: 10, bottom: 6, right: 6, width: 32, height: 32 }}
              onClick={onSaveFile}
            >
              <img src={toAbsoluteUrl("/media/icons/duotune/files/fil004.svg")} alt="" />
            </div>
          </div>
        )
        break;
      case 'WORD':
        el = (
          <div className="position-absolute top-0 start-0 w-100 h-100 rounded-2 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'var(--kt-light)' }}>
            <img className="w-50 h-50" src={toAbsoluteUrl('/media/svg/files/doc.svg')} alt="" />
          </div>
        )
        break;
    }
    return el
  }
  return renderMedia()
}
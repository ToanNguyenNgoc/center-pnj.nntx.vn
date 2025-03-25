import { FC } from "react";
import { toAbsoluteUrl } from "../../../_metronic/helpers";

const generatePage = (count: number, page: number) => {
  let pages = Array(count).fill(null).map((_i, index) => index + 1);
  if (count <= 7) return pages;
  const first = pages[0];
  const last = pages[pages.length - 1];
  if (page <= first + 2) {
    return pages = [first, pages[1], pages[2], page === first + 2 && page + 1, NaN, last].filter(i => i !== false) as number[];
  }
  if (page >= last - 2) {
    return pages = [first, NaN, page === last - 2 && page - 1, pages[pages.length - 3], pages[pages.length - 2], last].filter(i => i !== false) as number[];
  }
  else {
    return pages = [first, NaN, page - 1, page, page + 1, NaN, last]
  }
}

interface PaginationProps {
  page?: number;
  count?: number;
  onChangePage?: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = (props) => {
  const { count = 0, page = 1, onChangePage = () => null } = props;
  const pages = generatePage(count, page);
  const first = pages[0];
  const last = pages[pages.length - 1];
  return (
    <div className="d-flex">
      <div className="cursor-pointer me-2 d-flex align-item-center" onClick={() => page > first ? onChangePage(page - 1) : null}>
        <img src={toAbsoluteUrl("/media/icons/duotune/arrows/arr002.svg")} className="w-75" alt="" />
      </div>
      {
        pages.map((item, index) => {
          return (
            <button
              key={index}
              disabled={isNaN(item)}
              className={`btn btn-sm me-2 ${page === item ? 'btn-primary' : 'btn-light'}`}
              onClick={() => onChangePage(item)}
            >
              {isNaN(item) ? '...' : item}
            </button>
          )
        })
      }
      <div className="cursor-pointer d-flex align-item-center" onClick={() => page < last ? onChangePage(page + 1) : null}>
        <img src={toAbsoluteUrl("/media/icons/duotune/arrows/arr001.svg")} className="w-75" alt="" />
      </div>
    </div>
  )
}
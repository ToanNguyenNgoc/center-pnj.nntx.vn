import { FC, memo, ReactElement, useRef } from "react";
import './drop-menu.scss';

interface DropMenuProps {
  children?: ReactElement
}

export const DropMenu: FC<DropMenuProps> = memo(({ children }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const onToggleMenu = () => {
    if (!menuRef.current) return;
    menuRef.current.classList.toggle('menu-container-act')
  }
  window.addEventListener("click", () => {
    if (!menuRef.current) return;
    menuRef.current.classList.remove('menu-container-act')
  })
  return (
    <div className='card-toolbar me-6 position-relative'>
      <div className='me-n3'>
        <button
          className='btn btn-sm btn-icon btn-active-light-primary'
          data-kt-menu-trigger='click'
          data-kt-menu-placement='bottom-end'
          data-kt-menu-flip='top-end'
          onClick={e => {
            e.stopPropagation();
            onToggleMenu()
          }}
        >
          <i className='bi bi-three-dots fs-2'></i>
        </button>
      </div>
      <div className="menu-container p-2" ref={menuRef} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
})
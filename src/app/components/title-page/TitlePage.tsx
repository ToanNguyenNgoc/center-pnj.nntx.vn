import { FC, memo } from "react";

interface TitlePageProps {
  title?: string
  element?: JSX.Element
}

export const TitlePage: FC<TitlePageProps> = memo(props => {
  const { title, element } = props;
  return (
    <div className='toolbar' id='kt_toolbar'>
      <div id="kt_toolbar_container" className='container-fluid d-flex flex-stack'>
        <h1 className='d-flex align-items-center text-dark fw-bolder my-1 fs-3'>
          {title}
        </h1>
        {element}
      </div>
    </div>
  );
})
import { observer } from "mobx-react-lite";
import { PermissionLayout, TitlePage } from "../../components";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks";

const BrandsPage = observer(() => {
  const { profile } = useAuth()
  return (
    <div className="card p-3">
      <TitlePage title="Thương hiệu" element={
        <PermissionLayout permissions={['.brands.post']}>
          <Link to={'/brands-form'} className="btn btn-primary">Tạo mới</Link>
        </PermissionLayout>
      } />
    </div>
  )
})

export default BrandsPage;
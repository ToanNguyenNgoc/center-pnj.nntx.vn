import { FC, memo, useRef } from "react";
import { useGetProvince } from "../../hooks";
import Select from 'react-select';

interface SelectOptionProvinceProps {
  required?: boolean,
  province_code?: number;
  onSelectProvince?: (code?: number) => void;
  district_code?: number;
  onSelectDistrict?: (code?: number) => void;
  ward_code?: number;
  onSelectWard?: (code?: number) => void;
}

export const SelectOptionProvince: FC<SelectOptionProvinceProps> = memo(({
  required,
  province_code, onSelectProvince = () => null,
  district_code, onSelectDistrict = () => null,
  ward_code, onSelectWard = () => null
}) => {
  const selectDistrictRef = useRef<any>(null);
  const selectWardRef = useRef<any>(null);
  const { provinces, districts, wards } = useGetProvince({
    province_code,
    district_code
  });
  const getValueProvince = () => {
    if (!province_code) return undefined;
    const province = provinces.find(i => i.code === province_code);
    if (!province) return undefined;
    return {
      value: province.code,
      label: province.name
    }
  }
  const getValueDistrict = () => {
    if (!district_code) return undefined;
    const district = districts.find(i => i.code === district_code);
    if (!district) return undefined;
    return {
      value: district.code,
      label: district.name
    }
  }
  const getValueWard = () => {
    if (!ward_code) return undefined;
    const ward = wards.find(i => i.code === ward_code);
    if (!ward) return undefined;
    return {
      value: ward.code,
      label: ward.name
    }
  }
  return (
    <div>
      <div className='row mb-6'>
        <label className='col-lg-4 col-form-label fw-bold fs-6'>
          <span className={required ? 'required' : ''} >Tỉnh/ Thành phố</span>
        </label>
        <div className='col-lg-8 fv-row'>
          <Select
            value={getValueProvince()}
            options={provinces.map(i => ({ value: i.code, label: i.name }))}
            onChange={(e: any) => {
              onSelectProvince(e.value);
              if (e.value !== province_code) {
                if (selectDistrictRef.current) selectDistrictRef.current.clearValue();
                if (selectWardRef.current) selectDistrictRef.current.clearValue();
              }
            }}
          />
        </div>
      </div>
      <div className='row mb-6'>
        <label className='col-lg-4 col-form-label fw-bold fs-6'>
          <span className={required ? 'required' : ''} >Quận/ Huyện</span>
        </label>
        <div className='col-lg-8 fv-row'>
          <Select
            ref={selectDistrictRef}
            options={districts.map(i => ({ value: i.code, label: i.name }))}
            value={getValueDistrict()}
            onChange={(e: any) => {
              onSelectDistrict(e?.value);
              if (e?.value !== district_code) {
                if (selectWardRef.current) selectWardRef.current.clearValue();
              }
            }}
          />
        </div>
      </div>
      <div className='row mb-6'>
        <label className='col-lg-4 col-form-label fw-bold fs-6'>
          <span className={required ? 'required' : ''} >Xã/ Phường</span>
        </label>
        <div className='col-lg-8 fv-row'>
          <Select
            ref={selectWardRef}
            options={wards.map(i => ({ value: i.code, label: i.name }))}
            value={getValueWard()}
            onChange={(e: any) => onSelectWard(e?.value)}
          />
        </div>
      </div>
    </div>
  )
})
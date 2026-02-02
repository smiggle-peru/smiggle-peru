// lib/ubigeo.ts
export type UbigeoOption = { id: string; name: string };

let _ubigeo: any = null;

function getUbigeoInstance() {
  if (_ubigeo) return _ubigeo;

  // peru-ubigeo es CommonJS, por eso require:
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Ubigeoperu = require("peru-ubigeo");
  _ubigeo = new Ubigeoperu();
  return _ubigeo;
}

export function getDepartments(): UbigeoOption[] {
  const ubigeo = getUbigeoInstance();
  const regions = ubigeo.getRegions();
  return (regions ?? []).map((r: any) => ({ id: String(r.id), name: String(r.name) }));
}

export function getProvincesByDepartment(depIdOrName: string): UbigeoOption[] {
  const ubigeo = getUbigeoInstance();
  const region = ubigeo.getRegions(depIdOrName);
  if (!region) return [];
  const provinces = region.provinces?.() ?? [];
  return provinces.map((p: any) => ({ id: String(p.id), name: String(p.name) }));
}

export function getDistrictsByProvince(provIdOrName: string): UbigeoOption[] {
  const ubigeo = getUbigeoInstance();
  const province = ubigeo.getProvinces(provIdOrName);
  if (!province) return [];
  const districts = province.districts?.() ?? [];
  return districts.map((d: any) => ({ id: String(d.id), name: String(d.name) }));
}

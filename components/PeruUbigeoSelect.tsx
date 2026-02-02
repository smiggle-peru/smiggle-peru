"use client";

import { useEffect, useMemo, useState } from "react";

type Opt = { code: string; name: string };

export default function PeruUbigeoSelect() {
  const [deps, setDeps] = useState<Opt[]>([]);
  const [provs, setProvs] = useState<Opt[]>([]);
  const [dists, setDists] = useState<Opt[]>([]);

  const [dep, setDep] = useState("");
  const [prov, setProv] = useState("");
  const [dist, setDist] = useState("");

  // cargar departamentos
  useEffect(() => {
    fetch("/api/ubigeo/departamentos")
      .then((r) => r.json())
      .then(setDeps)
      .catch(() => setDeps([]));
  }, []);

  // cuando cambia dep → reset y cargar provincias
  useEffect(() => {
    setProv("");
    setDist("");
    setProvs([]);
    setDists([]);

    if (!dep) return;

    fetch(`/api/ubigeo/provincias?dep=${encodeURIComponent(dep)}`)
      .then((r) => r.json())
      .then(setProvs)
      .catch(() => setProvs([]));
  }, [dep]);

  // cuando cambia prov → reset y cargar distritos
  useEffect(() => {
    setDist("");
    setDists([]);

    if (!dep || !prov) return;

    fetch(
      `/api/ubigeo/distritos?dep=${encodeURIComponent(dep)}&prov=${encodeURIComponent(prov)}`
    )
      .then((r) => r.json())
      .then(setDists)
      .catch(() => setDists([]));
  }, [dep, prov]);

  const provDisabled = !dep || provs.length === 0;
  const distDisabled = !dep || !prov || dists.length === 0;

  const depName = useMemo(() => deps.find((x) => x.code === dep)?.name ?? "", [deps, dep]);
  const provName = useMemo(() => provs.find((x) => x.code === prov)?.name ?? "", [provs, prov]);
  const distName = useMemo(() => dists.find((x) => x.code === dist)?.name ?? "", [dists, dist]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Select
        label="Departamento"
        value={dep}
        onChange={setDep}
        placeholder="Selecciona"
        options={deps}
      />

      <Select
        label="Provincia"
        value={prov}
        onChange={setProv}
        placeholder={provDisabled ? "Primero departamento" : "Selecciona"}
        options={provs}
        disabled={provDisabled}
      />

      <Select
        label="Distrito"
        value={dist}
        onChange={setDist}
        placeholder={distDisabled ? "Primero provincia" : "Selecciona"}
        options={dists}
        disabled={distDisabled}
      />

      {/* si quieres ver el resultado */}
      <input type="hidden" name="department" value={depName} />
      <input type="hidden" name="province" value={provName} />
      <input type="hidden" name="district" value={distName} />
      <input type="hidden" name="ubigeo_dep" value={dep} />
      <input type="hidden" name="ubigeo_prov" value={prov} />
      <input type="hidden" name="ubigeo_dist" value={dist} />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Opt[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <label>
      <div className="mb-1 text-[12px] text-black/60">{label}</div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="
            h-11 w-full appearance-none rounded-xl border border-black/10 bg-white px-4 pr-9 text-[13px]
            outline-none
            focus:border-black/20
            disabled:bg-black/[0.03] disabled:text-black/40
          "
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.code} value={o.code}>
              {o.name}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/35">
          ▾
        </span>
      </div>
    </label>
  );
}

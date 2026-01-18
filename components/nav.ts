export type NavChild = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
  columns?: { title?: string; items: NavChild[] }[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "REGRESO A CLASES",
    href: "/categoria/regreso-a-clases",
    columns: [
      {
        title: "Regreso a Clases",
        items: [
          { label: "Packs Escolares", href: "/categoria/regreso-a-clases/packs-escolares" },
          { label: "Mochilas", href: "/categoria/regreso-a-clases/mochilas" },
          { label: "Loncheras", href: "/categoria/regreso-a-clases/loncheras" },
          { label: "Botellas", href: "/categoria/regreso-a-clases/botellas" },
        ],
      },
      {
        title: "Útiles",
        items: [
          { label: "Cartucheras", href: "/categoria/regreso-a-clases/cartucheras" },
          { label: "Cuadernos", href: "/categoria/regreso-a-clases/cuadernos" },
          { label: "Plumones y Marcadores", href: "/categoria/regreso-a-clases/plumones-y-marcadores" },
        ],
      },
      {
        title: "Más",
        items: [
          { label: "Preescolar", href: "/categoria/regreso-a-clases/preescolar" },
          { label: "Lápices", href: "/categoria/regreso-a-clases/lapices" },
          { label: "Borradores, reglas y útiles", href: "/categoria/regreso-a-clases/borradores-reglas-y-utiles" },
        ],
      },
    ],
  },

  {
    label: "NOVEDADES",
    href: "/categoria/novedades",
    columns: [
      {
        title: "Novedades",
        items: [
          { label: "Licencias", href: "/categoria/novedades/licencias" },
          { label: "Colecciones", href: "/categoria/novedades/colecciones" },
          { label: "Preescolar", href: "/categoria/novedades/preescolar" },
        ],
      },
    ],
  },

  {
    label: "LICENCIAS",
    href: "/categoria/licencias",
    columns: [
      {
        title: "Licencias",
        items: [
          { label: "Care Bears", href: "/categoria/licencias/care-bears" },
          { label: "Marvel", href: "/categoria/licencias/marvel" },
          { label: "Disney Stitch", href: "/categoria/licencias/disney-stitch" },
          { label: "Paw Patrol", href: "/categoria/licencias/paw-patrol" },
          { label: "Hello Kitty", href: "/categoria/licencias/hello-kitty" },
        ],
      },
    ],
  },

  {
    label: "MOCHILAS",
    href: "/categoria/mochilas",
    columns: [
      {
        title: "Mochilas",
        items: [
          { label: "Mochilas", href: "/categoria/mochilas/mochilas" },
          { label: "Packs", href: "/categoria/mochilas/packs" },
          { label: "Mochilas con Ruedas", href: "/categoria/mochilas/mochilas-con-ruedas" },
          { label: "Mochilas Preescolares", href: "/categoria/mochilas/mochilas-preescolares" },
        ],
      },
    ],
  },

  {
    label: "LONCHERAS",
    href: "/categoria/loncheras",
    columns: [
      {
        title: "Loncheras",
        items: [
          { label: "Loncheras", href: "/categoria/loncheras/loncheras" },
          { label: "Botellas", href: "/categoria/loncheras/botellas" },
        ],
      },
    ],
  },

  {
    label: "PAPELERÍA",
    href: "/categoria/papeleria",
    columns: [
      {
        title: "Papelería",
        items: [
          { label: "Cartucheras", href: "/categoria/papeleria/cartucheras" },
          { label: "Plumones y arte", href: "/categoria/papeleria/plumones-y-arte" },
          { label: "Lápices", href: "/categoria/papeleria/lapices" },
          { label: "Cuadernos", href: "/categoria/papeleria/cuadernos" },
        ],
      },
    ],
  },
];

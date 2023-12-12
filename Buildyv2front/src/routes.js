import React from "react";

const EstateMenu = React.lazy(() =>
  import("./components/adminSide/estate/EstateMenu")
);
const DataMenu = React.lazy(() =>
  import("./components/adminSide/data/DataMenu")
);

const EstateCreate = React.lazy(() =>
  import("./components/adminSide/estate/EstateCreate")
);

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/estates", name: "Propiedades", element: EstateMenu },
  { path: "/add-estate", name: "Agregar propiedades", element: EstateCreate },
  { path: "/reports", name: "Reportes", element: EstateMenu },
  { path: "/jobs", name: "Obras", element: EstateMenu },
  { path: "/tenants", name: "Inquilinos", element: EstateMenu },
  { path: "/workers", name: "Trabajadores", element: EstateMenu },
  { path: "/data", name: "Datos", element: DataMenu },
];

export default routes;

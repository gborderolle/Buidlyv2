import React from "react";

const EstatesMenu = React.lazy(() =>
  import("./components/adminSide/estate/EstatesMenu")
);

const AddEstate = React.lazy(() =>
  import("./components/adminSide/estate/AddEstate")
);

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/estates", name: "Propiedades", element: EstatesMenu },
  { path: "/add-estate", name: "Agregar propiedades", element: AddEstate },
  { path: "/reports", name: "Reportes", element: EstatesMenu },
  { path: "/jobs", name: "Obras", element: EstatesMenu },
  { path: "/tenants", name: "Inquilinos", element: EstatesMenu },
  { path: "/workers", name: "Trabajadores", element: EstatesMenu },
];

export default routes;

import React from "react";

const EstateMenu = React.lazy(() =>
  import("./components/adminSide/estates/EstateMenu")
);
const ReportMenu = React.lazy(() =>
  import("./components/adminSide/reports/ReportMenu")
);
const WorkerMenu = React.lazy(() =>
  import("./components/adminSide/workers/WorkerMenu")
);
const TenantMenu = React.lazy(() =>
  import("./components/adminSide/tenants/TenantMenu")
);
const JobMenu = React.lazy(() => import("./components/adminSide/jobs/JobMenu"));
const DataMenu = React.lazy(() =>
  import("./components/adminSide/data/DataMenu")
);

const EstateABM = React.lazy(() =>
  import("./components/adminSide/estates/EstateABM")
);

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/estates", name: "Propiedades", element: EstateMenu },
  { path: "/abm-estate", name: "Agregar propiedades", element: EstateABM },
  { path: "/reports", name: "Reportes", element: ReportMenu },
  { path: "/jobs", name: "Obras", element: JobMenu },
  { path: "/tenants", name: "Inquilinos", element: TenantMenu },
  { path: "/workers", name: "Trabajadores", element: WorkerMenu },
  { path: "/data", name: "Datos", element: DataMenu },
];

export default routes;

import React from "react";

const EstateMenu = React.lazy(() =>
  import("./components/adminSide/estates/EstateMenu")
);
const EstateABM = React.lazy(() =>
  import("./components/adminSide/estates/EstateABM")
);

const ReportMenu = React.lazy(() =>
  import("./components/adminSide/reports/ReportMenu")
);
const ReportABM = React.lazy(() =>
  import("./components/adminSide/reports/ReportABM")
);
const ReportView = React.lazy(() =>
  import("./components/adminSide/reports/ReportView")
);

const WorkerMenu = React.lazy(() =>
  import("./components/adminSide/workers/WorkerMenu")
);
const WorkerABM = React.lazy(() =>
  import("./components/adminSide/workers/WorkerABM")
);

const TenantMenu = React.lazy(() =>
  import("./components/adminSide/tenants/TenantMenu")
);
const TenantABM = React.lazy(() =>
  import("./components/adminSide/tenants/TenantABM")
);

const JobMenu = React.lazy(() => import("./components/adminSide/jobs/JobMenu"));
const JobABM = React.lazy(() => import("./components/adminSide/jobs/JobABM"));
const JobView = React.lazy(() => import("./components/adminSide/jobs/JobView"));

const RentABM = React.lazy(() =>
  import("./components/adminSide/rents/RentABM")
);

const DataMenu = React.lazy(() =>
  import("./components/adminSide/data/DataMenu")
);

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/estates", name: "Propiedades", element: EstateMenu },
  { path: "/abm-estate", name: "Agregar propiedades", element: EstateABM },

  { path: "/reports", name: "Reportes", element: ReportMenu },
  { path: "/abm-report", name: "Agregar reportes", element: ReportABM },
  { path: "/view-report", name: "Ver álbum", element: ReportView },

  { path: "/jobs", name: "Obras", element: JobMenu },
  { path: "/abm-job", name: "Agregar obras", element: JobABM },
  { path: "/view-job", name: "Ver álbum", element: JobView },

  { path: "/tenants", name: "Inquilinos", element: TenantMenu },
  { path: "/abm-tenant", name: "Agregar inquilinos", element: TenantABM },

  { path: "/workers", name: "Trabajadores", element: WorkerMenu },
  { path: "/abm-worker", name: "Agregar trabajadores", element: WorkerABM },

  { path: "/abm-rent", name: "Agregar alquiler", element: RentABM },

  { path: "/data", name: "Datos", element: DataMenu },
];

export default routes;

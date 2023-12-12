import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilImage,
  cilBriefcase,
  cilPaint,
  cilPeople,
  cilFeaturedPlaylist,
  cilStorage,
} from "@coreui/icons";
import { CNavGroup, CNavItem } from "@coreui/react";

const _nav = [
  {
    roles: [2], // roles que pueden ver este elemento
    component: CNavItem,
    name: "Propiedades",
    to: "/estates",
    icon: <CIcon icon={cilFeaturedPlaylist} customClassName="nav-icon" />,
  },
  {
    roles: [1], // roles que pueden ver este elemento
    component: CNavItem,
    name: "Reportes",
    to: "/reports",
    icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
  },
  {
    roles: [1], // roles que pueden ver este elemento
    component: CNavItem,
    name: "Obras",
    to: "/jobs",
    icon: <CIcon icon={cilPaint} customClassName="nav-icon" />,
  },
  {
    roles: [1], // roles que pueden ver este elemento
    component: CNavItem,
    name: "Inquilinos",
    to: "/tenants",
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    roles: [1], // roles que pueden ver este elemento
    component: CNavItem,
    name: "Trabajadores",
    to: "/workers",
    icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
  },
  {
    roles: [1], // roles que pueden ver este elemento
    component: CNavItem,
    name: "Datos",
    to: "/data",
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  },
];

export default _nav;

import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilSpeedometer,
  cilMap,
  cilTags,
  cilCog,
  cilPeople,
  cilFeaturedPlaylist,
} from "@coreui/icons";
import { CNavGroup, CNavItem } from "@coreui/react";

const _nav = [
  {
    roles: [2], // roles que pueden ver este elemento
    component: CNavItem,
    name: "Formulario",
    to: "/formStart",
    icon: <CIcon icon={cilFeaturedPlaylist} customClassName="nav-icon" />,
  },
  {
    roles: [1], // roles que pueden ver este elemento
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    roles: [1], // roles que pueden ver este elemento
    component: CNavItem,
    name: "Distribución",
    to: "/maps",
    icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
  },
  {
    roles: [1], // roles que pueden ver este elemento
    component: CNavItem,
    name: "Delegados",
    to: "/delegates",
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    roles: [1], // roles que pueden ver este elemento
    component: CNavItem,
    name: "Menú datos",
    to: "/datos",
    icon: <CIcon icon={cilTags} customClassName="nav-icon" />,
  },
  {
    roles: [1], // roles que pueden ver este elemento
    component: CNavItem,
    name: "Menú admin",
    to: "/admin",
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
  },
  // {
  //   roles: [1], // roles que pueden ver este elemento
  //   component: CNavItem,
  //   name: "Dashboard",
  //   to: "/dashboard",
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  // },

  // {
  //   roles: [1], // roles que pueden ver este elemento
  //   component: CNavItem,
  //   name: "Charts",
  //   to: "/charts",
  //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  // },
  // {
  //   roles: [1], // roles que pueden ver este elemento
  //   component: CNavItem,
  //   name: "Widgets",
  //   to: "/widgets",
  //   icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  //   badge: {
  //     color: "info",
  //     text: "NEW",
  //   },
  // },
  // {
  //   roles: [1], // roles que pueden ver este elemento
  //   component: CNavGroup,
  //   name: "Pages",
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Login general",
  //       to: "/login-general",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Register",
  //       to: "/register",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Error 404",
  //       to: "/404",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Error 500",
  //       to: "/500",
  //     },
  //   ],
  // },
];

export default _nav;

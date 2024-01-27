import React, { useEffect, useMemo } from "react";

import { MapContainer, TileLayer, useMap, Popup, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import iconBlue from "leaflet/dist/images/marker-icon.png";
import iconGreen from "leaflet/dist/images/marker-icon-completed.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import L, { divIcon } from "leaflet";

// redux imports
import { useSelector } from "react-redux";

import classes from "./EstateMap.module.css";

// Componente Popup personalizado
const CustomPopup = ({ estate }) => {
  return (
    <Popup>
      <strong>Propiedad: </strong>#{estate.name}
      <br />
      <strong>Dirección: </strong>
      {estate.address}
      <br />
    </Popup>
  );
};

L.icon({
  iconUrl: iconBlue,
  shadowUrl: iconShadow,
  iconAnchor: [16, 37],
  iconSize: [20, 30],
});

// Opciones de marcador por defecto con icono azul
const defaultIcon = L.icon({
  iconUrl: iconBlue,
  shadowUrl: iconShadow,
  iconAnchor: [16, 37],
  iconSize: [20, 30],
});

// Opciones de marcador con icono rojo
const completedIcon = L.icon({
  iconUrl: iconGreen,
  shadowUrl: iconShadow,
  iconAnchor: [16, 37],
  iconSize: [20, 30],
});

const EstateMap = (props) => {
  //#region Consts ***********************************

  const isMobile = useSelector((state) => state.auth.isMobile);

  const defaultCenter = [-34.91911763324771, -56.15673823330682];

  const mapStyle = {
    height: isMobile ? "370px" : "450px",
    width: "100%",
  };

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  useEffect(() => {
    L.Marker.prototype.options.icon = L.icon({
      iconUrl: iconBlue,
      shadowUrl: iconShadow,
      iconAnchor: [16, 37],
      iconSize: [20, 30],
    });
  }, []);

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  // Hook para ajustar la vista del mapa
  const ChangeView = ({ bounds }) => {
    const map = useMap();

    useEffect(() => {
      if (map && bounds) {
        map.fitBounds(bounds); // Ajustar la vista del mapa a los límites
      }
    }, [map, bounds]);

    return null;
  };

  // Calcula los límites para incluir todos los circuitos
  const bounds = useMemo(() => {
    const latLngBounds = L.latLngBounds();
    props.estateList.forEach((estate) => {
      if (estate.latLong) {
        const [lat, lon] = estate.latLong.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lon)) {
          latLngBounds.extend([lat, lon]);
        }
      }
    });
    return latLngBounds.isValid() ? latLngBounds : null; // Verificar que los límites son válidos
  }, [props.estateList]);

  // Función para crear el ícono del cluster
  const createCustomClusterIcon = (cluster) => {
    return new divIcon({
      html: `<div class=${
        classes.clusterIcon
      }>${cluster.getChildCount()}</div>`,
      className: "custom-marker-cluster",
      iconSize: L.point(33, 33, true),
    });
  };

  // Calcula el centro de todos los circuitos
  const centerOfEstates = useMemo(() => {
    if (props.estateList && props.estateList.length > 0) {
      let totalLat = 0;
      let totalLon = 0;
      let count = 0;

      props.estateList.forEach((estate) => {
        if (estate.latLong) {
          const [lat, lon] = estate.latLong.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lon)) {
            totalLat += lat;
            totalLon += lon;
            count++;
          }
        }
      });

      if (count > 0) {
        return [totalLat / count, totalLon / count];
      }
    }
    return defaultCenter; // Utiliza un centro por defecto si no hay circuitos
  }, [props.estateList]);

  const createMarkers = () => {
    return props.estateList.map((estate) => {
      if (estate.LatLong) {
        const [lat, lon] = estate.LatLong.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lon)) {
          return (
            <Marker
              key={estate.Id}
              position={[lat, lon]}
              // Puedes cambiar el icono según el estado del Estate
              icon={defaultIcon}
            >
              <CustomPopup estate={estate} />
            </Marker>
          );
        }
      }
      return null;
    });
  };

  //#endregion Functions ***********************************

  return (
    <MapContainer style={mapStyle}>
      <ChangeView bounds={bounds} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createCustomClusterIcon}
      >
        {createMarkers()}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default EstateMap;

import React from "react";
import { useLocation } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const ReportGallery = ({ photos }) => {
  return <ImageGallery items={photos} />;
};

const ReportView = () => {
  const location = useLocation();
  const report = location.state?.report;

  // Verificar si el reporte fue recibido correctamente
  if (!report || !Array.isArray(report.listPhotosURL)) {
    return <div>No se encontró el reporte</div>;
  }

  // Convertir listPhotos a la estructura requerida por ImageGallery
  const photos = report.listPhotosURL.map((url) => ({
    original: url,
    thumbnail: url, // O la URL de la miniatura si está disponible
  }));

  return (
    <div>
      <h2>Reporte: {report.title}</h2>
      <div>
        <ReportGallery photos={photos} />
      </div>
    </div>
  );
};

export default ReportView;

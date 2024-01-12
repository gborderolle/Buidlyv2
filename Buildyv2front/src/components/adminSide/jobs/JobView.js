import React from "react";
import { useLocation } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const JobGallery = ({ photos }) => {
  return <ImageGallery items={photos} />;
};

const JobView = () => {
  const location = useLocation();
  const job = location.state?.job;

  // Verificar si el jobe fue recibido correctamente
  if (!job || !Array.isArray(job.listPhotosURL)) {
    return <div>No se encontró la obra</div>;
  }

  // Convertir listPhotos a la estructura requerida por ImageGallery
  const photos = job.listPhotosURL.map((url) => ({
    original: url,
    thumbnail: url, // O la URL de la miniatura si está disponible
  }));

  return (
    <div>
      <h2>Obra: {job.title}</h2>
      <div>
        <JobGallery photos={photos} />
      </div>
    </div>
  );
};

export default JobView;

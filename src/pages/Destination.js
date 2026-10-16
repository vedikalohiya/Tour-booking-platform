import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BookingForm from "../components/BookingForm";
import ImageGallery from "../components/ImageGallery";
import { fetchPackages } from "../api/apiClient";

function Destination() {

  const { name } = useParams();
  const decodedName = decodeURIComponent(name);

  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchPackages().then(data => {

      const found = data.find(
        pkg =>
          pkg.PackageName
            ?.trim()
            .toLowerCase() ===
          decodedName.trim().toLowerCase()
      );

      if (found) {

        const rawImages = found.Images;

        let parsedImages = rawImages;

        if (typeof rawImages === "string") {
          try {
            parsedImages = JSON.parse(rawImages);
          } catch {
            parsedImages = [];
          }
        }

        const finalImages = Array.isArray(parsedImages)
          ? parsedImages.map(img => img.S || img)
          : [];

        setPackageData({
          name: found.PackageName,
          price: parseInt(found.Price),
          packageId: found.PackageID,
          images: finalImages
        });
      }

      setLoading(false);

    });

  }, [decodedName]);

  if (loading) return <p>Loading...</p>;

  if (!packageData) return <p>Package not found</p>;

  return (
    <div className="destination-container">

      <div className="destination-images">
        <ImageGallery images={packageData.images} />
      </div>

      <div className="booking-card">

        <h2>{packageData.name} Tour Package</h2>

        <p>
          Price per adult: ₹
          {packageData.price.toLocaleString("en-IN")}
        </p>

        <BookingForm selectedPackage={packageData} />

      </div>

    </div>
  );
}

export default Destination;
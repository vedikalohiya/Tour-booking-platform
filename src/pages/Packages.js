import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchPackages } from "../api/apiClient";
import ImageGallery from "../components/ImageGallery";

function Packages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages().then(data => {

const formattedPackages = data.map(pkg => ({

  packageId: pkg.PackageID,

  name: pkg.PackageName,

  price: parseInt(pkg.Price),

  images: Array.isArray(pkg.Images)
    ? pkg.Images
    : []

}));
console.log("FORMATTED:", formattedPackages);
      setPackages(formattedPackages);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading packages...</div>;
  }

  return (
    <div className="packages-page">
      <h1>Our Packages</h1>

      <div className="packages-grid">
        {packages.map((pkg, i) => (
          <div
            key={i}
            className="package-card"
            onClick={() => {
  console.log("CLICKED PACKAGE:", pkg);

  navigate(`/destination/${encodeURIComponent(pkg.name)}`, {
  state: {
    name: pkg.name,
    price: pkg.price,
    images: pkg.images,
    packageId: pkg.packageId
  }
})
            }}
          >
            <ImageGallery images={pkg.images} />

            <h3>{pkg.name}</h3>

            {/* ✅ formatted price */}
            <p>₹{pkg.price.toLocaleString("en-IN")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Packages;
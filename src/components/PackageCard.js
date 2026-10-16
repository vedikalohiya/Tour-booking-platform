function PackageCard({ pkg, onSelect }) {

  const image =
    pkg.Images?.[0]?.S ||
    pkg.Images?.[0] ||
    "";

  const name =
    pkg.Name?.S ||
    pkg.PackageName ||
    pkg.Name ||
    "";

  const price =
    pkg.Price?.N ||
    pkg.Price ||
    "";

  return (

    <div
      className="card"
      onClick={() => onSelect(pkg)}
    >

      <img
        src={image}
        alt={name}
      />

      <h3>{name}</h3>

      <p className="price">
        ₹{Number(price).toLocaleString("en-IN")}
      </p>

    </div>
  );
}

export default PackageCard;
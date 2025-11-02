import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: 50,
    discountPrice: 0,
    bedrooms: 1,
    bathrooms: 1,
    furnished: false,
    parking: false,
    type: "rent",
    offer: false,
    imageUrls: [],
    userRef: "",
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);

  const handleFiles = (e) => {
    const filesArr = Array.from(e.target.files || []);
    if (filesArr.length + selectedFiles.length > 6) {
      alert("You can only upload 6 images per listing.");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...filesArr]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const storeImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error(data.error || `Upload failed: ${errorText}`);

    const data = await res.json();

    return data.url;
  };

  const handleImagesSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Please select images first.");
      return;
    }
    if (selectedFiles.length > 6) {
      alert("You can upload a maximum of 6 images.");
      return;
    }

    setUploading(true);
    try {
      console.log("Selected files:", selectedFiles);

      const promises = selectedFiles.map((f) => storeImage(f));

      const urls = await Promise.all(promises);

      console.log("Uploaded URLs from Cloudinary:", urls);

      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));

      setSelectedFiles([]);

      alert("Images uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload images.");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData((prev) => {
      if (id === "sale" || id === "rent") {
        return { ...prev, type: id };
      }

      if (id === "parking" || id === "furnished" || id === "offer") {
        return { ...prev, [id]: checked };
      }

      if (type === "number" || type === "text" || type === "textarea") {
        return { ...prev, [id]: value };
      }

      return prev;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");

      if (
        formData.name === "" ||
        formData.description === "" ||
        formData.address === ""
      )
        return setError("You must fill all fields");

      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");

      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      alert("The listing was updated successfully!");
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-5 flex-1">
          <input
            id="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            maxLength={62}
            minLength={10}
            required
          />
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-3 rounded-lg"
            required
          />
          <input
            id="address"
            value={formData.address}
            onChange={handleChange}
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            required
          />

          <div className="flex gap-6 flex-wrap">
            <label className="flex items-center gap-2">
              <input
                id="sale"
                type="checkbox"
                checked={formData.type === "sale"}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span>Sell</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                id="rent"
                type="checkbox"
                checked={formData.type === "rent"}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span>Rent</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                id="parking"
                type="checkbox"
                checked={formData.parking}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span>Parking spot</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                id="furnished"
                type="checkbox"
                checked={formData.furnished}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span>Furnished</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                id="offer"
                type="checkbox"
                checked={formData.offer}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span>Offer</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-5">
              <input
                id="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                type="number"
                min="1"
                max="10"
                className="p-3 border rounded-lg"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-5">
              <input
                id="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                type="number"
                min="1"
                max="10"
                className="p-3 border rounded-lg"
              />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-5">
              <input
                id="regularPrice"
                value={formData.regularPrice}
                onChange={handleChange}
                type="number"
                min="50"
                max="10000000"
                className="p-3 border rounded-lg"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-5">
                <input
                  id="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  max="10000000"
                  className="p-3 border rounded-lg"
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={handleFiles}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImagesSubmit}
              disabled={uploading || selectedFiles.length === 0}
              className="uppercase p-3 text-green-600 border border-green-600 rounded hover:shadow-lg disabled:opacity-80 transition duration-200"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {selectedFiles.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Selected images (remove if needed):
              </p>
              <div className="flex gap-2 flex-wrap mb-3">
                {selectedFiles.map((file, idx) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div key={idx} className="relative">
                      <img
                        src={url}
                        alt={`sel-${idx}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(idx)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {formData.imageUrls.length > 0 && (
            <>
              <p className="text-sm text-gray-600 mb-2">Uploaded images:</p>
              <div className="flex gap-2 flex-wrap mb-3">
                {formData.imageUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`uploaded-${idx}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </>
          )}

          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-85 disabled:opacity-80 transition duration-150"
          >
            {loading ? "Creating..." : "Update Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;

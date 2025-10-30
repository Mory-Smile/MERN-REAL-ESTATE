import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setUser,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const [image, setImage] = useState(currentUser?.avatar || "");
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({});
  const [showListingsError, setshowListingsError] = useState(false);
  const [listings, setListings] = useState([]);

  const handleUploadChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Uploaded Image URL:", data.url);
        setImage(data.url);
        const updateRes = await fetch(`/api/user/update/${currentUser._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar: data.url }),
        });

        const updateData = await updateRes.json();
        if (!updateRes.ok)
          throw new Error(updateData.error || "Failed to update user");

        if (updateRes.ok) {
          dispatch(setUser(updateData));

          setImage(updateData.avatar);

          alert("Profile picture updated successfully!");
        }
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong while uploading");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        return;
      }
      dispatch(updateSuccess(data));
      alert("Profile updated successfully");
    } catch (error) {
      dispatch(updateFailure());
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/sign-out");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      console.log(error);
    }
  };

  const handleShowListings = async () => {
    try {
      setshowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setshowListingsError(true);
        return;
      }

      setListings(data);
    } catch (error) {
      setshowListingsError(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleUploadChange}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={image || currentUser.avatar}
          alt="profile image"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg bg-white outline-0"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg bg-white outline-0"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg bg-white outline-0"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 cursor-pointer uppercase hover:opacity-85 disabled:opacity-70 transition duration-200"
        >
          {uploading || loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white rounded-lg p-3 cursor-pointer uppercase hover:opacity-85 disabled:opacity-70 transition duration-200 text-center"
          to="/create-listing"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 p-2 cursor-pointer hover:bg-red-500 hover:text-white transition duration-300 rounded-md"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-600 mt-5">{error ? error : ""}</p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      {showListingsError && <p className="text-red-700 mt-5"></p>}

      {listings && listings.length > 0 && (
        <div className="flex flex-col gap-5">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {listings.map((listing, idx) => (
            <div
              className="border rounded-lg p-3 flex justify-between items-center gap-5"
              key={idx}
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col">
                <button className="text-red-700 uppercase">Delete</button>
                <button className="text-green-700 uppercase">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;

import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/user/userSlice";
import { useRef, useState } from "react";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const [image, setImage] = useState(currentUser?.avatar || "");
  const [uploading, setUploading] = useState(false);

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
        const updateRes = await fetch(`/api/user/${currentUser._id}`, {
          method: "PUT",
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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
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
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg bg-white outline-0"
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg bg-white outline-0"
        />
        <button
          disabled={uploading}
          className="bg-slate-700 text-white rounded-lg p-3 cursor-pointer uppercase hover:opacity-85 disabled:opacity-70 transition duration-200"
        >
          {uploading ? "Uploading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;

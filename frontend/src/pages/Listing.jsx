import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
} from "react-icons/fa";
import Contact from "../components/Contact";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);

  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        setError(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <>
      <main>
        {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
        {error && <p>Something went wrong!</p>}
        {listing && !loading && !error && (
          <div>
            <Swiper navigation>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[550px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
              <div className="font-semibold text-3xl py-2 px-10 w-full flex justify-center flex-col items-start">
                <div className="flex gap-2 py-5">
                  <h1>{listing.name}</h1>
                  <p>
                    {` - $ ${
                      listing.discountPrice
                        ? listing.discountPrice
                        : listing.regularPrice
                    }`}
                    {listing.type === "rent" && " / month"}
                  </p>
                </div>
                <p className="flex justify-center items-center gap-2 text-slate-600 my-3 mb-4 text-sm">
                  <FaMapMarkerAlt className="text-blue-700" />
                  {listing.address}
                </p>
                <div className="flex gap-5 w-[50%]">
                  <p className="bg-red-900 w-full max-w-[20rem] text-white text-center text-2xl py-3 px-6 rounded-md">
                    {listing.type === "rent" ? "For Rent" : "For Sale"}
                  </p>
                  {listing.offer && (
                    <p className="bg-blue-900 w-full max-w-[20rem] text-white text-center text-2xl py-3 px-6 rounded-md flex items-center justify-center">
                      ${+listing.regularPrice - +listing.discountPrice}
                    </p>
                  )}
                </div>

                <p className="text-slate-800 py-5">
                  <span className="font-semibold text-black">
                    Description - {"  "}
                  </span>
                  {listing.description}
                </p>
                <ul className="text-blue-900 font-semibold text-[0.9rem] sm:text-[1.15rem] flex flex-wrap gap-4 sm:gap-6 items-center">
                  <li className="flex items-center gap-1 whitespace-nowrap">
                    <FaBed className="text-3xl" />
                    {listing.bedrooms > 1
                      ? `${listing.bedrooms} beds`
                      : `${listing.bedrooms} bed `}
                  </li>
                  <li className="flex items-center gap-1 whitespace-nowrap">
                    <FaBath className="text-3xl" />
                    {listing.bathrooms > 1
                      ? `${listing.bathrooms} baths`
                      : `${listing.bathrooms} bath `}
                  </li>
                  <li className="flex items-center gap-1 whitespace-nowrap">
                    <FaParking className="text-3xl" />
                    {listing.parking ? "Parking spot" : "No Parking"}
                  </li>
                  <li className="flex items-center gap-1 whitespace-nowrap">
                    <FaChair className="text-3xl" />
                    {listing.furnished ? "Furnished" : "Unfurnished"}
                  </li>
                </ul>
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-85 p-3 my-5 w-full"
                >
                  Contact landlord
                </button>
                {contact && <Contact listing={listing} />}
              </div>
            </Swiper>
          </div>
        )}
      </main>
    </>
  );
};

export default Listing;

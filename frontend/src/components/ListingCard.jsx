import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingCard = ({ listing }) => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://f.hubspotusercontent20.net/hubfs/7324323/LuxuryRealEstateBranding.jpg"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition duration-300 rounded-xl"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-blue-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-black-500 mt-2 font-semibold">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.discountPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="text-slate-700 flex gap-5">
            <div className="font-bold text-sm">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>
            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;

import React from "react";
import travel from "../../assets/travel.jpg";
import { Link } from "react-router-dom";

function Hotels({ trip }) {
  return (
    <div>
      <h2 className="font-bold text-xl my-5"> Hotel Recommendation</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {trip?.tripPlan?.hotels.map((hotel) => (
          <Link
            to={
              "https://www.google.com/maps/search/?api=1&query=" + hotel?.hotelName || hotel?.HotelName + "," +
              hotel?.address || hotel?.hotelAddress
            }
            target="_blank"
          >
            <div className="hover:scale-105 cursor-pointertransition-all">
              <img
                src={travel}
                alt={hotel?.imageUrl || "Hotel Image"}
                className="rounded-xl object-cover h-40 w-full"
              />
              <div className="my-2 flex flex-col gap-2">
                <h2 className="font-medium">
                  {hotel?.hotelName || hotel?.HotelName}
                </h2>
                <h2 className="text-xs text-gray-400">
                  📍 {hotel?.address || hotel?.hotelAddress}
                </h2>
                <h2 className="font-bold">
                  💸 {hotel?.price || hotel?.Price || "N/A"}
                </h2>
                <h2>⭐ {hotel?.rating || hotel?.Rating || "N/A"}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
export default Hotels;

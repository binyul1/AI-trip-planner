import React from "react";
import travel from "../../assets/travel.jpg";
import { Button } from "../../components/ui/button";
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";

function PlaceCardItem({ place }) {
  return (
    <Link
      to={
        "https://www.google.com/maps/search/?api=1&query=" +
        place?.placeName +
        "," +
        place?.address
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="group border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all cursor-pointer overflow-hidden">
        <img src={travel} alt="" className="w-[150px] h-[130px] object-cover rounded-xl" />
        <div className="overflow-hidden">
          <h2 className="font-bold text-lg">{place?.placeName}</h2>
          <p className="text-sm text-gray-400 line-clamp-3 group-hover:line-clamp-none">
            {place?.description}
          </p>
          <h2 className="mt-2 line-clamp-1 group-hover:line-clamp-none hover:transition-normal">
            🕗 {place?.travelTime}
          </h2>
          {/* <Button className="size-sm">
            <FaMapLocationDot />
          </Button> */}
        </div>
      </div>
    </Link>
  );
}
``;

export default PlaceCardItem;

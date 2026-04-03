import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlaceDetails, PHOTO_REF_URL } from "../../service/GlobalApi";
import travel from "../../assets/travel.jpg";

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState();
  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: hotel?.hotelName || hotel?.HotelName,
    };
    const result = await GetPlaceDetails(data).then((resp) => {
      console.log(resp.data.places[0].photos[3].name);

      const PhotoUrl = PHOTO_REF_URL.replace(
        "{NAME}",
        resp.data.places[0].photos[3].name,
      );
      setPhotoUrl(PhotoUrl);
    });
  };

  return (
    <Link
      to={
        "https://www.google.com/maps/search/?api=1&query=" + hotel?.hotelName ||
        hotel?.HotelName + "," + hotel?.address ||
        hotel?.hotelAddress
      }
      target="_blank"
    >
      <div className="hover:scale-105 cursor-pointertransition-all">
        <img
          src={photoUrl || travel}
          alt={hotel?.imageUrl || "Hotel Image"}
          className="rounded-xl object-cover h-[180px] w-full"
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
  );
}

export default HotelCardItem;

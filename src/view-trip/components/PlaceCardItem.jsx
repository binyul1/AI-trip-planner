import React, { useEffect, useState } from "react";
import travel from "../../assets/travel.jpg";
import { Link } from "react-router-dom";
import { GetPlaceDetails, PHOTO_REF_URL } from "../../service/GlobalApi";

function PlaceCardItem({ place }) {
  const[photoUrl, setPhotoUrl] = useState()
      useEffect(() => {
        place && GetPlacePhoto();
      }, [place]);
    
      const GetPlacePhoto = async () => {
        const data = {
          textQuery: place?.placeName,
        };
        const result = await GetPlaceDetails(data).then((resp) => {    
          const PhotoUrl = PHOTO_REF_URL.replace(
            "{NAME}",resp.data.places[0].photos[3].name,
          );
          setPhotoUrl(PhotoUrl);
        });
      };
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
        <img src={photoUrl || travel} alt="" className="w-[150px] h-[130px] object-center rounded-xl" />
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

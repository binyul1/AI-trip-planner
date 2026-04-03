import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.jpg";
import { GetPlaceDetails, PHOTO_REF_URL } from "../../service/GlobalApi";
import { Link } from "react-router-dom";

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();
  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location?.label,
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
    <Link to={'/view-trip/'+trip?.id}>
      <div className="hover:scale-105 transition-all h-[300px] bg-slate-100 rounded-lg p-2">
        <img
          src={photoUrl || logo}
          alt="logo"
          className="size-48 object-cover rounded-xl"
        />
        <div>
          <h2 className="mt-2">{trip?.userSelection?.location?.label}</h2>
          <h2 className="text-sm text-gray-500 ">
            {trip?.userSelection?.NoOfDays} Days trip with{" "}
            {trip?.userSelection?.budget} Budget
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;

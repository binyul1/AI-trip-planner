import React from "react";
import placeholder from "../../assets/travel.jpg";
import { Button } from "../../components/ui/button";
import { CiShare2 } from "react-icons/ci";

function InfoSection({ trip }) {
  return (
    <div className="">
      <img
        src={placeholder}
        alt="Trip Image"
        className="h-[340px] w-full object-cover rounded"
      />
      <div className="justify-between flex items-start mt-5">
        <div className="my-5 flex flex-col gap-2">
          <h2 className="font-bold text-2xl">
            {trip?.userSelection?.location?.label}
          </h2>
          <div className="flex gap-5">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              📆 {trip.userSelection?.NoOfDays} Days{" "}
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              💰 {trip.userSelection?.budget} Budget{" "}
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              🧍 No of travelers : {trip.userSelection?.traveler}
            </h2>
          </div>
        </div>
        <Button>
          {" "}
          <CiShare2 />
        </Button>
      </div>
      <div></div>
    </div>
  );
}

export default InfoSection;

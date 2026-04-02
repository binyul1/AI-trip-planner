import { doc, getDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../service/firebaseConfig";
import { useState } from "react";
import InfoSection from "../components/InfoSection";
import Hotels from "../components/Hotels";

function Viewtrip() {
  const { tripid } = useParams();
  const [trip, setTrip] = useState({});

  useEffect(() => {
    tripid && GetTripData();
  }, [tripid]);

  /**
   * used to get info from get trip
   */

  const GetTripData = async () => {
    const tripRef = doc(db, "AITRIPS", tripid);
    const docSnap = await getDoc(tripRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };
  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      {/* Information Section */}
      <InfoSection trip={trip} />
      {/* Recommended Hotels */}
      <Hotels trip={trip} />
      {/* Daily Plans */}
      {/*Footers*/}
    </div>
  );
}

export default Viewtrip;

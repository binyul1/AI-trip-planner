import React, { useEffect, useState } from "react";
import { useNavigation } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../service/firebaseConfig";
import UserTripCardItem from "./components/UserTripCardItem";

function MyTrips() {
  const navigation = useNavigation();
  const [userTrips, setUserTrips] = useState([]);
  useEffect(() => {
    GetUserTrips();
  }, []);
  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigation("/");
    }
    const q = query(
      collection(db, "AITRIPS"),
      where("userEmail", "==", user?.email),
    );
    const querySnapshot = await getDocs(q);
    setUserTrips([]);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setUserTrips((prevVal) => [...prevVal, doc.data()]);
    });
  };
  return (
    <div className="sm:px-20 sm:flex sm:flex-col md:px-35 lg:px-55 xl:px-68 px-5 mt-10">
      <h2 className="font-bold text-3xl">My Trips</h2>
      <div className="grid grid-cols sm:grid-cols-2 mt-10 md:grid-cols-3 lg:grid-cols-4 gap-5 ">
        
        {userTrips?.length>0 ? userTrips.map((trip, index) => (
          <UserTripCardItem  trip={trip} />
        )) 
    : [1,2,3,4,5,6].map((item, index)=>(
        <div key={index} className="h-[300px] w-full bg-slate-200 animate-pulse rounded-lg">

        </div>
    ))}
      </div>
    </div>
  );
}

export default MyTrips;

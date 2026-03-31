import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "@/components/ui/input";
import {
  SelectBudgetOptions,
  SelectTravelesList,
} from "../../constants/options";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import { generateTravelPlan } from "../../service/AIModel";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Logo from "../../assets/logo.jpg";
import { FcGoogle } from "react-icons/fc";

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDailog, setOpenDailog] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    flow: "implicit",
    scope: "openid profile email",
    onSuccess: (response) => GetUserProfile(response),
    onError: (error) => console.log(error),
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDailog(true);
      return;
    }
    // Validation
    if (
      !formData?.location ||
      !formData?.NoOfDays ||
      !formData?.budget ||
      !formData?.traveler
    ) {
      toast("Please fill all the fields");
      return;
    }

    if (formData?.NoOfDays > 5) {
      toast("Please enter 5 days or less");
      return;
    }

    setLoading(true);

    try {
      // Extract values for the AI function
      const location = formData.location?.label || formData.location;
      const days = parseInt(formData.NoOfDays);
      const traveler = formData.traveler;
      const budget = formData.budget;

      console.log("Generating trip for:", { location, days, traveler, budget });

      // Call the AI service
      const tripPlan = await generateTravelPlan(
        location,
        days,
        traveler,
        budget,
      );

      console.log("Generated trip plan:", tripPlan);

      // Here you can store the trip plan in state or navigate to a results page
      // For now, just show success message
      toast("Trip plan generated successfully!");
    } catch (error) {
      console.error("Error generating trip:", error);
      toast("Failed to generate trip plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const GetUserProfile = async (tokenInfo) => {
    const accessToken = tokenInfo?.access_token || tokenInfo?.credential;

    if (!accessToken) {
      console.error("Google login did not return an access token", tokenInfo);
      return;
    }

    try {
      const resp = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        },
      );

      const userData = resp.data;
      const storedUser = { data: userData };

      localStorage.setItem("user", JSON.stringify(storedUser));
      setOpenDailog(false);
      toast("Login successful");
      console.log("Google user profile:", storedUser);
      return storedUser;
    } catch (error) {
      console.error("GetUserProfile error:", error);
      toast("Unable to fetch Google user profile");
      throw error;
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">
        Tell us your travel preferences 🏕️🌴
      </h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences. What is destination of
        choice?
      </p>
      <div className="mt-20 flex flex-col gap-20 ">
        <div>
          <h2 className="text-xl my-3 font-medium ">
            What is destination of choice?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("location", v);
              },
            }}
          />
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip?
          </h2>
          <Input
            placeholder={"Ex.3"}
            type="number"
            onChange={(e) => handleInputChange("NoOfDays", e.target.value)}
          />
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("budget", item.title)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow
                  ${formData?.budget == item.title && "shadow-lg border-black"}`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">
            Who do you plan on traveling with on your next adventure?
          </h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectTravelesList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("traveler", item.people)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow
                  ${formData?.traveler == item.people && "shadow-lg border-black"}`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="my-10 flex justify-end">
        <Button onClick={OnGenerateTrip} disabled={loading}>
          {loading ? "Generating Trip..." : "Generate Trip"}
        </Button>
      </div>
      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In with Google</DialogTitle>
            <DialogDescription>
              <img src={Logo} alt="Logo" className="size-15 rounded-[50%] " />
              <span className="block mt-3">
                Sign in to the App with Google authentication securely
              </span>
              <Button
                className="w-full mt-5 flex gap-4 items-center"
                onClick={login}
              >
                {" "}
                <FcGoogle className="h-7 w-7" />
                Sign In with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;

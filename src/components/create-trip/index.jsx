import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "@/components/ui/input";
import {
  SelectBudgetOptions,
  SelectTravelesList,
} from "../../constants/options";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { generateTravelPlan } from "../../service/AIModel";

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const OnGenerateTrip = async () => {
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
    </div>
  );
}

export default CreateTrip;

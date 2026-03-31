import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const defaultPrompt =
  'Respond only in valid JSON. Do not include any explanation, markdown, or code fences. Return a travel plan object with hotelOptions and itinerary. Example structure: {"location": "Paris", "noOfDays": 3, "traveler": "couple", "budget": "moderate", "hotelOptions": [{"name": "Hotel A", "address": "...", "price": "...", "imageUrl": "...", "geo": {"lat": ..., "lng": ...}, "rating": ..., "description": "..."}], "itinerary": [{"day": 1, "places": [{"name": "...", "details": "...", "imageUrl": "...", "geo": {"lat": ..., "lng": ...}, "ticketPrice": "...", "rating": ..., "travelTime": "...", "bestTimeToVisit": "..."}]}]}';

export function buildTravelPrompt(formData) {
  const location =
    formData?.location?.label || formData?.location || "your destination";
  const noOfDays = formData?.noOfDays || "your number of days";
  const traveler = formData?.traveler || "your travel group";
  const budget = formData?.budget || "your budget";

  return `Generate Travel Plan for Location: ${location}, for ${noOfDays} days, traveler: ${traveler}, budget: ${budget}. Give me a hotel options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions, and suggest an itinerary with placeName, place details, place image url, geo coordinates, ticket pricing, rating, travel time for each location for ${noOfDays} days with each day plan and best time to visit in JSON format.`;
}

export async function generateTravelPlan(prompt = defaultPrompt) {
  const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing environment variable VITE_GOOGLE_GEMINI_AI_API_KEY",
    );
  }

  const ai = new GoogleGenAI({
    apiKey,
  });

  const tools = [
    {
      googleSearch: {},
    },
  ];

  const config = {
    thinkingConfig: {
      thinkingLevel: ThinkingLevel.HIGH,
    },
    tools,
  };

  const model = "gemini-3-flash-preview";
  const contents = [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  let response;
  try {
    response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
  } catch (error) {
    if (
      error?.code === 429 ||
      error?.message?.includes("RESOURCE_EXHAUSTED") ||
      error?.message?.toLowerCase().includes("quota")
    ) {
      throw new Error(
        "Gemini API quota exceeded. Please check your Google Cloud plan/billing and try again.",
      );
    }
    throw error;
  }

  let generatedText = "";
  for await (const chunk of response) {
    generatedText += chunk.text ?? "";
  }

  try {
    return JSON.parse(generatedText);
  } catch (error) {
    throw new Error(
      `Failed to parse AI response as JSON: ${error.message}\nResponse text: ${generatedText}`,
    );
  }
}

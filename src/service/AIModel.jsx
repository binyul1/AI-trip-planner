import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY,
});

async function generateTravelPlan(location, days, traveler, budget) {
  const prompt = `Generate Travel Plan for Location: ${location}, for ${days} Days for ${traveler} with a ${budget} budget.
provide at least 4 hotel recomendations.
Return exactly valid JSON with these top-level keys: hotels and itinerary.

Each hotel object must use these keys:
- hotelName
- address
- description
- geoCoordinates
- imageUrl
- price
- rating

Each itinerary item must use these keys:
- day
- placeName
- description
- address
- imageUrl
- geoCoordinates
- ticketPricing
- rating
- travelTime
- time
structure for itinerary items must be as follows:
{
  "days": [
    {
      "day": 1,
      "places": [ ... ]
    },
    {
      "day": 2,
      "places": [ ... ]
    }
  ]
}

geoCoordinates should be an object with lat and lng values.

Return ONLY valid JSON without markdown, code fences, or any extra text. Start directly with { and end with }.`;

  console.log("Final prompt:", prompt);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Clean the response text to extract JSON
    let responseText = response.text.trim();
    console.log("Raw AI response:", responseText);

    // Remove markdown code blocks if present
    if (responseText.includes("```json")) {
      const jsonMatch = responseText.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        responseText = jsonMatch[1];
      } else {
        // Fallback: remove all markdown
        responseText = responseText
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      }
    } else if (responseText.startsWith("```")) {
      responseText = responseText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    // Clean up any remaining whitespace
    responseText = responseText.trim();

    console.log("Cleaned response:", responseText);

    // Parse the JSON response
    const jsonResponse = JSON.parse(responseText);
    return jsonResponse;
  } catch (error) {
    console.error("Error generating travel plan:", error);
    throw error;
  }
}

export { generateTravelPlan };

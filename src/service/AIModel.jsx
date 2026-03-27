import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY,
});

async function generateTravelPlan(location, days, traveler, budget) {
  const prompt = `Generate Travel Plan for Location: ${location}, for ${days} Days for ${traveler} with a ${budget} budget.

Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each Of the location for ${days} days with each day plan With best time visit in JSON format.

IMPORTANT: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text. Start directly with { and end with }.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Clean the response text to extract JSON
    let responseText = response.text.trim();
    console.log("Raw AI response:", responseText);

    // Remove markdown code blocks if present
    if (responseText.includes('```json')) {
      const jsonMatch = responseText.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        responseText = jsonMatch[1];
      } else {
        // Fallback: remove all markdown
        responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      }
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```\s*/, '').replace(/\s*```$/, '');
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

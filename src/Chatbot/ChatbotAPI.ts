export const updateServiceId = async (questionFunnel: string) => {
  try {
    const response = await fetch("http://localhost:5000/update-service-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Question-Funnel": questionFunnel,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // Return the parsed JSON data
    return await response.json(); // Ensure this returns the object containing serviceId
  } catch (error) {
    console.error("Failed to update service ID:", error);
    return null; // You can return null or handle it based on your requirements
  }
};

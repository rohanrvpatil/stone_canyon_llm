export const sendMessageToChatbot = async (
  geminiApiKey: string,
  prompt: string
) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate content: ${response.statusText}`);
    }

    const data = await response.json();
    // console.log(data);
    const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text; //this line contains the response
    return botResponse;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};

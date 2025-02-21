import axios from "axios";

const isLocal = window.location.hostname === "localhost";
const FIREBASE_FUNCTIONS_URL = isLocal
  ? "http://localhost:5001/cs-chat-app-8489c/us-central1/chatWithAssistant"
  : "https://cs-chat-app-8489c.web.app/api/chat"; // Calls the Firebase hosting rewrite in production

export const sendMessageToAssistant = async (
  messages: { role: string; content: string }[]
) => {
  try {
    const response = await axios.post(FIREBASE_FUNCTIONS_URL, { messages });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};

const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Ensure this is set in Firebase

exports.chatWithAssistant = functions.https.onRequest(async (req, res) => {
  try {
    console.log("➡️ Received request body:", JSON.stringify(req.body, null, 2));

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      console.error("❌ Invalid request format:", req.body);
      return res.status(400).json({ error: "Invalid request format" });
    }

    // **Step 1: Create a Thread** (OpenAI requires a thread for assistant messages)
    console.log("📝 Creating OpenAI Thread...");
    const threadResponse = await axios.post(
      "https://api.openai.com/v1/threads",
      {},
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2", // Required header
        },
      }
    );

    const threadId = threadResponse.data.id;
    console.log("✅ Thread created with ID:", threadId);

    // **Step 2: Send the User Message to the Thread**
    const userMessage = messages[messages.length - 1].content;
    console.log("💬 Sending user message:", userMessage);

    await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        role: "user",
        content: userMessage, // Send only the latest user message
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2", // Required header
        },
      }
    );

    console.log("✅ Message sent to thread successfully");

    // **Step 3: Run the Assistant in the Thread**
    console.log("🤖 Running assistant in thread...");
    const runResponse = await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/runs`,
      {
        assistant_id: "asst_4CArBJBuogmnmL4JoepFm1CQ",
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2", // Required header
        },
      }
    );

    const runId = runResponse.data.id;
    console.log("✅ Run started with ID:", runId);

    // **Step 4: Poll for Assistant Response**
    let runStatus = "in_progress";
    let retryCount = 0;

    while (runStatus === "in_progress" || runStatus === "queued") {
      if (retryCount > 10) {
        console.error("⏳ Run polling exceeded max retries");
        break;
      }

      console.log(`🔄 Checking run status... (Attempt ${retryCount + 1})`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before checking again

      const checkRunResponse = await axios.get(
        `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
            "OpenAI-Beta": "assistants=v2", // Required header
          },
        }
      );

      runStatus = checkRunResponse.data.status;
      console.log("🔍 Current run status:", runStatus);

      retryCount++;
    }

    if (runStatus !== "completed") {
      console.error("❌ Run did not complete successfully:", runStatus);
      return res.status(500).json({ error: "Assistant run did not complete" });
    }

    // **Step 5: Get the Messages from the Thread**
    console.log("📩 Fetching messages from thread...");
    const messagesResponse = await axios.get(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2", // Required header
        },
      }
    );

    const messagesData = messagesResponse.data.data;
    console.log("📜 Messages received:", JSON.stringify(messagesData, null, 2));

    // **Step 6: Extract the Most Recent Assistant Message**
    const lastAssistantMessage = messagesData
      .filter((msg) => msg.role === "assistant") // Get only assistant messages
      .sort((a, b) => b.created_at - a.created_at)[0]; // Get the latest one

    let assistantMessage = "No response received.";
    if (lastAssistantMessage && lastAssistantMessage.content.length > 0) {
      assistantMessage = lastAssistantMessage.content
        .map((item) => item.text?.value || "")
        .join(" ");
    }

    console.log("✅ Final Assistant response:", assistantMessage);
    res.status(200).json({ role: "assistant", content: assistantMessage });
  } catch (error) {
    console.error(
      "🚨 Error in chatWithAssistant:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Internal server error" });
  }
});

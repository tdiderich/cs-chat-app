import { useState } from "react";
import {
  Container,
  TextInput,
  Button,
  Box,
  Paper,
  ScrollArea,
} from "@mantine/core";
import { sendMessageToAssistant } from "./firebase";
function App() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const response = await sendMessageToAssistant(newMessages);

    if (response) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: response.content },
      ]);
    } else {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Failed to get response." },
      ]);
    }

    setLoading(false);
  };

  return (
    <Box
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container size="md" style={{ width: "100%", maxWidth: "600px" }}>
        <Paper
          shadow="xs"
          p="md"
          withBorder
          style={{ height: "80vh", display: "flex", flexDirection: "column" }}
        >
          <ScrollArea style={{ flex: 1, padding: "10px" }}>
            <Box>
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  p="xs"
                  style={{
                    color: "black",
                    backgroundColor:
                      msg.role === "user" ? "#e0f7fa" : "#eeeeee",
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "8px",
                  }}
                >
                  <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
                  {msg.content}
                </Box>
              ))}
            </Box>
          </ScrollArea>
          <Box mt="md" style={{ display: "flex", gap: "8px" }}>
            <TextInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1 }}
              disabled={loading}
            />
            <Button onClick={handleSend} loading={loading}>
              Send
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;

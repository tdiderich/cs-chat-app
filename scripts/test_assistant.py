import openai
import config


def test_assistant():
    OPENAI_API_KEY = config.config["OPENAI_API_KEY"]
    client = openai.OpenAI(api_key=OPENAI_API_KEY)

    assistant_id = "asst_4CArBJBuogmnmL4JoepFm1CQ"

    # Create a new thread
    thread = client.beta.threads.create()
    thread_id = thread.id

    # Send a message to the assistant
    message = client.beta.threads.messages.create(
        thread_id=thread_id, role="user", content="Hello, can you introduce yourself?"
    )

    # Run the assistant
    run = client.beta.threads.runs.create(
        thread_id=thread_id, assistant_id=assistant_id
    )

    # Wait for the run to complete
    import time

    while True:
        run_status = client.beta.threads.runs.retrieve(
            thread_id=thread_id, run_id=run.id
        )
        if run_status.status in ["completed", "failed", "cancelled"]:
            break
        time.sleep(1)  # Wait before checking again

    # Retrieve the response
    messages = client.beta.threads.messages.list(thread_id=thread_id)

    print("\n--- Assistant Conversation ---\n")
    for msg in reversed(messages.data):
        print(f"[{msg.role.capitalize()}]:\n{msg.content}\n")
    print("\n-----------------------------\n")


if __name__ == "__main__":
    test_assistant()

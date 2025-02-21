# 🚀 Chat App with Firebase + OpenAI Assistants API

This project is a chat application powered by **Firebase Functions** and the **OpenAI Assistants API**, with hosting on **Firebase Hosting**.

---

## 📂 Getting Started

Follow these steps to set up and deploy the chat app.

### 1️⃣ Clone the Repository

First, clone the repository to your local machine:

```sh
git clone https://github.com/tdiderich/cs-chat-app.git
cd your-repo-name
```

---

## 🔥 Firebase Setup

This project uses **Firebase Hosting** and **Firebase Functions**. Follow these steps to configure Firebase for the project.

### 2️⃣ Set Up Firebase in Your Project

Make sure you have **Firebase CLI** installed:

```sh
npm install -g firebase-tools
```

Then, log in to Firebase:

```sh
firebase login
```

Initialize Firebase in your project:

```sh
firebase init
```

When prompted, select:

- ✅ **Functions** (for backend logic)
- ✅ **Hosting** (to serve the web app)

For **Functions Setup**, choose:

- **Language**: TypeScript
- **ESLint**: Yes
- **Dependencies**: Install automatically

For **Hosting Setup**, choose:

- **Public directory**: `public`
- **Single-page app (SPA)**: Yes

---

## 🛠️ 3️⃣ Set Up Environment Variables

### Local Development (`.env` File)

Inside the `functions/` directory, create a `.env` file:

```sh
cd functions
touch .env
```

Add the following environment variables:

```ini
OPENAI_API_KEY=your-openai-api-key
```

Then install **dotenv** to load environment variables locally:

```sh
npm install dotenv
```

### Production Environment Variables

Set environment variables for Firebase Functions:

```sh
firebase functions:env:set OPENAI_API_KEY="your-openai-api-key"
```

Then, deploy the new environment variables:

```sh
firebase deploy --only functions
```

---

## 🛆 4️⃣ Install Dependencies

Run the following command to install all required npm packages:

```sh
npm install
```

For Firebase Functions, navigate into the `functions/` directory and install dependencies:

```sh
cd functions
npm install
```

---

## 🚀 5️⃣ Deploy to Firebase

Once everything is set up, deploy the application:

```sh
firebase deploy
```

This will deploy both **Firebase Functions** and **Firebase Hosting**.

If you only want to deploy specific parts:

```sh
firebase deploy --only functions
firebase deploy --only hosting
```

---

## 🛠️ Development Mode

To run the Firebase emulator locally for development:

```sh
firebase emulators:start
```

This allows you to test functions and hosting **without deploying**.

---

## 💌 API Usage

The frontend interacts with Firebase Functions via:

```ts
import { sendMessageToAssistant } from "./firebase";

sendMessageToAssistant({ role: "user", content: "Hello, AI!" })
  .then((response) => console.log("Assistant Response:", response))
  .catch((error) => console.error("Error:", error));
```

---

## 🎯 Summary

✅ Clone the repo  
✅ Set up Firebase Hosting & Functions  
✅ Configure API keys via `.env` and Firebase  
✅ Install dependencies (`npm install`)  
✅ Deploy with `firebase deploy`  

---

## 🙌 Contributing

Feel free to open **issues** or submit **pull requests** if you want to improve the project!

---


// backend/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = "https://text.pollinations.ai/";

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await axios.post(
      API_URL,
      {
        messages,
        model: "openai",
        private: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.send({ result: response.data });
  } catch (error) {
    console.error("Error al generar respuesta:", error.message);
    res.status(500).json({ error: "Error al generar respuesta." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend Pollinations corriendo en http://localhost:${PORT}`)
);

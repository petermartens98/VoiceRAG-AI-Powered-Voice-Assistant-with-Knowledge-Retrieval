
# **VoiceRAG: AI-Powered Voice Assistant with Knowledge Retrieval**

---

## 🧠 Overview

**VoiceRAG** combines **voice interaction** with **retrieval-augmented generation (RAG)** for intelligent, conversational access to your stored knowledge.
It integrates **ElevenLabs Voice Agents**, **OpenAI GPT models**, **Supabase/Vector databases**, and **n8n automations** for smooth knowledge-to-voice workflows.

---

## ☁️ Google Drive File Storage Integration

Store and manage files in Google Drive for embedding and retrieval through automated pipelines.

---

## ⚙️ n8n Automations

### 🔹 File Upload → Embedding Vector Storage

Automated flow for uploading and embedding files into your RAG database.

<img width="1006" height="394" alt="n8n upload flow" src="https://github.com/user-attachments/assets/631a018c-9f95-4e9c-ac1e-4d97fb15b868" />

#### Key Features

* Automatic vector embedding pipeline
* Integration with OpenAI Embeddings and Supabase
* Event-triggered from Google Drive uploads
* Works with .txt or .pdf files

---

### 🔹 Voice Assistant RAG Webhook

n8n flow connecting the voice interface to your RAG backend.

<img width="680" height="526" alt="n8n webhook flow" src="https://github.com/user-attachments/assets/5b2104ed-2572-4ccf-9d11-1493ffd52afa" />

#### Key Features

* Webhook connection to ElevenLabs Voice Agent
* Uses **OpenAI GPT-4o-mini** (swap models freely)
* RAG system prompt integration for context-aware responses

---

## 🗣️ ElevenLabs Voice Agent

* **Agent Dashboard:** [ElevenLabs Agents](https://elevenlabs.io/app/agents/agents)
* **Model Used:** GPT-4o-mini *(customizable)*
* **RAG Tool Integration:**

  1. Add tool titled `Knowledge Retrieval Tool` (connected to your n8n webhook)
* **Custom System Prompt:**
  Designed for retrieval-augmented conversations powered by your uploaded files.

---

## 💻 React Web App Integration

Frontend built with React for seamless voice interactions and knowledge querying.
Connects directly to the ElevenLabs Agent and n8n RAG workflows for end-to-end conversational intelligence.

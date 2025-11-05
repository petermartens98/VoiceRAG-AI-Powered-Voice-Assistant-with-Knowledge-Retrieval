# 🎙️ VoiceRAG: AI-Powered Voice Assistant with Knowledge Retrieval

> Transform your documents into an intelligent voice assistant—ask questions naturally and get accurate, context-aware answers drawn from your own knowledge base.

## 🌟 Overview

**VoiceRAG** is an end-to-end voice-powered knowledge assistant that bridges the gap between natural conversation and document intelligence. Simply speak your questions and receive instant, accurate answers synthesized from your uploaded documents.

### What It Does
Upload your documents (PDFs, text files, reports, guides) and VoiceRAG automatically:
- Processes and embeds them into a searchable vector database
- Understands your spoken questions using advanced AI
- Retrieves the most relevant information from your documents
- Synthesizes natural, conversational responses
- Delivers answers back to you through voice

### Technology Stack
- **🗣️ Voice Interaction** - ElevenLabs Voice Agents for natural conversation
- **🧠 AI Intelligence** - OpenAI GPT models for context-aware responses
- **📚 Document Retrieval** - Vector embeddings and semantic search with Cohere reranking
- **⚡ Automation** - n8n workflows for seamless data pipeline orchestration
- **💾 Storage** - Google Drive for documents, Supabase for vector database

### Use Cases
- Personal knowledge base (research papers, notes, documentation)
- Business information lookup (policies, procedures, product specs)
- Customer support (FAQs, troubleshooting guides)
- Educational assistant (study materials, course content)
- Legal/medical document consultation

---

## 🏗️ Architecture

```
User Voice Input → ElevenLabs Agent → n8n Webhook → RAG Search (Supabase) → Cohere Rerank → GPT Response → Voice Output
                                                            ↑
                                                    Embedded Documents
                                                            ↑
                                          Google Drive Files → n8n Pipeline
```

---

## 🚀 Getting Started

### Prerequisites

- [n8n](https://n8n.io/) (self-hosted or cloud)
- [Supabase](https://supabase.com/) account
- [OpenAI API](https://platform.openai.com/) key
- [Cohere API](https://cohere.com/) key (for reranking)
- [ElevenLabs](https://elevenlabs.io/) account
- [Google Cloud](https://console.cloud.google.com/) project (for Drive integration)

---

## 📁 1. Google Drive Setup

### Enable File Storage for Documents

1. **Create Google OAuth Credentials**
   - Follow the [n8n Google OAuth guide](https://docs.n8n.io/integrations/builtin/credentials/google/oauth-single-service/#create-your-google-oauth-client-credentials)
   - Enable Google Drive API in your Google Cloud Console

2. **Connect to n8n**
   - Add Google Drive credentials in n8n
   - Create a dedicated folder for VoiceRAG documents
   - Set up file watch triggers for automatic processing

---

## 🗄️ 2. Supabase Database Setup

### Initialize Vector Database

Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable the pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create documents table with vector embeddings
CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding VECTOR(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster similarity searches
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create function to search documents by semantic similarity
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding VECTOR(1536),
  match_count INT DEFAULT 5,
  filter JSONB DEFAULT '{}'
)
RETURNS TABLE (
  doc_id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id AS doc_id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM documents d
  WHERE d.metadata @> filter
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### What This Does
- **pgvector extension**: Enables vector similarity operations
- **documents table**: Stores text chunks with their vector embeddings (1536 dimensions for OpenAI)
- **match_documents function**: Performs semantic search and returns most relevant documents

---

## ⚙️ 3. n8n Workflow Setup

### 📦 Import Pre-built Workflows

The repository includes pre-configured n8n workflows with sensitive information redacted:
- **File**: `n8n_workflow_redacted.json`
- All API keys, credentials, and sensitive data replaced with `REDACTED`
- Import into your n8n instance and replace placeholders with your actual credentials

### 🔹 Workflow 1: File Upload → Vector Embedding Pipeline

**Purpose**: Automatically process uploaded files and store them as searchable embeddings

<img width="1006" height="394" alt="n8n upload flow" src="https://github.com/user-attachments/assets/631a018c-9f95-4e9c-ac1e-4d97fb15b868" />

#### Flow Steps:
1. **Google Drive Trigger** - Watches for new files (.txt, .pdf)
2. **File Content Extraction** - Reads and parses document content
3. **OpenAI Embeddings** - Converts document content to 1536-dim vectors
4. **Supabase Insert** - Stores embeddings with metadata in database

#### Key Configuration:
- **Embedding Model**: `text-embedding-3-small`
- **Supported Formats**: .txt, .pdf

---

### 🔹 Workflow 2: Voice Agent RAG Webhook

**Purpose**: Handles real-time voice queries by retrieving relevant context and generating responses

<img width="680" height="526" alt="n8n webhook flow" src="https://github.com/user-attachments/assets/5b2104ed-2572-4ccf-9d11-1493ffd52afa" />

#### Flow Steps:
1. **Webhook Trigger** - Receives query from ElevenLabs agent
2. **Query Embedding** - Converts user question to vector using OpenAI
3. **Supabase Match** - Finds top-k most relevant document chunks
4. **Cohere Reranking** - Re-ranks results for improved relevance
5. **Context Assembly** - Formats retrieved documents as context
6. **GPT Generation** - Creates answer using retrieved knowledge with system prompt:
   ```
   # OBJECTIVE
   - Retrieve and synthesize the most relevant information from the vector database, 
     which serves as your primary knowledge source.
   - Use this information to generate accurate, context-aware, and helpful responses 
     to the user's requests.
   - Prioritize precision, clarity, and relevance in all outputs.
   ```
7. **Response** - Returns formatted answer to voice agent

#### Webhook Configuration:
- **Method**: POST
- **Timeout**: 30 seconds (for complex queries)

---

## 🗣️ 4. ElevenLabs Voice Agent Configuration

### Setup Your Voice Agent

1. **Navigate to**: [ElevenLabs Agent Dashboard](https://elevenlabs.io/app/agents/agents)

2. **Create New Agent**:
   - Choose voice and language
   - Select conversation model: **GPT-4o-mini** (recommended for speed/cost) or **GPT-4o** (for complex reasoning)

3. **Add RAG Tool**:
   - Tool Name: `rag-knowledge-tool`
   - Description: "Search the knowledge base for relevant information to answer user questions"
   - Webhook URL: Your n8n webhook endpoint from Workflow 2
   - Method: POST

4. **System Prompt Example**:
```
You are a helpful and knowledgeable assistant designed to use the 'rag_knowledge_tool' to answer user queries.

# Objective
- Leverage the 'rag_knowledge_tool' to retrieve and synthesize relevant information.
- Provide accurate, concise, and context-aware responses.
- Maintain a cooperative and informative tone.

# Personality
- Friendly, clear, and confident in explanations.
- Curious and proactive in finding the best possible answer.
- Professional and respectful, yet conversational and easy to follow.
- Focused on usefulness and precision rather than verbosity.

# Guidelines
1. Always query the 'rag_knowledge_tool' when additional context or factual information is needed.
2. When responding:
   - Be clear and well-structured.
   - Cite or reference retrieved knowledge naturally.
   - Keep the tone professional, approachable, and helpful.
3. If information cannot be found, acknowledge that and provide the best reasoning possible.

# Goal
Deliver precise, knowledge-grounded responses that help the user efficiently reach their objective.
```

### Testing Your Agent
- Use the test interface to verify RAG tool calls
- Check that document retrieval is working
- Tune the system prompt based on response quality

---

## 💻 5. React Frontend

### Repository Structure
- **Frontend Code**: Located in the `frontend/` folder
- **n8n Workflows**: `n8n_workflow_redacted.json` (import and configure with your credentials)

### Features
- Direct integration with ElevenLabs Voice Agent SDK
- Visual feedback during voice interactions
- Document upload interface
- Conversation history

### Installation & Setup

1. **Clone the Repository**
```bash
git clone https://github.com/petermartens98/VoiceRAG-AI-Powered-Voice-Assistant-with-Knowledge-Retrieval.git
cd VoiceRAG-AI-Powered-Voice-Assistant-with-Knowledge-Retrieval/frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Your Agent ID**
   - Open `frontend/src/App.js`
   - Replace the placeholder `agentId` with your own ElevenLabs Agent ID:
   ```javascript
   const agentId = "your-agent-id-here"; // Replace with your actual agent ID
   ```

4. **Run the Application**
```bash
npm start
```

### Updating the App
```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Restart the application
npm start
```

---

## 📊 Usage Example

**User**: "What were the key findings from the Q4 report?"

**System Flow**:
1. Voice → ElevenLabs → n8n webhook
2. n8n embeds query → searches Supabase
3. Retrieves relevant Q4 report chunks
4. Cohere re-ranks results for best relevance
5. GPT synthesizes answer from top context
6. Response → ElevenLabs → Voice output

**Assistant**: "According to your Q4 report, the key findings were: revenue grew 23% year-over-year, customer retention improved to 94%, and the new product line exceeded targets by 18%."

---

---

## 📚 Resources

- [n8n Documentation](https://docs.n8n.io/)
- [Supabase Vector Guide](https://supabase.com/docs/guides/ai/vector-columns)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [ElevenLabs Voice Agents](https://elevenlabs.io/docs/conversational-ai/overview)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

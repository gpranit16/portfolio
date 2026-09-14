# Syncora — Tech Stack & Deployment Architecture

## Frontend
- **Framework**: React, TypeScript, Vite, Vanilla CSS
- **Real-Time Client**: Socket.io-client
- **Media & Voice/Video**: WebRTC APIs, Browser MediaStream APIs
- **Transcription**: Browser Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`)
- **Hosting / Deployment**: Vercel (`https://syncora-rho.vercel.app`)

## Backend
- **Runtime & Framework**: Node.js, Express, JavaScript
- **Real-Time Server**: Socket.io server with room-based pub/sub
- **Signaling**: WebRTC peer-to-peer signaling & group meeting session management
- **Authentication**: JWT authentication with protected REST routes and verified Socket.io handshakes
- **AI Integrations**: OpenRouter API (`https://openrouter.ai/api/v1`) using model `nvidia/nemotron-3.5-lightning:free`
- **Hosting / Deployment**: Render (`https://syncora-8wbn.onrender.com`)

## Database
- **Provider**: TiDB Cloud (Serverless MySQL-compatible Distributed SQL)
- **Persisted Entities**:
  - `users`: User profiles, credentials, timestamps
  - `workspaces`: Workspace teams, roles, memberships
  - `channels`: Team conversation spaces
  - `messages`: Channel text messages, attachments, pinned flags
  - `direct_messages`: 1-to-1 conversation messages and DM timeline events
  - `message_reactions`: Persistent emoji reactions per message
  - `tasks`: Title, description, assignee, priority, status (Pending, In Progress, Completed), due date, `source_meeting_id`
  - `meetings`: Meeting ID, unique `meeting_code`, host ID, title, mode (`voice` or `video`), status (`active` / `ended`), timestamps
  - `meeting_participants`: Participant ID, user ID, role (`host` / `participant`), mute/camera states, join/leave timestamps
  - `meeting_transcripts`: Meeting ID, speaker attribution, language, segment text, timestamps
  - `meeting_summaries`: Summary, decisions, action items, blockers, deadlines

## Security & Secrets Management
- All sensitive credentials (`NVIDIA_API_KEY`, `JWT_SECRET`, `DB_PASSWORD`, `DB_HOST`, `DB_USER`) strictly reside on the Render backend environment.
- Frontend only receives non-secret variables (e.g. `VITE_API_URL`). Never expose API keys or passwords to the client.

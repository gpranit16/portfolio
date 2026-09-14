# Syncora — AI Meeting Intelligence, Transcripts & Tasks

## Meeting Transcription Architecture
- **Transcription Engine**: Browser Web Speech API (`SpeechRecognition`) executing locally on each participant's client.
- **Data Flow**:
  - Participant speaks -> Local STT captures audio -> Transcribed text chunk -> Socket.io emit -> Backend buffer -> Persistent storage in TiDB `meeting_transcripts`.
- **Speaker Attribution**: Backend maps transcript segments to authenticated user IDs to attribute spoken lines correctly (e.g. `Pranit: Kal backend complete karna hai.`).
- **Language & Multilingual Handling**: Supports English, Hindi, Hinglish, and mixed Hindi/English phrases naturally without forced translation.
- **Known Reliability Limitations (Important)**:
  - Browser SpeechRecognition sessions can timeout or drop words during natural long discussions or backgrounding.
  - Syncora treats current transcription as an MVP with known reliability limitations; a dedicated server-side STT service is planned for guaranteed 100% full-meeting capture.

## Meeting AI Analysis (Nvidia Nemotron 3.5)
- **Model**: `nvidia/nemotron-3.5-lightning:free` via OpenRouter backend endpoint.
- **Extracted Artifacts**:
  1. **Executive Summary**: Clear overview of topics discussed.
  2. **Decisions**: Explicit recorded agreements (e.g. "TiDB selected as database").
  3. **Action Items**: Concrete work items with owners (e.g. "Complete API - Rahul").
  4. **Blockers**: Active hurdles reported (e.g. "Database migration blocked").
  5. **Deadlines**: Stated delivery dates (only if explicitly mentioned in transcript).
- **Anti-Hallucination Guardrails**:
  - If a meeting is casual/trivial ("Hello, how are you?"), the AI outputs:
    - *Decisions*: None recorded.
    - *Action Items*: None identified.
    - *Blockers*: None identified.
    - *Deadlines*: None recorded.
  - The AI never invents fake tasks, fake owners, or fabricated deadlines.

## Action Items → Kanban Tasks Workflow
- Extracted action items do **NOT** automatically flood the tasks board.
- The user reviews the action item in the Meeting Summary UI and explicitly clicks `[+ Create Task]`.
- Task modal allows verifying title, assignee, priority, and due date.
- The resulting task in TiDB stores `source_meeting_id`, providing two-way traceability back to the meeting transcript.

## Workspace AI Assistant vs. Meeting AI
- **Workspace AI Assistant**: Operates in Channels and DMs to summarize recent conversations, list pending sprint tasks, and explain blockers within authorized user permissions.
- **Meeting AI**: Operates strictly on meeting transcripts to produce structured summaries, decisions, action items, and task conversions.

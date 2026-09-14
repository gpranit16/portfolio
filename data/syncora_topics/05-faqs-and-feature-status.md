# Syncora — FAQs, Capabilities & Guardrails

## Common Questions & Verified Answers
- **What is Syncora?**
  Syncora is an AI-powered team collaboration workspace combining team channels, direct messages, Kanban tasks, voice/video calls, and meeting intelligence with AI summary generation.
- **Can I call someone?**
  Yes. 1-to-1 voice calling is fully working and tested in direct messages. 1-to-1 video calling is implemented but held for further reliability improvements.
- **Can I start a group meeting?**
  Yes. You can start a Voice Meeting (audio-only) or Video Meeting from any channel.
- **Can people join without being invited manually?**
  Yes. Team members in the channel see a live `🟢 Meeting in progress` indicator and can join, or click a shareable meeting link (`/meet/:meetingCode`).
- **Who is the Host?**
  The user who starts the meeting is the Host. The host has server-validated permissions to invite members, mute participants, remove participants, or end the meeting for everyone.
- **Can participants remove others?**
  No, only the meeting host can remove or mute other participants. Participants can mute themselves and toggle their camera.
- **Does DM call history persist?**
  Yes. Call records (completed, missed, declined, failed) with timestamps and durations are saved in the DM timeline in TiDB Cloud.
- **Does the transcript persist?**
  Yes. Transcripts are stored in TiDB Cloud when captured, though current browser-based speech recognition can have gaps during long or noisy meetings.
- **Can AI summarize meetings and create tasks?**
  Yes. Meeting AI generates executive summaries, decisions, action items, blockers, and deadlines. Action items can be converted into Kanban tasks upon explicit user confirmation (`[+ Create Task]`).
- **Does the AI understand Hindi / Hinglish?**
  Yes, the pipeline supports English, Hindi, and Hinglish transcripts and summary generation.

## Feature Status Registry
- `1-to-1 Voice Calling`: Fully working & tested
- `1-to-1 Video Calling`: Implemented, held for reliability refinement
- `Group Voice Meetings`: Fully working (WebRTC Mesh)
- `Group Video Meetings`: Fully working (WebRTC Mesh)
- `Browser Speech-to-Text`: Implemented with known browser STT reliability limitations (MVP)
- `Meeting AI Summaries & Extraction`: Fully working (Nvidia Nemotron-3.5-Lightning)
- `Action Items to Tasks`: Fully working with user confirmation modal
- `Channels, DMs, Reactions, Pinning`: Fully working in real-time via Socket.io
- `Kanban Tasks`: Fully working (Pending / In Progress / Completed)

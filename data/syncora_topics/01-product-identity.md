# Syncora — Product Identity & Core Architecture

## Product Identity
- **Product Name**: Syncora
- **Product Type**: AI-Powered Team Collaboration & Productivity Workspace Platform.
- **Repository**: https://github.com/gpranit16/syncora
- **Live Production Frontend**: https://syncora-rho.vercel.app (Vercel)
- **Production Backend**: https://syncora-8wbn.onrender.com (Render)
- **Database**: TiDB Cloud (MySQL-compatible Serverless DB)

Syncora unifies Slack/Teams-style messaging, Kanban task management, audio/video meetings, and AI workspace intelligence into a single platform.

## Core Lifecycle Flow
1. **Communicate**: Team connects via structured Channels (#general, #mini-project, #backend, #frontend) or 1-to-1 Direct Messages.
2. **Discuss Work**: Teams exchange messages, file attachments, and real-time emoji reactions (👍, ❤️, 😂, 🚀, 👀, 🎉), with message editing, replies, and pinning.
3. **Manage Tasks**: Native Kanban board with Pending, In Progress, and Completed states.
4. **Call / Meet**: Start 1-to-1 Voice Calls or multi-participant Channel Voice & Video Meetings.
5. **Capture Transcripts**: Real-time browser speech recognition on each participant's audio.
6. **Meeting AI**: Nvidia Nemotron-3.5-Lightning extracts executive summary, recorded decisions, identified action items, active blockers, and deadlines.
7. **Action Items → Tasks**: User confirms AI-extracted action items with `[+ Create Task]` to convert them directly into Kanban tasks with traceability back to `source_meeting_id`.

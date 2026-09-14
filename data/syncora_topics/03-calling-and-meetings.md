# Syncora — Calling & Group Meetings System

## 1-to-1 Calling (Direct Messages)
- **1-to-1 Voice Call (Status: Fully Working & Tested)**:
  - Supports outgoing/incoming call ringing, accept/reject, connected duration timer, mute/unmute, call termination, and WebRTC cleanup.
  - Generates persistent DM timeline events: completed, missed, rejected, failed, or cancelled calls with exact durations.
  - Deduplication handled via unique `call_id`.
- **1-to-1 Video Call (Status: Implemented, but Held for Reliability)**:
  - Implemented with local preview, remote video feed, camera and mic toggling.
  - Due to browser ICE candidate and camera negotiation variances across environments, 1-to-1 video is intentionally held for further reliability refinement.
  - **Important Rule**: Do not claim 1-to-1 video calling is 100% production-ready; explain that it is implemented and held for reliability polish.

## Group Meetings (Channels)
- **Modes**:
  - **Voice Meeting**: Audio-only room.
  - **Video Meeting**: Multi-participant video room with camera toggles.
- **Starting a Meeting**: Started directly inside any Channel (`Start Meeting` modal -> Topic + Format). The creator automatically becomes the **Host**.
- **Live Channel Indicator**: Real-time `🟢 Meeting in progress [Join Meeting]` banner visible to channel members via Socket.io.
- **Duplicate Prevention**: Backend prevents multiple simultaneous meetings in the same channel.
- **Shareable Links**: Each meeting generates a unique unpredictable code (e.g. `/meet/Ab7Kx29Q`). Authorized team members can open the link, configure mic/camera in the pre-join preview, and enter.
- **WebRTC Architecture**: Multi-peer WebRTC Mesh network.
  - Suitable for small-to-medium teams (8–12 participants).
  - High participant counts experience higher CPU and network load in mesh topologies; SFU architecture (e.g. LiveKit/Mediasoup) is planned for future enterprise scale.
- **Host Controls (Validated Server-Side)**:
  - Host can invite participants, server-side mute any participant, remove participants from the call, or end the meeting for everyone.
  - Normal participants can mute themselves, toggle camera, view roster, and leave. They cannot remove or mute others.

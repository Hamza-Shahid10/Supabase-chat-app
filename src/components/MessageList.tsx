"use client";

export default function MessageList({
  messages,
}: {
  messages: any[];
}) {
  return (
    <div style={{ flex: 1, padding: 10, overflowY: "auto" }}>
      {messages.map((m) => (
        <div key={m.id} style={{ marginBottom: 8 }}>
          <b>{m.sender_id.slice(0, 6)}:</b> {m.content}
        </div>
      ))}
    </div>
  );
}

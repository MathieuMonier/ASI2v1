import React, { useEffect, useRef, useState } from "react";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    const trimmed = currentMessage.trim();
    if (!trimmed) return;

    const now = new Date();
    const time =
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0") +
      ":" +
      String(now.getSeconds()).padStart(2, "0");

    const messageData = {
      room,
      author: username,
      message: trimmed,
      time,
    };

    await socket.emit("send_message", messageData);

    // On l'ajoute localement
    setMessageList((list) => [...list, messageData]);
    setCurrentMessage("");
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageList]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Room : {room}</p>
      </div>

      <div className="chat-body">
        <div className="message-container">
          {messageList.map((msg, index) => {
            const isOwnMessage = msg.author === username;
            return (
              <div
                key={index}
                className={`message ${isOwnMessage ? "you" : "other"}`}
              >
                <div className="message-content">
                  <p>{msg.message}</p>
                </div>
                <div className="message-meta">
                  <span>{msg.time}</span>
                  <span>{msg.author}</span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="chat-footer">
        <input
          type="text"
          placeholder="Écris un message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;

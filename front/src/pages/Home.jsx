import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBroadcast } from "../hooks/useBroadcast";
import { NotificationCenter } from "../components/NotificationsCenter";

// --- MODIFICATION ICI : On commente l'import du mauvais socket ---
// import { socket } from "../socket";
// import Chat from "../components/Chat";

export default function Home({ user }) {
  const navigate = useNavigate();

  // WebSocket existant (notifications) - On ne touche pas, c'est sur le port 8090
  const { connected, messages, clear } = useBroadcast("http://localhost:8090/ws");

  const consume = () => {
    messages.shift();
  };

  // ====== Chat (DÉSACTIVÉ TEMPORAIREMENT) ======
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentPeer, setCurrentPeer] = useState(null);

  const username = user?.username || user?.name || user?.login;

  /* COMMENTAIRE DU FIX :
     J'ai commenté tout le useEffect ci-dessous car il utilise "socket" qui est cassé.
     Une fois le jeu réparé, on créera un "ChatSocketService" propre pour réactiver ça.
  */
  useEffect(() => {
    if (!username) return;

    // socket.emit("register_user", username);

    // const handleOnlineUsers = (users) => {
    //   setOnlineUsers(users);
    // };

    // const handlePrivateChatStarted = ({ room, with: peer }) => {
    //   setCurrentRoom(room);
    //   setCurrentPeer(peer);
    //   socket.emit("join_room", room);
    // };

    // const handlePrivateChatInvitation = ({ room, from }) => {
    //   setCurrentRoom(room);
    //   setCurrentPeer(from);
    //   socket.emit("join_room", room);
    // };

    // socket.on("online_users", handleOnlineUsers);
    // socket.on("private_chat_started", handlePrivateChatStarted);
    // socket.on("private_chat_invitation", handlePrivateChatInvitation);

    // return () => {
    //   socket.off("online_users", handleOnlineUsers);
    //   socket.off("private_chat_started", handlePrivateChatStarted);
    //   socket.off("private_chat_invitation", handlePrivateChatInvitation);
    // };
  }, [username]);

  const handleUserClick = (u) => {
    if (u.username === username) return;
    // socket.emit("start_private_chat", { targetSocketId: u.socketId });
  };

  return (
      <div className="text-center space-y-6 mt-10">
        <h2 className="text-2xl font-bold">Select an action</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={() => navigate("/sell")} className="bg-green-600 text-white px-4 py-2 rounded">
            Sell
          </button>
          <button onClick={() => navigate("/buy")} className="bg-blue-600 text-white px-4 py-2 rounded">
            Buy
          </button>
          <button onClick={() => navigate("/create")} className="bg-purple-600 text-white px-4 py-2 rounded">
            Create
          </button>

          {/* C'est ce bouton qui nous intéresse */}
          <button onClick={() => navigate("/game")} className="bg-red-600 text-white px-4 py-2 rounded">
            Play Game
          </button>
        </div>

        <div>
          <p>WebSocket: {connected ? "connecté" : "déconnecté"}</p>
          <NotificationCenter queue={messages} onConsume={consume} duration={3000} />
        </div>
      </div>
  );
}
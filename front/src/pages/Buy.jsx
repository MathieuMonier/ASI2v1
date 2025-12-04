import React, { useEffect, useState, useContext } from "react";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import { useBroadcast } from "../hooks/useBroadcast";
import { NotificationCenter } from "../components/NotificationsCenter";

export default function Buy() {
  const { user, login } = useContext(AuthContext); 
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const { connected, messages, clear } = useBroadcast("http://localhost:8090/ws");

  // retire le 1er message affiché
  const consume = () => { messages.shift(); };

  useEffect(() => {
    fetch(`${API_BASE_URL}/store/cards_to_sell`)
      .then(res => res.json())
      .then(setCards)
      .catch(console.error);
  }, []);

  const handleBuy = async (card) => {
    if (!user) return alert("Please login first");

    const order = { user_id: user.id, card_id: card.id, store_id: -1 };
    const res = await fetch(`${API_BASE_URL}/store/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (res.ok) {
      const text = `Bought ${card.name} for $${card.price}`; 
      try {
        const res = await fetch(`http://localhost:8090/notify?msg=${encodeURIComponent(text)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ msg: "Bonjour" })
        });
        if (!res.ok) throw new Error("Erreur lors de la notification");
        setMessage("Notification envoyée avec succès !");
      } catch (err) {
        setMessage(err.message);
      }
      setCards(cards.filter(c => c.id !== card.id));
      setSelected(null);

      const updatedUserRes = await fetch(`${API_BASE_URL}/user/${user.id}`);
      const updatedUser = await updatedUserRes.json();
      login(updatedUser); 
      
    } else {
      alert("Purchase failed");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2 overflow-auto">
        <h2 className="text-xl font-bold mb-2 text-center">Buy Cards</h2>
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              {["Name","Desc","Family","HP","Energy","Defense","Attack","Price"].map(h => (
                <th key={h} className="border p-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cards.map(card => (
              <tr key={card.id} onClick={() => setSelected(card)} className="hover:bg-gray-50 cursor-pointer">
                <td className="border p-2">{card.name}</td>
                <td className="border p-2">{card.description}</td>
                <td className="border p-2">{card.family}</td>
                <td className="border p-2">{card.hp}</td>
                <td className="border p-2">{card.energy}</td>
                <td className="border p-2">{card.defence}</td>
                <td className="border p-2">{card.attack}</td>
                <td className="border p-2">${card.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white p-4 shadow rounded">
        {selected ? (
          <>
            <h3 className="text-xl font-bold mb-2">{selected.name}</h3>
            <img src={selected.imgUrl} alt={selected.name} className="mb-4 w-48 h-64 object-contain border rounded mx-auto" />
            <p className="mb-1">{selected.description}</p>
            <p className="mb-3"><strong>Price:</strong> ${selected.price}</p>
            <button 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
              onClick={() => handleBuy(selected)}
            >
              Buy
            </button>
            
          </>
        ) : <p>Select a card to view details</p>}
      </div>
      <NotificationCenter queue={messages} onConsume={consume} duration={10000} />
      {message && <p className="text-center mt-2">{message}</p>}
    </div>
  );
}

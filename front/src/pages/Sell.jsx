import React, { useEffect, useState, useContext } from "react";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

export default function Sell() {
  const { user, login } = useContext(AuthContext);
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!user) return;

    fetch(`${API_BASE_URL}/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        return Promise.all(
          (data.cardList || []).map(cardId => 
            fetch(`${API_BASE_URL}/card/${cardId}`).then(res => res.json())
          )
        );
      })
      .then(fullCards => setCards(fullCards))
      .catch(console.error);
  }, [user]);

  const handleSell = async (card) => {
    if (!user) return alert("Please login first");
    
    const order = { user_id: user.id, card_id: card.id, store_id: -1 };
    const res = await fetch(`${API_BASE_URL}/store/sell`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (res.ok) {
      alert(`Sold ${card.name} for $${card.price}`);
      setCards(cards.filter(c => c.id !== card.id));
      setSelected(null);

      const updatedUserRes = await fetch(`${API_BASE_URL}/user/${user.id}`);
      const updatedUser = await updatedUserRes.json();
      login(updatedUser); 
    } else {
      alert("Sale failed");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2 overflow-auto">
        <h2 className="text-xl font-bold mb-2 text-center">Sell Cards</h2>
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
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
              onClick={() => handleSell(selected)}
            >
              Sell
            </button>
          </>
        ) : <p>Select a card to view details</p>}
      </div>
    </div>
  );
}

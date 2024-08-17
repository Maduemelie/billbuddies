import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

const App = () => {
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const handleShowAddFriendForm = () => {
    setShowAddFriendForm((showAddFriendForm) => !showAddFriendForm);
  };
  const handleAddFriend = (friend) => {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriendForm(false);
  };
  const handleSelectFriend = (friend) => {
    setSelectedFriend(selectedFriend === friend ? null : friend);
    setShowAddFriendForm(false);
  };

  const handleSplitBill = (value, whoPaid) => {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? {
              ...friend,
              balance: friend.balance + (whoPaid === 'user' ? value : -value),
            }
          : friend
      )
    );
    setSelectedFriend(null);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSetSelectedFriend={handleSelectFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriendForm && <AddFriendForm onAddFriends={handleAddFriend} />}
        <Button onClick={handleShowAddFriendForm}>
          {showAddFriendForm ? 'Close' : 'Add Friend'}
        </Button>
      </div>

      {selectedFriend && (
        <SplitBillForm
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
};
export default App;

const FriendsList = ({ friends, onSetSelectedFriend, selectedFriend }) => {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSetSelectedFriend={onSetSelectedFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
};

const Friend = ({ friend, onSetSelectedFriend, selectedFriend }) => {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <div>
        <h3>{friend.name}</h3>
        {friend.balance > 0 ? (
          <p className="green">
            {friend.name} owes you ${friend.balance}
          </p>
        ) : friend.balance < 0 ? (
          <p className="red">
            You owe ${friend.name} ${Math.abs(friend.balance)}
          </p>
        ) : (
          <p>You and {friend.name} are even</p>
        )}
      </div>

      <Button onClick={() => onSetSelectedFriend(friend)}>
        {isSelected ? 'Close' : ' Select'}
      </Button>
    </li>
  );
};

const Button = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
};

const AddFriendForm = ({ onAddFriends }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriends(newFriend);
    setName('');
    setImage('https://i.pravatar.cc/48');
  };
  return (
    <form className="add-friend-form" onSubmit={handleSubmit}>
      <label> 🎅🏽Friend's Name</label>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label> 🎅🏽Friend's Image URL</label>
      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
};

const SplitBillForm = ({ selectedFriend, onSplitBill }) => {
  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  const paidByFriend = bill ? bill - paidByUser : '';
  const [whoIsPaying, setWhoIsPaying] = useState('user');
  const handleSubmit = (e) => {
    e.preventDefault();
    onSplitBill(
      whoIsPaying === 'user' ? paidByUser : paidByFriend,
      whoIsPaying
    );
  };

  return (
    <form className="split-bill-form" onSubmit={handleSubmit}>
      <h2> Split a Bill with {selectedFriend.name}</h2>
      <label> 💵 Bill's Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label> 🧍🏽‍♂️ Your Bill</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label> 🧍🏽‍♂️🧍🏽‍♂️ {selectedFriend.name}'s Bill</label>
      <input type="text" placeholder="Value" disabled value={paidByFriend} />

      <label> 💵 Who is paying</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split</Button>
    </form>
  );
};

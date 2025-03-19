import React, { useState, useEffect } from "react";
import axios from "axios";
import { sha256 } from "crypto-hash";
import './App.css'

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username && password) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      onLogin(username);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input
        type="text"
        placeholder="Username"
        className="p-2 border border-gray-300 rounded mb-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="p-2 border border-gray-300 rounded mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};

const Dashboard = ({ username, onLogout }) => {
  const dataArray = [
    { id: 1, info: "Informasi A" },
    { id: 2, info: "Informasi B" },
    { id: 3, info: "Informasi C" },
    { id: 4, info: "Informasi D" },
    { id: 5, info: "Informasi E" },
  ];
  const [label, setLabel] = useState(dataArray[0].info);
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("pria");
  const [hashShow, setHashShow] = useState("");

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        console.log("Response Data:", response.data);
        setPosts(response.data.slice(0, 10));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const deleteItem = (id) => {
    setPosts(posts.filter((item) => item.id !== id));
  };

  const removeKey = (id) => {
    setPosts(posts.map((item) => (item.id === id ? { ...item, body: undefined } : item)));
  };

  const hashData = async () => {
    if (!name) {
      alert("Masukkan nama depan terlebih dahulu!");
      return;
    }

    const today = new Date();
    const dateStr =
      `${today.getDate()}`.padStart(2, "0") +
      `${today.getMonth() + 1}`.padStart(2, "0") +
      today.getFullYear();

    const inputStr = `${dateStr}${name}${gender}ifabula`;
    const hash = await sha256(inputStr);
    setHashShow(hash);
    console.log(`Input: ${inputStr}`);
    
    console.log(`SHA-256 Hash: ${hash}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-max bg-gray-100 p-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Selamat Datang, {username}!</h1>
      <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 mb-4" onClick={onLogout}>
        Logout
      </button>

      <a href="https://snack.expo.dev/@aldijoko/react-native-test" target="_blank">React Native Test</a>

      <h2 className="text-xl font-bold">Label: {label}</h2>
      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mt-2" onClick={() => setLabel(dataArray[Math.floor(Math.random() * dataArray.length)].info)}>
        Ubah Label
      </button>

      <h2 className="text-xl font-semibold mt-8">Daftar Post</h2>
      <table className="table-auto border-collapse border border-gray-300 mt-4 w-full max-w-2xl">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Body</th>
            <th className="border border-gray-300 px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="bg-white text-center">
              <td className="border border-gray-300 px-4 py-2">{post.id}</td>
              <td className="border border-gray-300 px-4 py-2">{post.title}</td>
              <td className="border border-gray-300 px-4 py-2">
                {post.body || <span className="text-red-500">Body Dihapus</span>}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button className="bg-red-500 text-white px-2 py-1 rounded mr-2 my-2" onClick={() => deleteItem(post.id)}>
                  Hapus
                </button>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => removeKey(post.id)}>
                  Hapus Body
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2 flex flex-col items-center">
        <h2 className="text-xl font-semibold mt-8 mb-2">Hash Data</h2>
      
      <input
        type="text"
        placeholder="Masukkan Nama Depan"
        className="p-2 border border-gray-300 rounded mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        className="p-2 border border-gray-300 rounded mb-2"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="pria">Pria</option>
        <option value="wanita">Wanita</option>
      </select>
      <button className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700" onClick={hashData}>
        Hash Data
      </button>
      <p>Data Hash :</p>
      <p>{hashShow}</p>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(localStorage.getItem("username"));

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    setUser(null);
  };

  return user ? <Dashboard username={user} onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />;
};



export default App

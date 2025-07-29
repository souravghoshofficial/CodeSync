import { useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";

const EditorPage = () => {
  const [clients, setClients] = useState([
    { socketId: 1, username: "Sourav Ghosh" },
    { socketId: 2, username: "Abhijit Rabidas" },
    { socketId: 3, username: "Subhra Shaw" },
    { socketId: 4, username: "Rohit Gupta" },
  ]);

  return (
    <div className="w-full h-screen bg-black text-white flex">
      {/* Aside */}
      <div className="border-r border-zinc-600 p-4 flex flex-col items-center justify-between">
        <div>
          <div className="border-b border-zinc-700">
            <img
              className="w-60"
              src="/code-sync-logo.png"
              alt="code sync logo"
            />
          </div>
          <h4 className="mt-2 text-lg font-semibold">Connected</h4>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <div className="w-full">
          <button className="w-full py-2 bg-gray-100 text-black font-semibold rounded-md cursor-pointer">
            Copy Room ID
          </button>
          <button className="mt-4 w-full py-2 bg-red-500 text-black font-semibold rounded-md cursor-pointer">
            Leave
          </button>
        </div>
      </div>

      {/* Editor */}
      <div>
        <Editor />
      </div>
    </div>
  );
};

export default EditorPage;

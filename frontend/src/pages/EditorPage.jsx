import { useState, useRef, useEffect } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import { useLocation, useNavigate, Navigate, useParams } from "react-router";
import toast from "react-hot-toast";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("Socket Error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit("join", {
        roomId,
        username: location.state?.username,
      });

      // Listenting for joined event
      socketRef.current.on("joined", ({ clients, username, socketId }) => {
        if (username !== location.state.username) {
          toast.success(`${username} joined the room.`);
        }
        setClients(clients);
        socketRef.current.emit('code-sync', {
          code: codeRef.current,
          socketId
        });
      });

      // Listening for disconntected
      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId != socketId);
        });
      });
    };

    init();
    return () => {
      if (socketRef.current) {
        socketRef.current.off("joined");
        socketRef.current.off("disconnected");
        socketRef.current.disconnect();
      }
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID copied to clipboard');
    } catch (error) {
      toast.error('Could not copy Room Id')
    }
  }

  async function leaveRoom() {
    reactNavigator('/')
  }


  if(!location.state){
    return <Navigate to="/" />
  }

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
          <button onClick={copyRoomId} className="w-full py-2 bg-gray-100 text-black font-semibold rounded-md cursor-pointer">
            Copy Room ID
          </button>
          <button onClick={leaveRoom} className="mt-4 w-full py-2 bg-red-500 text-black font-semibold rounded-md cursor-pointer">
            Leave
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="w-full">
        <Editor roomId={roomId} socketRef={socketRef} onCodeChange={(code) => {codeRef.current = code}} />
      </div>
    </div>
  );
};

export default EditorPage;

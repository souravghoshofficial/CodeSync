import { useState , useEffect } from 'react'
import {v4 as uuid} from "uuid"
import toast from "react-hot-toast"
import { useNavigate } from "react-router"

const Home = () => {

  const navigate = useNavigate();

  const [roomId, setRoomId] = useState('')
  const [username, setUsername] = useState('')

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    toast.success("New Room Created !");
  }

  const joinRoom = (e) => {
    e.preventDefault();
    if(!roomId || !username){
      toast.error("Room ID and Username is required")
      return
    }
    navigate(`/editor/${roomId} ` , {
      state: {
        username
      }
    });
  }

  useEffect(() => {
    async function init() {
      await fetch(import.meta.env.VITE_BACKEND_URL)
    }
  }, [])
  


  return (
    <div className='w-full h-screen bg-black text-white flex items-center justify-center'>
        <div className='bg-zinc-900 rounded-lg max-w-[90%] px-8 py-6'>
            <img className='w-52 md:w-60' src="/code-sync-logo.png" alt="code sync logo" />
            <h4 className='mt-2'>Paste invitation ROOM ID</h4>
          <form onSubmit={joinRoom}>
              <div className='mt-2 w-full flex flex-col gap-4'>
                <input value={roomId} onChange={(e) => setRoomId(e.target.value)} className='border border-gray-300 px-3 py-2 rounded-md outline-none focus:border-blue-500' type="text" placeholder='ROOM ID' />
                <input value={username} onChange={(e) => setUsername(e.target.value)} className='border border-gray-300 px-3 py-2 rounded-md outline-none focus:border-blue-500' type="text" placeholder='USERNAME' />
            </div>
            <div className='w-full mt-4 flex justify-end'>
              <button type='submit' className='px-6 py-2 bg-[#00bf63] hover:bg-[#00bf5c] text-black font-semibold cursor-pointer rounded-sm transition-all duration-300'>Join</button>
            </div>
          </form>
            <h4 className='my-3 mx-auto'>
                Don't have an invite code ?&nbsp;
                <a className='text-[#00bf63]' href="" onClick={createNewRoom}>Create new room</a>
            </h4>
        </div>
    </div>
  )
}

export default Home
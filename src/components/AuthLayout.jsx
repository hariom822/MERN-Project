import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const bgImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPIy_drURd0T1bmhiYyLm4XBvXzhWH7CkZ6w&s";
const full="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU1xvUsHVFGQIKyjbBQ_cs1ieYe6k-dGFlHw&s";
export default function AuthLayout({ children }) {
  const navigate=useNavigate();
  return (

    <div className="min-h-screen flex items-center justify-center  to-[#2c5364] px-4 bg-no-repeat bg-center bg-cover"
     style={{ backgroundImage: `url(${full})` }}>
      
      <motion.div
        className="w-full max-w-md bg-white  rounded-2xl shadow-2xl p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
  <div className="flex gap-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full p-2 shadow-xl">
    
    <button
      onClick={() => navigate("/")}
      className="px-6 py-2 rounded-full text-white font-semibold
                 hover:bg-white/20 transition-all duration-300"
    >
      Login
    </button>

    <button
      onClick={() => navigate("/signup")}
      className="px-6 py-2 rounded-full text-white font-semibold
                 hover:bg-white/20 transition-all duration-300"
    >
      Signup
    </button>

  </div>
</div>

        {children}
      </motion.div>
    </div>
  );
}

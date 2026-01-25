import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useState } from "react";
import { object } from "framer-motion/client";

export default function Login() {
  const [data,setData]=useState({
    email:"",
    password:"",
  })
  const [error,setError]=useState({})

  const datasubmit=(e)=>{
    e.preventDefault();
    const err={};
    if(!data.name){
      err.name="name is requrire";
    }
    if(!data.email){
      err.email="email is require"
    }
    setError(err);
    if(Object.keys().length==0){
     console.log(data.name);
     console.log(data.password);
     setData({
      name:"",
      email:"",
     })
    }
   
  }
  return (
    <AuthLayout>
      <motion.div
        initial={{ x: 100, opacity: 1 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ y: -100}}
        transition={{ duration: 1}}
      >
        <form onSubmit={datasubmit}>
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={data.name}
           onChange={(e)=>setData({...data,name:e.target.value})} />
           {error.name &&<p className="text-red-600">{error.name}</p>}

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={data.password}
          onChange={(e)=>setData({...data,password:e.target.value})}
        />
         {error.email &&<p className="text-red-600">{error.email}</p>}
        <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
          Login
        </button>

        <p className="text-center text-sm mt-6">
          New here?
          <Link to="/signup" className="text-indigo-600 font-semibold ml-1">
            Create account
          </Link>
        </p>
        </form>
      </motion.div>
    </AuthLayout>
  );
}

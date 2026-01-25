import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useState } from "react";
import axios from "axios"
export default function Signup() {
  const [form,setForm]= useState({
    name:"",
    email:"",
    password:""
  })
  const [error,setError]=useState({})

  const formdatasubmit=async(e)=>{
    e.preventDefault();
    const err={};
    if(!form.name){
      err.name="name is require";

    }
    if(!form.email){
      err.email="email is require";
    }
    if(!form.password){
      err.password="password is require";
    }
    setError(err)
    if(Object.keys(err).length==0){
      const data=await axios.post("http://localhost:8000/signup",form)
      console.log(data)
      setError({
        name:"",
        email:"",
        password:""
      })
    }

  }
  return (
    <AuthLayout>
      <motion.div
         initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ y: -100}}
        transition={{ duration: 1}}
      >
        <form onSubmit={formdatasubmit}>
        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account 
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={form.name}
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />
        

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={form.email}
          onChange={(e)=>setForm({...form,email:e.target.value})}
        />
        

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={form.password}
          onChange={(e)=>setForm({...form,password:e.target.value})}
        />

        <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
          Sign Up
        </button>
        </form>
        <p className="text-center text-sm mt-6">
          Already have an account?
          <Link to="/" className="text-indigo-600 font-semibold ml-1">
            Login
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}

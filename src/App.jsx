import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Login from "./components/Login";
import ForgetPassword from "./components/Forget";
import Dashboard from "./components/Dashboard";
import User from "./components/User";
import EditEmployee from "./components/EditEmployee";
import AddEmployee from "./components/AddEmployee";
import AddCourse from "./components/Addcorse";
import AddSkill from "./components/Addskill";
import Profile from "./components/Profile";
import Reset from "./components/Reset";
import Course from "./components/Course";
import Employee from "./components/Employee";
import Skill from "./components/Skill";
import Student from "./components/Student";
export default function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/header" element={<Header />} />
        <Route path="/editemploye/:id" element={<EditEmployee />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/addemployee" element={<AddEmployee />} />
        <Route path="/addcourse" element={<AddCourse />} />
        <Route path="/student" element={<Student />} />
          <Route path="/course" element={<Course />} />
          <Route path="/skill" element={<Skill />} />
        <Route path="/forget" element={<ForgetPassword />} />
          <Route path="/reset" element={<Reset />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user" element={<User />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/addskill" element={<AddSkill />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

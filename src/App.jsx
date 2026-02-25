import { useLocation, Routes, Route } from "react-router-dom";
import Header from "./pages/components/Header.jsx";
import Sidebar from "./pages/components/Sidebar.jsx";

import Login from "./Login.jsx";
import ForgetPassword from "./pages/components/Forget.jsx";
import Dashboard from "./pages/components/Dashboard.jsx";
import User from "./pages/components/User.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx"
import EditEmployee from "./pages/components/EditEmployee.jsx";
import AddEmployee from "./pages/components/AddEmployee.jsx";
import AddCourse from "./pages/components/Addcorse.jsx";
import AddSkill from "./pages/components/Addskill.jsx";
import Profile from "./pages/components/Profile.jsx";
import Reset from "./pages/components/Reset.jsx";
import Course from "./pages/components/Course.jsx";
import Employee from "./pages/components/Employee.jsx";
import Skill from "./pages/components/Skill.jsx";
import Student from "./pages/components/Student.jsx";
import Tutors from "./pages/components/Tutors.jsx";
import Batch from "./pages/components/Batch.jsx";
import Visitors from "./pages/components/Visitors.jsx";
import Timetable from "./pages/components/Timetable.jsx";
import Mapping from "./pages/components/Mapping.jsx";
import Fees from "./pages/components/Fees.jsx"
import Documentation from "./pages/components/Documentation.jsx";
import TutorMapping from "./pages/components/TutorMapping.jsx"
import Attendance from "./pages/components/Attendance.jsx";

import StudentDashboard from "./pages/components/student/StudentDashboard.jsx";
import StudentLayout from "./pages/components/student/StudentLayout.jsx";
import StudentSidebar from "./pages/components/student/StudentSidebar.jsx";
import MyFees from "./pages/components/student/MyFees.jsx";
import MyProfile from "./pages/components/student/MyProfile.jsx";
import MyTimetable from "./pages/components/student/MyTimetable.jsx";
import StudentCourse from "./pages/components/student/Studentcourse.jsx";
import Feedback from "./pages/components/Feedback.jsx";

import Sidebartutor from "./pages/components/tutor/Sidebar.jsx";
import Batchtutor from "./pages/components/tutor/batchtutor.jsx";
import Coursetutor from "./pages/components/tutor/coursetutor.jsx";
import Studenttutor from "./pages/components/tutor/studenttutor.jsx";
import Timetabletutor from "./pages/components/tutor/timetabletutor.jsx";
import Tutorsall from "./pages/components/tutor/tutorall.jsx";
export default function App() {
     const location = useLocation();
const hideHeader = location.pathname === "/login" || location.pathname === "/forget"

  return (
    <>
     {!hideHeader && <Header />}
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/forget" element={<ForgetPassword />} />
        <Route path="/reset" element={<Reset />} />

         <Route path="/" element={
          <ProtectedRoute allowedRoles={["student","admin","employee","tutor"]}>
             <Dashboard/>
          </ProtectedRoute>
        } />
         <Route path="/studentdashboard" element={
          <ProtectedRoute allowedRoles={["student"]}>
             <StudentLayout/>
          </ProtectedRoute>
        } />
         <Route path="/student/course" element={
          <ProtectedRoute allowedRoles={["student"]}>
             <StudentCourse/>
          </ProtectedRoute>
        } />
         <Route path="/student/sidebar" element={
          <ProtectedRoute allowedRoles={["student"]}>
             <StudentSidebar/>
          </ProtectedRoute>
        } />
     
         <Route path="/student/profile" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <MyProfile />
          </ProtectedRoute>
        } />
         <Route path="/student/timetable" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <MyTimetable />
          </ProtectedRoute>
        } />
         <Route path="/student/fees" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <MyFees />
          </ProtectedRoute>
        } />
         <Route path="/tutor/sidebar" element={
          <ProtectedRoute allowedRoles={["tutor"]}>
            <Sidebartutor />
          </ProtectedRoute>
        } />
         <Route path="/tutor/all" element={
          <ProtectedRoute allowedRoles={["tutor"]}>
            <Tutorsall />
          </ProtectedRoute>
        } />
         <Route path="/tutor/timetable" element={
          <ProtectedRoute allowedRoles={["tutor"]}>
            <Timetabletutor />
          </ProtectedRoute>
        } />
         <Route path="/tutor/student" element={
          <ProtectedRoute allowedRoles={["tutor"]}>
            <Studenttutor />
          </ProtectedRoute>
        } />
         <Route path="/tutor/course" element={
          <ProtectedRoute allowedRoles={["tutor"]}>
            <Coursetutor />
          </ProtectedRoute>
        } />
         <Route path="/tutor/batch" element={
          <ProtectedRoute allowedRoles={["tutor"]}>
            <Batchtutor />
          </ProtectedRoute>
        } />

         <Route path="/attendance" element={
          <ProtectedRoute allowedRoles={["admin","tutors"]}>
            <Attendance />
          </ProtectedRoute>
        } />
         <Route path="/feedback" element={
          <ProtectedRoute allowedRoles={["admin","tutors"]}>
            <Feedback />
          </ProtectedRoute>
        } />
        {/* //////////////////////////////////////////////////////// */}

        <Route path="/employee" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Employee />
          </ProtectedRoute>
        } />
         <Route path="/documentation" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Documentation />
          </ProtectedRoute>
        } />


        <Route path="/addemployee" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AddEmployee />
          </ProtectedRoute>
        } />

         <Route path="/tutormaping" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <TutorMapping />
          </ProtectedRoute>
        } />

        <Route path="/editemploye/:id" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <EditEmployee />
          </ProtectedRoute>
        } />

        <Route path="/addcourse" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AddCourse />
          </ProtectedRoute>
        } />

        <Route path="/course" element={
          <ProtectedRoute allowedRoles={["admin","employee"]}>
            <Course />
          </ProtectedRoute>
        } />

        <Route path="/skill" element={
          <ProtectedRoute allowedRoles={["admin","employee"]}>
            <Skill />
          </ProtectedRoute>
        } />

        <Route path="/addskill" element={
          <ProtectedRoute allowedRoles={["admin","employee"]}>
            <AddSkill />
          </ProtectedRoute>
        } />

        <Route path="/tutors" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Tutors />
          </ProtectedRoute>
        } />

        <Route path="/batch" element={
          <ProtectedRoute allowedRoles={["admin","employee"]}>
            <Batch />
          </ProtectedRoute>
        } />

        <Route path="/visitors" element={
          <ProtectedRoute allowedRoles={["admin","employee"]}>
            <Visitors />
          </ProtectedRoute>
        } />

        <Route path="/mapping" element={
          <ProtectedRoute allowedRoles={["admin","employee"]}>
            <Mapping />
          </ProtectedRoute>
        } />

        <Route path="/user" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <User />
          </ProtectedRoute>
        } />

       
        <Route path="/fees" element={
          <ProtectedRoute allowedRoles={["admin","employee"]}>
            <Fees />
          </ProtectedRoute>
        } />

        <Route path="/timetable" element={
          <ProtectedRoute allowedRoles={["admin","employee"]}>
            <Timetable />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={["admin","student","employee","tutor"]}>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/student" element={
          <ProtectedRoute allowedRoles={["admin","employee"]}>
            <Student />
          </ProtectedRoute>
        } />
        <Route path="/sidebar" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Sidebar />
          </ProtectedRoute>
        } />

      </Routes>
    </>
  );
}

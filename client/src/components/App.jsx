import Register from "./Register.jsx";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import Tasks from "./Tasks.jsx";
import UserLogged from "./userLogged.jsx";
import FavTasks from "./FavTasks.jsx";
import TaskManagerHero from "./Welcome-page.jsx";
import CompletedTasks from "./Completed.jsx";


import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate} from "react-router-dom";


const router = createBrowserRouter(createRoutesFromElements(
  <>  
    <Route path="/" element={<Navigate to="/Welcome" />} />
    <Route path="/Welcome"  element={<TaskManagerHero />} />
    <Route path="/Dashboard" element={<Dashboard />} />
    <Route path="/Register" element={<Register />} />
    <Route path="/Login" element={<Login />} />
    <Route path="/Tasks" element={<Tasks />} />
    <Route path="/Profile" element={<UserLogged />} />
    <Route path="/Favorite-Tasks" element={<FavTasks/>} />
    <Route path="/Completed-Tasks" element={<CompletedTasks/>} />
  </>
), {
});


function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App;

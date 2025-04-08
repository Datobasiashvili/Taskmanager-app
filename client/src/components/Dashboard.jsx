import Taskform from "./Taskform";
import Sidebar from "./Sidebar";
import "../styles/dashboard.css";

function Dashboard() {
    return (
        <> 
            <Sidebar />
            <Taskform />
        </>
    )
}

export default Dashboard;
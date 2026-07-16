import { UserButton } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M3 11 12 3l9 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 10v10h14V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M7 6h14M7 12h14M7 18h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function ScheduleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}


function BottomNav() {

  const navigate = useNavigate();
  const location = useLocation();

  const active = (path) =>
    location.pathname === path ? "active" : "";


  return (
    <nav className="bottom-nav">

      <button className={active("/home")} onClick={() => navigate("/home")}>
        <HomeIcon />
        <span>Home</span>
      </button>


      <button className={active("/orders")} onClick={() => navigate("/orders")}>
        <OrdersIcon />
        <span>Orders</span>
      </button>


      <button className={active("/schedule")} onClick={() => navigate("/schedule")}>
        <ScheduleIcon />
        <span>Schedule</span>
      </button>


      <button 
        className={`profile-button ${active("/profile")}`}
        onClick={() => navigate("/profile")}
      >
        <div className="clerk-wrapper">
          <UserButton
            appearance={{
              elements:{
                avatarBox:{
                  width:"28px",
                  height:"28px"
                }
              }
            }}
          />
        </div>

        <span>Profile</span>
      </button>


    </nav>
  );
}

export default BottomNav;
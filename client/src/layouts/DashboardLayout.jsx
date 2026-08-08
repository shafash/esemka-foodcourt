import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

function DashboardLayout({ role, onLogout, withDetail = false, detail }) {
  const layoutClass = withDetail
    ? "dashboard-layout dashboard-layout--with-detail"
    : "dashboard-layout";

  return (
    <div className={layoutClass}>
      <div className="dashboard-layout__sidebar">
        <Sidebar role={role} onLogout={onLogout} />
      </div>

      <div className="dashboard-layout__main">
        <div className="dashboard-layout__content">
          <Outlet />
        </div>
      </div>

      {withDetail && <div className="dashboard-layout__detail">{detail}</div>}
    </div>
  );
}

export default DashboardLayout;
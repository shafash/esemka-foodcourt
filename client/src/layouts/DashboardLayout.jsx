import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";

function DashboardLayoutContent({ role, onLogout, withDetail = false, detail }) {
  const { isOpen, close } = useSidebar();

  const layoutClass = withDetail
    ? "dashboard-layout dashboard-layout--with-detail"
    : "dashboard-layout";

  return (
    <div className={layoutClass}>
      <div
        className={`sidebar__backdrop${isOpen ? " sidebar__backdrop--visible" : ""}`}
        onClick={close}
      />

      <div className="dashboard-layout__sidebar">
        <Sidebar role={role} onLogout={onLogout} isOpen={isOpen} onNavigate={close} />
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

function DashboardLayout(props) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent {...props} />
    </SidebarProvider>
  );
}

export default DashboardLayout;
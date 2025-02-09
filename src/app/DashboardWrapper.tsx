import { ReactNode } from "react";
import Sidebar from "./(Components)/Sidebar";
import Navbar from "./(Components)/Navbar";

const DashboardWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <nav className="pb-[66px]">
        <Navbar />
      </nav>
      <aside>
        <Sidebar />
      </aside>

      <main>
        <div className="flex w-full h-auto pl-64">{children}</div>{" "}
        {/* 모든 childern page의 최초 div는 h-full 시작하기 */}
      </main>
    </div>
  );
};

export default DashboardWrapper;

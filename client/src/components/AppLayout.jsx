import { useState } from "react";
import { Menu, Bell, Search } from "lucide-react";
import Sidebar from "./Sidebar";

export default function AppLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 glass border-b border-border flex items-center px-4 lg:px-6 gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1">
            {title && (
              <h1 className="orbitron text-base font-bold text-foreground">{title}</h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* <button className="w-9 h-9 rounded-lg glass-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"> */}
              {/* <Search className="w-4 h-4" /> */}
            {/* </button> */}
            {/* <button className="w-9 h-9 rounded-lg glass-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors relative"> */}
              {/* <Bell className="w-4 h-4" /> */}
              {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" /> */}
            {/* </button> */}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto grid-bg">
          <div className="p-4 lg:p-6 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

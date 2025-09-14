import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const Header = ({ activeView, onViewChange, onCheckIn, hasCheckedInToday }) => {
  const views = [
    { id: "personal", label: "Personal", icon: "User" },
    { id: "team", label: "Team", icon: "Users" },
    { id: "weekly", label: "Weekly", icon: "BarChart3" },
    { id: "foia", label: "FOIA Requests", icon: "FileText" }
  ];

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                <ApperIcon name="Radar" className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text font-display">
                  📌 Priority Radar
                </h1>
                <p className="text-sm text-neutral-600">
                  {format(new Date(), "EEEE, MMMM do")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
<nav className="hidden md:flex bg-white rounded-xl p-1 shadow-sm border border-neutral-200 overflow-x-auto">
              {views.map((view) => (
                <motion.button
                  key={view.id}
                  onClick={() => onViewChange(view.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeView === view.id
                      ? "text-primary-700 bg-primary-50"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon name={view.icon} size={16} />
                  <span className="hidden lg:inline">{view.label}</span>
                  <span className="lg:hidden">{view.id === "foia" ? "FOIA" : view.label}</span>
                  {activeView === view.id && (
                    <motion.div
                      className="absolute inset-0 bg-primary-100 rounded-lg -z-10"
                      layoutId="activeTab"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              ))}
            </nav>

            <Button
              onClick={onCheckIn}
              variant={hasCheckedInToday ? "outline" : "primary"}
              className="hidden sm:flex"
            >
              <ApperIcon 
                name={hasCheckedInToday ? "RefreshCw" : "Plus"} 
                size={16} 
                className="mr-2" 
              />
              {hasCheckedInToday ? "Update Check-in" : "Daily Check-in"}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
<nav className="md:hidden mt-4 flex bg-white rounded-xl p-1 shadow-sm border border-neutral-200 overflow-x-auto">
          {views.map((view) => (
            <motion.button
              key={view.id}
              onClick={() => onViewChange(view.id)}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 min-w-0 ${
                activeView === view.id
                  ? "text-primary-700 bg-primary-50"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ApperIcon name={view.icon} size={14} />
              <span className="truncate">
                {view.id === "foia" ? "FOIA" : view.label}
              </span>
            </motion.button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
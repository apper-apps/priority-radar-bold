import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/organisms/Header";
import PersonalView from "@/components/organisms/PersonalView";
import TeamView from "@/components/organisms/TeamView";
import WeeklyView from "@/components/organisms/WeeklyView";
import CheckInModal from "@/components/molecules/CheckInModal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { checkInService } from "@/services/api/checkInService";
import { toast } from "react-toastify";

function App() {
  const [activeView, setActiveView] = useState("personal");
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [showMobileCheckIn, setShowMobileCheckIn] = useState(false);

  useEffect(() => {
    checkTodayCheckIn();
  }, []);

  const checkTodayCheckIn = async () => {
    try {
      const todayCheckIn = await checkInService.getTodayCheckIn();
      setHasCheckedInToday(!!todayCheckIn);
    } catch (error) {
      console.error("Error checking today's check-in:", error);
    }
  };

  const handleCheckIn = () => {
    setIsCheckInModalOpen(true);
  };

  const handleCheckInSubmit = async (checkInData) => {
    try {
      await checkInService.create(checkInData);
      setHasCheckedInToday(true);
      toast.success("Check-in completed successfully! 🎯");
      // Force a page refresh to show new data
      window.location.reload();
    } catch (error) {
      console.error("Check-in failed:", error);
      toast.error("Failed to complete check-in. Please try again.");
      throw error;
    }
  };

  const renderView = () => {
    switch (activeView) {
      case "personal":
        return <PersonalView onCheckIn={handleCheckIn} />;
      case "team":
        return <TeamView />;
      case "weekly":
        return <WeeklyView />;
      default:
        return <PersonalView onCheckIn={handleCheckIn} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        onCheckIn={handleCheckIn}
        hasCheckedInToday={hasCheckedInToday}
      />

      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Check-in Button */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <Button
          onClick={handleCheckIn}
          size="lg"
          className="w-14 h-14 rounded-full shadow-lg"
        >
          <ApperIcon 
            name={hasCheckedInToday ? "RefreshCw" : "Plus"} 
            size={24} 
          />
        </Button>
      </div>

      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onSubmit={handleCheckInSubmit}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;
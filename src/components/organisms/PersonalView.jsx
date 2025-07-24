import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import PriorityCard from "@/components/molecules/PriorityCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { priorityService } from "@/services/api/priorityService";
import { checkInService } from "@/services/api/checkInService";
import { toast } from "react-toastify";
import { format, isToday, startOfWeek, endOfWeek } from "date-fns";

const PersonalView = ({ onCheckIn }) => {
  const [priorities, setPriorities] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [prioritiesData, checkInsData] = await Promise.all([
        priorityService.getAll(),
        checkInService.getAll()
      ]);
      
      setPriorities(prioritiesData);
      setCheckIns(checkInsData);
    } catch (err) {
      setError("Failed to load your priorities. Please try again.");
      console.error("Error loading personal data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (priorityId, newStatus) => {
    try {
      const updatedPriority = await priorityService.update(priorityId, { status: newStatus });
      setPriorities(prev => prev.map(p => p.Id === priorityId ? updatedPriority : p));
      toast.success("Priority status updated!");
    } catch (err) {
      toast.error("Failed to update priority status");
      console.error("Error updating priority:", err);
    }
  };

  const handleDelete = async (priorityId) => {
    if (!window.confirm("Are you sure you want to delete this priority?")) return;
    
    try {
      await priorityService.delete(priorityId);
      setPriorities(prev => prev.filter(p => p.Id !== priorityId));
      toast.success("Priority deleted successfully");
    } catch (err) {
      toast.error("Failed to delete priority");
      console.error("Error deleting priority:", err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const todayPriorities = priorities.filter(p => isToday(new Date(p.date)));
  const thisWeekPriorities = priorities.filter(p => {
    const priorityDate = new Date(p.date);
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    return priorityDate >= weekStart && priorityDate <= weekEnd;
  });

  const todayCheckIn = checkIns.find(c => isToday(new Date(c.date)));
  const completedToday = todayPriorities.filter(p => p.status === "done").length;
  const thisWeekCompleted = thisWeekPriorities.filter(p => p.status === "done").length;

  const streakDays = checkIns
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .reduce((streak, checkIn, index) => {
      const checkInDate = new Date(checkIn.date);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - index);
      
      if (checkInDate.toDateString() === expectedDate.toDateString()) {
        return streak + 1;
      }
      return streak;
    }, 0);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <ApperIcon name="Target" className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Today's Focus</p>
                <p className="text-2xl font-bold text-blue-900">
                  {completedToday}/{todayPriorities.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <ApperIcon name="Calendar" className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">This Week</p>
                <p className="text-2xl font-bold text-green-900">
                  {thisWeekCompleted}/{thisWeekPriorities.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                <ApperIcon name="Flame" className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700">Streak</p>
                <p className="text-2xl font-bold text-purple-900">{streakDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-700">Total Done</p>
                <p className="text-2xl font-bold text-orange-900">
                  {priorities.filter(p => p.status === "done").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Check-in Reminder */}
      {!todayCheckIn && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ready to start your day?</h3>
              <p className="text-blue-100">
                Set your priorities and let your team know what you're focusing on today.
              </p>
            </div>
            <Button
              onClick={onCheckIn}
              variant="secondary"
              className="bg-white text-primary-700 hover:bg-gray-50"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Start Check-in
            </Button>
          </div>
        </motion.div>
      )}

      {/* Today's Priorities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Calendar" size={20} />
              Today's Priorities
              <span className="text-sm font-normal text-neutral-500">
                {format(new Date(), "MMMM d, yyyy")}
              </span>
            </CardTitle>
            {todayCheckIn && (
              <Button variant="outline" size="sm" onClick={onCheckIn}>
                <ApperIcon name="Edit" size={14} className="mr-2" />
                Update
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {todayPriorities.length === 0 ? (
            <Empty
              icon="Target"
              title="No priorities set for today"
              description="Start your day by setting your main focuses. What are the most important things you want to accomplish?"
              actionLabel="Set Today's Priorities"
              onAction={onCheckIn}
            />
          ) : (
            <div className="space-y-3">
              {todayPriorities.map((priority) => (
                <motion.div
                  key={priority.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: priority.Id * 0.1 }}
                >
                  <PriorityCard
                    priority={priority}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Check-in Details */}
      {todayCheckIn && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="MessageSquare" size={20} />
              Today's Check-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-neutral-700">Mood:</span>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  todayCheckIn.mood === "focused" ? "bg-green-100 text-green-800" :
                  todayCheckIn.mood === "struggling" ? "bg-red-100 text-red-800" :
                  "bg-neutral-100 text-neutral-800"
                }`}>
                  <ApperIcon 
                    name={
                      todayCheckIn.mood === "focused" ? "Zap" :
                      todayCheckIn.mood === "struggling" ? "AlertTriangle" :
                      "Minus"
                    } 
                    size={14} 
                  />
                  {todayCheckIn.mood.charAt(0).toUpperCase() + todayCheckIn.mood.slice(1)}
                </div>
              </div>
              {todayCheckIn.note && (
                <div>
                  <span className="text-sm font-medium text-neutral-700 block mb-2">Note:</span>
                  <p className="text-sm text-neutral-600 bg-neutral-50 rounded-lg p-3">
                    {todayCheckIn.note}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalView;
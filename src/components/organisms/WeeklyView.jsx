import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { priorityService } from "@/services/api/priorityService";
import { checkInService } from "@/services/api/checkInService";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from "date-fns";

const WeeklyView = () => {
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
      setError("Failed to load weekly data. Please try again.");
      console.error("Error loading weekly data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const thisWeekPriorities = priorities.filter(p => {
    const priorityDate = new Date(p.date);
    return priorityDate >= weekStart && priorityDate <= weekEnd;
  });

  const thisWeekCheckIns = checkIns.filter(c => {
    const checkInDate = new Date(c.date);
    return checkInDate >= weekStart && checkInDate <= weekEnd;
  });

  const completedThisWeek = thisWeekPriorities.filter(p => p.status === "done").length;
  const completionRate = thisWeekPriorities.length > 0 
    ? Math.round((completedThisWeek / thisWeekPriorities.length) * 100) 
    : 0;

  const moodCounts = thisWeekCheckIns.reduce((acc, checkIn) => {
    if (checkIn.mood) {
      acc[checkIn.mood] = (acc[checkIn.mood] || 0) + 1;
    }
    return acc;
  }, {});

  const dominantMood = Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0]?.[0];

  const getStatusColor = (status) => {
    switch (status) {
      case "done": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "blocked": return "bg-red-500";
      default: return "bg-yellow-500";
    }
  };

  const getMoodIcon = (mood) => {
    switch (mood) {
      case "focused": return "Zap";
      case "struggling": return "AlertTriangle";
      default: return "Minus";
    }
  };

  return (
    <div className="space-y-6">
      {/* Weekly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">Completion Rate</p>
                <p className="text-2xl font-bold text-green-900">{completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <ApperIcon name="Target" className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Total Priorities</p>
                <p className="text-2xl font-bold text-blue-900">{thisWeekPriorities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                <ApperIcon name="Calendar" className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700">Check-ins</p>
                <p className="text-2xl font-bold text-purple-900">{thisWeekCheckIns.length}/7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                <ApperIcon name={dominantMood ? getMoodIcon(dominantMood) : "Smile"} className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-700">Dominant Mood</p>
                <p className="text-lg font-bold text-orange-900 capitalize">
                  {dominantMood || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Calendar" size={20} />
            This Week's Overview
            <span className="text-sm font-normal text-neutral-500">
              {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {weekDays.map((day) => {
              const dayPriorities = thisWeekPriorities.filter(p => 
                isSameDay(new Date(p.date), day)
              );
              const dayCheckIn = thisWeekCheckIns.find(c => 
                isSameDay(new Date(c.date), day)
              );
              
              return (
                <motion.div
                  key={day.toISOString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    isToday(day) 
                      ? "border-primary-300 bg-primary-50" 
                      : dayCheckIn 
                        ? "border-green-200 bg-green-50" 
                        : "border-neutral-200 bg-white"
                  }`}
                >
                  <div className="text-center mb-2">
                    <p className="text-xs font-medium text-neutral-600 uppercase">
                      {format(day, "EEE")}
                    </p>
                    <p className={`text-lg font-bold ${
                      isToday(day) ? "text-primary-700" : "text-neutral-900"
                    }`}>
                      {format(day, "d")}
                    </p>
                  </div>
                  
                  {dayCheckIn && (
                    <div className="flex justify-center mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        dayCheckIn.mood === "focused" ? "bg-green-500" :
                        dayCheckIn.mood === "struggling" ? "bg-red-500" :
                        "bg-neutral-400"
                      }`} />
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    {dayPriorities.slice(0, 2).map((priority) => (
                      <div
                        key={priority.Id}
                        className="flex items-center gap-1"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(priority.status)}`} />
                        <span className="text-xs text-neutral-600 truncate">
                          {priority.title}
                        </span>
                      </div>
                    ))}
                    {dayPriorities.length > 2 && (
                      <p className="text-xs text-neutral-500 text-center">
                        +{dayPriorities.length - 2} more
                      </p>
                    )}
                    {dayPriorities.length === 0 && !dayCheckIn && (
                      <p className="text-xs text-neutral-400 text-center">
                        No activity
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Focus Patterns */}
      {thisWeekPriorities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="BarChart3" size={20} />
              Focus Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">Status Distribution</h4>
                <div className="flex flex-wrap gap-2">
                  {["done", "in-progress", "todo", "blocked"].map((status) => {
                    const count = thisWeekPriorities.filter(p => p.status === status).length;
                    if (count === 0) return null;
                    
                    return (
                      <Badge key={status} variant={status} className="text-sm">
                        {status.replace("-", " ").toUpperCase()}: {count}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              
              {Object.keys(moodCounts).length > 0 && (
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Mood Distribution</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(moodCounts).map(([mood, count]) => (
                      <div
                        key={mood}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                          mood === "focused" ? "bg-green-100 text-green-800" :
                          mood === "struggling" ? "bg-red-100 text-red-800" :
                          "bg-neutral-100 text-neutral-800"
                        }`}
                      >
                        <ApperIcon name={getMoodIcon(mood)} size={14} />
                        <span className="capitalize">{mood}: {count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {thisWeekPriorities.length === 0 && (
        <Empty
          icon="Calendar"
          title="No activity this week"
          description="Start tracking your priorities to see weekly patterns and insights here."
        />
      )}
    </div>
  );
};

export default WeeklyView;
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import TeamMemberCard from "@/components/molecules/TeamMemberCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { userService } from "@/services/api/userService";
import { priorityService } from "@/services/api/priorityService";
import { format, isToday } from "date-fns";

const TeamView = () => {
  const [users, setUsers] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [usersData, prioritiesData] = await Promise.all([
        userService.getAll(),
        priorityService.getAll()
      ]);
      
      setUsers(usersData);
      setPriorities(prioritiesData);
    } catch (err) {
      setError("Failed to load team data. Please try again.");
      console.error("Error loading team data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const todayPriorities = priorities.filter(p => isToday(new Date(p.date)));
  const activeToday = users.filter(u => 
    todayPriorities.some(p => p.userId === u.id)
  ).length;

  const completedToday = todayPriorities.filter(p => p.status === "done").length;
  const totalToday = todayPriorities.length;

  const commonFocuses = todayPriorities.reduce((acc, priority) => {
    const keywords = priority.title.toLowerCase().split(" ");
    keywords.forEach(keyword => {
      if (keyword.length > 3) {
        acc[keyword] = (acc[keyword] || 0) + 1;
      }
    });
    return acc;
  }, {});

  const topFocuses = Object.entries(commonFocuses)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <ApperIcon name="Users" className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Active Today</p>
                <p className="text-2xl font-bold text-blue-900">
                  {activeToday}/{users.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">Completed</p>
                <p className="text-2xl font-bold text-green-900">
                  {completedToday}/{totalToday}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                <ApperIcon name="Target" className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700">Total Priorities</p>
                <p className="text-2xl font-bold text-purple-900">{totalToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Common Focus Areas */}
      {topFocuses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Radar" size={20} />
              Team Focus Areas Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topFocuses.map(([focus, count]) => (
                <div
                  key={focus}
                  className="flex items-center gap-2 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                >
                  <span className="capitalize">{focus}</span>
                  <div className="w-5 h-5 bg-primary-200 rounded-full flex items-center justify-center text-xs font-semibold">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Users" size={20} />
            Team Overview
            <span className="text-sm font-normal text-neutral-500">
              {format(new Date(), "MMMM d, yyyy")}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <Empty
              icon="Users"
              title="No team members found"
              description="Your team members will appear here once they start using Priority Radar."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TeamMemberCard user={user} priorities={priorities} />
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamView;
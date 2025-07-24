import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const TeamMemberCard = ({ user, priorities }) => {
  const userPriorities = priorities.filter(p => p.userId === user.id);
  const todayPriorities = userPriorities.filter(p => {
    const today = new Date().toDateString();
    return new Date(p.date).toDateString() === today;
  });

  const completedToday = todayPriorities.filter(p => p.status === "done").length;
  const totalToday = todayPriorities.length;

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{user.name}</CardTitle>
            <p className="text-xs text-neutral-500">
              {user.lastCheckIn ? 
                `Last check-in: ${format(new Date(user.lastCheckIn), "MMM d")}` : 
                "No check-ins yet"
              }
            </p>
          </div>
          {totalToday > 0 && (
            <div className="text-right">
              <div className="text-sm font-semibold text-neutral-900">
                {completedToday}/{totalToday}
              </div>
              <div className="text-xs text-neutral-500">completed</div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {todayPriorities.length === 0 ? (
          <div className="text-center py-4">
            <ApperIcon name="Calendar" className="mx-auto text-neutral-400 mb-2" size={24} />
            <p className="text-sm text-neutral-500">No priorities set today</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayPriorities.slice(0, 3).map((priority) => (
              <div key={priority.Id} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  priority.status === "done" ? "bg-green-500" :
                  priority.status === "in-progress" ? "bg-blue-500" :
                  priority.status === "blocked" ? "bg-red-500" :
                  "bg-yellow-500"
                }`} />
                <span className="text-sm text-neutral-700 truncate flex-1">
                  {priority.title}
                </span>
                <Badge variant={priority.status} className="text-xs">
                  {priority.status === "in-progress" ? "WIP" : 
                   priority.status === "done" ? "✓" :
                   priority.status === "blocked" ? "!" : "○"}
                </Badge>
              </div>
            ))}
            {todayPriorities.length > 3 && (
              <p className="text-xs text-neutral-500 text-center pt-2">
                +{todayPriorities.length - 3} more priorities
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;
import { useState, useEffect } from "react";
import { Activity, Clock, Trophy, BookOpen, Target, X, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ActivitySummaryProps {
  isOpen: boolean;
  onClose: () => void;
  activities: string[];
}

interface ActivityStats {
  totalActivities: number;
  guidesCompleted: number;
  quizzesCompleted: number;
  scenariosViewed: number;
  timeSpent: string;
}

const ActivitySummary = ({ isOpen, onClose, activities }: ActivitySummaryProps) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ActivityStats>({
    totalActivities: 0,
    guidesCompleted: 0,
    quizzesCompleted: 0,
    scenariosViewed: 0,
    timeSpent: "0 min"
  });

  useEffect(() => {
    if (activities.length > 0) {
      const guidesCompleted = activities.filter(a => a.includes("AI Guide")).length;
      const quizzesCompleted = activities.filter(a => a.includes("quiz")).length;
      const scenariosViewed = activities.filter(a => a.includes("scenario")).length;
      
      setStats({
        totalActivities: activities.length,
        guidesCompleted,
        quizzesCompleted,
        scenariosViewed,
        timeSpent: `${Math.floor(activities.length * 2.5)} min`
      });
    }
  }, [activities]);

  if (!isOpen) return null;

  const getActivityIcon = (activity: string) => {
    if (activity.includes("AI Guide")) return <BookOpen className="h-4 w-4 text-green-500" />;
    if (activity.includes("quiz")) return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (activity.includes("scenario")) return <Target className="h-4 w-4 text-blue-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getRecentActivities = () => activities.slice(-8).reverse();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Activity Summary</h2>
              <p className="text-sm text-gray-500">{user?.username || "User"}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{stats.totalActivities}</div>
              <div className="text-sm text-gray-600">Total Activities</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg text-center">
              <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{stats.guidesCompleted}</div>
              <div className="text-sm text-gray-600">Guides Completed</div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{stats.quizzesCompleted}</div>
              <div className="text-sm text-gray-600">Quizzes Taken</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{stats.timeSpent}</div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
            {getRecentActivities().length > 0 ? (
              <div className="space-y-3">
                {getRecentActivities().map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    {getActivityIcon(activity)}
                    <span className="flex-1 text-gray-700">{activity}</span>
                    <span className="text-xs text-gray-500">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No activities yet. Start exploring to see your progress!</p>
              </div>
            )}
          </div>

          {/* Progress Insights */}
          <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">AI Guides Completed</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((stats.guidesCompleted / 4) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{stats.guidesCompleted}/4</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Quiz Performance</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((stats.quizzesCompleted / 4) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{stats.quizzesCompleted}/4</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivitySummary;
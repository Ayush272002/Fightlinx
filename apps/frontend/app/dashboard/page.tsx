'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Activity, Users, Calendar, TrendingUp, Edit } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui';
import { EditProfilePopup } from 'components/EditProfilePopup';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Mock data
const performanceData = [
  { month: 'Jan', wins: 1, losses: 0 },
  { month: 'Feb', wins: 1, losses: 1 },
  { month: 'Mar', wins: 2, losses: 0 },
  { month: 'Apr', wins: 1, losses: 1 },
  { month: 'May', wins: 2, losses: 0 },
];

const matchCandidates = [
  { name: 'Mike Johnson', compatibilityScore: 95 },
  { name: 'Sarah Lee', compatibilityScore: 88 },
  { name: 'Tom Wilson', compatibilityScore: 82 },
];

interface FighterProfile {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  reach: number;
  style: string;
  gym: string;
}

interface Activity {
  fighter1: {
    name: string;
  };
  fighter2: {
    name: string;
  };
  winner: string;
  outcome: string;
  method: string;
  event: string;
}

interface QuickStats {
  totalFighters: number;
  recentSignups: number;
  // upcomingMatches: number,
  // matchmakingStatus: number,
}

interface UpcomingMatch {
  matchId: number;
  status: string;
  matchDate: string;
  fighter1Name: string;
  fighter2Name: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profile, setProfile] = useState<FighterProfile | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [quickStats, setQuickStats] = useState<QuickStats>({
    totalFighters: 0,
    recentSignups: 0,
    // upcomingMatches: 0,
    // matchmakingStatus: 0,
  });

  const [upcomingMatches, setUpcomingMatches] = useState<UpcomingMatch[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/user/profile`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          const profileData = response.data.data;
          // console.log('Profile data:', profileData);
          setProfile(profileData);
        }
      } catch (e) {
        console.error('Profile fetch error:', e);
      }
    };

    const getRecentActivity = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/fight/recentActivity`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          const activityData = response.data.data;
          setRecentActivity(activityData);
          // console.log('Recent activity:', activityData);
        }
      } catch (e) {
        console.error('Recent activity fetch error:', e);
      }
    };

    const fetchQuickStats = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/user/quickStats`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          const stats = response.data.data;
          // console.log('Quick stats:', stats);
          setQuickStats(stats);
        }
      } catch (e) {
        console.error('Quick stats fetch error:', e);
      }
    };

    fetchUpcomingMatches();
    fetchProfile();
    getRecentActivity();
    fetchQuickStats();
  }, []);

  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = async (updatedProfile: FighterProfile) => {
    setIsEditProfileOpen(false);

    try {
      const payload = {
        name: updatedProfile.name,
        age: updatedProfile.age,
        heightCm: updatedProfile.height,
        reachCm: updatedProfile.reach,
        weightKg: updatedProfile.weight,
        fightingStyle: updatedProfile.style,
        gym: updatedProfile.gym,
        gender: updatedProfile.gender,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/user/update`,
        {
          payload,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setProfile(updatedProfile);
        toast.success('Updated successful');
      } else {
        toast.error(response.data.error || 'Something went wrong');
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An error occurred during update. Please try again.');
      }
      console.error('Update error:', error);
    }
  };

  const handleMatchMaking = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/fight/matchmaking`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        fetchUpcomingMatches();
        toast.success('Matchmaking initiated successfully');
      } else {
        toast.error(response.data.error || 'Something went wrong');
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An error occurred during matchmaking. Please try again.');
      }
      console.error('Update error:', error);
    }
  };

  const fetchUpcomingMatches = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/user/getUpcomingMatches`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const matches = response.data.data;
        setUpcomingMatches(matches);
      } else {
        toast.error(
          response.data.message || 'Failed to fetch upcoming matches'
        );
      }
    } catch (error) {
      console.error('Error fetching upcoming matches:', error);
      toast.error('An error occurred while fetching upcoming matches.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-red-600">
        FightLinx Dashboard
      </h1>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-gray-800 rounded">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-red-600 rounded"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-red-600 rounded"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="matchmaking"
            className="data-[state=active]:bg-red-600 rounded"
          >
            Matchmaking
          </TabsTrigger>
          <TabsTrigger
            value="scheduled"
            className="data-[state=active]:bg-red-600 rounded"
          >
            Scheduled Matches
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-red-600 rounded"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-900 border-red-600 rounded">
              <CardHeader>
                <CardTitle className="text-red-400">Total Fighters</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{quickStats.totalFighters}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-red-600 rounded">
              <CardHeader>
                <CardTitle className="text-red-400">Upcoming Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {/* {quickStats.upcomingMatches} */}
                  50
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-red-600 rounded">
              <CardHeader>
                <CardTitle className="text-red-400">
                  Recent Sign-ups (last 7d)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{quickStats.recentSignups}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-red-600 rounded">
              <CardHeader>
                <CardTitle className="text-red-400">
                  Matchmaking Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {/* {quickStats.matchmakingStatus} */}
                  Active
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900 border-red-600 rounded">
            <CardHeader>
              <CardTitle className="text-red-400">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <li
                      key={index}
                      className="text-gray-300 flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <Activity className="text-red-500 h-4 w-4" />
                        <span>
                          <strong>{activity.fighter1.name}</strong> vs{' '}
                          <strong>{activity.fighter2.name}</strong> -
                          <strong className="text-green-400">
                            {' '}
                            {activity.winner}
                          </strong>{' '}
                          won by{' '}
                          <span className="text-red-400">
                            {activity.method}
                          </span>
                        </span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {activity.event}
                      </span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400">No recent activity available.</p>
                )}
              </ul>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button className="bg-red-600 hover:bg-red-700 rounded">
              Find a Match
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 rounded"
              onClick={handleEditProfile}
            >
              Edit Profile
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 rounded">
              View Match History
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card className="bg-gray-900 border-red-600 rounded">
            <CardHeader>
              <CardTitle className="text-red-400">Fighter Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Name:</strong> {profile?.name || 'N/A'}
                  </p>
                  <p>
                    <strong>Age:</strong> {profile?.age || 'N/A'}
                  </p>
                  <p>
                    <strong>Gender:</strong> {profile?.gender || 'N/A'}
                  </p>
                  <p>
                    <strong>Height:</strong>{' '}
                    {profile?.height ? `${profile.height} cm` : 'N/A'}
                  </p>
                  <p>
                    <strong>Weight:</strong>{' '}
                    {profile?.weight ? `${profile.weight} kg` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Reach:</strong>{' '}
                    {profile?.reach ? `${profile.reach} cm` : 'N/A'}
                  </p>
                  <p>
                    <strong>Style:</strong> {profile?.style || 'N/A'}
                  </p>
                  <p>
                    <strong>Gym:</strong> {profile?.gym || 'N/A'}
                  </p>
                </div>
              </div>
              <Button
                className="mt-4 bg-red-600 hover:bg-red-700 rounded"
                onClick={handleEditProfile}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-red-600 rounded">
            <CardHeader>
              <CardTitle className="text-red-400">
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  wins: {
                    label: 'Wins',
                    color: '#ff4136',
                  },
                  losses: {
                    label: 'Losses',
                    color: '#0074d9',
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#fff' }}
                      label={{
                        value: 'Months',
                        position: 'insideBottom',
                        offset: -5,
                        fill: '#fff',
                      }}
                    />
                    <YAxis
                      tick={{ fill: '#fff' }}
                      label={{
                        value: 'Count',
                        angle: -90,
                        position: 'insideLeft',
                        fill: '#fff',
                      }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="wins" fill="#ff4136" />
                    <Bar dataKey="losses" fill="#0074d9" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matchmaking" className="space-y-4">
          <Card className="bg-gray-900 border-red-600 rounded">
            <CardHeader>
              <CardTitle className="text-red-400">Find a Match</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                className="bg-red-600 hover:bg-red-700 rounded"
                onClick={handleMatchMaking}
              >
                Start Matchmaking
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-red-600 rounded">
            <CardHeader>
              <CardTitle className="text-red-400">Match Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-red-400">Name</TableHead>
                    <TableHead className="text-red-400">
                      Compatibility Score
                    </TableHead>
                    <TableHead className="text-red-400">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matchCandidates.map((candidate, index) => (
                    <TableRow key={index}>
                      <TableCell>{candidate.name}</TableCell>
                      <TableCell>{candidate.compatibilityScore}%</TableCell>
                      <TableCell>
                        <Button className="bg-red-600 hover:bg-red-700 rounded">
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card className="bg-gray-900 border-red-600 rounded">
            <CardHeader>
              <CardTitle className="text-red-400">Upcoming Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-red-400">Match ID</TableHead>
                    <TableHead className="text-red-400">Fighter 1</TableHead>
                    <TableHead className="text-red-400">Fighter 2</TableHead>
                    <TableHead className="text-red-400">Match Date</TableHead>
                    <TableHead className="text-red-400">Status</TableHead>
                    <TableHead className="text-red-400">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingMatches.map((match) => (
                    <TableRow key={match.matchId}>
                      <TableCell>{match.matchId}</TableCell>
                      <TableCell>{match.fighter1Name}</TableCell>
                      <TableCell>{match.fighter2Name}</TableCell>
                      <TableCell>
                        {new Date(match.matchDate).toLocaleString()}
                      </TableCell>
                      <TableCell>{match.status}</TableCell>
                      <TableCell>
                        <Button className="bg-red-600 hover:bg-red-700 rounded">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-gray-900 border-red-600 rounded">
            <CardHeader>
              <CardTitle className="text-red-400">
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Detailed performance metrics and analytics will be displayed
                here.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-red-600 rounded">
            <CardHeader>
              <CardTitle className="text-red-400">Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Top fighters leaderboard will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {profile && (
        <EditProfilePopup
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={handleSaveProfile}
          initialProfile={profile}
        />
      )}
    </div>
  );
}

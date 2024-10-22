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
import {
  Activity,
  Users,
  Calendar,
  TrendingUp,
  Edit,
  LogOut,
  Zap,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Spinner,
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
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Heatmap } from 'components/heatmap';
import { Performance } from 'components/Performance';

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
  const router = useRouter();
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
  const [disabledButton, setDisabledButton] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [
          profileResponse,
          recentActivityResponse,
          quickStatsResponse,
          upcomingMatchesResponse,
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/v1/user/profile`, {
            withCredentials: true,
          }),
          axios.get(`${API_BASE_URL}/api/v1/fight/recentActivity`, {
            withCredentials: true,
          }),
          axios.get(`${API_BASE_URL}/api/v1/user/quickStats`, {
            withCredentials: true,
          }),
          axios.get(`${API_BASE_URL}/api/v1/user/getUpcomingMatches`, {
            withCredentials: true,
          }),
        ]);

        if (profileResponse.status === 200) {
          const profileData = profileResponse.data.data;
          setProfile(profileData);
        }
        if (recentActivityResponse.status === 200) {
          const activityData = recentActivityResponse.data.data;
          setRecentActivity(activityData);
        }
        if (quickStatsResponse.status === 200) {
          const stats = quickStatsResponse.data.data;
          setQuickStats(stats);
        }
        if (upcomingMatchesResponse.status === 200) {
          const matches = upcomingMatchesResponse.data.data;
          setUpcomingMatches(matches);
        }
      } catch (error) {
        router.push('/signin');
        toast.error(
          'An error occurred while fetching data. Please signin again.'
        );
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        router.push('/signin');
        toast.success('Logged out successfully');
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout. Please try again.');
    }
  };

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
      setDisabledButton(true);
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
      setDisabledButton(false);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
        setDisabledButton(false);
      } else {
        toast.error('An error occurred during matchmaking. Please try again.');
        setDisabledButton(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex justify-center items-center">
        <Spinner className="w-8 h-8 text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div
        className="flex justify-between items-center mb-8 cursor-pointer"
        onClick={() => router.push('/')}
      >
        <h1 className="text-4xl font-bold text-red-600 flex items-center">
          <Zap className="h-8 w-8 text-red-500 mt-2" />
          <span className="ml-2">FightLinx</span>
        </h1>

        <Button
          className="bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-2"
          onClick={handleLogout}
        >
          <span>Logout</span>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

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
            <Button
              className="bg-red-600 hover:bg-red-700 rounded"
              onClick={handleMatchMaking}
              disabled={disabledButton}
            >
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

          <Performance />
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
                disabled={disabledButton}
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
          <Heatmap />
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

'use client';

import React, { useState } from 'react';
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

// Mock data
const quickStats = {
  totalFighters: 1000,
  upcomingMatches: 50,
  recentSignups: 25,
  matchmakingStatus: 'Active',
};

const recentActivity = [
  { type: 'Match', description: 'John Doe vs Jane Smith - John Doe won by KO' },
  { type: 'Signup', description: 'New fighter Mike Johnson joined' },
  { type: 'Match', description: 'Alice Brown vs Eve Wilson - Draw' },
];

const fighterProfile = {
  name: 'John Doe',
  age: 28,
  height: 180,
  weight: 77,
  reach: 188,
  style: 'Mixed Martial Arts',
  gym: 'Elite Fight Club',
  record: { wins: 10, losses: 2, draws: 1 },
};

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

const upcomingMatches = [
  {
    opponent: 'Mike Johnson',
    date: '2023-07-15',
    time: '20:00',
    location: 'Las Vegas Arena',
  },
  {
    opponent: 'Sarah Lee',
    date: '2023-08-02',
    time: '19:30',
    location: 'New York Stadium',
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

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
        <TabsList className="bg-gray-800">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-red-600"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-red-600"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="matchmaking"
            className="data-[state=active]:bg-red-600"
          >
            Matchmaking
          </TabsTrigger>
          <TabsTrigger
            value="scheduled"
            className="data-[state=active]:bg-red-600"
          >
            Scheduled Matches
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-red-600"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-900 border-red-600">
              <CardHeader>
                <CardTitle className="text-red-400">Total Fighters</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{quickStats.totalFighters}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-red-600">
              <CardHeader>
                <CardTitle className="text-red-400">Upcoming Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {quickStats.upcomingMatches}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-red-600">
              <CardHeader>
                <CardTitle className="text-red-400">Recent Sign-ups</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{quickStats.recentSignups}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-red-600">
              <CardHeader>
                <CardTitle className="text-red-400">
                  Matchmaking Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {quickStats.matchmakingStatus}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900 border-red-600">
            <CardHeader>
              <CardTitle className="text-red-400">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recentActivity.map((activity, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    {activity.type === 'Match' ? (
                      <Activity className="text-red-400" />
                    ) : (
                      <Users className="text-red-400" />
                    )}
                    <span>{activity.description}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button className="bg-red-600 hover:bg-red-700">
              Find a Match
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              Edit Profile
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              View Match History
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card className="bg-gray-900 border-red-600">
            <CardHeader>
              <CardTitle className="text-red-400">Fighter Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Name:</strong> {fighterProfile.name}
                  </p>
                  <p>
                    <strong>Age:</strong> {fighterProfile.age}
                  </p>
                  <p>
                    <strong>Height:</strong> {fighterProfile.height} cm
                  </p>
                  <p>
                    <strong>Weight:</strong> {fighterProfile.weight} kg
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Reach:</strong> {fighterProfile.reach} cm
                  </p>
                  <p>
                    <strong>Style:</strong> {fighterProfile.style}
                  </p>
                  <p>
                    <strong>Gym:</strong> {fighterProfile.gym}
                  </p>
                  <p>
                    <strong>Record:</strong> {fighterProfile.record.wins}W-
                    {fighterProfile.record.losses}L-
                    {fighterProfile.record.draws}D
                  </p>
                </div>
              </div>
              <Button className="mt-4 bg-red-600 hover:bg-red-700">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-red-600">
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
                  <BarChart
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#fff' }}
                      label={{
                        value: 'Month',
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
          <Card className="bg-gray-900 border-red-600">
            <CardHeader>
              <CardTitle className="text-red-400">Find a Match</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="bg-red-600 hover:bg-red-700">
                Start Matchmaking
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-red-600">
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
                        <Button className="bg-red-600 hover:bg-red-700">
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
          <Card className="bg-gray-900 border-red-600">
            <CardHeader>
              <CardTitle className="text-red-400">Upcoming Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-red-400">Opponent</TableHead>
                    <TableHead className="text-red-400">Date</TableHead>
                    <TableHead className="text-red-400">Time</TableHead>
                    <TableHead className="text-red-400">Location</TableHead>
                    <TableHead className="text-red-400">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingMatches.map((match, index) => (
                    <TableRow key={index}>
                      <TableCell>{match.opponent}</TableCell>
                      <TableCell>{match.date}</TableCell>
                      <TableCell>{match.time}</TableCell>
                      <TableCell>{match.location}</TableCell>
                      <TableCell>
                        <Button className="bg-red-600 hover:bg-red-700">
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
          <Card className="bg-gray-900 border-red-600">
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

          <Card className="bg-gray-900 border-red-600">
            <CardHeader>
              <CardTitle className="text-red-400">Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Top fighters leaderboard will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

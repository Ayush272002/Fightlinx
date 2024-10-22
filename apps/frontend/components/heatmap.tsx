import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Flame } from 'lucide-react';

interface FighterData {
  name: string;
  wins: number;
  losses: number;
  knockouts: number;
  submissions: number;
}

const fighterData: FighterData[] = [
  { name: 'Alex', wins: 8, losses: 2, knockouts: 5, submissions: 3 },
  { name: 'Sam', wins: 7, losses: 3, knockouts: 4, submissions: 3 },
  { name: 'Jordan', wins: 9, losses: 1, knockouts: 6, submissions: 3 },
  { name: 'Casey', wins: 6, losses: 4, knockouts: 3, submissions: 3 },
  { name: 'Taylor', wins: 8, losses: 2, knockouts: 5, submissions: 3 },
];

const statCategories = ['Wins', 'Losses', 'Knockouts', 'Submissions'] as const;
type StatCategory = (typeof statCategories)[number];

export function Heatmap() {
  const getIntensity = (value: number, max: number) => {
    const intensity = Math.floor((value / max) * 5);
    const colorClasses = [
      'bg-red-200',
      'bg-red-300',
      'bg-red-400',
      'bg-red-500',
      'bg-red-600',
    ];
    return colorClasses[intensity] || 'bg-orange-600';
  };

  const maxStats: Record<StatCategory, number> = {
    Wins: Math.max(...fighterData.map((f) => f.wins)),
    Losses: Math.max(...fighterData.map((f) => f.losses)),
    Knockouts: Math.max(...fighterData.map((f) => f.knockouts)),
    Submissions: Math.max(...fighterData.map((f) => f.submissions)),
  };

  return (
    <Card className="bg-gray-900 border-red-600">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center gap-1">
          <Flame className="h-6 w-6" />
          <span>Fighter Performance Heatmap</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4">
          <div className="font-bold text-red-400">Fighter</div>
          {statCategories.map((category) => (
            <div key={category} className="font-bold text-red-400">
              {category}
            </div>
          ))}
          {fighterData.map((fighter) => (
            <React.Fragment key={fighter.name}>
              <div className="font-semibold text-white">{fighter.name}</div>
              <div
                className={`rounded p-2 text-center ${getIntensity(fighter.wins, maxStats.Wins)}`}
              >
                {fighter.wins}
              </div>
              <div
                className={`rounded p-2 text-center ${getIntensity(fighter.losses, maxStats.Losses)}`}
              >
                {fighter.losses}
              </div>
              <div
                className={`rounded p-2 text-center ${getIntensity(fighter.knockouts, maxStats.Knockouts)}`}
              >
                {fighter.knockouts}
              </div>
              <div
                className={`rounded p-2 text-center ${getIntensity(fighter.submissions, maxStats.Submissions)}`}
              >
                {fighter.submissions}
              </div>
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

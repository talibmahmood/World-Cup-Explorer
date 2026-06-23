import { GroupData, Match } from '../types';

export const MATCHES_DATA: Match[] = [
  {
    id: 'm1',
    group: 'A',
    homeTeamCode: 'br',
    awayTeamCode: 'fr',
    homeScore: 2,
    awayScore: 1,
    date: '2026-06-25',
    time: '18:00',
    status: 'completed'
  },
  {
    id: 'm2',
    group: 'A',
    homeTeamCode: 'ca',
    awayTeamCode: 'jp',
    homeScore: 1,
    awayScore: 2,
    date: '2026-06-25',
    time: '21:00',
    status: 'completed'
  },
  {
    id: 'm3',
    group: 'A',
    homeTeamCode: 'sn',
    awayTeamCode: 'br',
    date: '2026-06-29',
    time: '15:00',
    status: 'scheduled'
  },
  {
    id: 'm4',
    group: 'A',
    homeTeamCode: 'fr',
    awayTeamCode: 'ca',
    date: '2026-06-29',
    time: '18:00',
    status: 'scheduled'
  },
  {
    id: 'm5',
    group: 'B',
    homeTeamCode: 'ar',
    awayTeamCode: 'de',
    homeScore: 3,
    awayScore: 2,
    date: '2026-06-26',
    time: '18:00',
    status: 'completed'
  },
  {
    id: 'm6',
    group: 'B',
    homeTeamCode: 'pt',
    awayTeamCode: 'au',
    homeScore: 2,
    awayScore: 0,
    date: '2026-06-26',
    time: '21:00',
    status: 'completed'
  },
  {
    id: 'm7',
    group: 'B',
    homeTeamCode: 'ma',
    awayTeamCode: 'ar',
    date: '2026-06-30',
    time: '15:00',
    status: 'scheduled'
  },
  {
    id: 'm8',
    group: 'B',
    homeTeamCode: 'de',
    awayTeamCode: 'pt',
    date: '2026-06-30',
    time: '18:00',
    status: 'scheduled'
  }
];

export const INITIAL_GROUPS: GroupData[] = [
  {
    name: 'Group A',
    teams: ['br', 'fr', 'jp', 'ca', 'sn'],
    standings: [
      { teamCode: 'br', played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 2, goalsAgainst: 1, points: 3 },
      { teamCode: 'jp', played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 2, goalsAgainst: 1, points: 3 },
      { teamCode: 'sn', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
      { teamCode: 'fr', played: 1, won: 0, drawn: 0, lost: 1, goalsFor: 1, goalsAgainst: 2, points: 0 },
      { teamCode: 'ca', played: 1, won: 0, drawn: 0, lost: 1, goalsFor: 1, goalsAgainst: 2, points: 0 }
    ]
  },
  {
    name: 'Group B',
    teams: ['ar', 'pt', 'de', 'ma', 'au'],
    standings: [
      { teamCode: 'ar', played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 3, goalsAgainst: 2, points: 3 },
      { teamCode: 'pt', played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 2, goalsAgainst: 0, points: 3 },
      { teamCode: 'ma', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
      { teamCode: 'de', played: 1, won: 0, drawn: 0, lost: 1, goalsFor: 2, goalsAgainst: 3, points: 0 },
      { teamCode: 'au', played: 1, won: 0, drawn: 0, lost: 1, goalsFor: 0, goalsAgainst: 2, points: 0 }
    ]
  }
];

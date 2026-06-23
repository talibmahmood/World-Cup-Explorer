import { Achievement } from '../types';

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 'first_step',
    title: 'First Step',
    desc: 'Explore your very first country profile!',
    icon: 'Compass',
    color: 'emerald',
    category: 'discovery',
    requiredCount: 1
  },
  {
    id: 'world_explorer',
    title: 'World Explorer',
    desc: 'Explore all 10 countries in the World Cup catalog!',
    icon: 'Globe',
    color: 'sky',
    category: 'discovery',
    requiredCount: 10
  },
  {
    id: 'continent_hopper',
    title: 'Continent Hopper',
    desc: 'Explore country profiles across 3 different continents!',
    icon: 'Map',
    color: 'amber',
    category: 'geography',
    requiredCount: 3
  },
  {
    id: 'samba_stamp',
    title: 'Samba Stamp',
    desc: 'Visit Brazil 🇧🇷 and get your first Samba stamp!',
    icon: 'Music',
    color: 'yellow',
    category: 'football',
    requiredCount: 1
  },
  {
    id: 'african_pride',
    title: 'Atlas & Teranga',
    desc: 'Unlock stamps for Morocco 🇲🇦 and Senegal 🇸🇳!',
    icon: 'Heart',
    color: 'red',
    category: 'geography',
    requiredCount: 2
  },
  {
    id: 'quiz_hero',
    title: 'Quiz Hero',
    desc: 'Score 5 correct answers in the Quiz Arena!',
    icon: 'Award',
    color: 'purple',
    category: 'quiz',
    requiredCount: 5
  },
  {
    id: 'quiz_legend',
    title: 'Quiz Legend',
    desc: 'Solve 15 quiz questions correctly across any difficulty!',
    icon: 'Trophy',
    color: 'indigo',
    category: 'quiz',
    requiredCount: 15
  },
  {
    id: 'football_guru',
    title: 'Football Guru',
    desc: 'Get a perfect score (3/3) in a Medium or Hard football quiz!',
    icon: 'Activity',
    color: 'orange',
    category: 'football',
    requiredCount: 3
  }
];

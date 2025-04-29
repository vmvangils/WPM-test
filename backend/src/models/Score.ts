// cookies opslag, nog geen database
const scores: Score[] = [];

export interface Score {
  id?: number;
  username: string;
  wpm: number;
  created_at?: Date;
}

export const saveScore = async (score: Score): Promise<void> => {
  scores.push({
    ...score,
    id: scores.length + 1,
    created_at: new Date()
  });
};

export const getLeaderboard = async (): Promise<Score[]> => {
  return [...scores]
    .sort((a, b) => b.wpm - a.wpm)
    .slice(0, 10);
}; 
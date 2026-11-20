export const CITY = { width: 96, height: 96, road: 8, block: 16 };
export const JOBS = [
  { name: 'THE PICKUP', text: 'Drive to Lio at the marina slip.', x: 24, z: 8, reward: 350, car: true },
  { name: 'HOT WHEELS', text: 'Steal a sports car and deliver it downtown.', x: -24, z: 24, reward: 600, car: true, kind: 2 },
  { name: 'THE DEAL', text: 'Collect the package on foot. Clear the ambush.', x: 24, z: 24, reward: 800, onFoot: true, fight: true },
  { name: 'GETAWAY', text: 'Lose the three-star tail at the hillside safehouse.', x: -24, z: -24, reward: 1200, escape: 3 },
  { name: 'THE BIG SCORE', text: 'Hit the pier in a car, then shake the heat.', x: 8, z: -40, reward: 2500, car: true, escape: 3 },
];
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);

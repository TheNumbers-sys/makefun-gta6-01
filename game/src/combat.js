import {dist} from './config.js';
export function combatSystem(game,dt){
  if(!game.pickups.length)for(let i=0;i<6;i++)game.pickups.push({x:(i%3-1)*18+4,z:(Math.floor(i/3)-.5)*28,kind:i%2?'ammo':'health'});
  if(!game.enemies.length)game.enemies.push({x:22,z:23,hp:3},{x:26,z:24,hp:3});
  for(const item of game.pickups){if(!item.used&&dist(item,game.player)<2.4){item.used=true;if(item.kind==='health')game.health=Math.min(100,game.health+35);else game.ammo+=12;game.audio.pickup();game.toast(item.kind==='health'?'FIRST AID +35':'AMMO +12')}}
  game.fireCooldown=Math.max(0,game.fireCooldown-dt);
  if(game.keys.f&&!game.fLock){game.fLock=true;const p=game.people.find(q=>dist(q,game.player)<2.5);if(p){p.run=true;game.wanted=Math.min(5,game.wanted+1);game.heatTimer=20;game.audio.hit()}}
  if(!game.keys.f)game.fLock=false;
  if(game.keys.g&&!game.gLock&&game.ammo>0&&game.fireCooldown===0){game.gLock=true;game.ammo--;game.fireCooldown=.35;game.wanted=Math.min(5,game.wanted+1);game.heatTimer=22;game.audio.shot();const p=game.people.find(q=>dist(q,game.player)<13),enemy=game.enemies.find(q=>q.hp>0&&dist(q,game.player)<18);if(p)p.run=true;if(enemy){enemy.hp--;if(enemy.hp<=0)game.money+=100;game.bump=.3}}
  if(!game.keys.g)game.gLock=false;
  for(const e of game.enemies){if(e.hp<=0||game.done<2)continue;const d=dist(e,game.player),dx=game.player.x-e.x,dz=game.player.z-e.z,n=Math.hypot(dx,dz)||1;if(d>3){e.x+=dx/n*dt*2.8;e.z+=dz/n*dt*2.8}else game.health-=dt*2.5}
  if(game.health<100)game.health=Math.min(100,game.health+dt*.45)
}

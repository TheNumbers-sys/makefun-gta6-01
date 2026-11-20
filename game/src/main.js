import {makeCity} from './city.js';
import {makeHud} from './hud.js';
import {playerSystem} from './player.js';
import {vehicleSystem} from './vehicles.js';
import {pedestrianSystem} from './pedestrians.js';
import {policeSystem} from './police.js';
import {combatSystem} from './combat.js';
import {missionSystem} from './missions.js';
import {makeAudio} from './audio.js';
import {loadGame,saveGame} from './save.js';
const query=new URLSearchParams(location.search), shot=query.get('shot'),seed=Number(query.get('seed')||1);let rng=seed>>>0;const random=()=>((rng=(rng*1664525+1013904223)>>>0)/4294967296);
const game={state:'menu',player:{x:-8,z:8,y:0,face:0},cars:[],car:null,driving:false,people:[],cops:[],pickups:[],enemies:[],keys:{},wanted:0,heatTimer:0,health:100,money:1250,ammo:18,done:0,missionFlash:0,bump:0,fireCooldown:0,visibleCop:true,cameraYaw:0,audio:makeAudio(),toast(s){hud.toast(s)},save(){saveGame(game)}};
const saved=loadGame();if(saved){game.money=saved.money||1250;game.done=saved.done||0;game.player.x=saved.x||0;game.player.z=saved.z||0;game.health=saved.health||100}
game.missions=missionSystem(game);const hud=makeHud(game);game.hud=hud;const city=makeCity(document.getElementById('scene'),game);
const $=id=>document.getElementById(id);function begin(continueSave=false){game.audio.boot();game.audio.click();if(!continueSave){game.player.x=-8;game.player.z=8;game.money=1250;game.done=0;game.health=100;game.wanted=0;game.cars=[]}game.state='playing';$('title').classList.add('hidden');$('pause').classList.add('hidden')}
$('start').onclick=()=>begin(false);$('continue').onclick=()=>begin(true);$('resume').onclick=()=>{game.state='playing';$('pause').classList.add('hidden')};$('save').onclick=()=>{game.save();game.toast('GAME SAVED');game.audio.click()};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();game.keys[k]=true;if(k==='escape'||k==='p'){if(game.state==='playing'){game.state='paused';$('pause').classList.remove('hidden')}else if(game.state==='paused'){$('pause').classList.add('hidden');game.state='playing'}}if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault()});addEventListener('keyup',e=>game.keys[e.key.toLowerCase()]=false);addEventListener('blur',()=>game.keys={});
addEventListener('mousemove',e=>{if(document.pointerLockElement)game.cameraYaw+=e.movementX*.002});$('scene').addEventListener('click',()=>{if(game.state==='playing'&&!game.driving&&game.ammo>0){game.keys.g=true;setTimeout(()=>game.keys.g=false,30);document.body.requestPointerLock?.()}});
// Deterministic showcase states are applied before the first rendered frame.
function stage(){game.state='playing';$('title').classList.add('hidden');if(shot==='play'||shot==='chase'){game.player.x=24;game.player.z=8;game.wanted=shot==='play'?3:4;game.cops=[{x:12,z:8,angle:0},{x:16,z:0,angle:0},{x:5,z:8,foot:true}];game.car=game.cars[0];game.car.x=24;game.car.z=8;game.car.speed=shot==='chase'?25:17;game.car.angle=Math.PI/2;game.cameraYaw=Math.PI/2;game.driving=true;game.player.x=game.car.x;game.player.z=game.car.z}else if(shot==='mission'){game.player.x=-24;game.player.z=8;game.done=1;game.missionFlash=2;hud.complete('THE PICKUP',350);$('missionpop').classList.remove('hidden')} }
// Seed the vehicle roster before showcase positioning so every query renders identically.
vehicleSystem(game,0);
if(shot&&shot!=='start')stage();
let previous=performance.now();function frame(now){const dt=Math.min(.04,(now-previous)/1000);previous=now;if(game.state==='playing'&&!shot){game.visibleCop=game.cops.some(c=>Math.hypot(c.x-game.player.x,c.z-game.player.z)<29);playerSystem(game,dt);vehicleSystem(game,dt);pedestrianSystem(game,dt);policeSystem(game,dt);combatSystem(game,dt);game.missions.update();game.bump=Math.max(0,game.bump-dt);game.missionFlash=Math.max(0,game.missionFlash-dt)}city.draw();hud.update();requestAnimationFrame(frame)}requestAnimationFrame(frame);

const KEY='solstice-bay-save-v1';
export function saveGame(game){try{localStorage.setItem(KEY,JSON.stringify({money:game.money,done:game.done,x:game.player.x,z:game.player.z,health:game.health}));return true}catch{return false}}
export function loadGame(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}

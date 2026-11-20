// Local Playwright capture harness for Solstice Bay. Install playwright-core beside this repo
// (for example in ~/workspace/make-fun/tools/shot/) and use the cached Chromium executable.
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
const root=resolve(new URL('.',import.meta.url).pathname),shots=join(root,'screenshots');
const core=process.env.PLAYWRIGHT_CORE_PATH||join(homedir(),'workspace/make-fun/tools/shot/node_modules/playwright-core/index.mjs');
const {chromium}=await import(pathToFileURL(core));
const server=spawn('node',['serve.ts','--port','8080'],{cwd:root,stdio:'ignore'});
try{
  for(let i=0;i<50;i++){try{await fetch('http://localhost:8080');break}catch{await delay(100)}}
  const browser=await chromium.launch({headless:true,executablePath:join(homedir(),'.cache/ms-playwright/chromium-1255/chrome-linux64/chrome'),args:['--no-sandbox']});
  try{const page=await browser.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});page.on('console',m=>{if(m.type()==='error')console.error('browser:',m.text())});page.on('pageerror',e=>console.error('page:',e.message));mkdirSync(shots,{recursive:true});for(const [name,mode] of [['1-start.jpg','start'],['2-drive.jpg','play'],['3-chase.jpg','chase'],['4-mission.jpg','mission']]){await page.goto(`http://localhost:8080/?shot=${mode}&seed=1`);await page.waitForTimeout(2200);await page.screenshot({path:join(shots,name),type:'jpeg',quality:80});console.log(`captured ${name}`)}}finally{await browser.close()}
}finally{server.kill()}

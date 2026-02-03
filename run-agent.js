#!/usr/bin/env node
"use strict";
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const readline = require('readline');

const repoRoot = __dirname;
const agentFile = path.join(repoRoot, 'expert-react-frontend-engineer.agent.md');

function parseCapabilities(text) {
  const lines = text.split(/\r?\n/);
  const caps = [];
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().toLowerCase().startsWith('capabilities:')) { start = i + 1; break; }
  }
  if (start === -1) return caps;
  for (let i = start; i < lines.length; i++) {
    const l = lines[i];
    if (!l || /^#/.test(l)) break;
    const m = l.match(/^-\s+(.*)$/);
    if (m) caps.push(m[1].trim());
    else if (l.trim() === '') break;
  }
  return caps;
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}

function runCommand(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const ps = spawn(cmd, args, Object.assign({ stdio: 'inherit', shell: true }, opts));
    ps.on('close', code => code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited with ${code}`)));
    ps.on('error', err => reject(err));
  });
}

(async function main(){
  console.log('Agent runner starting from:', repoRoot);
  if (!fs.existsSync(agentFile)) {
    console.error('Agent descriptor not found at', agentFile);
    process.exit(1);
  }

  const txt = fs.readFileSync(agentFile, 'utf8');
  console.log('\n=== Agent descriptor: ' + path.basename(agentFile) + ' ===\n');
  console.log(txt);

  const caps = parseCapabilities(txt);
  if (caps.length) {
    console.log('\nParsed Capabilities:');
    caps.forEach((c, i) => console.log(` ${i+1}. ${c}`));
  }

  const ans = await prompt('\nRun `npm install` and then `npm run dev` now? (y/N) ');
  if (ans.trim().toLowerCase() !== 'y') {
    console.log('Cancelled. To run manually: npm install && npm run dev');
    process.exit(0);
  }

  try {
    console.log('\nRunning: npm install');
    await runCommand('npm', ['install']);
    console.log('\nStarting dev server: npm run dev');
    await runCommand('npm', ['run', 'dev']);
  } catch (err) {
    console.error('\nCommand failed:', err.message);
    process.exit(1);
  }
})();

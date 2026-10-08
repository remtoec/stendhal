'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const root=path.join(__dirname,'..');
const version=file=>createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex').slice(0,12);
const index=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/(href|src)="(style\.css|content\.js|scenes\.js|reader-model\.js|story\.js)(?:\?v=[^"]*)?"/g,(_,attribute,file)=>`${attribute}="${file}?v=${version(file)}"`);
fs.writeFileSync(path.join(root,'index.html'),index);
fs.writeFileSync(path.join(root,'read.html'),require('./build-reading.js')());

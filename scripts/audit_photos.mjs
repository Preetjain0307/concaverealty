import fs from 'fs';
import path from 'path';
import { PROJECTS_DATA, PROJECT_FOLDERS } from '../src/data/projectsData.js';

const base = path.join(process.cwd(), 'public', 'project_photos');
const results = [];

PROJECTS_DATA.forEach(p => {
  const folder = PROJECT_FOLDERS[p.id];
  const pPath = path.join(base, folder);
  const files = fs.existsSync(pPath) ? fs.readdirSync(pPath) : [];
  const distinct = new Set(files.map(f => f.split('.')[0]));
  results.push({
    id: p.id,
    name: p.name,
    builder: p.builder,
    location: p.location,
    folder,
    count: distinct.size,
    slots: Array.from(distinct).sort().join(', '),
    files: files.join(', ')
  });
});

console.table(results.map(r => ({
  id: r.id,
  name: r.name,
  location: r.location,
  folder: r.folder,
  distinctSlots: r.count,
  slots: r.slots
})));

const needsMore = results.filter(r => r.count < 3);
console.log(`\nProjects with LESS than 3 photos: ${needsMore.length}`);
needsMore.forEach(r => console.log(`- Project ${r.id}: ${r.name} (${r.location}) has ${r.count} slots [${r.slots}]`));

console.log('\n--- FULL PROJECT DETAILS ---');
PROJECTS_DATA.forEach(p => {
  console.log(`${p.id} | ${p.name} | ${p.builder} | ${p.locality || p.location} | RERA: ${p.rera || 'N/A'}`);
});

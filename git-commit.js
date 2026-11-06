const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

const dir = __dirname;

async function run() {
  console.log('Staging files...');

  // Function to recursively find files while ignoring .git, node_modules, .next, etc.
  function getFiles(currentDir) {
    let results = [];
    const list = fs.readdirSync(currentDir);
    const ignores = ['node_modules', '.git', '.next', 'out', 'build', '.DS_Store'];

    list.forEach(file => {
      if (ignores.includes(file)) return;
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFiles(fullPath));
      } else {
        const relPath = path.relative(dir, fullPath).replace(/\\/g, '/');
        results.push(relPath);
      }
    });
    return results;
  }

  const files = getFiles(dir);
  console.log(`Found ${files.length} files to track.`);

  for (const filepath of files) {
    await git.add({ fs, dir, filepath });
  }

  console.log('Creating commit...');
  const sha = await git.commit({
    fs,
    dir,
    message: 'Initial commit: Firecracker explosion risk engine and live dashboard',
    author: {
      name: 'Jaidev U',
      email: 'jaidev@sentinel.local',
    },
  });

  console.log(`[main (root-commit) ${sha.slice(0, 7)}] Initial commit: Firecracker explosion risk engine and live dashboard`);
  console.log(` ${files.length} files changed, insertions(+)`);
}

run().catch(err => {
  console.error('Commit failed:', err);
  process.exit(1);
});

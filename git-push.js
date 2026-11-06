const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');

const dir = __dirname;
const remoteUrl = process.argv[2];
const token = process.argv[3];

if (!remoteUrl) {
  console.log('Usage: node git-push.js <https://github.com/user/repo.git> [GITHUB_TOKEN]');
  process.exit(1);
}

async function push() {
  console.log(`Setting remote origin: ${remoteUrl}`);
  try {
    await git.addRemote({ fs, dir, remote: 'origin', url: remoteUrl, force: true });
  } catch (e) {
    // remote might already exist
  }

  console.log('Pushing to main branch...');
  const res = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => ({
      username: token || 'git',
      password: token || ''
    })
  });
  console.log('Push successful!', res);
}

push().catch(err => {
  console.error('Push error:', err.message);
});

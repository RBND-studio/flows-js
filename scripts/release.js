const util = require("util");
const exec = util.promisify(require("child_process").exec);

const canary = process.argv.includes("--canary");
const patch = process.argv.includes("--patch");
const minor = process.argv.includes("--minor");
const major = process.argv.includes("--major");

if (!patch && !minor && !major && !canary)
  throw new Error("You must specify a release type: --patch, --minor, --major or --canary");

if (canary) await exec("pnpm js version prerelease --preid=canary");
else await exec(`pnpm js version ${patch ? "patch" : minor ? "minor" : "major"}`);

await exec("git config --global user.name 'flows-release-bot'");
await exec("git config --global user.email 'bot@flows.sh'");
await exec("git add .");
const currentVersion = require("./workspaces/js/package.json").version;
await exec(`git commit -m "${currentVersion}"`);
const gitTagName = `v${currentVersion}`;
await exec(`git tag -a ${gitTagName} -m '${gitTagName}'`);
await exec("git push");

await exec("cp README.md workspaces/js");
await exec("pnpm js build");
await exec(`pnpm js publish --access=public --provenance --no-git-checks`);

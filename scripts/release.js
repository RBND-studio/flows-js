const util = require("util");
const exec = util.promisify(require("child_process").exec);

const canary = process.argv.includes("--canary");
const patch = process.argv.includes("--patch");
const minor = process.argv.includes("--minor");
const major = process.argv.includes("--major");

if (!patch && !minor && !major && !canary)
  throw new Error("You must specify a release type: --patch, --minor, --major or --canary");

const main = async () => {
  if (canary) await exec("pnpm js version prerelease --preid=canary");
  else await exec(`pnpm js version ${patch ? "patch" : minor ? "minor" : "major"}`);

  const currentVersion = require("../workspaces/js/package.json").version;
  await exec(`git commit -S -am "${currentVersion}"`);
  const gitTagName = `v${currentVersion}`;
  await exec(`git tag -s -a ${gitTagName} -m '${gitTagName}'`);
  await exec("git push --no-verify --follow-tags");

  await exec("pnpm js build");
  await exec("cp README.md workspaces/js");
  await exec(
    `pnpm js publish --access=public --provenance --no-git-checks ${canary ? "--tag=canary" : ""}`,
  );
};

main();

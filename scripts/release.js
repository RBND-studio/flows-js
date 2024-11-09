const util = require("util");
const exec = util.promisify(require("child_process").exec);

const argv = require("minimist")(process.argv.slice(2));
const { release, package } = argv;

const allowedReleases = ["canary", "patch", "minor", "major"];

if (!allowedReleases.includes(release))
  throw new Error(`You must specify a release type (--release=...): ${allowedReleases.join(", ")}`);

const allowedPackages = ["js", "react"];
if (!allowedPackages.includes(package))
  throw new Error(`You must specify a package (--package=...): ${allowedPackages.join(", ")}`);

const main = async () => {
  if (release === "canary") await exec(`pnpm ${package} version prerelease --preid=canary`);
  else await exec(`pnpm ${package} version ${release}`);

  const currentVersion = require(`../workspaces/${package}/package.json`).version;
  await exec(`git commit -am "${currentVersion}"`);
  const gitTagName = `v${currentVersion}`;
  await exec(`git tag -a ${gitTagName} -m '${gitTagName}'`);
  await exec("git push --no-verify");
  await exec(`git push --no-verify --tags`);

  await exec(`pnpm ${package} build`);
  await exec(`cp README.md workspaces/${package}`);
  await exec(
    `pnpm ${package} publish --access=public --provenance --no-git-checks ${release === "canary" ? "--tag=canary" : ""}`,
  );
};

main();

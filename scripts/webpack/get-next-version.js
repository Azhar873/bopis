const conventionalRecommendedBump = require('conventional-recommended-bump');
const semver = require('semver');
const argv = require('yargs').argv;

const packageJson = require('../../package.json');

let nextVersion;

function getNextVersion() {
    if (!nextVersion) {
        nextVersion = new Promise((resolve, reject) => {
            const fs = require('fs');
            const path = require('path');

            if (!fs.existsSync(path.join(__dirname, '../../.git'))) {
                return resolve(packageJson.version);
            }

            const timeout = setTimeout(() => {
                resolve(packageJson.version);
            }, 10000); // 10 second timeout

            conventionalRecommendedBump({ preset: 'angular' }, (err, release) => {
                clearTimeout(timeout);
                const prerelease = process.env.PRERELEASE;

                if (err) {
                    // Fallback to current version if git is not available or other error occurs
                    return resolve(packageJson.version);
                }

                if (prerelease) {
                    const prereleaseType = typeof prerelease === 'string' ? prerelease : 'alpha';

                    return resolve(semver.inc(packageJson.version, 'prerelease', prereleaseType).replace(/\.\d+$/, `.${Date.now()}`));
                }

                resolve(semver.inc(packageJson.version, release.releaseType));
            })
        });
    }

    return nextVersion;
}

module.exports = getNextVersion;

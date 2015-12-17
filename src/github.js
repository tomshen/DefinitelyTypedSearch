require("es6-promise").polyfill();
require("isomorphic-fetch");

const packageCache = require("./packages.json");

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_COMMITS_ENDPOINT = "/repos/DefinitelyTyped/DefinitelyTyped/commits";
const GITHUB_TREE_ENDPOINT = "/repos/DefinitelyTyped/DefinitelyTyped/git/trees/";

function logRateLimits(responseHeaders) {
    const limit = responseHeaders.get("X-RateLimit-Limit");
    const remaining = responseHeaders.get("X-RateLimit-Remaining");
    const resetTime = new Date(responseHeaders.get("X-RateLimit-Reset") * 1000).toLocaleString();
    console.log(`GitHub rate limit: ${remaining}/${limit} remaining requests until ${resetTime}`);
}

function makeGitHubApiRequest(endpoint) {
    const url = `${GITHUB_API_URL}${endpoint}`;
    return fetch(url)
        .then(response => {
            logRateLimits(response.headers);
            const contentType = response.headers.get("content-type");
            if (response.status !== 200) {
                throw new Error(`Request failed: ${response.status}`);
            } else if (contentType.indexOf("application/json") !== -1) {
                return response.json();
            } else {
                throw new Error(`Response is of type ${contentType}`)
            }
        });
}

function getLatestSha() {
    return makeGitHubApiRequest(GITHUB_COMMITS_ENDPOINT)
        .then(response => response[0].sha);
}

// github.getAllPackages().then(packages => fs.writeFileSync('./src/packages.json', JSON.stringify(packages, null, '  ')));
exports.getAllPackages = function getAllPackages() {
    return getLatestSha()
        .then(sha => makeGitHubApiRequest(`${GITHUB_TREE_ENDPOINT}${sha}?recursive=1`))
        .then(response => {
            if (response.truncated) {
                console.error("List of typings was truncated.")
            }
            const packages = {};
            response.tree
                .filter(node => node.type === "blob" && node.path.indexOf("/") !== -1)
                .map(directory => directory.path)
                .forEach(name => {
                    const splitNames = name.split("/");
                    const packageName = splitNames[0];
                    const fileName = splitNames.slice(1).join("/");
                    packages[packageName] = packages[packageName] || [];
                    packages[packageName].push(fileName);
                });
            return Object.keys(packages).map(packageName => {
                return {
                    packageName: packageName,
                    fileNames: packages[packageName].filter(fileName => fileName.endsWith(".d.ts"))
                };
            }).sort((pkg1, pkg2) => pkg1.packageName.toLowerCase().localeCompare(pkg2.packageName.toLowerCase()));
        })
        .catch(error => {
            console.log("GitHub API request failed. Falling back to package cache.");
            return new Promise(function(resolve, reject) {
                return resolve(packageCache);
            });
        });
}

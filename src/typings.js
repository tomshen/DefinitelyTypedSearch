require("es6-promise").polyfill();
require("isomorphic-fetch");

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_COMMITS_ENDPOINT = "/repos/DefinitelyTyped/DefinitelyTyped/commits";
const GITHUB_TREE_ENDPOINT = "/repos/DefinitelyTyped/DefinitelyTyped/git/trees/";

function logRateLimits(responseHeaders) {
    const limit = responseHeaders.get("X-RateLimit-Limit");
    const remaining = responseHeaders.get("X-RateLimit-Remaining");
    const resetTime = new Date(responseHeaders.get("X-RateLimit-Reset") * 1000).toLocaleString();
    console.log(`GitHub rate limit: ${remaining}/${limit} requests until ${resetTime}`);
}

function makeGitHubApiRequest(endpoint) {
    const url = `${GITHUB_API_URL}${endpoint}`;
    return fetch(url)
        .then(response => {
            logRateLimits(response.headers);
            const contentType = response.headers.get("content-type");
            if(contentType.indexOf("application/json") !== -1) {
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

exports.getAllPackages = function getAllPackages() {
    return getLatestSha()
        .then(sha => makeGitHubApiRequest(`${GITHUB_TREE_ENDPOINT}${sha}`))
        .then(response => {
            return response.tree
                .filter(node => node.type === "tree")
                .map(directory => directory.path)
                .sort((path1, path2) => path1.toLowerCase().localeCompare(path2.toLowerCase()));
        });
}

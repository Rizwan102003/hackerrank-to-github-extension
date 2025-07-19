
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getTokenAndRepo") {
        chrome.storage.local.get(["gh_token", "gh_repo"], (result) => {
            sendResponse({ token: result.gh_token, repo: result.gh_repo });
        });
        return true; // Keep message channel open for async response
    } else if (message.type === "saveTokenAndRepo") {
        chrome.storage.local.set({
            gh_token: message.token,
            gh_repo: message.repo
        }, () => {
            sendResponse({ success: true });
        });
        return true;
    }
});

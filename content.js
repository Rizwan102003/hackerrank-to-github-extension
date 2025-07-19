
function getLanguageExtension(language) {
    const map = {
        'java': 'java',
        'python': 'py',
        'cpp': 'cpp',
        'c': 'c',
        'javascript': 'js',
        'ruby': 'rb',
        'go': 'go'
    };
    return map[language.toLowerCase()] || 'txt';
}

function waitForSuccess() {
    const observer = new MutationObserver(() => {
        const successMsg = document.querySelector('.congrats-wrapper');
        if (successMsg) {
            observer.disconnect();
            uploadToGitHub();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

function uploadToGitHub() {
    chrome.runtime.sendMessage({ type: "getTokenAndRepo" }, ({ token, repo }) => {
        if (!token || !repo) {
            console.log("Token or Repo not found.");
            return;
        }
        
        const codeElement = document.querySelector('pre');
        const langElement = document.querySelector('[data-attr2]');
        const title = document.querySelector("div.hr_tour-challenge-name h1")?.innerText.trim().replace(/\s+/g, '_') || "submission";

        if (!codeElement || !langElement) return;
        
        const code = codeElement.innerText;
        const language = langElement.getAttribute("data-attr2");
        const extension = getLanguageExtension(language);
        const filename = `${title}.${extension}`;

        const apiUrl = `https://api.github.com/repos/${repo}/contents/${filename}`;

        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(res => res.json())
        .then(data => {
            const payload = {
                message: `Add solution for ${title}`,
                content: btoa(unescape(encodeURIComponent(code))),
                ...(data.sha && { sha: data.sha })
            };

            return fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(payload)
            });
        })
        .then(res => res.json())
        .then(result => {
            console.log("Committed to GitHub:", result.content?.path);
        })
        .catch(err => console.error("GitHub commit failed:", err));
    });
}

waitForSuccess();

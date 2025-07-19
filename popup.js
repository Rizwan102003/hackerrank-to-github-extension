document.getElementById('submit').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        chrome.tabs.sendMessage(tab.id, { action: 'getCode' }, async ({ code, language }) => {
            const ext = languageMap[language] || 'txt';
            const filename = `solution.${ext}`;

            const githubToken = document.getElementById('token').value;
            const repo = document.getElementById('repo').value;

            const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Add HackerRank solution',
                    content: btoa(unescape(encodeURIComponent(code)))
                })
            });

            if (response.ok) {
                alert('Uploaded successfully!');
            } else {
                alert('Upload failed.');
            }
        });
    });
});
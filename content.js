const languageMap = {
    'Java': 'java',
    'Python 3': 'py',
    'C++': 'cpp',
    'C': 'c',
    'JavaScript': 'js',
    'Go': 'go',
    'Ruby': 'rb'
};

const getCodeDetails = () => {
    const code = document.querySelector('.view-lines')?.innerText || '';
    const language = document.querySelector('.css-1hwfws3')?.innerText || 'text';
    const titleEl = document.querySelector('h1');
    const problem = titleEl ? titleEl.innerText.trim().replace(/\s+/g, '_') : 'hackerank_problem';
    return { code, language, problem };
};

const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === 'childList' && mutation.target.innerText?.includes('Success')) {
            const { code, language, problem } = getCodeDetails();
            const ext = languageMap[language] || 'txt';
            const filename = `${problem}.${ext}`;

            const token = localStorage.getItem('gh_token');
            const repo = localStorage.getItem('gh_repo');

            if (!token || !repo) {
                console.warn('GitHub token or repo not found in localStorage');
                return;
            }

            fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Add solution for ${problem}`,
                    content: btoa(unescape(encodeURIComponent(code)))
                })
            }).then(res => {
                if (res.ok) console.log('Submission pushed to GitHub');
                else console.error('Failed to push to GitHub');
            });
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
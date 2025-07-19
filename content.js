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
  const codeEl = document.querySelector('.view-lines');
  let code = '';
  if (codeEl) {
    code = Array.from(codeEl.querySelectorAll('div')).map(line => line.innerText).join('\n');
  }

  const langEl = document.querySelector('[data-attr2="Language"]') || document.querySelector('.css-1hwfws3');
  const language = langEl ? langEl.innerText.trim() : 'text';

  const titleEl = document.querySelector('h1');
  const problem = titleEl ? titleEl.innerText.trim().replace(/\s+/g, '_') : 'hackerank_problem';

  console.log('[HR2GH] Code:', code.slice(0, 50) + '...');
  console.log('[HR2GH] Lang:', language);
  console.log('[HR2GH] Problem:', problem);

  return { code, language, problem };
};

const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);
    for (let node of addedNodes) {
      if (node.nodeType === 1 && node.textContent.includes('All test cases passed')) {
        console.log('[HR2GH] Success message detected');

        const { code, language, problem } = getCodeDetails();
        const ext = languageMap[language] || 'txt';
        const filename = `${problem}.${ext}`;

        chrome.storage.local.get(['gh_token', 'gh_repo'], ({ gh_token, gh_repo }) => {
          if (!gh_token || !gh_repo) {
            console.warn('[HR2GH] GitHub token or repo not found in storage');
            return;
          }

          fetch(`https://api.github.com/repos/${gh_repo}/contents/${filename}`, {
            method: 'PUT',
            headers: {
              'Authorization': `token ${gh_token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: `Add solution for ${problem}`,
              content: btoa(unescape(encodeURIComponent(code)))
            })
          }).then(res => {
            if (res.ok) console.log('[HR2GH] ✅ Submission pushed to GitHub');
            else res.text().then(err => console.error('[HR2GH] ❌ GitHub error:', err));
          });
        });
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });
document.getElementById('save').addEventListener('click', () => {
  const token = document.getElementById('token').value;
  const repo = document.getElementById('repo').value;

  chrome.storage.local.set({ gh_token: token, gh_repo: repo }, () => {
    alert('GitHub token and repo saved!');
  });
});
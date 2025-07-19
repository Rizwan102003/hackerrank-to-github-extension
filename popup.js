document.getElementById('save').addEventListener('click', () => {
  const token = document.getElementById('token').value;
  const repo = document.getElementById('repo').value;
  localStorage.setItem('gh_token', token);
  localStorage.setItem('gh_repo', repo);
  alert('GitHub token and repo saved!');
});
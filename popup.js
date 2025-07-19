
document.getElementById("save").addEventListener("click", () => {
    const token = document.getElementById("token").value;
    const repo = document.getElementById("repo").value;
    chrome.runtime.sendMessage({ type: "saveTokenAndRepo", token, repo }, (response) => {
        document.getElementById("status").textContent = "Token and Repo saved.";
    });
});

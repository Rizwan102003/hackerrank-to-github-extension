const getCodeDetails = () => {
    const code = document.querySelector('.view-lines')?.innerText || '';
    const language = document.querySelector('.css-1hwfws3')?.innerText || 'text';
    return { code, language };
};

chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
    if (req.action === 'getCode') {
        sendRes(getCodeDetails());
    }
});
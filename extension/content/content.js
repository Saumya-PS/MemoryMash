// Runs on every page and returns its visible text to the popup.





const extractVisibleText = () => {

    const clonedBody = document.body.cloneNode(true);

    clonedBody.querySelectorAll("script, style, noscript, nav, footer, svg").forEach((el) => el.remove());

    const text = clonedBody.innerText || "";

    return text.replace(/\s+/g, " ").trim().slice(0, 8000);

};




chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === "AI_MEMORY_GET_PAGE_CONTENT") {
        sendResponse({ content: extractVisibleText() });
        return true;
    }

});

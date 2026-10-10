// Popup: log in, then save the current page as a memory.

const loginView = document.getElementById("loginView");
const saveView = document.getElementById("saveView");
const loginError = document.getElementById("loginError");
const saveStatus = document.getElementById("saveStatus");
const userEmailLabel = document.getElementById("userEmail");
const collectionSelect = document.getElementById("collectionSelect");
const pageTitleInput = document.getElementById("pageTitle");




// Saved token + user from chrome.storage.

const getStoredAuth = () => {

    return new Promise((resolve) => {
        chrome.storage.local.get(["accessToken", "user"], (result) => {
            resolve(result);
        });
    });

};




// Authenticated fetch to the backend.

const callApi = async (path, options = {}) => {

    const { accessToken } = await getStoredAuth();

    const response = await fetch(`${AI_MEMORY_CONFIG.API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            ...(options.headers || {})
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;

};






// Fills the collection dropdown (the API arrives in a later commit).

const loadCollections = async () => {

    try {

        const data = await callApi("/collections");

        (data.data || []).forEach((collection) => {
            const option = document.createElement("option");
            option.value = collection._id;
            option.textContent = collection.name;
            collectionSelect.appendChild(option);
        });

    } catch (error) {

        console.error("Could not load collections:", error.message);

    }

};





// Asks the content script for the active tab's text.

const getActiveTabContent = async () => {

    return new Promise((resolve) => {

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

            const activeTab = tabs[0];

            chrome.tabs.sendMessage(
                activeTab.id,
                { type: "AI_MEMORY_GET_PAGE_CONTENT" },
                (response) => {
                    resolve({
                        url: activeTab.url,
                        title: activeTab.title,
                        content: response?.content || ""
                    });
                }
            );

        });

    });

};





// Switches to the save view and pre-fills the title.

const showSaveView = async (user) => {

    loginView.classList.add("hidden");
    saveView.classList.remove("hidden");
    userEmailLabel.textContent = user.email;

    const tabInfo = await getActiveTabContent();
    pageTitleInput.value = tabInfo.title || "";

    await loadCollections();

};






// POST /auth/login, then stores the token.

const handleLogin = async () => {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    loginError.textContent = "";

    if (!email || !password) {
        loginError.textContent = "Please enter your email and password.";
        return;
    }

    try {

        const response = await fetch(`${AI_MEMORY_CONFIG.API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        chrome.storage.local.set(
            { accessToken: data.data.accessToken, user: data.data.user },
            () => showSaveView(data.data.user)
        );

    } catch (error) {

        loginError.textContent = error.message;

    }

};




// POST /memories with the form fields.

const handleSaveMemory = async () => {

    saveStatus.textContent = "Saving...";

    try {

        const tabInfo = await getActiveTabContent();

        await callApi("/memories", {
            method: "POST",
            body: JSON.stringify({
                url: tabInfo.url,
                title: pageTitleInput.value || tabInfo.title,
                content: tabInfo.content,
                userIntent: document.getElementById("userIntent").value,
                notes: document.getElementById("userNotes").value,
                collection: collectionSelect.value || null
            })
        });

        saveStatus.textContent = "Saved!";

    } catch (error) {

        saveStatus.textContent = `Error: ${error.message}`;

    }

};



const handleLogout = () => {

    chrome.storage.local.remove(["accessToken", "user"], () => {
        saveView.classList.add("hidden");
        loginView.classList.remove("hidden");
    });

};



document.getElementById("loginBtn").addEventListener("click", handleLogin);
document.getElementById("saveMemoryBtn").addEventListener("click", handleSaveMemory);
document.getElementById("logoutBtn").addEventListener("click", handleLogout);
document.getElementById("openDashboardBtn").addEventListener("click", () => {
    chrome.tabs.create({ url: AI_MEMORY_CONFIG.DASHBOARD_URL });
});





// On open, jump to the save view if already logged in.

(async () => {

    const { accessToken, user } = await getStoredAuth();

    if (accessToken && user) {
        showSaveView(user);
    }

})();

/**
 * NotebookLM Pro Tree - Background Service V17.1
 * Handles remote configuration fetching to bypass CORS restrictions.
 * 
 * V17.1 Changes:
 * - Added retry logic for failed fetches
 * - Improved error messages
 * - Added timeout handling
 */

const FETCH_TIMEOUT_MS = 10000; // 10 second timeout

// Yalnızca sabitlenmiş seçici yapılandırması indirilir. İçerik betiği başka bir
// adres isterse istek reddedilir; gist'in sürümsüz "raw" ucu bilerek kullanılmaz.
// Güncelleme: content.js'teki REMOTE_CONFIG_URL ile birlikte bu sabiti değiştir.
const ALLOWED_CONFIG_URL = "https://gist.githubusercontent.com/benju66/7635f09ea87f81c890f9b736b22d9ac4/raw/ab991c7ba2e6650b48f068b3fb0ebe11029d7d0c/notebooklm-selectors.json";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchConfig") {
        if (request.url !== ALLOWED_CONFIG_URL) {
            console.warn("NotebookLM Tree: Refused config fetch for a non-allowlisted URL");
            sendResponse({ success: false, error: "URL not allowed" });
            return false;
        }
        fetchWithTimeout(request.url, FETCH_TIMEOUT_MS)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                sendResponse({ success: true, data: data });
            })
            .catch(error => {
                console.warn("NotebookLM Tree: Config fetch failed:", error.message);
                sendResponse({ success: false, error: error.message });
            });
        return true; // Keeps the message channel open for async response
    }
});

/**
 * Fetch with timeout wrapper
 * @param {string} url - URL to fetch
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<Response>}
 */
function fetchWithTimeout(url, timeoutMs) {
    return new Promise((resolve, reject) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
            reject(new Error('Request timeout'));
        }, timeoutMs);
        
        fetch(url, { signal: controller.signal })
            .then(response => {
                clearTimeout(timeoutId);
                resolve(response);
            })
            .catch(error => {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    reject(new Error('Request timeout'));
                } else {
                    reject(error);
                }
            });
    });
}

console.log("NotebookLM Pro Tree service worker started (V17.1)");

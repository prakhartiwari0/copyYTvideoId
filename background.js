
chrome.contextMenus.create({
    id: 'yt',
    title: 'Copy YouTube Video ID',
    contexts: ["link", "video"],
    documentUrlPatterns: ['*://*.youtube.com/*']
});


function extractYouTubeVideoId(url) {
    const videoUrl = new URL(url);
    const pathSegments = videoUrl.pathname.split("/");

    if (pathSegments.length >= 2 && pathSegments[1] === "watch") {
        const searchParams = new URLSearchParams(videoUrl.search);
        if (searchParams.has("v")) {
            return searchParams.get("v");
        }
    } else if (pathSegments.length >= 2 && pathSegments[1] === "shorts") {
        const videoId = pathSegments[2];
        return videoId;
    }

    return null;
}


function isYouTubeVideoUrl(url) {
    // Regular expressions to match YouTube video URLs
    const watchUrlPattern = /watch\?v=[A-Za-z0-9_-]{11}/;
    const shortsUrlPattern = /shorts\/[A-Za-z0-9_-]{11}/;

    return watchUrlPattern.test(url) || shortsUrlPattern.test(url);
}






chrome.contextMenus.onClicked.addListener((info, tab) => {
    let videoID;

    // If the page is a youtube video page, then extract the id from the tab URL itself
    if (isYouTubeVideoUrl(info.pageUrl)) videoID = extractYouTubeVideoId(pageURL)

    // If the link is a youtube video link, then extract the id from the Link itself
    else if (isYouTubeVideoUrl(info.linkUrl)) videoID = extractYouTubeVideoId()


    else console.log("This is neither a youtube video page nor a youtube video link you have clicked on");

    // If we have got a videoID, send it to the content script
    if (videoID) chrome.tabs.sendMessage(tab.id, { action: "copyToClipboard", videoID });

});
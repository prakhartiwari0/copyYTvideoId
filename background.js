
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

    // If the link is a youtube video link, then extract the id from the Link itself
    if (isYouTubeVideoUrl(info.linkUrl)) videoID = extractYouTubeVideoId(info.linkUrl)
    
    // If the page is a youtube video page, then extract the id from the tab URL itself
    else if (isYouTubeVideoUrl(info.pageUrl)) videoID = extractYouTubeVideoId(info.pageUrl)

    // Note, we are checking the Link URL first, because in case the user clicks on a YouTube video link when they are already watching a YouTube video, the ID copied will not be of the clicked Link but of the current video being played, because we are checking for the page first. Therefore, instead of checking of the page first, we will check for the clicked LINK to see if it's a YouTube video link, if it's not, then it will check for the page URL. 
    


    else console.log("This is neither a youtube video page nor a youtube video link you have clicked on");

    // If we have got a videoID, send it to the content script
    if (videoID) chrome.tabs.sendMessage(tab.id, { action: "copyToClipboard", videoID });

});
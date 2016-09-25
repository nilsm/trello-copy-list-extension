/**
 * Created by Nathalie Rud on 24-Sep-16.
 */

chrome.runtime.onMessage.addListener(
    function(request) {
        var res = chrome.notifications.create(request);
    }
);
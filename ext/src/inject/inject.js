chrome.extension.sendMessage({}, function() {
    var minute = 60*1000;
    var timeout = 15*minute;

    function log(message){
        console.log("fb_auto_logout: " + message);
    }

    function openMenu(after){
        var all_links = document.getElementsByTagName('a');
        for (var i = 0, n = all_links.length; i < n; i++){
            var e = all_links[i];
            var href = e.getAttribute("href");
            var text = e.innerText;
            if (
                href && href.match(/(https:\/\/www.facebook.com)?\/settings/) &&
                text && text.match(/Account Settings/) ){
                log("clicking " + e);
                e.click();
                setTimeout(after, 1000);
                return;
            }
        }
        log("Couldn't find account settings menu. User probably not logged in");
    }
    function signOut(){
        var all_forms = document.getElementsByTagName('form');
        for (var i = 0, n = all_forms.length; i < n; i++){
            var e = all_forms[i];
            if (e.getAttribute("action") == "https://www.facebook.com/logout.php"){
                log("submitting " + e);
                e.submit();
                return;
            }
        }
    }

    function tick(timeLeft){
        log((timeLeft/minute) + " minutes until logout");
        if (timeLeft > 0)
          setTimeout(function(){ tick(timeLeft - minute); }, minute);
        else
          openMenu(signOut);
    }
	var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            tick(timeout);
        }
	}, 10);
});
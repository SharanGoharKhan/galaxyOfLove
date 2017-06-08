var loading_screen;
var imagesToLoad = [
    "//d44k5f1zplbpz.cloudfront.net/staticImages/24pxflare.png",
    "//d44k5f1zplbpz.cloudfront.net/staticImages/8pxflare.png",
    "//d44k5f1zplbpz.cloudfront.net/staticImages/background-v2.jpg",
    "//d44k5f1zplbpz.cloudfront.net/staticImages/4pxflare-v2.png",
    "//d44k5f1zplbpz.cloudfront.net/staticImages/4pxflare-v3.png",
    "//d44k5f1zplbpz.cloudfront.net/staticImages/4pxflare-v1.png",
    "//d44k5f1zplbpz.cloudfront.net/staticImages/8pxflare-v1.png",
    "//d44k5f1zplbpz.cloudfront.net/staticImages/8pxflare-v2.png"
]

var launchPharse = ["Spreading love, One star at a time!", "Express your love, Name a star!","Go on, Tell someone how much you love them!"]


function showLoader(where) {
    console.log("Showing loader from ", where)
    if (!loading_screen || loading_screen.finishing) {
        var index = Math.floor(Math.random() * ((launchPharse.length - 1) - 0 + 1) + 0)
        var loadingPhrase = launchPharse[index]
        var html = "<p style='color: #fff;font-size: 18px; font-family:'Lucida Grande';font-weight: 300;'>" + loadingPhrase + "</p><div class='spinner'>  <div class='double-bounce1'></div>  <div class='double-bounce2'></div></div>"
        if (where == "home") {
            html = "<p style='color: #fff;font-size: 18px; font-family:'Lucida Grande';font-weight: 300;'>Taking you there ...</p><div class='spinner'>  <div class='double-bounce1'></div>  <div class='double-bounce2'></div></div>"
        }
        loading_screen = pleaseWait({
            logo: "//d44k5f1zplbpz.cloudfront.net/staticImages/v2/logo_galaxy_of_love.png",
            backgroundColor: '#000',
            loadingHtml: html
        });
    }
}

function stopLoader() {
    //console.log('called stop')
    window.scrollTo(0, 0)
    loading_screen.finish()
}

function checkContainer() {
    if (($('star').is(':visible') || $('createstar').is(':visible'))) { //if the container is visible on the page
        var index = 0

        function loadImage(src) {
            var image = new Image()
            image.src = src
            image.onload = function() {
                console.log("Loaded image : %s", imagesToLoad[index])
                if ((index + 1) === imagesToLoad.length) {
                    return stopLoader()
                } else {
                    index++
                    loadImage(imagesToLoad[index])
                }
            }
        }
        loadImage(imagesToLoad[0])
    } else {
        setTimeout(checkContainer, 50); //wait 50 ms, then try again
    }
};
showLoader("self")
angular
    .module("GalaxyOfLoveApp", [
        "ngCookies",
        "ui.bootstrap",
        "ngRoute",
        "angular-loading-bar",
        "sly",
        "ngFileUpload",
        "ngImgCrop",
        "facebook",
        "bootstrapLightbox",
        "vcRecaptcha",
        "angulartics",
        "angulartics.google.analytics",
        "angulartics.mixpanel"
    ])
    .run(templateGet)
    .config(routesFunc)
    .config(facebook)
    .config(LightboxConfig)
    .config(facebookApi)
    .service("starService", starServiceFunc)
    .service("selectedStarService", selectedStarService)
    .service("facebookService", facebookService)
    .service("starPageService", starPageService)
    .service("staticDataService", staticDataService)
    .service("miscService", miscService)
    .service("paymentService", paymentService)
    .directive("star", starDirectiveFunc)
    .directive("createstar", createStarDirective)
    .directive("typeahead", typeAhead)
    .controller("spaceController", spaceController)
    .controller("chooseStarController", chooseStarController)
    .controller("nameStarController", nameStarController)
    .controller("imageSelectorController", imageSelectorController)
    .controller("resultModalController", resultModalController)
    .controller("navigationController", navigationController)
    .controller("msgPicController", msgPicController)
    .controller("starPageController", starPageController)
    .controller("profileImageSelectorController", profileImageSelectorController)
    .controller("errorController", errorController)
    .controller("paymentModalController", paymentModalController)
    .controller("staticPageController", staticPageController)
    .controller("emailShareModalController", emailShareModalController)
    .controller("contactController", contactController)
    .controller("paymentVerificationModalController", paymentVerificationModalController)
    .controller("introController",introController)
    .filter('capitalize', capitalize)
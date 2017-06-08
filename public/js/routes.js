function routesFunc($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    $routeProvider
        .when("/", {
            templateUrl: "public/templates/home.html",
            controller: "spaceController",
            controllerAs: "homeController"
        })
        .when("/createstar/choose", {
            templateUrl: "public/templates/chooseStar.html",
            controller: "chooseStarController",
            controllerAs: "chooseStarController"
        })
        .when("/createstar/name", {
            templateUrl: "public/templates/nameStar.html",
            controller: "nameStarController"
        })
        .when("/404", {
            templateUrl: "public/templates/404.html",
            controller: "errorController"
        })
        .when("/what", {
            templateUrl: "public/templates/what.html",
            controller: "staticPageController"
        })
        .when("/why", {
            templateUrl: "public/templates/what.html",
            controller: "staticPageController"
        })
        .when("/terms", {
            templateUrl: "public/templates/terms.html",
            controller: "staticPageController"
        })
        .when("/privacy", {
            templateUrl: "public/templates/privacy.html",
            controller: "staticPageController"
        })
        .when("/contact", {
            templateUrl: "public/templates/contact.html",
            controller: "contactController"
        })
        .when("/star/:starName", {
            templateUrl: "public/templates/starPage.html",
            controller: "starPageController",
            controllerAs: "starPageController",
            resolve: {
                response: starDataResolve
            }
        })

    .otherwise({
        redirectTo: "/404"
    })

    $locationProvider.html5Mode(true);
}

routesFunc.$inject = ["$routeProvider", "$locationProvider"]


function facebook(FacebookProvider) {
    FacebookProvider.init('625870930910496');
}
facebook.$inject = ["FacebookProvider"]

function LightboxConfig(LightboxProvider) {
    // set a custom template
    LightboxProvider.templateUrl = 'public/templates/lightbox.html';
}
LightboxConfig.$inject = ["LightboxProvider"]

function facebookApi(x) {
    //
}
facebookApi.$inject = ["$httpProvider"]


function starDataResolve(starPageService, $route) {
    return starPageService.getStarPageData(
        $route.current.params.starName,
        $route.current.params.payment_id, 
        $route.current.params.payment_request_id, 
        $route.current.params.paymentId, 
        $route.current.params.PayerID,
        $route.current.params.token)
}
starDataResolve.$inject = ["starPageService",'$route']

function staticPageResolve(staticDataService, $location, $route) {
    return staticDataService.getStaticData($location.path().split("/")[1])
}
staticPageResolve.$inject = ["staticDataService", "$location", "$route"]



function templateGet($templateCache, $http) {
    $http.get('public/templates/enabledPopoverTemplate.html', { cache: $templateCache });
    $http.get('public/templates/404.html', { cache: $templateCache });
    $http.get('public/templates/chooseStar.html', { cache: $templateCache });
    $http.get('public/templates/directives/createStarDirective.html', { cache: $templateCache });
    $http.get('public/templates/directives/createStarDirective.html', { cache: $templateCache });

}
templateGet.$inject = ["$templateCache", "$http"]
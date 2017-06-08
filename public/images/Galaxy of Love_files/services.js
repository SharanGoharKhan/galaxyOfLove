function starServiceFunc($q, $timeout, $http, $location) {
    var self = this
    this.getData = function(callback) {
        return $http({
            method: "GET",
            url: "api/v1/home",
            params: {
                path: $location.path() == "/" ? "home" : "name-a-star"
            }
        }).then(function sucess(response) {
            if (response) {

                self.stars = response.data.stars
                self.costArray = response.data.costArray
                self.selectedRadius = response.data.costArray[0].radius.toString()
                return callback(null, response.data)
            }
        }, function error(err) {
            if (err) {
                console.log(err)
                return callback(err)
            }
        })
    }
    this.getStars = function() {
        return self.stars
    }

    this.getSearchResult = function() {
        return self.searchResult
    }

    this.getSearchResultPulse = function(star) {
        var selectedPulse = {}
        selectedPulse.width = star.width + 18
        selectedPulse.top = star.top - 11
        selectedPulse.left = star.left - 11
        selectedPulse.radius = selectedPulse.width * 3
        return selectedPulse
    }
}
starServiceFunc.$inject = ["$q", "$timeout", "$http", "$location"]



function selectedStarService($q, $http, $location) {
    var self = this

    this.selectedStar = {
        croppedImage: "public/images/croppedImage.png",
        profileImagePlaceholder: "public/images/facePlaceholder.png",
        user: {},
        messagePics: [

        ]
    }

    this.getSelectedPulse = function() {
        var selectedPulse = {}
        selectedPulse.width = self.selectedStar.width + 18
        selectedPulse.top = self.selectedStar.top - 11
        selectedPulse.left = self.selectedStar.left - 11
        selectedPulse.radius = selectedPulse.width * 3
        return selectedPulse
    }

    this.getStarPrice = function(costArray, selectedRadius) {
        var returnObj
        angular.forEach(costArray, function(starCost) {
            if (starCost.radius == selectedRadius) {
                returnObj = starCost
                if (starCost.value == 0) {
                    returnObj.starPriceLabel = "Free"
                } else {
                    returnObj.starPriceLabel = starCost.currency + " " + starCost.value.toString()
                }
            }
        })
        return returnObj
    }

    this.userData = function(data) {
        self.selectedStar.user = data
    }

    this.createStar = function(payment_gateway_response) {
        // Post Data to server and create Star Razor Pay
        var deferred = $q.defer()
        var postData = {
            starData: self.selectedStar,
            paymentData: payment_gateway_response,
            captchaResponse: self.captchaResponse
        }

        delete postData.starData.croppedImage
        delete postData.starData.enabled

        // Handle for Razor Pay
        $http({
            method: "POST",
            data: postData,
            url: "api/v1/createStar"
        }).then(function success(response) {
            if (!response.data.err) {
                deferred.resolve(response.data)
            } else {
                deferred.reject('Something went Wrong!!! \n\nPlease try again')
            }
        }, function error(err) {
            deferred.reject("Something went Wrong!!! \n\nPlease try again")
        })
        return deferred.promise
    }

    this.starNameCheck = function(starName) {
        var deferred = $q.defer()
        $http({
            method: "GET",
            url: "api/v1/starNameCheck",
            params: {
                starName: starName
            }
        }).then(function(res) {
            if (res.data.available == true) {
                deferred.resolve("Hurray!!! Name is available")
            } else {
                deferred.reject("Ooops!! Name already taken")
            }
        }, function(err) {
            deferred.reject("Something wierd happened, try again!")
        })
        return deferred.promise
    }

    this.validateStar = function(starToTest) {
        var deferred = $q.defer()
        $http({
            method: "POST",
            data: starToTest,
            url: "api/v1/validateStar"
        }).then(function(response) {
            if (response.data.validation) {
                deferred.resolve()
            } else {
                deferred.reject("Too close to another Star or the Space boundries.\n\nWe all need some space afterall.")
            }
        }, function(err) {
            console.log(err)
            deferred.reject("Something went wrong, Try Again")
        })
        return deferred.promise
    }

    this.validateCoupon = function(couponCode) {
        var deferred = $q.defer()
        return $http({
            method: "POST",
            data: {
                couponCode: couponCode,
            },
            url: "api/v1/validateCoupon"
        })


    }

}

selectedStarService.$inkject = ["$q", "$http"]


function miscService($q, $http) {
    this.shareCreatedStar = function(email, sharerData) {
        var deferred = $q.defer()
        var shareData = {
            emailToShareWith: email,
            starName: sharerData.name
        }

        $http({
            method: 'POST',
            data: shareData,
            url: 'api/v1/shareCreatedStar'
        }).then(function(response) {
            deferred.resolve(response.data.msg)
        }, function(err) {
            deferred.resolve("Someting Went Wrong")
        })
        return deferred.promise
    }

    this.emailQuery = function(emailData) {
        var deferred = $q.defer()
        $http({
            method: "POST",
            data: emailData,
            url: "api/v1/emailQuery"
        }).then(function(res) {
            if (!res.data.err) {
                deferred.resolve(res.data.msg)
            } else {
                deferred.reject("Something went wrong")
            }
        }, function(err) {
            deferred.reject("Something went wrong")
        })
        return deferred.promise
    }
}

miscService.$inject = ['$q', '$http']


function facebookService(Facebook, $q, $location) {

    this.authData = {}
    var self = this

    this.fbFeed = function(shareType, starData) {
        var caption;
        var description = starData.smallMessage;
        var name;
        switch (shareType) {
            case "selfShare":
                // statements_1
                caption = "I just named a star in the Galaxy of Love";
                description = starData.message;
                break;
            case "elseShare":
                // caption = "Found a star, "+starData.name+", in the Galaxy of Love.";
                break;
        }
        Facebook.ui({
            method: "feed",
            link: "https://galaxyoflove.co/star/" + starData.name,
            name: starData.name.toUpperCase() + " - Galaxy of Love.",
            caption: caption,
            description: description,
            picture: "https://d44k5f1zplbpz.cloudfront.net/staticImages/fb-share-v3-tiny.png"
        }, function(response) {
            console.log(response)
        })
    };

    this.getProfileImage = function(userID) {
        var deferred = $q.defer()
        var path = "/" + userID + "/picture"
        var params = {
            height: 200
        }
        Facebook.api(path, params, function(response) {
            if (!response || response.error) {
                deferred.reject("Error")
            } else {
                deferred.resolve(response)
            }
        })
        return deferred.promise
    };

    this.getLoginStatus = function() {
        var deferred = $q.defer()
        Facebook.getLoginStatus(function(response) {
            if (!response || response.error) {
                deferred.reject("Error Occured")
            } else {
                deferred.resolve(response)
            }
        })
        return deferred.promise
    };

    this.fbLogin = function() {
        var deferred = $q.defer()
        Facebook.login(function(response) {
            if (!response || response.error || !response.authResponse) {
                deferred.reject("Some Error")
            } else {
                console.log(response)
                deferred.resolve(response)
            }
        }, { scope: "email" })
        return deferred.promise
    };

    this.fbMe = function() {

        var deferred = $q.defer()

        Facebook.api("/me?fields=email,name,id", { "fields": "id,name,email" }, function(response) {
            console.log(response)
            if (response.name && response.email) {
                deferred.resolve(response)
            } else {
                deferred.reject("Some Error")
                // Facebook.logout(function(res) {
                //     console.log(res)
                // })
            }
        })
        return deferred.promise
    };
}

facebookService.$inject = ["Facebook", "$q", '$location']



function starPageService($q, $http, $location) {

    this.getStarPageData = function(starname, payment_id, payment_request_id, paymentId, PayerID, token) {
        var deferred = $q.defer()
        $http({
            method: "GET",
            url: "api/v1/starData",
            params: {
                starName: starname,
                payment_id: payment_id,
                payment_request_id: payment_request_id,
                paymentId: paymentId,
                PayerID: PayerID,
                token: token

            }
        }).then(function(response) {
            if (response.error && response.error.code == 404) {
                $location.path("404")
                    // deferred.reject()
            } else {
                console.log(response.data)
                deferred.resolve(response.data)
            }
        }, function(err) {
            console.log(err)

            $location.path("404")

        })
        return deferred.promise
    }
}
starPageService.$inject = ["$q", "$http", "$location"]

function staticDataService($q, $http) {

    this.getStaticData = function(staticType) {
        var deferred = $q.defer()
        $http({
            method: "GET",
            url: "api/v1/static",
            params: {
                staticType: staticType
            }
        }).then(function(response) {

            if (response.error && response.error.code == 404) {
                $location.path("404")
                    // deferred.reject()
            } else {

                deferred.resolve(response.data)
            }
        }, function(err) {
            console.log(err)
        })
        return deferred.promise
    }
}
staticDataService.$inject = ["$q", "$http"]

function capitalize() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
}



function paymentService($q, $http) {

    this.getPaymentConfirmation = function(starname, payment_id, payment_request_id, paymentId, PayerID, token) {
        var deferred = $q.defer()
        $http({
            method: "GET",
            url: "api/v1/validatePayment",
            params: {
                starName: starname,
                payment_id: payment_id,
                payment_request_id: payment_request_id,
                paymentId: paymentId,
                PayerID: PayerID,
                token: token
            }
        }).then(function(response) {
            if (response.data.err) {
                deferred.reject(response.data.msg)
            } else {
                deferred.resolve(response.data)
            }
        }, function(err) {
            deferred.reject("Something went wrong, if your payment was deducted, it would be refunded in 3 -4 working days.")
        })
        return deferred.promise

    }

}

paymentService.$inject = ["$q", '$http']
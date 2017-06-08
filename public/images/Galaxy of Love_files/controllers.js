function introController($scope, $cookies) {
    $scope.showIntro = true
    if (!$cookies.getAll()["showIntro"]) {
        console.log("Show Intro")
        $scope.showIntro = true
        $cookies.put("showIntro", "Shown")
        console.log("Show error Popoup")

    } else {
        $scope.showIntro = false
        console.log("Dont show Intro")
    }
    $scope.ok = function() {
        $scope.showIntro = false
    }
}
introController.$inject = ["$scope", "$cookies"]

function spaceController($scope, starService, $location, $document, $cookies, $uibModal) {
    window.scrollTo(0, 0)
    $scope.showIntro = false
    showLoader("home")
    var self = this
    this.starService = starService
    self.searchResult = starService.getSearchResult()

    if (starService.stars) {
        self.stars = starService.stars
    }
    $scope.$watch(angular.bind(this, function() {
        return this.starService.getStars()
    }), function(newv, oldv) {
        if (newv !== oldv) {
            self.stars = newv
        }
        //console.log(newv)
        if (newv && newv.length === 0) {
            stopLoader()
        }
    })

    $scope.$watch(angular.bind(this, function() {
        return this.starService.getSearchResult();
    }), function(newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            self.searchResult = newValue
            self.selectedPulse = starService.getSearchResultPulse(newValue)
            self.checkIfInView(self.selectedPulse.top)
        }
    })
    self.checkIfInView = function(top) {
        var offset = top - $(window).scrollTop();

        if (top > window.innerHeight) {
            // Not in view so scroll to it
            $('html,body').animate({ scrollTop: offset }, 1000);

        }
    }


    if (self.searchResult) {
        self.selectedPulse = starService.getSearchResultPulse(self.searchResult)
        self.checkIfInView(self.selectedPulse.top)
    }

    if (!$cookies.getAll()["showIntro"]) {
        console.log("Show Intro")
        $scope.showIntro = true
        $cookies.put("showIntro", "Hello")
        console.log("Show error Popoup")

    } else {
        $scope.showIntro = false
        console.log("Dont show Intro")
    }

}
spaceController.$inject = ["$scope", "starService", "$location", "$document", "$cookies", "$uibModal"]


function navigationController($scope, $location, starService) {

    if (!starService.stars) {
        starService.getData(function(err, data) {
            console.log("Getting Stars again Stars")
        })
    }

    if ($location.path() == "/") {
        $scope.home = true
    }



    $scope.$on('$routeChangeSuccess', function(event, current, previous) {
        // console.log('from: ',previous["$$route"].originalPath, "  to :", current["$$route"].originalPath)
        $scope.choosestar = false
        $scope.namestar = false
        $scope.what = false
        $scope.why = false
        $scope.home = false
        if ($location.path() != "/") {
            starService.searchItem = ""
            $scope.name = "";
        }
        $scope[$location.path().split("/")[1]] = true
        if ($location.path() == "/namestar") {
            $scope.chooseStar = true
        }
        if ($location.path() == "/") {
            $scope.home = true
        }
    });
    $scope.items = starService.stars
    $scope.starService = starService




    $scope.onItemSelected = function(star) {
        if ($location.path() != "/") {
            $location.path("/")
        }

        starService.searchResult = {
            top: parseInt(star.top),
            left: parseInt(star.left),
            width: star.width
        }

        starService.searchItem = $scope.name
            // Make a 
    }

    $scope.$watch("starService.getStars()", function(newv, oldv) {

        if (newv) {

            var starNames = []
            $scope.items = newv
        }

    })

    $scope.onCancel = function(selected) {

        starService.searchItem = ""
        starService.searchResult = null
        if (selected) {
            $scope.name = ""
        }
    }



}

navigationController.$inject = ["$scope", "$location", "starService"]



function chooseStarController($scope, starService, $location, selectedStarService, $uibModal, $anchorScroll) {
    var self = this
    this.starService = starService

    if (starService.stars) {
        self.starPriceLabel = selectedStarService.getStarPrice(starService.costArray, starService.selectedRadius).starPriceLabel
        self.selectedRadius = starService.selectedRadius
    }

    $scope.$watch(angular.bind(this, function() {
        return this.starService.getStars()
    }), function(newv, oldv) {
        if (newv) {
            self.stars = starService.stars
            self.costArray = starService.costArray
            self.starPriceLabel = selectedStarService.getStarPrice(starService.costArray, starService.selectedRadius).starPriceLabel
            self.selectedRadius = starService.selectedRadius
            if (selectedStarService.selectedStar.selected) {
                self.selectedStar = selectedStarService.selectedStar
                self.selectedPulse = selectedStarService.getSelectedPulse()
            }
        }
    })

    $scope.$on("$routeChangeStart", function(eve, next, current) {
        var currentPath = current["$$route"].originalPath
        var nextPath = next["$$route"].originalPath

        if (nextPath != "/namestar/name" && self.selectedStar) {
            self.selectedStar.selected = false
            selectedStarService.selectedStar.selected = false
        }


    })

    if (selectedStarService.selectedStar.selected) {
        self.starSizeName = selectedStarService.selectedStar.starSizeName
        console.log((selectedStarService.selectedStar.top + 350), window.innerHeight)
        if ((selectedStarService.selectedStar.top + 350) > window.innerHeight) {

            $('html,body').animate({ scrollTop: selectedStarService.selectedStar.top }, 1500);
        }
    }


    this.next = function() {

        selectedStarService.validateStar({
            top: selectedStarService.selectedStar.top,
            left: selectedStarService.selectedStar.left,
            width: selectedStarService.selectedStar.width
        }).then(function() {
            //self.selectedStar.selected = true
            $location.path("/namestar/name")

        }, function(err) {
            console.log("Show error Popoup")
            console.log(err)
            self.selectedStar.selected = false
            var parentElem = undefined;
            var size = "Lg"
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'public/templates/resultModal.html',
                controller: 'resultModalController',
                controllerAs: '$resultModalController',
                size: size,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    res: function() {
                        return {
                            msg: err,
                            buttonMsg: "Got It"
                        }
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                // $ctrl.selected = selectedItem;
            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });
        })

    }

    this.spaceClicked = function($event) {

        $("input[type='radio']:checked").each(function() {
            var idVal = $(this).attr("id");
            self.starSizeName = $("label[for='" + idVal + "']").text();
        });



        if ($event.target.className == "space chooseStar" || $event.target.className == "gps_ring") {
            var parentOffset = angular.element(document.querySelector('#chooseStarSpace')).offset()

            var X = event.pageX - parentOffset.left
            var Y = event.pageY - parentOffset.top

            var selectedStar = {
                top: Math.floor(Y) - (parseInt(self.selectedRadius) / 2),
                left: Math.floor(X) - (parseInt(self.selectedRadius) / 2),
                enabled: true,
                width: parseInt(self.selectedRadius),
                selected: true,
                messagePics: [],
                starSizeName: self.starSizeName,
                starPrice: selectedStarService.getStarPrice(self.costArray, self.selectedRadius),
                profileImagePlaceholder: "//d44k5f1zplbpz.cloudfront.net/staticImages/facePlaceholder.png",
                croppedImage: "//d44k5f1zplbpz.cloudfront.net/staticImages/croppedImage.png",
                user: {}
            }
            selectedStarService.selectedStar = selectedStar
            self.selectedStar = selectedStarService.selectedStar
            self.selectedPulse = selectedStarService.getSelectedPulse()

        }

    }



    $scope.$watch(angular.bind(this, function() {
        return this.selectedRadius;
    }), function(newValue, oldValue) {

        if (oldValue != newValue) {
            if (self.selectedStar) {
                self.selectedStar.selected = false
            }
            starService.selectedRadius = newValue
            self.starPriceLabel = selectedStarService.getStarPrice(starService.costArray, starService.selectedRadius).starPriceLabel
        }
    })


    $scope.priceClick = function() {
        var parentElem = undefined;
        var size = "Lg"
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'public/templates/priceModal.html',
            controller: 'resultModalController',
            controllerAs: '$resultModalController',
            size: size,
            backdrop: 'static',
            keyboard: false,
            resolve: {
                res: function() {
                    return {
                        msg: "I wanted to keep the Galaxy free for all but soon realized that it would be impossble for me to do that" +
                            "due to the high technology costs for keeping the Galaxy up and running for 18 years.\n\n Everytime you name a" +
                            "star in the Galaxy of lovewe also plant a tree on your behalf to ensure that we negate our carbon footprint. ",
                        buttonMsg: "Got It"
                    }
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            // $ctrl.selected = selectedItem;
        }, function() {
            console.log('Modal dismissed at: ' + new Date());
        });

    }

}

chooseStarController.$inject = ["$scope", "starService", "$location", "selectedStarService", "$uibModal", '$anchorScroll']






function nameStarController($scope, selectedStarService, $uibModal, $location, facebookService, $timeout, vcRecaptchaService) {

    window.scrollTo(0, 0)
    $scope.model = {
        key: "6Ld1axAUAAAAAH7eCDD73giaBwiyOAAY9fuinIEQ"
    }
    if (!selectedStarService.selectedStar.selected) {
        return $location.path("/namestar/choose")
    } else {


        var self = this

        $scope.spinner = true
        $scope.fbLoginStatus = false
        $scope.selectedStar = selectedStarService.selectedStar

        $scope.paypalButton = $scope.selectedStar.starPrice.currency === "$" ? true : false

        $scope.starName = ""
        $scope.starMessage = ""
        $scope.croppedDataUrl = ''
        $scope.userEmailConfirm = ""
        $scope.coupon = ""
        $scope.couponAmount = "-"

        $scope.captchaResponse = null;
        $scope.widgetId = null;



        $scope.setResponse = function(response) {
            console.info('Response available');
            $scope.captchaResponse = response;
            selectedStarService.captchaResponse = $scope.captchaResponse
        };
        $scope.setWidgetId = function(widgetId) {
            console.info('Created widget ID: %s', widgetId);
            $scope.widgetId = widgetId;
        };
        $scope.cbExpiration = function() {
            console.info('Captcha expired. Resetting response object');
            vcRecaptchaService.reload($scope.widgetId);
            $scope.captchaResponse = null;
        };

        $scope.forms = {}

        $scope.starPriceLabel = selectedStarService.selectedStar.starPrice.currency + " " + selectedStarService.selectedStar.starPrice.value.toString()
        $scope.revisedAmount = $scope.starPriceLabel
            // console.log($scope.forms.$valid)



        if (loading_screen) {
            stopLoader()
        }

        $scope.$watch("starName", function(newValue, oldValue) {
            if (newValue) {
                $scope.starName = newValue.toLowerCase()
            }
            $scope.starNameMsg = ""
            if (newValue) {

                if (newValue.length >= 3 && newValue.length <= 15) {
                    $scope.starNameWaiting = true
                    selectedStarService.starNameCheck(newValue)
                        .then(function(res) {
                            $scope.starNameWaiting = false
                            console.log(res)
                            $scope.starNameMsg = res
                            $scope.forms.starForm.starName.$setValidity("starName", true)
                        }, function(err) {
                            $scope.starNameWaiting = false
                            console.log(err)
                            $scope.starNameMsg = err
                            $scope.forms.starForm.starName.$setValidity("starName", false)
                        })

                } else {
                    $scope.starNameMsg = "Please enter atleast 3 characters"
                    if (newValue.length > 15) {
                        console.log("15")
                        $scope.starNameMsg = "Please enter less than 15 characters"
                    }
                    $scope.starNameWaiting = false

                }
            }

        })


        $scope.validateCoupon = function() {
            if ($scope.coupon && $scope.coupon.length >= 3) {
                $scope.couponWaiting = true

                selectedStarService.validateCoupon($scope.coupon)
                    .then(function(response) {

                        $scope.couponWaiting = false
                        $scope.couponValidationMsg = response.data.msg
                        if (response.data.valid) {
                            $scope.couponValid = true
                            var discountAmount = response.data.value / 100 * $scope.selectedStar.starPrice.value
                            var revisedValue = $scope.selectedStar.starPrice.value.toString().indexOf(".") == -1 ? parseInt($scope.selectedStar.starPrice.value - discountAmount) : parseFloat($scope.selectedStar.starPrice.value - discountAmount).toFixed(2)

                            $scope.couponAmount = "- " + selectedStarService.selectedStar.starPrice.currency + " " + discountAmount.toString()
                            $scope.revisedAmount = selectedStarService.selectedStar.starPrice.currency + " " + revisedValue.toString()

                            selectedStarService.selectedStar.starPrice.revisedValue = revisedValue
                            selectedStarService.selectedStar.starPrice.couponCode = $scope.coupon

                        }
                    }, function(msg) {
                        $scope.couponWaiting = false
                        $scope.couponValidationMsg = msg
                    })
            } else {
                $scope.couponValidationMsg = "Minimum 3 Characters"
            }

        }

        $scope.cancelCoupon = function() {
            $scope.couponValid = false
            $scope.starPriceLabel = selectedStarService.selectedStar.starPrice.currency + " " + selectedStarService.selectedStar.starPrice.value.toString()
            $scope.coupon = null
            selectedStarService.selectedStar.starPrice.revisedValue = null
        }

        $scope.$watch("coupon", function(newv, oldv) {
            $scope.couponAmount = "-"
            $scope.revisedAmount = $scope.starPriceLabel
            if (newv) {
                $scope.coupon = newv.toUpperCase()

                if (newv.length >= 3) {
                    $scope.couponValidationMsg = ""
                } else {

                    $scope.couponValidationMsg = "Minimum 3 Characters"
                }
            } else {
                $scope.couponValidationMsg = ""
            }
        })

        $scope.openImageSelector = function(size, parentSelector) {
            var parentElem = undefined;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'public/templates/imageSelector.html',
                controller: 'imageSelectorController',
                controllerAs: '$imageSelectorController',
                size: size,
                backdrop: 'static',
                keyboard: false
            });

            modalInstance.result.then(function(selectedItem) {
                // $ctrl.selected = selectedItem;
            }, function() {
                //console.log('Modal dismissed at: ' + new Date());
            });
        };


        $scope.openImageSelectorMsgPics = function(index, size, parentSelector) {

            var parentElem = undefined;
            var size = undefined
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'public/templates/messagePics.html',
                controller: 'msgPicController',
                controllerAs: '$msgPicController',
                size: size,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    index: function() {
                        return {
                            index
                        }
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                // $ctrl.selected = selectedItem;
            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });

        }


        $scope.openProfilePicSelector = function(size, parentSelector) {
            var parentElem = undefined;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'public/templates/profileImageSelector.html',
                controller: 'profileImageSelectorController',
                controllerAs: '$profileImageSelectorController',
                size: size,
                backdrop: 'static',
                keyboard: false
            });

            modalInstance.result.then(function(selectedItem) {
                // $ctrl.selected = selectedItem;
            }, function() {
                //console.log('Modal dismissed at: ' + new Date());
            });
        };




        $scope.anyErrors = function() {

            if ($scope.errors && $scope.errors.length > 0) {
                return true
            } else {
                return false
            }
        }

        $scope.addImageShow = function() {
            if (selectedStarService.selectedStar.messagePics.length > 3) {
                return false
            }
            return true
        }

        $scope.removeImage = function(index) {
            console.log(index)
            selectedStarService.selectedStar.messagePics.splice(index, 1)
                // console.log(selectedStarService.selectedStar.messagePics)
        }

        $scope.createStar = function() {

            // console.log($scope.fbProfileName)

            $scope.errors = []
            selectedStarService.selectedStar.name = $scope.starName
            selectedStarService.selectedStar.message = $scope.starMessage

            delete selectedStarService.selectedStar.profileImagePlaceholder
            delete selectedStarService.selectedStar.selected


            // Do Validations!!
            if ($scope.forms.starForm.starName.$error.required) {
                $scope.errors.push("A Star Name is required")
            }

            if ($scope.forms.starForm.starName.$error.starName == true) {
                console.log("Hello")
                $scope.errors.push("A Star Name is not available")
            }

            if ($scope.forms.starForm.starName.$error.minlength) {

                $scope.errors.push("Star Name is to be mnimum 5 characters")
            }

            if ($scope.forms.starForm.starName.$error.maxlength) {

                $scope.errors.push("Star Name can be maximum 10 of characters")
            }

            if (!selectedStarService.selectedStar.starImage) {
                $scope.errors.push("A Star Image is required")
            }


            if ($scope.forms.starForm.starMessage.$error.required) {
                $scope.errors.push("A Message is required")
            }

            if (!selectedStarService.selectedStar.user) {
                $scope.errors.push("Facebook SignIn required")
            }
            if (!selectedStarService.selectedStar.user.pictureUrl) {
                $scope.errors.push("Your Picture is required")
            }

            if ($scope.forms.starForm.userName.$error.required) {
                $scope.errors.push("Your Name is required")
            }

            if ($scope.forms.starForm.userEmail.$error.required) {
                $scope.errors.push("Your Email is required")
            }
            if ($scope.forms.starForm.userEmail.$error.email) {
                $scope.errors.push("Your Email is not valid")
            }

            if (selectedStarService.selectedStar.user.email != $scope.userEmailConfirm) {
                $scope.errors.push("Your Email and Confirm Emails dont match")
            }

            // if ($scope.forms.starForm.userName.$error.required) {
            //     $scope.errors.push("About you Name is required")
            // }

            if (!$scope.captchaResponse) {
                $scope.errors.push("Human verification is required")
            }


            if ($scope.errors.length == 0) {

                // There are some errors
                var starCost = selectedStarService.selectedStar.starPrice.value

                if (typeof selectedStarService.selectedStar.starPrice.revisedValue === "number") {
                    starCost = selectedStarService.selectedStar.starPrice.revisedValue
                }

                var parentElem = undefined;
                var size = undefined
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'public/templates/emailShareModal.html',
                    controller: 'paymentModalController',
                    controllerAs: '$resultModalController',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        res: function() {
                            return {
                                payment: null
                            }
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                }, function() {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }
        }

        this.setFbData = function(fbData, Userdata) {

            var user = {
                name: Userdata.name,
                pictureUrl: "https://graph.facebook.com/" + fbData.authResponse.userID + "/picture?height=300",
                email: Userdata.email
            }
            user.fbData = fbData
            selectedStarService.userData(user)

        }

        $scope.emailChange = function() {
            console.log("Changeed")
            if ($scope.fbLoginStatus) {
                $scope.confirmEmailStatus = true
            }
        }

        $scope.fbLogin = function() {
            facebookService.fbLogin()
                .then(function(loginResponse) {
                    $scope.spinner = false
                    var fbData = {
                            authResponse: loginResponse.authResponse,
                        }
                        //Sucess, Get user Data
                    facebookService.fbMe()
                        .then(function(userImageResponse) {
                            self.setFbData(fbData, userImageResponse)

                            $scope.fbLoginStatus = true
                            $scope.userName = selectedStarService.selectedStar.user.name
                            $scope.userEmail = selectedStarService.selectedStar.user.email
                            $scope.userEmailConfirm = selectedStarService.selectedStar.user.email
                            selectedStarService.selectedStar.profileImagePlaceholder = selectedStarService.selectedStar.user.pictureUrl

                        }, function(userImageErr) {
                            console.log("Error Getting User Image")
                        })

                }, function(err) {
                    //Faliure
                    console.log("Some Error")
                })
        };


        facebookService.getLoginStatus().then(function(response) {
            $scope.spinner = false
            if (response.status == "connected") {
                var fbData = {
                        authResponse: response.authResponse,
                    }
                    // Get User Image
                facebookService.fbMe()
                    .then(function(fbResponse) {
                        self.setFbData(fbData, fbResponse)

                        $scope.fbLoginStatus = true
                        $scope.userName = selectedStarService.selectedStar.user.name
                        $scope.userEmail = selectedStarService.selectedStar.user.email
                        $scope.userEmailConfirm = selectedStarService.selectedStar.user.email
                        selectedStarService.selectedStar.profileImagePlaceholder = selectedStarService.selectedStar.user.pictureUrl

                    }, function(userImageErr) {
                        console.log("Error Getting User Image")
                    })

            } else {
                $scope.fbLoginStatus = false
            }

        }, function(err) {
            console.log("Some Error")
        })

    }


}
nameStarController.$inject = ["$scope", "selectedStarService", "$uibModal", "$location", "facebookService", "$timeout", "vcRecaptchaService"]





function resultModalController($scope, res, $uibModalInstance, $location) {

    $scope.msg = res.msg
    $scope.buttonMsg = res.buttonMsg
    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
        //$location.path("/")
    }
}

resultModalController.$inject = ["$scope", "res", "$uibModalInstance", "$location"]


function paymentModalController($scope, res, $uibModalInstance, selectedStarService, $window, facebookService, miscService) {




    $scope.resultWaiting = true;
    $scope.msg = "Just a moment ...";
    $scope.err = true;
    $scope.forms = {};
    $scope.buttonMsg = "OK";
    $scope.homePath = "/"

    $scope.model = {
        email: "",
        errors: [],
        sendingEmail: false,
        emailMsg: "",
        laterLabel: "Later"
    };


    selectedStarService.createStar(res.payment)
        .then(function(response) {
            if (response.redirect) {
                $scope.msg = "Redirecting ..."
                $window.location.href = response.url;
            } else {
                $scope.err = false;
                $scope.resultWaiting = false;
                $scope.msg = response.msg;
                $scope.buttonMsg = response.buttonMsg;
                $scope.shortUrl = response.shortUrl;
                $scope.share.twitterUrl = encodeURI("https://twitter.com/intent/tweet?text=Named a star, '" + selectedStarService.selectedStar.name.toUpperCase() + "', in the Galaxy of love. It's a small life lets make the most of it.&hashtags=expresslove,mystar&url=" + $scope.shortUrl);
                $scope.homePath = "/star/" + selectedStarService.selectedStar.name
            }
        }, function(err) {
            $scope.msg = err;
            $scope.resultWaiting = false;
            $scope.buttonMsg = "OK";
        });

    $scope.close = function() {
        if ($scope.err === false) {
            console.log("Home path :", $scope.homePath)
            showLoader()
            $window.location.href = $scope.homePath
        } else {
            $uibModalInstance.dismiss('cancel');
        }
    };

    $scope.$watch(function() {
        return $scope.model.email
    }, function(o, n) {
        console.log(o, n)
        $scope.model.emailMsg = ""
    });

    $scope.sendEmails = function() {
        console.log('Send Emails called')
        $scope.model.sendingEmail = true
        miscService.shareCreatedStar($scope.model.email, selectedStarService.selectedStar)
            .then(function(msg) {
                $scope.model.emailMsg = msg
                $scope.model.sendingEmail = false
                $scope.model.laterLabel = "Done"
            })
    };

    $scope.share = {
        fb: function() {
            facebookService.fbFeed('selfShare', selectedStarService.selectedStar)
        }
    }

}

paymentModalController.$inject = ["$scope", "res", "$uibModalInstance", "selectedStarService", "$window", 'facebookService', 'miscService']


function imageSelectorController($scope, selectedStarService, Upload, $uibModalInstance, $timeout) {
    $scope.uploading = false

    $scope.upload = function(dataUrl, name) {
        $scope.uploading = true
        $scope.uploader = Upload.upload({
            url: '/api/v1/uploadFiles/popUpImage',
            data: {
                file: Upload.dataUrltoBlob(dataUrl, name)
            }
        })
        $scope.uploader.then(function(response) {
            $scope.uploading = false
            if (!response.data.err) {
                selectedStarService.selectedStar.starImage = response.data.url
                selectedStarService.selectedStar.croppedImage = dataUrl
                $uibModalInstance.dismiss('cancel');
            } else {
                $scope.errorMsg = response.data.err;
            }
        }, function(response) {
            $scope.uploading = false
            if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
        }, function(evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        });
    }
    $scope.close = function() {
        // body...
        $scope.uploading = false
        if ($scope.uploader) {
            $scope.uploader.abort()
        }
        $uibModalInstance.dismiss('cancel');
    }

}
imageSelectorController.$inject = ["$scope", "selectedStarService", "Upload", "$uibModalInstance", "$timeout"]

function profileImageSelectorController($scope, selectedStarService, Upload, $uibModalInstance, $timeout) {

    $scope.uploading = false
    $scope.upload = function(dataUrl, name) {
        $scope.uploading = true
        $scope.uploader = Upload.upload({
            url: '/api/v1/uploadFiles/popUpImage',
            data: {
                file: Upload.dataUrltoBlob(dataUrl, name)
            }
        })
        $scope.uploader.then(function(response) {
            $scope.uploading = false
            if (!response.data.err) {

                selectedStarService.selectedStar.user.pictureUrl = response.data.url
                selectedStarService.selectedStar.profileImagePlaceholder = dataUrl
                $uibModalInstance.dismiss('cancel');

            } else {
                $scope.errorMsg = response.data.err;
            }
        }, function(response) {
            $scope.uploading = false
            if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
        }, function(evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        });
    }
    $scope.close = function() {
        // body...
        $scope.uploading = false
        if ($scope.uploader) {
            $scope.uploader.abort()
        }
        $uibModalInstance.dismiss('cancel');
    }

}

profileImageSelectorController.$inject = ["$scope", "selectedStarService", "Upload", "$uibModalInstance", "$timeout"]



function msgPicController(index, $scope, selectedStarService, Upload, $uibModalInstance, $timeout) {

    $scope.uploading = false
    $scope.picFile = ""


    $scope.setFile = function(element) {
        $scope.picFile = element.files[0];
        $scope.$apply()
        var reader = new FileReader();
        reader.onload = function(event) {
                $scope.image_source = event.target.result
                $scope.$apply()
            }
            // when the file is read it triggers the onload event above.
        reader.readAsDataURL(element.files[0]);
    }

    $scope.upload = function(dataUrl, name) {
        $scope.uploading = true
        $scope.uploader = Upload.upload({
            url: '/api/v1/uploadFiles/msgImage',
            data: {
                file: Upload.dataUrltoBlob(dataUrl, name)
            },
        })

        $scope.uploader.then(function(response) {
            $scope.uploading = false
            if (!response.data.err) {
                selectedStarService.selectedStar.messagePics.push({
                    url: response.data.url,
                    thumbnail: response.data.thumbUrl
                })
                $uibModalInstance.dismiss('cancel');
            } else {
                $scope.errorMsg = response.data.err;
            }
        }, function(response) {
            $scope.uploading = false
            if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
        }, function(evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        });
    }
    $scope.close = function() {
        // body...
        $scope.uploading = false
        if ($scope.uploader) {
            $scope.uploader.abort()
        }
        $uibModalInstance.dismiss('cancel');
    }

}
msgPicController.$inject = ["index", "$scope", "selectedStarService", "Upload", "$uibModalInstance", "$timeout"]



function starPageController($scope, $routeParams, starPageService, response, Lightbox, $location, facebookService, $uibModal) {
    window.scrollTo(0, 0)
    $scope.enabled = true
    var self = this
    if (!response.error) {
        // show popup for Payment verification is star is disabled
        if (!response.starData.enabled) {
            $scope.enabled = true
            $scope.enabled = response.starData.enabled
            var parentElem = undefined;
            var size = undefined
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'public/templates/emailShareModal.html',
                controller: 'paymentVerificationModalController',
                size: size,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    res: {
                        payment_id: $routeParams.payment_id,
                        payment_request_id: $routeParams.payment_request_id,
                        paymentId: $routeParams.paymentId,
                        PayerID: $routeParams.PayerID,
                        starData: response.starData,
                        token: $routeParams.token
                    }

                }
            });

            modalInstance.result.then(function(selectedItem) {
                // $ctrl.selected = selectedItem;
            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
        //No error show page with Data
        self.starData = response.starData
        self.twitterUrl = encodeURI("https://twitter.com/intent/tweet?text='" + self.starData.name.toUpperCase() + "' is shining brightly in the Galaxy of love. Go on, name a star and express your love.&hashtags=expresslove&url=" + self.starData.shortUrl)
        if (response.starData.creationDate) {
            var temp = new Date(response.starData.creationDate).toString().split(" ")
            self.starData.dateString = temp[2] + " - " + temp[1] + " - " + temp[3]
        }

        stopLoader()
    } else if (response.error.code == 404) {
        console.log("404")
        console.log("HEllo")
        $location.url("404")
        self.starData = response.error
        stopLoader()
    }

    this.openLightboxModal = function(index) {
        Lightbox.openModal(response.starData.messagePics, index);
    };

    this.share = function(shareType) {
        switch (shareType) {
            case 'fb':
                facebookService.fbFeed('elseShare', self.starData)
                break;
            case 'email':
                var parentElem = undefined;
                var size = undefined
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'public/templates/emailShareModal.html',
                    controller: 'emailShareModalController',
                    controllerAs: '$emailShareModalController',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        res: function() {
                            return {
                                payment: response
                            }
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    // $ctrl.selected = selectedItem;
                }, function() {
                    console.log('Modal dismissed at: ' + new Date());
                });
                break;
            default:
                // statements_def
                break;
        }
    }


}
starPageController.$inject = ["$scope", "$routeParams", "starPageService", "response", "Lightbox", "$location", 'facebookService', '$uibModal']

function emailShareModalController($scope, $uibModalInstance, $timeout) {


    $scope.forms = {}

    $scope.model = {
        email: "",
        errors: [],
        sendingEmail: false,
        emailMsg: ""
    }

    $scope.close = function() {
        // body...
        //showLoader()
        $uibModalInstance.dismiss('cancel');
    }

    $scope.$watch(function() {
        return $scope.model.email
    }, function(o, n) {
        console.log(o, n)
        $scope.model.emailMsg = ""
    })
    $scope.sendEmails = function() {
        console.log('Send Emails called')
        $scope.model.sendingEmail = true
        if ($scope.forms.emailShareForm.email.$error.required) {
            $scope.model.errors.push("Receiver email is required")
        }
        $timeout(function() {
            $scope.model.emailMsg = "Email has been sent!"
            $scope.model.sendingEmail = false

        }, 3000)


    }

    $scope.anyErrors = function() {
        if ($scope.errors && $scope.errors.length > 0) {
            return true
        } else {
            return false
        }
    }
}
emailShareModalController.$inject = ['$scope', '$uibModalInstance', '$timeout']

function errorController() {
    window.scrollTo(0, 0)
    console.log("ErrorController")
    stopLoader()
}

function incompatibleController() {
    window.scrollTo(0, 0)
    console.log("incompatibleController")
    stopLoader()
}


function staticPageController($scope, $location) {
    window.scrollTo(0, 0)
    $scope.where = $location.path().split("/")[1]

    $scope.imageList = {
        "what": [
            "//d44k5f1zplbpz.cloudfront.net/staticImages/sartaaj/1.jpg",
            "//d44k5f1zplbpz.cloudfront.net/staticImages/sartaaj/3.jpg",
            "//d44k5f1zplbpz.cloudfront.net/staticImages/sartaaj/4.jpg",
            "//d44k5f1zplbpz.cloudfront.net/staticImages/sartaaj/7.jpg",
            "//d44k5f1zplbpz.cloudfront.net/staticImages/sartaaj/10.jpg",
            "//d44k5f1zplbpz.cloudfront.net/staticImages/sartaaj/11.jpg"
        ],
        "why": [
            "//d44k5f1zplbpz.cloudfront.net/staticImages/sartaaj/2.jpg",
            "//d44k5f1zplbpz.cloudfront.net/staticImages/sartaaj/5.jpg",
            "//d44k5f1zplbpz.cloudfront.net/staticImages/sartaaj/6.jpg",
            "//d44k5f1zplbpz.cloudfront.net/staticImages/sartaaj/8.jpg",
            "//d44k5f1zplbpz.cloudfront.net/staticImages/sartaaj/13.jpg",
            "//d44k5f1zplbpz.cloudfront.net/staticImages/sartaaj/12.jpg"
        ]
    }



    if ($location.path() == "/what" || $location.path() == "/why") {
        $scope.imageList[$location.path().split("/")[1]] = shuffleArray($scope.imageList[$location.path().split("/")[1]])
    }

    // $scope.heading = response.heading
    // $scope.content = response.content

    stopLoader()

    function shuffleArray(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

}
staticPageController.$inject = ["$scope", "$location"]

function contactController($scope, miscService) {
    $scope.model = {}
    $scope.ok = true
    $scope.forms = {}
    $scope.sendingQuery = false

    $scope.submit = function() {
        $scope.sendingQuery = true
        miscService.emailQuery($scope.model)
            .then(function(msg) {
                $scope.sendingQuery = false
                $scope.msg = msg
                $scope.model = {}
                $scope.forms.contactForm.$setPristine()
            }, function(err) {
                $scope.sendingQuery = false
                $scope.msg = err
                $scope.model = {}
                $scope.forms.contactForm.$setPristine()
            })
    }
    stopLoader()
}
contactController.$inject = ['$scope', 'miscService']



function paymentVerificationModalController($scope, res, paymentService, miscService, facebookService, $window, $uibModalInstance) {

    console.log(res.starData)
    console.log("Payment Controller")
    $scope.resultWaiting = true
    $scope.msg = "Putting your star in the Galaxy, Just a moment..."
    $scope.err = true
    $scope.forms = {};
    $scope.buttonMsg = "OK";
    $scope.shortUrl = res.starData.shortUrl;
    $scope.homePath = "/"

    $scope.model = {
        email: "",
        errors: [],
        sendingEmail: false,
        emailMsg: "",
        laterLabel: "Later"
    };

    paymentService.getPaymentConfirmation(res.starData.name, res.payment_id, res.payment_request_id, res.paymentId, res.PayerID, res.token)
        .then(function(response) {
            $scope.err = false
            $scope.resultWaiting = false
            $scope.msg = response.msg
            $scope.buttonMsg = response.buttonMsg
            $scope.share.twitterUrl = encodeURI("https://twitter.com/intent/tweet?text=Named a star, '" + res.starData.name.toUpperCase() + "', in the Galaxy of love. It's a small life lets make the most of it.&hashtags=expresslove,mystar&url=" + $scope.shortUrl)
            $scope.homePath = "/star/" + res.starData.name
        }, function(err) {
            $scope.msg = err
            $scope.resultWaiting = false
            $scope.buttonMsg == "OK"
        });

    $scope.close = function() {
        $window.location.href = $scope.homePath
    };

    $scope.$watch(function() {
        return $scope.model.email
    }, function(o, n) {
        console.log(o, n)
        $scope.model.emailMsg = ""
    });

    $scope.sendEmails = function() {
        console.log('Send Emails called')
        $scope.model.sendingEmail = true
        miscService.shareCreatedStar($scope.model.email, res.starData)
            .then(function(msg) {
                $scope.model.emailMsg = msg
                $scope.model.sendingEmail = false
                $scope.model.laterLabel = "Done"
            })
    };

    $scope.share = {
        fb: function() {
            facebookService.fbFeed('selfShare', res.starData)
        }
    }
}
paymentVerificationModalController.$inject = ['$scope', 'res', 'paymentService', 'miscService', 'facebookService', '$window', '$uibModalInstance']
var starDirectiveFunc = function($location, $rootScope) {

    var returnObj = {}

    returnObj = {
        templateUrl: "public/templates/directives/starDirective.html",
        replace: false,
        scope: {
            starData: "="
        },
        controller: function($scope) {

        },
        link: function(scope, element) {
            if (scope.$parent.$last) {
                console.log("last hgome")
                checkContainer()
            } if(scope.$parent.$first){
                console.log("Hellow First")
                //showLoader()
            }
        }
    }

    return returnObj
}


var createStarDirective = function() {
    return {
        templateUrl: "public/templates/directives/createStarDirective.html",
        replace: false,
        scope: {
            starData: "=",
            spaceClicked: "&"
        },
        controller: function($scope) {

        },
        link: function(scope, element) {
            if (scope.$parent.$last) {
                // Hide 
                console.log("Last")
                checkContainer()
            } 
            
        }
    }
}

starDirectiveFunc.$inject = ["$location", "$rootScope"]

function typeAhead($timeout) {
    return {
        restrict: 'AEC',
        scope: {
            items: '=',
            prompt: '@',
            title: '@',
            model: '=',
            onSelect: '&',
            onCancel: '&',
            upDown: "&"
        },
        link: function(scope, elem, attrs) {


            scope.handleSelection = function(selectedItem) {
                scope.model = selectedItem.name;
                scope.current = 0;
                scope.selected = true;
                $timeout(function() {
                    scope.onSelect({ star: selectedItem });
                }, 200);
            };
            scope.$watch("model", function(newVal, oldVal) {
                scope.filteredItems = scope.$eval("items | filter : {name : model}:strict | limitTo:7   | orderBy : 'name.length' : reverse");

                if (scope.model && scope.model.length) {
                    scope.onCancel({ selected: false })
                }
            });

            scope.current = 0;
            scope.selected = true;

            scope.handleCancel = function() {
                scope.onCancel({ selected: true })
            }

            scope.upDown = function($event) {
                scope.selected = false
                var index = scope.current
                if (scope.filteredItems && scope.model.length) {
                    if ($event.keyCode == 38) {
                        if (index != 0) {
                            index -= 1
                            scope.setCurrent(scope.current < 0 ? 0 : index)
                        }
                    }
                    if ($event.keyCode == 40) {
                        if (index != scope.filteredItems.length - 1) {
                            index += 1
                            scope.setCurrent(scope.current > scope.filteredItems.length - 1 ? scope.filteredItems.length - 1 : index)
                        }
                    }
                    if ($event.keyCode == 13) {
                        if (!scope.selected) {
                            scope.handleSelection(scope.filteredItems[scope.current])
                        }
                    }
                }
            }

            scope.isCurrent = function(index) {
                return scope.current == index;
            };
            scope.setCurrent = function(index) {
                scope.current = index;
            };
        },
        templateUrl: 'public/templates/directives/typeahead.html'
    }
}
typeAhead.$inject = ["$timeout"]

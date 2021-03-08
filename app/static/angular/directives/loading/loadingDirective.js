appModule.directive('loading', function() {
    return {
        restrict: 'E',
        templateUrl: 'angular/directives/loading/loading.html'
    };
});

appModule.directive('spin', function() {
    return {
        restrict: 'E',
        templateUrl: 'angular/directives/loading/spin.html'
    };
});

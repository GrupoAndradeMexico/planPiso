var sabanaPath = 'angular/directives/sabana/';

appModule.directive('sabanaContentHeader', function() {
    return {
        restrict: 'E',
        templateUrl: sabanaPath + 'sabanaContentHeader.html'
    };
}).directive('sabanaGrid', function() {
    return {
        restrict: 'E',
        templateUrl: sabanaPath + 'sabanaGrid.html'
    };
});

var unuevasPath = 'angular/directives/unuevas/';

appModule.directive('unuevasAplicar', function() {
    return {
        restrict: 'E',
        templateUrl: unuevasPath + 'unuevasAplicar.html'
    };
}).directive('unuevasContentHeader', function() {
    return {
        restrict: 'E',
        templateUrl: unuevasPath + 'unuevasContentHeader.html'
    };
}).directive('unuevasFinanciera', function() {
    return {
        restrict: 'E',
        templateUrl: unuevasPath + 'unuevasFinanciera.html'
    };
}).directive('unuevasSeleccion', function() {
    return {
        restrict: 'E',
        templateUrl: unuevasPath + 'unuevasSeleccion.html'
    };
});
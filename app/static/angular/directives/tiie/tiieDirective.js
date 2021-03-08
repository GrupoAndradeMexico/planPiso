var tiiePath = 'angular/directives/tiie/';

appModule.directive('tiieAgregar', function() {
    return {
        restrict: 'E',
        templateUrl: tiiePath + 'tiieAgregar.html'
    };
}).directive('tiieHistorial', function() {
    return {
        restrict: 'E',
        templateUrl: tiiePath + 'tiieHistorial.html'
    };
});
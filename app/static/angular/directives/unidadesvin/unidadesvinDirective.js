var unidadesvinPath = 'angular/directives/unidadesvin/';

appModule.directive('unidadesvinAplicar', function() {
    return {
        restrict: 'E',
        templateUrl: unidadesvinPath + 'unidadesvinAplicar.html'
    };
}).directive('unidadesvinContentHeader', function() {
    return {
        restrict: 'E',
        templateUrl: unidadesvinPath + 'unidadesvinContentHeader.html'
    };
}).directive('unidadesvinFinanciera', function() {
    return {
        restrict: 'E',
        templateUrl: unidadesvinPath + 'unidadesvinFinanciera.html'
    };
}).directive('unidadesvinSeleccion', function() {
    return {
        restrict: 'E',
        templateUrl: unidadesvinPath + 'unidadesvinSeleccion.html'
    };
});
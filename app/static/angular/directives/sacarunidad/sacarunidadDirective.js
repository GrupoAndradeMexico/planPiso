var sacarunidadPath = 'angular/directives/sacarunidad/';

appModule.directive('sacarunidadContentHeader', function() {
    return {
        restrict: 'E',
        templateUrl: sacarunidadPath + 'sacarunidadContentHeader.html'
    };
}).directive('sacarunidadDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: sacarunidadPath + 'sacarunidadDetalle.html'
    };
}).directive('sacarunidadPendiente', function() {
    return {
        restrict: 'E',
        templateUrl: sacarunidadPath + 'sacarunidadPendiente.html'
    };
});
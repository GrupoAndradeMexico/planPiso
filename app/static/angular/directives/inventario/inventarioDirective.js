var inventarioPath = 'angular/directives/inventario/';

appModule.directive('inventarioContentHeader', function() {
    return {
        restrict: 'E',
        templateUrl: inventarioPath + 'inventarioContentHeader.html'
    };
}).directive('inventarioDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: inventarioPath + 'inventarioDetalle.html'
    };
}).directive('inventarioAplicar', function() {
    return {
        restrict: 'E',
        templateUrl: inventarioPath + 'inventarioAplicar.html'
    };
});
var aplicaPagosPath = 'angular/directives/aplicaPagos/';

appModule.directive('aplicaPagosAplicado', function() {
    return {
        restrict: 'E',
        templateUrl: aplicaPagosPath + 'aplicaPagosAplicado.html'
    };
}).directive('aplicaPagosContentHeader', function() {
    return {
        restrict: 'E',
        templateUrl: aplicaPagosPath + 'aplicaPagosContentHeader.html'
    };
}).directive('aplicaPagosDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: aplicaPagosPath + 'aplicaPagosDetalle.html'
    };
}).directive('aplicaPagosPendiente', function() {
    return {
        restrict: 'E',
        templateUrl: aplicaPagosPath + 'aplicaPagosPendiente.html'
    };
}).directive('modalDetalleLote', function() {
    return {
        restrict: 'E',
        templateUrl: aplicaPagosPath + 'modalDetalleLote.html'
    };
}).directive('modalDetalleInteres', function() {
    return {
        restrict: 'E',
        templateUrl: aplicaPagosPath + 'modalDetalleInteres.html'
    };
}).directive('modalDetalleAplicado', function() {
    return {
        restrict: 'E',
        templateUrl: aplicaPagosPath + 'modalDetalleAplicado.html'
    };
});
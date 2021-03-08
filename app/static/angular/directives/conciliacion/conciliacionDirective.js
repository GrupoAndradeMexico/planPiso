var conciliacionPath = 'angular/directives/conciliacion/';

appModule.directive('conciliacionDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: conciliacionPath + 'conciliacionDetalle.html'
    };
}).directive('conciliacionDetalleUnidades', function() {
    return {
        restrict: 'E',
        templateUrl: conciliacionPath + 'conciliacionDetalleUnidades.html'
    };
}).directive('conciliacionUploader', function() {
    return {
        restrict: 'E',
        templateUrl: conciliacionPath + 'conciliacionUploader.html'
    };
}).directive('conciliacionDocumentos', function() {
    return {
        restrict: 'E',
        templateUrl: conciliacionPath + 'conciliacionDocumentos.html'
    };
}).directive('conciliacionDocumentosDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: conciliacionPath + 'conciliacionDocumentosDetalle.html'
    };
}).directive('compraVirtualAplicar', function() {
    return {
        restrict: 'E',
        templateUrl: conciliacionPath + 'compraVirtualAplicar.html'
    };
}).directive('compraVirtualContentHeader', function() {
    return {
        restrict: 'E',
        templateUrl: conciliacionPath + 'compraVirtualContentHeader.html'
    };
}).directive('compraVirtualDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: conciliacionPath + 'compraVirtualDetalle.html'
    };
}).directive('compraVirtual', function() {
        return {
            restrict: 'E',
            templateUrl: conciliacionPath + 'compraVirtual.html'
        };
    });
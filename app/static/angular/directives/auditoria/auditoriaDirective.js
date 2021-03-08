var auditoriaPath = 'angular/directives/auditoria/';

appModule.directive('auditoriaDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: auditoriaPath + 'auditoriaDetalle.html'
    };
}).directive('auditoriaDetalleUnidades', function() {
    return {
        restrict: 'E',
        templateUrl: auditoriaPath + 'auditoriaDetalleUnidades.html'
    };
}).directive('auditoriaUploader', function() {
    return {
        restrict: 'E',
        templateUrl: auditoriaPath + 'auditoriaUploader.html'
    };
}).directive('auditoriaDocumentos', function() {
    return {
        restrict: 'E',
        templateUrl: auditoriaPath + 'auditoriaDocumentos.html'
    };
}).directive('auditoriaDocumentosDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: auditoriaPath + 'auditoriaDocumentosDetalle.html'
    };
});
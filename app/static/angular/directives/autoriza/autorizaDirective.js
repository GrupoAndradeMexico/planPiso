var autorizaPath = 'angular/directives/autoriza/';

appModule.directive('autorizaDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: autorizaPath + 'autorizaDetalle.html'
    };
}).directive('autorizaUploader', function() {
    return {
        restrict: 'E',
        templateUrl: autorizaPath + 'autorizaUploader.html'
    };
}).directive('autorizaDocumentos', function() {
    return {
        restrict: 'E',
        templateUrl: autorizaPath + 'autorizaDocumentos.html'
    };
}).directive('autorizaDocumentosDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: autorizaPath + 'autorizaDocumentosDetalle.html'
    };
});
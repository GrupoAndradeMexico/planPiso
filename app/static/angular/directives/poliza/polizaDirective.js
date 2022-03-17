var autorizaPathPoliza = 'angular/directives/poliza/';

appModule.directive('polizaUploader', function() {
    return {
        restrict: 'E',
        templateUrl: autorizaPathPoliza + 'polizaUploader.html'
    };
}).directive('modalCierreMes', function() {
    return {
        restrict: 'E',
        templateUrl: autorizaPathPoliza + 'modalFechaCierreMes.html'
    };
});
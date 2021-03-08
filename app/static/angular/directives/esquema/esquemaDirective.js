var esquemaPath = 'angular/directives/esquema/';

appModule.directive('esquemaCampos', function() {
    return {
        restrict: 'E',
        templateUrl: esquemaPath + 'esquemaCampos.html'
    };
}).directive('esquemaCamposDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: esquemaPath + 'esquemaCamposDetalle.html'
    };
}).directive('esquemaDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: esquemaPath + 'esquemaDetalle.html'
    };
}).directive('esquemaFinancieras', function() {
    return {
        restrict: 'E',
        templateUrl: esquemaPath + 'esquemaFinancieras.html'
    };
}).directive('esquemaHeader', function() {
    return {
        restrict: 'E',
        templateUrl: esquemaPath + 'esquemaHeader.html'
    };
});

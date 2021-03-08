var financieraPath = 'angular/directives/financiera/';

appModule.directive('financieraCampos', function() {
    return {
        restrict: 'E',
        templateUrl: financieraPath + 'financieraCampos.html'
    };
}).directive('financieraDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: financieraPath + 'financieraDetalle.html'
    };
}).directive('financieraHeader', function() {
    return {
        restrict: 'E',
        templateUrl: financieraPath + 'financieraHeader.html'
    };
});
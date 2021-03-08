var unidadesPath = 'angular/directives/unidades/';

appModule.directive('unidadesHeader', function() {
    return {
        restrict: 'E',
        templateUrl: unidadesPath + 'unidadesHeader.html'
    };
}).directive('stepUnidades', function() {
    return {
        restrict: 'E',
        templateUrl: unidadesPath + 'stepUnidades.html'
    };
}).directive('esquemaUnidades', function() {
    return {
        restrict: 'E',
        templateUrl: unidadesPath + 'unidadesEsquema.html'
    };
});

var interesPath = 'angular/directives/interes/';

appModule.directive('interesCambioAgencia', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesCambioAgencia.html'
    };
}).directive('interesDashboard', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesDashboard.html'
    };
}).directive('interesDetalleUnidad', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesDetalleUnidad.html'
    };
}).directive('interesContentHeader', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesContentHeader.html'
    };
}).directive('interesInteres', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesInteres.html'
    };
}).directive('interesResumen', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesResumen.html'
    };
}).directive('interesMovimientos', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesMovimientos.html'
    };
}).directive('interesPagoReduccion', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesPagoReduccion.html'
    };
}).directive('interesTraspasoFinanciera', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesTraspasoFinanciera.html'
    };
}).directive('interesSpread', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesSpread.html'
    };
}).directive('interesPagoUnidad', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesPagoUnidad.html'
    };
}).directive('interesPagoResumen', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesPagoResumen.html'
    };
}).directive('interesPagoUnidadResumen', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesPagoUnidadResumen.html'
    };
}).directive('interesCompensacion', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesCompensacion.html'
    };
}).directive('interesCompensacionResumen', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesCompensacionResumen.html'
    };
}).directive('interesPago', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesPago.html'
    };
}).directive('interesRecalcular', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesRecalcular.html'
    };
});
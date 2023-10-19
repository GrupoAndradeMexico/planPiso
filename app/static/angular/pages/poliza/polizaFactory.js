
var polUrl = global_settings.urlCORS + 'api/apiPoliza/';
appModule.factory('polizaFactory', function($http) {
    return {
        
        topNavBar: function() {
            return [
                { name: 'Empresas', url: 'empresa', isActive: false },
                { name: 'Polizas', url: '#', isActive: true }
            ];
        },
       

        obtienePeriodosActivos: function(parametros) {
            return $http({
                url: polUrl + 'obtienePeriodosActivos/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        CancelaPoliza: function(parametros) {
            return $http({
                url: polUrl + 'CancelaPoliza/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        obtienePolizaApi: function(parametros) {
            return $http({
                url: polUrl + 'obtienePolizaApi/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
    };
});
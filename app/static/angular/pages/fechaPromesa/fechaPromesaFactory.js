var fechaPromesaUrl = global_settings.urlCORS + 'api/apifechapromesa/';
appModule.factory('fechaPromesaFactory', function($http) {
    return {
        getCartera: function(idEmpresa, idPersona, tipoCartera) {
            return $http({
                url: fechaPromesaUrl + 'cartera/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idPersona: idPersona,
                    tipoCartera: tipoCartera
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        pushCartera: function(idCartera, idEmpresa, fechaPromesa, anioCartera, documento) {
            return $http({
                url: fechaPromesaUrl + 'pushCartera/',
                method: "POST",
                data: {
                    idEmpresa: idEmpresa,
                    idCartera: idCartera,
                    fechaPromesa: fechaPromesa,
                    anioCartera: anioCartera,
                    documento: documento
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});
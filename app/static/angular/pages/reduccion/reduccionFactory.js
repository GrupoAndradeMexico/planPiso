var reduccionUrl = global_settings.urlCORS + 'api/apiReduccion/';
appModule.factory('reduccionFactory', function($http) {
    // return true;
    return {
        getEsquema: function( idEmpresa ) {
            return $http({
                url: reduccionUrl + 'EsquemaExpiration/',
                method: "GET",
                params: { 
                    idEmpresa: idEmpresa
                },
                headers: { 'Content-Type': 'application/json' }
            });
        }

    };
});
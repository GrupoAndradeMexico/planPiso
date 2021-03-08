var commonUrl = global_settings.urlCORS + 'api/apiCommon/';
appModule.factory('commonFactory', function($http) {
    return {
        getSucursal: function(idEmpresa, idUsuario) {
            return $http({
                url: commonUrl + 'Sucursal/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idUsuario: idUsuario
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getFinancial: function(empresaID, idUsuario) {
            return $http({
                url: commonUrl + 'Financieras/',
                method: "GET",
                params: {
                    empresaID: empresaID,
                    idUsuario: idUsuario
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getSchemas: function(financieraID, esquemaID) {
            return $http({
                url: commonUrl + 'Schemas/',
                method: "GET",
                params: { financieraID: financieraID, esquemaID: esquemaID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getSchemasBP: function(financieraID,idempresa, esquemaID) {
            return $http({
                url: commonUrl +'SchemasBP/',
                method: "GET",
                params: { financieraID: financieraID, esquemaID: esquemaID,idempresa:idempresa },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getCatalog: function(catalogoID) {
            return $http({
                url: commonUrl + 'Catalog/',
                method: "GET",
                params: { catalogoID: catalogoID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getTipoTiie: function() {
            return $http({
                url: commonUrl + 'TipoTiie/',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        currentTIIE: function() {
            return $http({
                url: commonUrl + 'currentTIIE/',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getTipoColateral: function() {
            return $http({
                url: commonUrl +'TipoColateral/',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },   
        getFinancieraSucursal: function(idEmpresa, idSucursal) {
            return $http({
                url: commonUrl + 'financieraSucursal/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },   
        getSpreads: function(idEmpresa) {
            return $http({
                url: commonUrl + 'Spreads/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa
                },
                headers: { 'Content-Type': 'application/json' }
            });
        }

    };

});
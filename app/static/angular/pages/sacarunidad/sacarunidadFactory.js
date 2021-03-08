var apisacarunidadUrl = global_settings.urlCORS + 'api/apisacarunidad/';
appModule.factory('sacarunidadFactory', function($http) {
    return {
        getDocumentos: function(idEmpresa) {
            return $http({
                url: apisacarunidadUrl + 'documentos/',
                method: "GET",
                params: { idEmpresa: idEmpresa },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getSaldoCuenta: function(idEmpresa, cuenta) {
            return $http({
                url: apisacarunidadUrl + 'saldoCuenta/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    cuenta: cuenta
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getIntesesUnidad: function(documento, idProveedor, monto) {
            return $http({
                url: apisacarunidadUrl + 'interesUnidad/',
                method: "GET",
                params: {
                    documento: documento,
                    idProveedor: idProveedor,
                    monto: monto
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        encabezadoPreLote: function(idLote, idProveedor) {
            return $http({
                url: apisacarunidadUrl + 'encabezadoPreLote/',
                method: "GET",
                params: {
                    idLote: idLote,
                    idProveedor: idProveedor
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        polizaInteres: function(parametros) {
            return $http({
                url: apisacarunidadUrl + 'polizaInteres/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insBitacora: function(parametros) {
            return $http({
                url: apisacarunidadUrl + 'bitacorainteres/',
                method: "POST",
                data: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        }

    };

});
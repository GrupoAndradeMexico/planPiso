var aplicaPagosUrl = global_settings.urlCORS + 'api/apiAplicaPagos/';
appModule.factory('aplicaPagosFactory', function($http) {
    return {
        getLote: function(estatusCID, pro_idtipoproceso) {
            return $http({
                url: aplicaPagosUrl + 'Lote/',
                method: "GET",
                params: { estatusCID: estatusCID, idtipoproceso: pro_idtipoproceso },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getLoteDetail: function(loteID) {
            return $http({
                url: aplicaPagosUrl + 'LoteDetail/',
                method: "GET",
                params: { loteID: loteID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        buscarLotes: function(parametros) {
            return $http({
                url: aplicaPagosUrl + 'buscarLotes/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        detalleLote: function(idLote) {
            return $http({
                url: aplicaPagosUrl + 'detalleLote/',
                method: "GET",
                params: {
                    idLote: idLote
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        sacarPlanPiso: function(idLote, idUsuario) {
            return $http({
                url: aplicaPagosUrl + 'sacarPlanPiso/',
                method: "GET",
                params: {
                    idLote: idLote,
                    idUsuario:idUsuario
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        agregaIntesesLote: function(idLote) {
            return $http({
                url: aplicaPagosUrl + 'agregaIntesesLote/',
                method: "GET",
                params: {
                    idLote: idLote
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        detalleBitacora: function(idLote) {
            return $http({
                url: aplicaPagosUrl + 'detalleBitacora/',
                method: "GET",
                params: {
                    idLote: idLote
                },
                headers: { 'Content-Type': 'application/json' }
            });
        }

    };

});
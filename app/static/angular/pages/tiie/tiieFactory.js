var tiieUrl = global_settings.urlCORS + 'api/apiTiie/';
appModule.factory('tiieFactory', function($http) {
    return {
        getTiie: function() {
            return $http({
                url: tiieUrl + 'Tiie/',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insertTiie: function(params) {
            return $http({
                url: tiieUrl + 'insertTiie/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        actualizaTiie: function(params) {
            return $http({
                url: tiieUrl + 'actualizaTiie/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getTiieDateExist: function(fecha) {
            return $http({
                url: tiieUrl + 'TiieDateExist/',
                method: "GET",
                params: { fecha: fecha },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getUltimaFechaTiie: function () {
            return $http({
                url: tiieUrl + 'ultimaFechaTiie/',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        postInsertarTiie: function (fecha, tasa) {
            return $http({
                url: tiieUrl + 'insertarTiie/',
                method: "POST",
                params: { fecha: fecha, tasa: tasa },
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };

});
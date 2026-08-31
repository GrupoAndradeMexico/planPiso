var sabana2Url = global_settings.urlCORS + 'api/sabana2/';

appModule.factory('sabana2Repository', function($http) {
    return {
        getDatos: function(idEmpresa) {
            return $http({
                url: sabana2Url + 'datos/',
                method: 'GET',
                params: { idEmpresa: idEmpresa },
                headers: { 'Content-Type': 'application/json' }
            });
        },

        getFechaEfectiva: function() {
            return $http({
                url: sabana2Url + 'fechaefectiva/',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
        },

        getResumenCarga: function() {
            return $http({
                url: sabana2Url + 'resumencarga/',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
        },

        getPivotViewDefault: function() {
            return $http({
                url: sabana2Url + 'pivotviewdefault/',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
        },

        getPivotViews: function(idUsuario, idEmpresa) {
            return $http({
                url: sabana2Url + 'pivotviews/',
                method: 'GET',
                params: { idUsuario: idUsuario, idEmpresa: idEmpresa || null },
                headers: { 'Content-Type': 'application/json' }
            });
        },

        // payload: { nombre, descripcion, config, idEmpresa, idUsuarioCreador, nombreUsuarioCreador }
        guardarPivotView: function(payload) {
            return $http.post(sabana2Url + 'pivotviews/', payload);
        }
    };
});

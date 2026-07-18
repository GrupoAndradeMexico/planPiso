var filtroReglasUrl = global_settings.urlCORS + 'api/apiFiltroReglas/';

appModule.factory('filtroReglasFactory', function($http) {
    return {

        getReglas: function(idUsuario) {
            return $http({
                url:    filtroReglasUrl + 'getReglas/',
                method: 'GET',
                params: { idUsuario: idUsuario }
            });
        },

        insertRegla: function(idUsuario, nombre, expresion) {
            return $http({
                url:    filtroReglasUrl + 'insertRegla/',
                method: 'POST',
                data:   { idUsuario: idUsuario, nombre: nombre, expresion: expresion }
            });
        },

        updateRegla: function(id, nombre, expresion) {
            return $http({
                url:    filtroReglasUrl + 'updateRegla/',
                method: 'POST',
                data:   { id: id, nombre: nombre, expresion: expresion }
            });
        },

        deleteRegla: function(id) {
            return $http({
                url:    filtroReglasUrl + 'deleteRegla/',
                method: 'POST',
                data:   { id: id }
            });
        }

    };
});

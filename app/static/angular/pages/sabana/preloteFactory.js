appModule.factory('preloteFactory', function($http) {

    var _url = '/api/apiPrelote/';

    return {

        getPrelotes: function(idUsuario) {
            return $http.get(_url + 'getPrelotes/', { params: { idUsuario: idUsuario } });
        },

        // nombre   : string — nombre del grupo de pre-lotes
        // idUsuario: int
        // unidades : array de filas de la sábana (ya con IdEmpresa, CCP_IDDOCTO, etc.)
        insertPrelote: function(nombre, idUsuario, unidades) {
            return $http.post(_url + 'insertPrelote/', {
                nombre:    nombre,
                idUsuario: idUsuario,
                unidades:  unidades
            });
        },

        getPreloteVsSabana: function(pplId) {
            return $http.get(_url + 'getPreloteVsSabana/', { params: { pplId: pplId } });
        },

        cancelPrelote: function(pplId) {
            return $http.post(_url + 'cancelPrelote/', { pplId: pplId });
        }

    };
});

var empresaUrl = global_settings.urlCORS + 'api/apiEmpresa/';
appModule.factory('empresaFactory', function($http) {
    return {        
        getEmpresa: function( idUsuario ) {
            return $http({
                url: empresaUrl + 'Empresa/',
                method: "GET",
                params:{
                	idUsuario: idUsuario
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getUsuarioNombre: function( idUsuario ) {
            return $http({
                url: empresaUrl + 'UsuarioNombre/',
                method: "GET",
                params:{
                	idUsuario: idUsuario
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getUsuarioPermisos: function( idUsuario ) {
            return $http({
                url: empresaUrl + 'UsuarioPermisos/',
                method: "GET",
                params:{
                	idUsuario: idUsuario
                },
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };

});

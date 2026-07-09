var sabanaUrl = global_settings.urlCORS + 'api/apiSabana/';

appModule.factory('sabanaFactory', function($http) {
    return {
        getUnidades: function(idEmpresa, idFinanciera) {
            var params = {};
            if (idEmpresa    !== null) params.idEmpresa    = idEmpresa;
            if (idFinanciera !== null) params.idFinanciera = idFinanciera;

            return $http({
                url: sabanaUrl + 'getSabana/',
                method: 'GET',
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },

        getExcelUrl: function(idEmpresa, idFinanciera) {
            var qs = [];
            if (idEmpresa    !== null) qs.push('idEmpresa='    + idEmpresa);
            if (idFinanciera !== null) qs.push('idFinanciera=' + idFinanciera);
            return sabanaUrl + 'getExcel/' + (qs.length ? '?' + qs.join('&') : '');
        },

        exportarSeleccionadas: function(rows) {
            return fetch(sabanaUrl + 'getExcelSeleccionadas/', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ rows: rows })
            }).then(function(response) {
                if (!response.ok) throw new Error('Error del servidor: ' + response.status);
                return response.blob();
            });
        }
    };
});

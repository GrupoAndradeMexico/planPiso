var crealoteUrl = global_settings.urlCORS + 'api/apicrealote/';
appModule.factory('crealoteFactory', function($http) {
    return {
        obtieneTodos: function() {
            return $http({
                url: crealoteUrl + 'obtieneTodos/',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        obtieneDetalle: function(idcrealoteFinanciera) {
            return $http({
                url: crealoteUrl + 'Detalle/',
                method: "GET",
                params: { idcrealoteFinanciera: idcrealoteFinanciera },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getCuentas: function(idEmpresa) {
            return $http({
                url: crealoteUrl + 'cuentas/',
                method: "GET",
                params: { idEmpresa: idEmpresa },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getDocumentos: function(idEmpresa) {
            return $http({
                url: crealoteUrl + 'documentos/',
                method: "GET",
                params: { idEmpresa: idEmpresa },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getPdf: function(tipo, annio, mes, No, empresa) {
            return $http({
                url: crealoteUrl + 'poliza/',
                method: "GET",
                params: {
                    tipo: tipo,
                    annio: annio,
                    mes: mes,
                    No: No,
                    empresa: empresa
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getLotes: function(idEmpresa) {
            return $http({
                url: crealoteUrl + 'lotes/',
                method: "GET",
                params: { idEmpresa: idEmpresa },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getescenario: function(idEmpresa) {
            return $http({
                url: crealoteUrl + 'escenarios/',
                method: "GET",
                params: { idEmpresa: idEmpresa },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        setEncabezadoPago: function(dataEncabezado) {
            return $http({
                url: crealoteUrl + 'encabezadoPagos/',
                method: "POST",
                data: dataEncabezado,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        setDatos: function(id, idEmpleado, idPadre, ingresos, transfer, caja, cobrar, total, operacion) {
            return $http({
                url: crealoteUrl + 'detalleLotePago/',
                method: 'POST',
                params: {
                    idEmpleado: idEmpleado,
                    idPadre: idPadre
                },
                data: { datos: JSON.stringify(id) },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getPreDocumentos: function(idEmpresa, idPoliza) {
            return $http({
                url: crealoteUrl + 'preDocumentos/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idPoliza: idPoliza
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        actualizarCartera: function(idEmpresa) {
            return $http({
                url: crealoteUrl + 'actualizarCartera/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getDocumentosNoEncontrados: function(idEmpresa, idPoliza) {
            return $http({
                url: crealoteUrl + 'documentosNoEncontrados/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idPoliza: idPoliza
                },
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };
});
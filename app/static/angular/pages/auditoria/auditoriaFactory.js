
var auditoriaUrl = global_settings.urlCORS + 'api/apiAuditoria/';
appModule.factory('auditoriaFactory', function($http) {
    return {
        
        topNavBar: function() {
            return [
                { name: 'Empresas', url: 'empresa', isActive: false },
                { name: 'Auditoria', url: '#', isActive: true }
            ];
        },
        stepsBar: function() {
            return [
                { name: "1. Seleccionar", className: "active", panelName: "pnlSeleccionar", icono: "fa fa-check-square-o" },
                { name: "2. Financiera", className: "", panelName: "pnlFinanciera", icono: "fa fa-bank" }, 
                { name: "3. Aplicar", className: "", panelName: "pnlAplicar", icono: "fa fa-cloud-upload" }
            ];
        },
        savePdf: function(LayoutName,idAuditoria) {
            return $http({
                url: auditoriaUrl + 'savePdf/',
                method: "GET",
                params: { LayoutName: LayoutName,
                    idAuditoria:idAuditoria
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insertaAuditoria: function(parametros) {
            return $http({
                url: auditoriaUrl + 'insertaAuditoria/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        guardarObservaciones: function(parametros) {
            return $http({
                url: auditoriaUrl + 'guardarObservaciones/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getAuditoria: function( id ) {
            return $http({
                url: auditoriaUrl + 'Auditoria/',
                method: "GET",
                params: { 
                    idAuditoria: id
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getAuditorias: function( parametros ) {
            return $http({
                url: auditoriaUrl + 'Auditorias/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getreadPdf: function( ruta ) {
            return $http({
                url: auditoriaUrl + 'readPdf/',
                method: "GET",
                params: { 
                    ruta: ruta, 
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getCierreMes: function( periodo ) {
            return $http({
                url: auditoriaUrl + 'CierreMes/',
                method: "GET",
                params: { periodo: periodo },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        guardaAuditoria: function( parametros ) {
            return $http({
                url: auditoriaUrl + 'guardaAuditoria/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        validaExistencia: function( parametros ) {
            return $http({
                url: auditoriaUrl + 'validaExistencia/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        creaAuditoriaDetalle: function( parametros ) {
            return $http({
                url: auditoriaUrl + 'creaAuditoriaDetalle/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        solicitaAutorizacion: function( parametros ) {
            return $http({
                url: auditoriaUrl + 'solicitaAutorizacion/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        porAutorizar: function() {
            return $http({
                url: auditoriaUrl + 'porAutorizar/',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        autorizacionDetalle: function( consecutivo ) {
            return $http({
                url: auditoriaUrl + 'AutorizacionDetalle/',
                method: "GET",
                params:{ consecutivo: consecutivo },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        generaAuditoria: function( periodo, anio, financiera ) {
            return $http({
                url: auditoriaUrl + 'generaAuditoria/',
                method: "GET",
                params:{ 
                    periodo: periodo,
                    anio: anio,
                    financiera: financiera
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        obtieneCociliacion: function(parametros) {
            return $http({
                url: auditoriaUrl + 'obtieneAuditoria/',
                method: "GET",
                params:parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        conciliaDetalle: function( idAuditoria ) {
            return $http({
                url: auditoriaUrl + 'conciliaDetalle/',
                method: "GET",
                params:{ idAuditoria: idAuditoria },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        validaCancelacion: function( idAuditoria ) {
            return $http({
                url: auditoriaUrl + 'validaCancelacion/',
                method: "GET",
                params:{ idAuditoria: idAuditoria },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        CancelaAuditoria: function( idAuditoria ) {
            return $http({
                url: auditoriaUrl + 'CancelaAuditoria/',
                method: "GET",
                params:{ idAuditoria: idAuditoria },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        cambiarEncontrada: function(parametros) {
            return $http({
                url: auditoriaUrl + 'cambiarEncontrada/',
                method: "GET",
                params:parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        guardarObservacionesGeneral: function(parametros) {
            return $http({
                url: auditoriaUrl + 'guardarObservacionesGeneral/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },getTiposAuditoria: function() {
            return $http({
                url: auditoriaUrl + 'tiposAuditoria/',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        reporteAuditoria: function(json) {
            return $http({
                url: global_settings.urlJsReport,
                method: "POST",
                data: {
                    template: { name: "auditoriaPP" },
                    data: json
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            });
        },
        readLayout: function(LayoutName) {
            return $http({
                url: auditoriaUrl + 'readLayout/',
                method: "GET",
                params: { LayoutName: LayoutName },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insExcelData: function(lstUnidades) {
            return $http({
                url: auditoriaUrl + 'insExcelData/',
                method: "GET",
                params: { lstUnidades: lstUnidades },
                headers: { 'Content-Type': 'application/json' }
            });
        },getConciliacionAuditoria: function(idAuditoria) {
            return $http({
                url: auditoriaUrl + 'ConciliacionAuditoria/',
                method: "GET",
                params: { idAuditoria: idAuditoria },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        buscaVIN: function( parametros ) {
            return $http({
                url: auditoriaUrl + 'buscaVIN/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },getTiposColateral: function(financieraID) {
            return $http({
                url: auditoriaUrl + 'TiposColateral/',
                method: "GET",
                params: { financieraID: financieraID },
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };
});
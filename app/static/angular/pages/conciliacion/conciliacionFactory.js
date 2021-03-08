
var conciliacionUrl = global_settings.urlCORS + 'api/apiConciliacion/';
appModule.factory('conciliacionFactory', function($http) {
    return {
        
        topNavBar: function() {
            return [
                { name: 'Empresas', url: 'empresa', isActive: false },
                { name: 'Conciliacion', url: '#', isActive: true }
            ];
        },
        stepsBar: function() {
            return [
                { name: "1. Seleccionar", className: "active", panelName: "pnlSeleccionar", icono: "fa fa-check-square-o" },
                { name: "2. Financiera", className: "", panelName: "pnlFinanciera", icono: "fa fa-bank" }, 
                { name: "3. Aplicar", className: "", panelName: "pnlAplicar", icono: "fa fa-cloud-upload" }
            ];
        },
        readLayout: function(LayoutName) {
            return $http({
                url: conciliacionUrl + 'readLayout/',
                method: "GET",
                params: { LayoutName: LayoutName },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insExcelData: function(lstUnidades) {
            return $http({
                url: conciliacionUrl + 'insExcelData/',
                method: "GET",
                params: { lstUnidades: lstUnidades },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getConciliacion: function( periodo,anio, consecutivo, financiera ) {
            return $http({
                url: conciliacionUrl + 'Conciliacion/',
                method: "GET",
                params: { 
                    periodo: periodo, 
                    consecutivo: consecutivo,
                    anio:anio,
                    financiera: financiera
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getConciliacionGuardada: function( idconciliacion ) {
            return $http({
                url: conciliacionUrl + 'ConciliacionGuardada/',
                method: "GET",
                params: { 
                    idconciliacion: idconciliacion, 
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getCierreMes: function( periodo ) {
            return $http({
                url: conciliacionUrl + 'CierreMes/',
                method: "GET",
                params: { periodo: periodo },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        creaConciliacion: function( parametros ) {
            return $http({
                url: conciliacionUrl + 'creaConciliacion/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        guardaConciliacion: function( parametros ) {
            return $http({
                url: conciliacionUrl + 'guardaConciliacion/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        validaExistencia: function( parametros ) {
            return $http({
                url: conciliacionUrl + 'validaExistencia/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        creaConciliacionDetalle: function( parametros ) {
            return $http({
                url: conciliacionUrl + 'creaConciliacionDetalle/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        guardaConciliacionDetalle: function( parametros ) {
            return $http({
                url: conciliacionUrl + 'creaConciliacionDetalle/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        solicitaAutorizacion: function( parametros ) {
            return $http({
                url: conciliacionUrl + 'solicitaAutorizacion/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        porAutorizar: function() {
            return $http({
                url: conciliacionUrl + 'porAutorizar/',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        autorizacionDetalle: function( consecutivo ) {
            return $http({
                url: conciliacionUrl + 'AutorizacionDetalle/',
                method: "GET",
                params:{ consecutivo: consecutivo },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        generaConciliacion: function( periodo, anio, financiera ) {
            return $http({
                url: conciliacionUrl + 'generaConciliacion/',
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
                url: conciliacionUrl + 'obtieneConciliacion/',
                method: "GET",
                params:parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        conciliaDetalle: function( idConciliacion ) {
            return $http({
                url: conciliacionUrl + 'conciliaDetalle/',
                method: "GET",
                params:{ idConciliacion: idConciliacion },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        validaCancelacion: function( idConciliacion ) {
            return $http({
                url: conciliacionUrl + 'validaCancelacion/',
                method: "GET",
                params:{ idConciliacion: idConciliacion },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        CancelaConciliacion: function( idConciliacion ) {
            return $http({
                url: conciliacionUrl + 'CancelaConciliacion/',
                method: "GET",
                params:{ idConciliacion: idConciliacion },
                headers: { 'Content-Type': 'application/json' }
            });
        } ,
        getUnidadesCompraVirtual: function(idConciliacion) {
            return $http({
                url: conciliacionUrl + 'UnidadesCompraVirtual/',
                method: "GET",
                params:{ idConciliacion: idConciliacion },
                headers: { 'Content-Type': 'application/json' }
            });
        }, conciliacionPoliza: function(params) {
            return $http({
                url: conciliacionUrl + 'conciliacionPoliza/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        conciliacionPolizaDetalle: function(params) {
            return $http({
                url: conciliacionUrl + 'conciliacionPolizaDetalle/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        procesaconciliacion: function( lastId ) {
            return $http({
                url: conciliacionUrl + 'procesaconciliacion/',
                method: "GET",
                params: {
                    idTraspasoFinanciera: lastId
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },  
        getMesConciliacion: function(params) {
            return $http({
                url: conciliacionUrl + 'MesConciliacion/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },  
        getTiposConciliacion: function() {
            return $http({
                url: conciliacionUrl + 'tiposConciliacion/',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        obtienePeriodosActivos: function(parametros) {
            return $http({
                url: conciliacionUrl + 'obtienePeriodosActivos/',
                method: "GET",
                params:parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },    getreadFile: function( parametros ) {
            return $http({
                url: conciliacionUrl + 'readFile/',
                method: "GET",
                params:parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },

        getReporteTesoreria: function(myJson) {
            console.log(myJson);
            return $http({
                //LQMA changed 01022018
                //url: 'http://189.204.141.193:5488/api/report',
                url: 'http://192.168.20.92:5488/api/report',
                method: "POST",
                data: {
                    template: { name: myJson.template.name },
                    data: myJson.data
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            });
        }, getAbonoContable: function(id) {
            return $http({
                url: conciliacionUrl + 'abonoContable/',
                method: "GET",
                params: {
                   
                    id:id
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getCargoContable: function(id) {
            return $http({
                url: conciliacionUrl + 'cargoContable/',
                method: "GET",
                params: {                    
                    id:id
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getCargoBancario: function(id) {
            return $http({
                url: conciliacionUrl + 'cargoBancario/',
                method: "GET",
                params: {                    
                    id:id
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getAbonoBancario: function(id) {
            return $http({
                url: conciliacionUrl + 'abonoBancario/',
                method: "GET",
                params: {                    
                    id:id
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getDatosReporte: function(id) {
            return $http({
                url: conciliacionUrl + 'DatosReporte/',
                method: "GET",
                params: {                    
                    id:id
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }

    };
});
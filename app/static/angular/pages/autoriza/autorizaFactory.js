appModule.factory('autorizaFactory', function($http) {
    return {
        readLayout: function(LayoutName) {
            return $http({
                url: 'apiConciliacion/readLayout',
                method: "GET",
                params: { LayoutName: LayoutName },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insExcelData: function(lstUnidades) {
            return $http({
                url: 'apiConciliacion/insExcelData',
                method: "GET",
                params: { lstUnidades: lstUnidades },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getConciliacion: function( periodo, consecutivo, financiera ) {
            return $http({
                url: 'apiConciliacion/getConciliacion',
                method: "GET",
                params: { 
                    periodo: periodo, 
                    consecutivo: consecutivo,
                    financiera: financiera
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getCierreMes: function( periodo ) {
            return $http({
                url: 'apiConciliacion/getCierreMes',
                method: "GET",
                params: { periodo: periodo },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        creaConciliacion: function( parametros ) {
            return $http({
                url: 'apiConciliacion/creaConciliacion',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        validaExistencia: function( parametros ) {
            return $http({
                url: 'apiConciliacion/validaExistencia',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        creaConciliacionDetalle: function( parametros ) {
            return $http({
                url: 'apiConciliacion/creaConciliacionDetalle',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        solicitaAutorizacion: function( parametros ) {
            return $http({
                url: 'apiConciliacion/solicitaAutorizacion',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        porAutorizar: function() {
            return $http({
                url: 'apiConciliacion/porAutorizar',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        autorizacionDetalle: function( consecutivo ) {
            return $http({
                url: 'apiConciliacion/getAutorizacionDetalle',
                method: "GET",
                params:{ consecutivo: consecutivo },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        generaConciliacion: function( periodo, anio, financiera ) {
            return $http({
                url: 'apiConciliacion/generaConciliacion',
                method: "GET",
                params:{ 
                    periodo: periodo,
                    anio: anio,
                    financiera: financiera
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        obtieneCociliacion: function() {
            return $http({
                url: 'apiConciliacion/obtieneConciliacion',
                method: "GET",
                params:{},
                headers: { 'Content-Type': 'application/json' }
            });
        },
        conciliaDetalle: function( idConciliacion ) {
            return $http({
                url: 'apiConciliacion/conciliaDetalle',
                method: "GET",
                params:{ idConciliacion: idConciliacion },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        validaCancelacion: function( idConciliacion ) {
            return $http({
                url: 'apiConciliacion/validaCancelacion',
                method: "GET",
                params:{ idConciliacion: idConciliacion },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        CancelaConciliacion: function( idConciliacion ) {
            return $http({
                url: 'apiConciliacion/CancelaConciliacion',
                method: "GET",
                params:{ idConciliacion: idConciliacion },
                headers: { 'Content-Type': 'application/json' }
            });
        }        
    };
});
var proveedorUrl = global_settings.urlCORS + 'api/apiproveedor/';
appModule.factory('proveedorFactory', function($http) {
    return {
        getProviders: function(idEmpresa, idSucursal) {
            return $http({
                url: proveedorUrl + 'providers/',
                method: "GET",
                params: {
                    empresaID: idEmpresa,
                    sucursalID: idSucursal
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        // getLote: function(estatusCID, pro_idtipoproceso) {
        //     return $http({
        //         url: proveedorUrl + 'Lote/',
        //         method: "GET",
        //         params: { estatusCID: estatusCID, idtipoproceso: pro_idtipoproceso },
        //         headers: { 'Content-Type': 'application/json' }
        //     });
        // },
        // getLoteDetail: function(loteID) {
        //     return $http({
        //         url: proveedorUrl + 'LoteDetail/',
        //         method: "GET",
        //         params: { loteID: loteID },
        //         headers: { 'Content-Type': 'application/json' }
        //     });
        // },
        // getproveedorType: function(loteID) {
        //     return $http({
        //         url: proveedorUrl + 'proveedorType/',
        //         method: "GET",
        //         params: { loteID: loteID },
        //         headers: { 'Content-Type': 'application/json' }
        //     });
        // },
        topNavBar: function() {
            return [
                { name: 'Empresas', url: 'empresa', isActive: false },
                { name: 'Unidades en Proveedor', url: '#', isActive: true }
            ];
        },
        stepsBar: function() {
            return [
                { name: "1. Seleccionar", className: "active", panelName: "pnlSeleccionar", icono: "fa fa-check-square-o" },
                { name: "2. Financiera", className: "", panelName: "pnlFinanciera", icono: "fa fa-bank" },
                { name: "3. Aplicar", className: "", panelName: "pnlAplicar", icono: "fa fa-cloud-upload" }
            ];
        },
        proveedorPoliza: function(params) {
            return $http({
                url: proveedorUrl + 'proveedorPoliza/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        proveedorPolizaDetalle: function(params) {
            return $http({
                url: proveedorUrl + 'proveedorPolizaDetalle/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        procesaproveedor: function( lastId ) {
            return $http({
                url: traspasoUrl + 'procesaproveedor/',
                method: "GET",
                params: {
                    idTraspasoFinanciera: lastId
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },

    };

});
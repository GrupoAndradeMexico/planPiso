var apiinventarioUrl = global_settings.urlCORS + 'api/apiinventario/';
appModule.factory('inventarioFactory', function($http) {
    return {
        getInventory: function(idEmpresa, idSucursal) {
            return $http({
                url: apiinventarioUrl + 'inventory/',
                method: "GET",
                params: { idEmpresa: idEmpresa
                    , idSucursal: idSucursal },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        topNavBar: function() {
            return [
                { name: 'Empresas', url: 'empresa', isActive: false },
                { name: 'Unidades en Inventario', url: '#', isActive: true }
            ];
        },
        stepsBar: function() {
            return [
                { name: "1. Seleccionar", className: "active", panelName: "pnlSeleccionar", icono: "fa fa-check-square-o" },
                { name: "2. Financiera", className: "", panelName: "pnlFinanciera", icono: "fa fa-bank" }, 
                { name: "3. Aplicar", className: "", panelName: "pnlAplicar", icono: "fa fa-cloud-upload" }
            ];
        },
        inventarioPoliza: function(params) {
            return $http({
                url: apiinventarioUrl + 'inventarioPoliza/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        inventarioPolizaDetalle: function(params) {
            return $http({
                url: apiinventarioUrl + 'inventarioPolizaDetalle/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        procesainventario: function( lastId ) {
            return $http({
                url: traspasoUrl + 'procesainventario/',
                method: "GET",
                params: {
                    idTraspasoFinanciera: lastId
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
    };

});
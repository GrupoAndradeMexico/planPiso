var apiNewUnitsUrl = global_settings.urlCORS + 'api/apiNewUnits/';
appModule.factory('unuevasFactory', function($http) {
    return {
        getNewUnits: function(empresaID) {
            return $http({
                url: apiNewUnitsUrl + 'NewUnits/',
                method: "GET",
                params: { empresaID: empresaID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getNewUnitsBySucursal: function(empresaID, sucursalID,financieraID) {
            return $http({
                url: apiNewUnitsUrl + 'NewUnitsBySucursal/',
                method: "GET",
                params: { empresaID: empresaID, sucursalID: sucursalID,financieraID:financieraID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        setUnitSchema: function(objectData) {
            return $http({
                url: apiNewUnitsUrl + 'setUnitSchema/',
                method: "POST",
                data: objectData,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        topNavBar: function() {
            return [
                { name: 'Empresas', url: 'empresa', isActive: false },
                { name: 'Unidades Nuevas', url: '#', isActive: true }
            ];
        },
        stepsBar: function() {
            return [
                { name: "Seleccionar", className: "active", panelName: "pnlSeleccionar", icono: "fa fa-check-square-o" },
                { name: "Esquema", className: "", panelName: "pnlFinanciera", icono: "fa fa-bank" }, 
                { name: "Aplicar", className: "", panelName: "pnlAplicar", icono: "fa fa-cloud-upload" }
            ];
        },
        assignMesage: function(callback) {
            swal({
                    title: "¿Estas Seguro?",
                    text: "Se asignarán todas la unidades seleccionadas.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#21B9BB",
                    confirmButtonText: "Continuar",
                    closeOnConfirm: false
                },
                callback
            );
        },
        SaldoFinanciera: function(objectData) {
            return $http({
                url: apiNewUnitsUrl + 'SaldoFinanciera/',
                method: "GET",
                params: objectData,
                headers: { 'Content-Type': 'application/json' }
            });
        },
    };

});

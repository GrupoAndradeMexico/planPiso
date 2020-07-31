var interesesUrl = global_settings.urlCORS + 'api/apiInteres/';
appModule.factory('interesFactory', function($http) {

    return {
        getInterestUnits: function(empresaID, sucursalID, financieraID) {
            return $http({
                url: interesesUrl + 'InterestUnits/',
                method: "GET",
                params: { empresaID: empresaID, sucursalID: sucursalID, financieraID: financieraID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getDetailUnits: function(unidadID) {
            return $http({
                url: interesesUrl + 'DetailUnits/',
                method: "GET",
                params: { unidadID: unidadID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insLotePago: function() {
            return $http({
                url: interesesUrl + 'insLotePago/',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insLotePagoDetalle: function(params) {
            return $http({
                url: interesesUrl + 'insLotePagoDetalle/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getSchemaMovements: function(params) {
            return $http({
                url: interesesUrl + 'SchemaMovements/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getGuardaProvision: function(params) {
            return $http({
                url: interesesUrl + 'guardaProvision/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getProcesaProvision: function(params) {
            return $http({
                url: interesesUrl + 'procesaProvision/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getProvisionToday: function(params) {
            return $http({
                url: interesesUrl + 'ProvisionToday/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        ProvisionFinancieraDetalle: function(params) {
            return $http({
                url: interesesUrl + 'ProvisionFinancieraDetalle/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insPago: function(params) {
            return $http({
                url: interesesUrl + 'insPago/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insCompensacion: function(params) {
            return $http({
                url: interesesUrl + 'insCompensacion/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        validaPago: function(params) {
            return $http({
                url: interesesUrl + 'validaPago/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        GetCompensacion: function(params) {
            return $http({
                url: interesesUrl + 'Compensacion/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        ReduccionFinanciera: function(params) {
            return $http({
                url: interesesUrl + 'reduccionFinanciera/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        ReduccionFinancieraDetalle: function(params) {
            return $http({
                url: interesesUrl + 'reduccionFinancieraDetalle/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        procesaReduccion: function(lastId) {
            return $http({
                url: interesesUrl + 'procesaReduccion/',
                method: "GET",
                params: {
                    idReduccionFinanciera: lastId
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getInterestUnitsNews: function(empresaID, sucursalID, financieraID) {
            return $http({
                url: interesesUrl + 'interestUnitsNews/',
                method: "GET",
                params: { empresaID: empresaID, sucursalID: sucursalID, financieraID: financieraID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getInterestUnitsPreOwned: function(empresaID, sucursalID, financieraID) {
            return $http({
                url: interesesUrl + 'interestUnitsPreOwned/',
                method: "GET",
                params: { empresaID: empresaID, sucursalID: sucursalID, financieraID: financieraID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insertaDocumentosLote: function(array) {
            return $http({
                url: interesesUrl + 'insertaDocumentosLote/',
                method: "POST",
                data: array,
                headers: { 'Content-Type': 'application/json' }
            });
        },

        facturaUnidad: function(idEmpresa, idSucursal, documento) {
            return $http({
                url: interesesUrl + 'facturaUnidad/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    documento: documento
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        facturaTramites: function(idEmpresa, idSucursal, documento) {
            return $http({
                url: interesesUrl + 'facturaTramites/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    documento: documento
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        facturaServicios: function(idEmpresa, idSucursal, documento) {
            return $http({
                url: interesesUrl + 'facturaServicios/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    documento: documento
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        facturaOT: function(idEmpresa, idSucursal, documento) {
            return $http({
                url: interesesUrl + 'facturaOT/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    documento: documento
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        facturaAccesorios: function(idEmpresa, idSucursal, documento) {
            return $http({
                url: interesesUrl + 'facturaAccesorios/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    documento: documento
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        saveSpread: function(params) {
            return $http({
                url: interesesUrl + 'saveSpread/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        enganche: function(vin) {
            return $http({
                url: interesesUrl + 'enganche/',
                method: "GET",
                params: { vin: vin },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        cabeceraPoliza: function(params) {
            return $http({
                url: interesesUrl + 'cabeceraPoliza/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        compensacionDetalle: function(params) {
            return $http({
                url: interesesUrl + 'compensacionDetalle/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        detalleBproCompensacion: function(params) {
            return $http({
                url: interesesUrl + 'detalleBproCompensacion/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        notaCredito: function(idEmpresa, idSucursal, documento) {
            return $http({
                url: interesesUrl + 'notaCredito/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    documento: documento
                },
                headers: { 'Content-Type': 'application/json' }
            });
        }

    };
});
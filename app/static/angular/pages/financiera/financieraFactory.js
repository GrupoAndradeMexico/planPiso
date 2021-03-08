var financieraUrl = global_settings.urlCORS + 'api/apiFinanciera/';
appModule.factory('financieraFactory', function($http) {
    return {

        initSchemaHeader: function() {
            return {
                nombre: null,
                descripcion: null,
                diasGracia: null,
                plazo: null,
                interesMoratorio: null,
                tasaInteres: null,
                porcentajePenetracion: null,
                fechaInicio: null,
                fechaFin: null,
                tiie: null,
                selectedOption: null
            };
        },

        initSchemaDetail: function() {
            return {

            };
        },
        getCatalogosTipo: function(params) {
            return $http({
                url: financieraUrl + 'CatalogosTipo/',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        putScheme: function(params) {
            return $http({
                url: financieraUrl + 'putFinanciera/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        updFinanciera: function(params) {
            return $http({
                url: financieraUrl + 'updFinanciera/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        deleteScheme: function(params) {
            return $http({
                url: financieraUrl + 'delFinanciera/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        formIsvalid: function(controls) {
            var esValido = false;

            for (i = 0; i < controls.length; i++) {

                if (controls[i].value === null || controls[i].value === '') {
                    swal('Verifique', controls[i].name + ' es requerido', 'warning');
                    esValido = false;
                    break;
                }

                var pattern = new RegExp(controls[i].regExp);

                if (pattern.test(controls[i].value) === false) {
                    swal('Verifique', controls[i].name + ' formato incorrecto', 'warning');
                    esValido = false;
                    break;
                }

                esValido = true;
            }

            return esValido;
        },

        setHeaderValues: function(control, expresion) {

            var formControls = [
                { value: control.tipoCobroInteresID, name: 'Tipo Cobro Interes', regExp: expresion.entero1 },
                { value: control.tipoPagoInteresID, name: 'Tipo Pago Interes', regExp: expresion.entero1 },
                { value: control.tipoPagoInteresFinMesID, name: 'Tipo Pago Interes fin Mes', regExp: expresion.entero1 },
                { value: control.tipoSOFOMID, name: 'Tipo SOFOM', regExp: expresion.entero1 },

            ];
            return formControls;
        },
        insColateralLineaCredito: function(params) {
            return $http({
                url: financieraUrl + 'insColateralLineaCredito/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        updColateralLineaCredito: function(params) {
            return $http({
                url: financieraUrl + 'updColateralLineaCredito/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getColateralLineaCredito: function(params) {
            return $http({
                url: financieraUrl + 'ColateralLineaCredito/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        delColateralLineaCredito: function(params) {
            return $http({
                url: financieraUrl + 'delColateralLineaCredito/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        }



    };

});
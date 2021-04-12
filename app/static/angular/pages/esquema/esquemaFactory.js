var esquemaUrl = global_settings.urlCORS + 'api/apiEsquema/';
appModule.factory('esquemaFactory', function($http) {
    return {

        initSchemaHeader: function() {
            return {
                nombre: null,
                diasGracia: null,
                plazo: null,
              
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
        putScheme: function(params) {
            return $http({
                url: esquemaUrl +'putEsquema/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        updEsquema: function(params) {
            return $http({
                url: esquemaUrl +'updEsquema/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getPlantilla: function(params) {
            return $http({
                url: esquemaUrl +'Plantilla/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        deleteScheme: function(params) {
            return $http({
                url: esquemaUrl +'delEsquema/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        guardarListaReduccion: function(params) {
            return $http({
                url: esquemaUrl +'guardarListaReduccion/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        obtenListaReduccion: function(params) {
            return $http({
                url: esquemaUrl +'obtenListaReduccion/',
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
                { value: control.nombre, name: 'Nombre', regExp: expresion.todo },
                { value: control.diasGracia, name: 'Dias Gracia', regExp: expresion.entero1 },
                { value: control.plazo, name: 'Plazo', regExp: expresion.entero1 },
                { value: control.tasaInteres, name: 'Tasa interes', regExp: expresion.decimal1 },
                { value: control.fechaInicio, name: 'Fecha inicio', regExp: expresion.todo },
                { value: control.fechaFin, name: 'Fecha fin', regExp: expresion.todo },
            ];
            return formControls;
        }
        ,guardarEsquemaCopia: function(params) {
            return $http({
                url: esquemaUrl +'guardarEsquemaCopia/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        } ,Empresa: function(idusuario) {
            return $http({
                url: esquemaUrl +'Empresa/',
                method: "GET",
                params: {idusuario:idusuario},
                headers: { 'Content-Type': 'application/json' }
            });
        },savePdf: function(params) {
            return $http({
                url: esquemaUrl + 'savePdf/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        }, getreadPdf: function( ruta ) {
            return $http({
                url: esquemaUrl + 'readPdf/',
                method: "GET",
                params: { 
                    ruta: ruta, 
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },


    };

});
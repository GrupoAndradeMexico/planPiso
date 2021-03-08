appModule.controller('esquemaController', function($scope, $rootScope, $filter, $location, commonFactory, staticFactory, esquemaFactory) {

    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.lstPermisoBoton = JSON.parse(sessionStorage.getItem("PermisoUsuario"));
    var regularExpression = staticFactory.getRegExp();

    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.currentFinancialName = "Selecciona Financiera";
    $scope.currentPanel = "pnlFinanciera";
    $scope.currentEsquema = 0;
    $scope.currentEsquemaDetail = 0;
    $scope.idUsuario = localStorage.getItem("idUsuario");
    $scope.editAddTitle = "";
    $scope.lstFinancial = [];
    $scope.lstSchemeDetail = [];
    $scope.lstTiie = [];
    $scope.currentFinancialID = 0;
    $scope.showAddBtn = false;
    $scope.showEditBtn = false;
    $scope.agregareditar = false;
    $scope.esquemaHeader = esquemaFactory.initSchemaHeader();
    $scope.SumaPorcentaje =0;
    $scope.topBarNav = staticFactory.esquemaBar();
    var nuevoEsquema = _.where($scope.lstPermisoBoton, { idModulo: 2, Boton: "nuevoEsquema" })[0];
    var editar = _.where($scope.lstPermisoBoton, { idModulo: 2, Boton: "editar" })[0];
    var borrar = _.where($scope.lstPermisoBoton, { idModulo: 2, Boton: "borrar" })[0];
    $scope.muestranuevoEsquema = nuevoEsquema != undefined ? false : true;
    $scope.muestraeditar = editar != undefined ? false : true;
    $scope.muestraborrar = borrar != undefined ? false : true;

    commonFactory.getFinancial(sessionFactory.empresaID).then(function(result) {
        $scope.lstFinancial = result.data;
    });
    commonFactory.getTipoTiie().then(function(result) {
        $scope.lstTiie = result.data;
    });
    commonFactory.getTipoColateral().then(function(result) {
        $scope.lstTipoColateral = result.data;
    });
    $scope.validateSchemaHeader = function() {
        var esquemaFormControls = esquemaFactory.setHeaderValues($scope.esquemaHeader, regularExpression);
        // var isValid = esquemaFactory.formIsvalid(esquemaFormControls);
        // if (isValid === true) 
        $scope.insertSchemaHeader();
    };
    $scope.insertSchemaHeader = function() {

        var params = {
            usuarioID: $scope.usuarioID,
            financieraID: $scope.currentFinancialIDAP,
            diasGracia: $scope.esquemaHeader.diasGracia,
            plazo: $scope.esquemaHeader.plazo,
            nombre: $scope.esquemaHeader.nombre,
            interesMoratorio: $scope.esquemaHeader.interesMoratorio,
            usuarioID: $scope.usuarioID,
            tasaInteres: $scope.esquemaHeader.tasaInteres,
            tieneDPP: $scope.esquemaHeader.tieneDPP,
            tieneReduccion: $scope.esquemaHeader.tieneReduccion,
            fechaInicio: $scope.esquemaHeader.fechaInicio,
            fechaFin: $scope.esquemaHeader.fechaFin,
            porcentajePenetracion: $scope.esquemaHeader.porcentajePenetracion,
            tipoTiieCID: $scope.esquemaHeader.selectedOption.tipoTiieId,
            tipoColateralId: $scope.esquemaHeader.selectedtipoColateral.idtipoColateral,
            recalendarizacion:$scope.esquemaHeader.recalendarizacion,
            tasarecalendarizacion:$scope.esquemaHeader.tasarecalendarizacion,
            tiie: $scope.esquemaHeader.tiie,
        };

        esquemaFactory.putScheme(params).then(function(result) {
            console.log(result.data);
            $scope.currentEsquema = result.data[0].id;
            if ($scope.esquemaHeader.tieneReduccion == 1) {
                var resultado = '';
                for (var i = 0; i < $scope.esquemaHeader.lstreduccion.length; i++) {
                    resultado = resultado + '|' + $scope.esquemaHeader.lstreduccion[i].dia + ',' + $scope.esquemaHeader.lstreduccion[i].porcentaje
                }

                if (resultado.length > 0) {
                    resultado = resultado.substring(1, resultado.length);
                    var params2 = {
                        lista: resultado,
                        esquemaID: $scope.currentEsquema
                    };
                    esquemaFactory.guardarListaReduccion(params2).then(function(result) {
                        console.log(result.data);
                    });
                }
            }
            swal('Guardado', 'Insertado con exito', 'success');
            $scope.getSchemas($scope.currentFinancialID);
            $scope.backToPrincipal();
        });
    };
    $scope.ColateralChange = function() {
        var item = $scope.esquemaHeader.selectedtipoColateral;
        var params = {
            idempresa: sessionFactory.empresaID,
            idtipoColateral: item.idtipoColateral,
            idfinanciera: $scope.currentFinancialID
        };
        $scope.SumaPorcentaje =0;
        esquemaFactory.getPlantilla(params).then(function(result) {

            $scope.esquemaHeader.diasGracia = result.data[0].diasGracia;
            $scope.esquemaHeader.plazo = result.data[0].plazo;
            $scope.esquemaHeader.interesMoratorio = result.data[0].interesMoratorio;
            $scope.esquemaHeader.tasaInteres = result.data[0].tasaInteres;
            $scope.esquemaHeader.porcentajePenetracion = result.data[0].porcentajePenetracion;
            $scope.esquemaHeader.tieneReduccion = result.data[0].tieneReduccion;
           // $scope.esquemaHeader.tieneDPP = result.data[0].tieneDPP;
            $scope.esquemaHeader.fechaInicio = result.data[0].fechaInicio;
            $scope.esquemaHeader.fechaFin = result.data[0].fechaFin;
            if ($scope.esquemaHeader.tieneReduccion == 1)
                $scope.esquemaHeader.lstreduccion = $scope.regresatabla(result.data[0].reducciondetalle);
            $scope.esquemaHeader.selectedOption = _.where($scope.lstTiie, { tipoTiieId: result.data[0].tipoTiieCID })[0];
            $scope.esquemaHeader.selectedtipoColateral = _.where($scope.lstTipoColateral, { idtipoColateral: result.data[0].tipoColateralID })[0];
        });
    }
    $scope.regresatabla = function(arreglo) {
        var tablaregreso = [];
        var array = arreglo.split('|');
        for (var i = 0; i < array.length; i++) {
            var array2 = array[i].split(',');
            var newobject = {
                dia: array2[0],
                porcentaje: array2[1]
            }
            $scope.SumaPorcentaje += parseInt(array2[1]);
            tablaregreso.push(newobject);
        }

        return tablaregreso;


    }
    $scope.AgregarDetail = function() {
        $scope.agregareditar = true;
        $scope.nuevo = 1;
        $scope.ctrl = {};
        $scope.ctrl.dia = 0;
        $scope.ctrl.porcentaje = 0;
    }
    $scope.GuardarDetail = function() {
        if ($scope.nuevo == 1) {
            var newobject = {
                dia: $scope.ctrl.dia,
                porcentaje: $scope.ctrl.porcentaje
            }
            $scope.esquemaHeader.lstreduccion.push(newobject);
        } else {
            for (var i = 0; i < $scope.esquemaHeader.lstreduccion.length; i++) {
                if ($scope.esquemaHeader.lstreduccion[i].dia == $scope.ctrl.dia) {
                    $scope.esquemaHeader.lstreduccion[i].porcentaje = $scope.ctrl.porcentaje;
                    break; //Stop this loop, we found it!
                }
            }

        }
        $scope.SumaPorcentaje=0;
        for (var i = 0; i < $scope.esquemaHeader.lstreduccion.length; i++) {
            $scope.SumaPorcentaje +=  parseInt($scope.esquemaHeader.lstreduccion[i].porcentaje,10);
        }
        $scope.ctrl.dia = 0;
        $scope.ctrl.porcentaje = 0;
        $scope.agregareditar = false;
    }
    $scope.CancelarDetail = function() {
        $scope.ctrl.dia = 0;
        $scope.ctrl.porcentaje = 0;
        $scope.agregareditar = false;
    }
    $scope.EditarDetail = function(item) {
        $scope.agregareditar = true;
        $scope.ctrl = {};
        $scope.nuevo = 0;
        $scope.ctrl.dia = item.dia;
        $scope.ctrl.porcentaje = item.porcentaje;
        $scope.SumaPorcentaje=0;
        for (var i = 0; i < $scope.esquemaHeader.lstreduccion.length; i++) {
            $scope.SumaPorcentaje +=  parseInt($scope.esquemaHeader.lstreduccion[i].porcentaje,10);
        }
    }
    $scope.BorrarDetail = function(item) {
        $scope.esquemaHeader.lstreduccion.splice($scope.esquemaHeader.lstreduccion.findIndex(v => v.dia === item.dia), 1);
        $scope.SumaPorcentaje=0;
        for (var i = 0; i < $scope.esquemaHeader.lstreduccion.length; i++) {
            $scope.SumaPorcentaje +=  parseInt($scope.esquemaHeader.lstreduccion[i].porcentaje,10);
        }
    }
    $scope.setCurrentFinancial = function(financialObj) {
        $scope.showAddBtn = true;
        $scope.currentPanel = "pnlFinanciera";
        $scope.currentFinancialName = financialObj.nombre;
        $scope.currentFinancialID = financialObj.financieraIDBP;
        $scope.currentFinancialIDAP = financialObj.financieraIDAP;
        $scope.verTasaInteres = financialObj.verTasaInteres;
        $scope.getSchemas($scope.financieraIDAP);
    };
    $scope.getSchemas = function() {
        $('#mdlLoading').modal('show');
        commonFactory.getSchemas($scope.currentFinancialIDAP).then(function(result) {
            if( $scope.lstSchemas !=undefined)
            {
           $('#tblSchemas1').DataTable().destroy();
            }
    //        $scope.initTblSchemas();
            $scope.lstSchemas = result.data;
            $('#mdlLoading').modal('hide');
        });
    };
    $scope.initTblSchemas = function() {
        $scope.setTableStyle('#tblSchemas1');
    };
    $scope.setTableStyle = function(tblID) {
        staticFactory.setTableStyleOne(tblID);
    };
    $scope.newSchema = function() {
        $scope.isAddMode = true;
    };
    $scope.CambiarReduccion = function(reducc) {
        $scope.reducc = reducc;
        $scope.esquemaHeader.tieneReduccion = reducc;
    };
    $scope.addSchema = function() {
        $scope.isAddMode = true;
        $scope.showAddBtn = false;
        $scope.showEditBtn = false;
        $scope.currentPanel = "pnlEsquema";
        $scope.editAddTitle = "Nuevo esquema: " + $scope.currentFinancialName;
        $scope.esquemaHeader = esquemaFactory.initSchemaHeader();
    };
    $scope.deleteSchema = function(objSchema) {
        $scope.currentEsquema = objSchema.esquemaID;
        var params = {
            esquemaID: $scope.currentEsquema
        };
        esquemaFactory.deleteScheme(params).then(function(result) {
            console.log(result.data);
            swal('Guardado', 'Esquema borrado con exito', 'success');
            $scope.getSchemas($scope.currentFinancialID);
            $scope.backToPrincipal();
        });
    };

    $scope.backToPrincipal = function() {
        $scope.showAddBtn = true;
        $scope.showEditBtn = false;
        $scope.currentPanel = "pnlFinanciera";
        $scope.esquemaHeader = esquemaFactory.initSchemaHeader();
    };
    $scope.editSchema = function(objSchema) {
        $scope.currentEsquema = objSchema.esquemaID;
        $scope.isAddMode = true;
        $scope.showAddBtn = false;
        $scope.showEditBtn = true;
        $scope.currentPanel = "pnlEsquema";
        $scope.editAddTitle = "Editando esquema: " + objSchema.nombre;
        var params2 = {
            esquemaID: $scope.currentEsquema
        };
        esquemaFactory.obtenListaReduccion(params2).then(function(result) {
            $scope.esquemaHeader.lstreduccion = result.data;
            $scope.SumaPorcentaje=0;
            for (var i = 0; i < $scope.esquemaHeader.lstreduccion.length; i++) {
                $scope.SumaPorcentaje +=  $scope.esquemaHeader.lstreduccion[i].porcentaje;
            }
         
        });

        $scope.setSchemaHeaderData(objSchema);
    };
    $scope.copySchema = function(objSchema) {
        $("#modalcopiarEsquema").modal('show');
        $scope.esquemacopiar=objSchema;
         esquemaFactory.Empresa($scope.idUsuario).then(function(result) {
            $scope.lstEmpresaCopy = result.data;
        });
       
    };

    $scope.setCurrentEmpresaCopy = function(EmpresaObj) {
       
        $scope.currentEmpresaNameCopy = EmpresaObj.emp_nombre;
        $scope.empresa=EmpresaObj;
        commonFactory.getFinancial($scope.empresa.emp_idempresa).then(function(result) {
            $scope.lstFinancialCopy = result.data;
        });
    };
    $scope.GuardarCopy=function(){

        var params2 = {
            esquemaID: $scope.esquemacopiar.esquemaID,
            financieraID:$scope.currentFinancialIDAP,
            financieraIDDest:$scope.currentFinancialIDCopy.financieraID
        };
        esquemaFactory.guardarEsquemaCopia(params2).then(function(result) {
            if(result.data.length>0)
            {
                $("#modalcopiarEsquema").modal('hide');
                swal('Guardado', 'Copia de esquema guardado con éxito', 'success');
            }
        });
    }
    $scope.setCurrentFinancialCopy = function(financialObj) {
       
        $scope.currentFinancialNameCopy = financialObj.nombre;
        $scope.currentFinancialIDCopy = financialObj;
    };
    $scope.setSchemaHeaderData = function(objSchema) {
        $scope.esquemaHeader.nombre = objSchema.nombre;
        $scope.esquemaHeader.diasGracia = objSchema.diasGracia;
        $scope.esquemaHeader.plazo = objSchema.plazo;
        $scope.esquemaHeader.recalendarizacion=objSchema.recalendarizacion;
        $scope.esquemaHeader.tasarecalendarizacion = objSchema.tasarecalendarizacion;
        $scope.esquemaHeader.interesMoratorio = objSchema.interesMoratorio;
        $scope.esquemaHeader.tasaInteres = objSchema.tasaInteres;
        $scope.esquemaHeader.porcentajePenetracion = objSchema.porcentajePenetracion;
        $scope.esquemaHeader.tieneReduccion = objSchema.tieneReduccion;
        $scope.esquemaHeader.tieneDPP = objSchema.tieneDPP;
        $scope.esquemaHeader.fechaInicio = objSchema.fechaInicio;
        $scope.esquemaHeader.fechaFin = objSchema.fechaFin;
        $scope.esquemaHeader.tiie = objSchema.tiie;
        $scope.esquemaHeader.selectedOption = _.where($scope.lstTiie, { tipoTiieId: objSchema.tipoTiieCID })[0];
        $scope.esquemaHeader.selectedtipoColateral = _.where($scope.lstTipoColateral, { idtipoColateral: objSchema.tipoColateralId })[0];

    };
    $scope.validateSchemaHeaderEdit = function() {
        var esquemaFormControls = esquemaFactory.setHeaderValues($scope.esquemaHeader, regularExpression);
        // var isValid = esquemaFactory.formIsvalid(esquemaFormControls);
        // if (isValid === true) 
        if($scope.SumaPorcentaje==0 || $scope.SumaPorcentaje==100)
        {
        $scope.updSchemaHeader();
        }else
        swal('Verificar', 'La lista de reducción debe ser 0% o 100%');

    };
    $scope.updSchemaHeader = function() {

        var params = {
            esquemaID: $scope.currentEsquema,
            usuarioID: $scope.usuarioID,
            financieraID: $scope.currentFinancialIDAP,
            diasGracia: $scope.esquemaHeader.diasGracia,
            plazo: $scope.esquemaHeader.plazo,
            recalendarizacion:$scope.esquemaHeader.recalendarizacion,
            tasarecalendarizacion:$scope.esquemaHeader.tasarecalendarizacion,
            nombre: $scope.esquemaHeader.nombre,
            interesMoratorio: $scope.esquemaHeader.interesMoratorio,
            tasaInteres: $scope.esquemaHeader.tasaInteres,
            tieneDPP: $scope.esquemaHeader.tieneDPP ? 1 : 0,
            tieneReduccion: $scope.esquemaHeader.tieneReduccion ? 1 : 0,
            fechaInicio: $scope.esquemaHeader.fechaInicio,
            fechaFin: $scope.esquemaHeader.fechaFin,
            porcentajePenetracion: $scope.esquemaHeader.porcentajePenetracion,
            tipoTiieCID: $scope.esquemaHeader.selectedOption.tipoTiieId,
            tipoColateralId: $scope.esquemaHeader.selectedtipoColateral.idtipoColateral,
            tiie: $scope.esquemaHeader.tiie,
           
        };

        esquemaFactory.updEsquema(params).then(function(result) {
            swal('Guardado', 'Esquema guardado con exito', 'success');
            if ($scope.esquemaHeader.tieneReduccion == 1) {
                var resultado = '';
                for (var i = 0; i < $scope.esquemaHeader.lstreduccion.length; i++) {
                    resultado = resultado + '|' + $scope.esquemaHeader.lstreduccion[i].dia + ',' + $scope.esquemaHeader.lstreduccion[i].porcentaje
                }

                if (resultado.length > 0) {
                    resultado = resultado.substring(1, resultado.length);
                    var params2 = {
                        lista: resultado,
                        esquemaID: $scope.currentEsquema
                    };
                    esquemaFactory.guardarListaReduccion(params2).then(function(result) {
                        console.log(result.data);
                    });
                }
            }
            $scope.getSchemas($scope.currentFinancialID);
            $scope.backToPrincipal();
        });
    };

    $scope.validateSchemaDetailsEdit = function() {
        var esquemaFormControls = esquemaFactory.setDetailsValues($scope.esquemaDetalle, regularExpression);
        // var isValid = esquemaFactory.formIsvalid(esquemaFormControls);
        // if (isValid === true)
         $scope.updSchemaDetails();
    };
    $scope.cancelDetailEdit = function() {
        $scope.esquemaDetalle = esquemaFactory.initSchemaDetail();
        $scope.editAddTitle = "Agregar detalle esquema: " + $scope.currentFinancialName;
        $scope.showEditBtn = false;
    };
    $scope.setCalendarStyle = function() {
        setTimeout(function() {
            staticFactory.setCalendarStyle();
        }, 500);
    };
    $scope.dateOverlap = function(initDate, endDate, listObj) {
        var isOk = false;

        for (var i = 0; i < listObj.length; i++) {
            isOk = staticFactory.dateExist(initDate, endDate, listObj[i].fechaInicio, listObj[i].fechaFin);
            if (isOk) break;
        }

        return isOk;
    };
});
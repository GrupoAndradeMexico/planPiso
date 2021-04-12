appModule.controller('financieraController', function($scope, $rootScope, $filter, $location, commonFactory, staticFactory, financieraFactory,esquemaFactory) {

    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.lstPermisoBoton = JSON.parse(sessionStorage.getItem("PermisoUsuario"));
    var regularExpression = staticFactory.getRegExp();

    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.currentFinancialName = "Selecciona Financiera";
    $scope.currentPanel = "pnlFinanciera";
    $scope.currentEsquema = 0;
    $scope.currentEsquemaDetail = 0;
    $scope.usuarioID = 0;
    $scope.editAddTitle = "";
    $scope.lstFinancial = [];
    $scope.financieraHeader = [];
    $scope.lstTiie = [];
    $scope.currentFinancialID = 0;
    $scope.showAddBtn = false;
    $scope.showEditBtn = false;

    $scope.topBarNav = staticFactory.financieraBar();

    var editar = _.where($scope.lstPermisoBoton, { idModulo: 3, Boton: "editar" })[0];
    $scope.muestraeditar = editar != undefined ? false : true;

    commonFactory.getFinancial(sessionFactory.empresaID).then(function(result) {
        $scope.lstFinancial = result.data;
    });

    financieraFactory.getCatalogosTipo().then(function(result) {
        $scope.lsttipoCobroInteres = result.data[0];
        $scope.lsttipoPagoInteres = result.data[1];
        $scope.lsttipoPagoInteresFinMes = result.data[2];
        $scope.lsttipoSOFOM = result.data[3];

    });
    $scope.validateSchemaHeader = function() {
        var financieraFormControls = financieraFactory.setHeaderValues($scope.financieraHeader, regularExpression);
        var isValid = financieraFactory.formIsvalid(financieraFormControls);
        if (isValid === true) $scope.insertSchemaHeader();
    };
    $scope.insertSchemaHeader = function() {

        var params = {
            usuarioID: $scope.usuarioID,
            financieraID: $scope.currentFinancialID,
            diasGracia: $scope.financieraHeader.diasGracia,
            plazo: $scope.financieraHeader.plazo,
            nombre: $scope.financieraHeader.nombre,
            descripcion: $scope.financieraHeader.descripcion,
            interesMoratorio: $scope.financieraHeader.interesMoratorio,
            usuarioID: $scope.usuarioID,
            tasaInteres: $scope.financieraHeader.tasaInteres,
            fechaInicio: $scope.financieraHeader.fechaInicio,
            fechaFin: $scope.financieraHeader.fechaFin,
            porcentajePenetracion: $scope.financieraHeader.porcentajePenetracion,
            tipoTiieCID: $scope.financieraHeader.selectedOption.tipoTiieId,
            tiie: $scope.financieraHeader.tiie,
        };

        financieraFactory.putScheme(params).then(function(result) {
            console.log(result.data);
            swal('Guardado', 'Insertado con exito', 'success');
            $scope.getSchemas($scope.currentFinancialID);
            $scope.backToPrincipal();
        });
    };

    $scope.initTblSchemas = function() {
        $scope.setTableStyle('#tblSchemas');
    };
    $scope.setTableStyle = function(tblID) {
        staticFactory.setTableStyleOne(tblID);
    };
    $scope.newSchema = function() {
        $scope.isAddMode = true;
    };
    $scope.addSchema = function() {
        $scope.isAddMode = true;
        $scope.showAddBtn = false;
        $scope.showEditBtn = false;
        $scope.currentPanel = "pnlEsquema";
        $scope.editAddTitle = "Nuevo financiera: " + $scope.currentFinancialName;
        $scope.financieraHeader = financieraFactory.initSchemaHeader();
    };


    $scope.backToPrincipal = function() {
        $scope.showAddBtn = true;
        $scope.showEditBtn = false;
        $scope.currentPanel = "pnlFinanciera";

    };
    $scope.editDetail = function(objSchema) {
        $scope.currentEsquema = objSchema.financieraID;
        $scope.isAddMode = true;
        $scope.showAddBtn = false;
        $scope.showEditBtn = true;
        $scope.currentPanel = "pnlEsquema";
        $scope.editAddTitle = "Editando financiera: " + objSchema.nombre;
        $scope.setSchemaHeaderData(objSchema);
    };
    $scope.setSchemaHeaderData = function(objSchema) {
        $scope.financieraHeader.nombre = objSchema.nombre;
        $scope.financieraHeader.financieraID = objSchema.financieraIDAP;
        $scope.financieraHeader.empresaID = objSchema.empresaID;
        $scope.financieraHeader.tipoCobroInteresID = objSchema.tipoCobroInteresID;
        $scope.financieraHeader.tipoPagoInteresID = objSchema.tipoPagoInteresID;
        $scope.financieraHeader.tipoPagoInteresFinMesID = objSchema.tipoPagoInteresFinMesID;


        $scope.financieraHeader.selectedtipoCobroInteres = _.where($scope.lsttipoCobroInteres, { tipoCobroInteresID: objSchema.tipoCobroInteresID })[0];
        $scope.financieraHeader.selectedtipoPagoInteres = _.where($scope.lsttipoPagoInteres, { tipoPagoInteresID: objSchema.tipoPagoInteresID })[0];
        $scope.financieraHeader.selectedtipoPagoInteresFinMes = _.where($scope.lsttipoPagoInteresFinMes, { tipoPagoInteresFinMesID: objSchema.tipoPagoInteresFinMesID })[0];
        $scope.financieraHeader.selectedtipoSOFOM = _.where($scope.lsttipoSOFOM, { tipoSOFOMID: objSchema.tipoSOFOMID })[0];

        $scope.regresatabla();

    };
    $scope.validateSchemaHeaderEdit = function() {
        $scope.financieraHeader.tipoCobroInteresID = $scope.financieraHeader.selectedtipoCobroInteres.tipoCobroInteresID;
        $scope.financieraHeader.tipoPagoInteresFinMesID = $scope.financieraHeader.selectedtipoPagoInteresFinMes.tipoPagoInteresFinMesID;
        $scope.financieraHeader.tipoPagoInteresID = $scope.financieraHeader.selectedtipoPagoInteres.tipoPagoInteresID;
        $scope.financieraHeader.tipoSOFOMID = $scope.financieraHeader.selectedtipoSOFOM.tipoSOFOMID;


        var financieraFormControls = financieraFactory.setHeaderValues($scope.financieraHeader, regularExpression);
        var isValid = financieraFactory.formIsvalid(financieraFormControls);
        if (isValid === true) $scope.updSchemaDetails();
    };
    $scope.updSchemaDetails = function() {

        var params = {
            financieraID: $scope.financieraHeader.financieraID,
            empresaID: $scope.financieraHeader.empresaID,
            tipoCobroInteresID: $scope.financieraHeader.tipoCobroInteresID,
            tipoPagoInteresFinMesID: $scope.financieraHeader.tipoPagoInteresFinMesID,
            tipoPagoInteresID: $scope.financieraHeader.tipoPagoInteresID,
            tipoSOFOMID: $scope.financieraHeader.tipoSOFOMID,
            usuarioID: localStorage.getItem('idUsuario')
        };

        financieraFactory.updFinanciera(params).then(function(result) {
            swal('Guardado', 'Financiera guardada con exito', 'success');
            commonFactory.getFinancial(sessionFactory.empresaID).then(function(result) {
                $scope.lstFinancial = result.data;
                $scope.backToPrincipal();
            });

        });
    };


    $scope.cancelDetailEdit = function() {
        $scope.financieraDetalle = financieraFactory.initSchemaDetail();
        $scope.editAddTitle = "Agregar detalle financiera: " + $scope.currentFinancialName;
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
    commonFactory.getTipoColateral().then(function(result) {
        $scope.lstTipoColateral = result.data;
    });
    $scope.regresatabla = function() {
        var params = {
            idfinanciera: $scope.financieraHeader.financieraID,
            //,usuarioID: localStorage.getItem('idUsuario')
        };

        financieraFactory.getColateralLineaCredito(params).then(function(result) {
            $scope.lstLista = result.data;

        });


    }
    $scope.AgregarDetail = function() {
        $scope.agregareditar = true;
        $scope.nuevo = 1;
        $scope.ctrl = {};

    }
    $scope.GuardarDetail = function() {
        if ($scope.nuevo == 1) {
            // var newobject={
            //     dia:$scope.ctrl.dia,
            //     porcentaje:$scope.ctrl.porcentaje
            // }
            //  $scope.esquemaHeader.lstreduccion.push(newobject);
            var params = {
                idfinanciera: $scope.financieraHeader.financieraID,
                idtipoColateral: $scope.ctrl.selectedtipoColateral.idtipoColateral,
                LineaCredito: $scope.ctrl.LineaCredito,
                NumUnidades: $scope.ctrl.NumUnidades,
                fechainicio: $scope.ctrl.fechainicio,
                fechafin: $scope.ctrl.fechafin
                ,usuarioID: localStorage.getItem('idUsuario')
            };

            financieraFactory.insColateralLineaCredito(params).then(function(result) {
                swal('Guardado', 'Financiera guardada con exito', 'success');
                $scope.regresatabla();

            });
        } else {
            // for (var i=0; i<$scope.esquemaHeader.lstreduccion.length; i++) { 
            //     if ($scope.esquemaHeader.lstreduccion[i].dia == $scope.ctrl.dia) {
            //         $scope.esquemaHeader.lstreduccion[i].porcentaje = $scope.ctrl.porcentaje;
            //        break; //Stop this loop, we found it!
            //     }
            //   }
            var params = {
                idColateralLineaCredito: $scope.ctrl.idColateralLineaCredito,
                LineaCredito: $scope.ctrl.LineaCredito,
                NumUnidades: $scope.ctrl.NumUnidades,
                fechainicio: $scope.ctrl.fechainicio,
                fechafin: $scope.ctrl.fechafin
                ,usuarioID: localStorage.getItem('idUsuario')
            };

            financieraFactory.updColateralLineaCredito(params).then(function(result) {
                swal('Guardado', 'Financiera guardada con exito', 'success');
                $scope.regresatabla();

            });

        }
        $scope.agregareditar = false;
    }
    $scope.CancelarDetail = function() {
        $scope.agregareditar = false;
    }
    $scope.EditarDetail = function(item) {
        $scope.agregareditar = true;
        $scope.ctrl = {};
        $scope.nuevo = 0;
        $scope.ctrl.idColateralLineaCredito = item.idColateralLineaCredito;
        $scope.ctrl.idtipoColateral = item.idtipoColateral;
        $scope.ctrl.selectedtipoColateral = _.where($scope.lstTipoColateral, { idtipoColateral: item.idtipoColateral })[0];
        $scope.ctrl.LineaCredito = item.LineaCredito;
        $scope.ctrl.NumUnidades = item.NumUnidades;
        $scope.ctrl.fechainicio = item.fechainicio;
        $scope.ctrl.fechafin = item.fechafin;

    }
    $scope.BorrarDetail = function(item) {
        var params = {
            idColateralLineaCredito: item.idColateralLineaCredito
            //,usuarioID: localStorage.getItem('idUsuario')
        };

        financieraFactory.delColateralLineaCredito(params).then(function(result) {
            swal('Guardado', 'Financiera guardada con exito', 'success');
            $scope.regresatabla();

        });
    }
    $scope.guardaArchivofinanciera = function() {
        $('#modalFinancieraCargarArchivo').modal('show');
        //     $('#selectGuardarPDF').modal('show');
        $scope.Dropzone();


    }

    var myDropzone;
    $scope.Dropzone = function() {
        $("#templateDropzone").html('')

        var html = `<form action="/file-upload" class="dropzone" id="idDropzone">
                        <div class="fallback">
                            <input name="file" type="file" accept=".pdf" />
                        </div>
                    </form>`;

        $("#templateDropzone").html(html);
        myDropzone = new Dropzone("#idDropzone", {
            url: "api/apiAuditoria/uploadpdf",
            uploadMultiple: 0,
            maxFiles: 1,
            autoProcessQueue: false,
            acceptedFiles: "application/pdf",
            webkitRelativePath: "/uploads"
        });

        myDropzone.on("success", function(req, xhr) {
            var _this = this;

            var filename = xhr + '.pdf';
            $scope.loadingPanel = true;
            $('#mdlLoading').modal('show');
            $scope.TerminarGuardarFinanciera(filename);

            $scope.limpiarDropzone = function() {
                _this.removeAllFiles();
                myDropzone.enable()
               // $scope.frmauditoria.loadLayout = true;
            }
        });

        myDropzone.on("addedfile", function() {
          //  $scope.frmauditoria.loadLayout = true;
        });
    };

    $scope.readArchivoFinanciera = function() {
        myDropzone.processQueue();

    };
    $scope.TerminarGuardarFinanciera = function(filename) {
        var params = {
            idfinanciera: $scope.financieraHeader.financieraID,
            idesquema: undefined,
            LayoutName:filename,
            idusuario: localStorage.getItem('idUsuario')
        };
        esquemaFactory.savePdf(params).then(function(result) {
            var res = result;
            $('#mdlLoading').modal('hide');
            $('#modalFinancieraCargarArchivo').modal('hide');
            $scope.loadingPanel = false;
            swal("Ok", "Se guardo con exito el archivo", "success");
            setTimeout(function() {
                location.reload();
            }, 3000);
        }, function(error) {
            console.log("Error", error);
        });
    }

    $scope.VerArchivoPdf = function(item) {

        var folioEmpresaSucursal = item;
        var arregloBytes = [];
        $rootScope.pdf = undefined;
        esquemaFactory.getreadPdf(item.ruta).then(function(result) {
            arregloBytes = result.data;

            if (arregloBytes.length == 0) {
                $rootScope.NohayPdf = 1;
                $rootScope.pdf = [];
            } else {

                $rootScope.NohayPdf = undefined;
                $rootScope.pdf = URL.createObjectURL(utils.b64toBlob(arregloBytes, "application/pdf"));

                $('#polizaCancelada').modal('show');
            }

            setTimeout(function() {
                $("#pdfArchivo").html('');
                $("<object class='filesInvoce' data='" + $scope.pdf + "' width='100%' height='500px' >").appendTo('#pdfArchivo');

            }, 100);
            $('#loading').modal('hide');
            console.log($scope.pdf, 'Soy el arreglo ')
        }, function(error) {
            console.log("Error", error);
        });
    }
});
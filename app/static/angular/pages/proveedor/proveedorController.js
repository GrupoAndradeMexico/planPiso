appModule.controller('proveedorController', function($scope, $rootScope, $location, filterFilter, commonFactory, staticFactory, proveedorFactory, alertFactory) {

    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.lstPermisoBoton = JSON.parse(sessionStorage.getItem("PermisoUsuario"));
    $scope.idUsuario = localStorage.getItem("idUsuario");

    $scope.currentSucursalName = "Sucursal Todas";
    $scope.currentFinancialName = "Seleccionar Financiera";
    $scope.FinancieraSel = [];
    $scope.selectedSchema = [];
    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.topBarNav = proveedorFactory.topNavBar();
    $scope.steps = proveedorFactory.stepsBar();

    $scope.currentStep = 0;
    $scope.showStep = 1;
    // $scope.topBarNav = staticFactory.proveedorBar();
    // $scope.lstPayTypes = [];
    // $scope.lstUnitsPending = [];
    // $scope.lstUnitsApply = [];
    // $scope.lstUnitDeatil = [];
    // $scope.objEdit = { visible: false };
    // $scope.currentPanel = 'pnlPendientes';
    // $scope.currentPayName = 'Todos';
    // $scope.showDropDown = true;
    $('#mdlLoading').modal('show');

    var finalizar = _.where($scope.lstPermisoBoton, { idModulo: 6, Boton: "finalizar" })[0];
    $scope.muestrafinalizar = finalizar != undefined ? false : true;
    commonFactory.getSucursal(sessionFactory.empresaID, $scope.idUsuario).then(function(result) {
        $scope.lstSucursal = result.data;
    });
    commonFactory.getFinancial(sessionFactory.empresaID).then(function(result) {
        $scope.lstFinancial = result.data;
    });
    proveedorFactory.getProviders(sessionFactory.empresaID).then(function(result) {
        $scope.lstNewUnits = result.data;
        $scope.initTblProviders();
        $('#mdlLoading').modal('hide');
    });
    $scope.initTblProviders = function() {
        $scope.setTableStyle('#tblUnidadesProveedores');
        $scope.totalUnidades = $scope.lstNewUnits.length;
        $scope.setCalendarStyle();
    };
    $scope.setTableStyle = function(tableID) {
        staticFactory.setTableStyleOne(tableID);
    };
    $scope.setCalendarStyle = function() {
        staticFactory.setCalendarStyle();
    };
    $scope.checkAllUnits = function() {

        // for (var i = 0; i < $scope.lstNewUnits.length; i++) {
        //     $scope.lstNewUnits[i].isChecked = $scope.allUnits.isChecked;
        // }

        if ($scope.allUnits.isChecked == true) {
            var table = $('#tblUnidadesProveedores').DataTable();
            var rows = table.rows({ search: 'applied' }).data();
            var documento = '';
            angular.forEach(rows, function(value, key) {
                documento = value[0];
                angular.forEach($scope.lstNewUnits, function(value, key) {
                    if (value.CCP_IDDOCTO == documento) {
                        value.isChecked = true;
                    }
                });

            });
        } else if ($scope.allUnits.isChecked == false) {
            angular.forEach($scope.lstNewUnits, function(value, key) {
                value.isChecked = false;
            });
        }

    };

    $scope.nextStep = function() {
        var contador = 0;
        angular.forEach($scope.lstNewUnits, function(value, key) {
            if (value.isChecked === true) {
                contador++;
            }
        });
        if ($scope.currentStep === 0 && contador === 0) {
            swal("Aviso", "No ha seleccionado ningun documento", "warning");
            return;
        } else if ($scope.currentStep === 1 && $scope.selectedSchema.esquemaID === undefined) {
            if ($scope.FinancieraSel.nombre) {
                swal("Aviso", "No ha seleccionado un esquema", "warning");
                return;
            } else {
                swal("Aviso", "Debe seleccionar una financiera para continuar el proceso", "warning");
                return;
            }

        } else if (($scope.currentStep + 1) < $scope.steps.length) {
            $scope.steps[$scope.currentStep].className = "visited";
            $scope.currentStep++;
            $scope.showStep = $scope.currentStep + 1;
            $scope.currentPanel = $scope.steps[$scope.currentStep].panelName;
            $scope.steps[$scope.currentStep].className = "active";
            $scope.showFilterButtons($scope.currentStep);
        }
    };

    $scope.prevStep = function() {
        if (($scope.currentStep - 1) >= 0) {
            $scope.steps[$scope.currentStep].className = "visited";
            $scope.showStep = $scope.currentStep;
            $scope.currentStep--;
            $scope.currentPanel = $scope.steps[$scope.currentStep].panelName;
            $scope.steps[$scope.currentStep].className = "active";
            $scope.showFilterButtons($scope.currentStep);
        }
    };
    $scope.showFilterButtons = function(step) {
        if (step === 0)
            $scope.ddlFinancialShow = false;
        else
            $scope.ddlFinancialShow = true;
    };
    $scope.showMsg = function() {
        swal({
                title: "¿Estas Seguro?",
                text: "Se le generara póliza a todos los documentos seleccionados.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#21B9BB",
                confirmButtonText: "Continuar",
                closeOnConfirm: true
            },
            function() {
                $('#mdlLoading').modal('show');
                // var paraproveedor = {
                //     idUsuario: $scope.idUsuario,
                //     idEmpresa: sessionFactory.empresaID,
                //     idtipopoliza: 1 //Unidades de proovedoores
                // }
                $scope.lstUnitsproveedors = filterFilter($scope.lstNewUnits, { isChecked: true });
                console.log($scope.lstUnitsproveedors, 'LAS PLIZAS A GENERAR')
                $scope.guardaDetalle();
                // proveedorFactory.proveedorPoliza(paraproveedor).then(function(respuesta) {
                //     $scope.LastId = respuesta.data[0].LastId;
                //     $scope.lstUnitsproveedors = filterFilter($scope.lstNewUnits, { isChecked: true });
                //     $scope.guardaDetalle();
                // }, function(error) {
                //     $scope.error(error.data.Message);
                // });



            });
    };

    $scope.LastId = 0;
    var contTraspadoDetalle = 0;
    $scope.guardaDetalle = function() {
        if (contTraspadoDetalle < $scope.lstUnitsproveedors.length) {
            var item = $scope.lstUnitsproveedors[contTraspadoDetalle];

            var paraproveedorDetalle = {
                idtipopoliza: 1,
                empresaID: item.idEmpresa,
                sucursalID: item.idSucursal,
                CCP_IDDOCTO: item.CCP_IDDOCTO,
                idfinancieraO: $scope.FinancieraSel.financieraID,
                idEsquemaO: $scope.selectedSchema.esquemaID,
                idfinancieraD: 0,
                idEsquemaD: 0,
                idUsuario: $scope.idUsuario,
                montoFinanciar: item.montoFinanciar,
                fechaInicio: item.fechaCalculo
            }

            proveedorFactory.proveedorPolizaDetalle(paraproveedorDetalle).then(function(response) {
                if (response.data.length != 0) {
                    if (contTraspadoDetalle < $scope.lstUnitsproveedors.length) {
                        contTraspadoDetalle++;
                        $scope.guardaDetalle();
                    }
                }
            }, function(error) {
                $scope.error(error.data.Message);
            });
        } else {
            // swal("proveedor Plan Piso", "Se ha efectuado correctamente su proveedor.");
            proveedorFactory.procesaproveedor($scope.LastId).then(function(response) {
                $('#mdlLoading').modal('hide');
                if (response.length != 0) {
                    swal({
                        title: "Unidades de proveedor Plan Piso",
                        text: "Se ha efectuado correctamente su póliza.",
                        type: "warning"
                    }, function() {
                        location.reload();
                    });
                }
            }, function(error) {
                $('#mdlLoading').modal('hide');
                $scope.error(error.data.Message);
            });
        }
    }
    $scope.setCurrentFinancialHead = function(financialObj) {
        $scope.FinancieraSel = financialObj;
        $('#mdlLoading').modal('show');
        $scope.currentFinancialName = financialObj.nombre;
        // $scope.getNewUnitsBySucursal(sessionFactory.empresaID, $scope.SucursalSel.sucursalID,$scope.FinancieraSel.financieraID);
        $scope.getSchemas($scope.FinancieraSel.financieraID);
    };
    $scope.getSchemas = function(financieraID) {
        commonFactory.getSchemas(financieraID).then(function(result) {
            $('#tblSchemas').DataTable().destroy();
            $scope.lstSchemas = result.data;
            $('#mdlLoading').modal('hide');
        });
    };

    $scope.setCurrentSucursal = function(sucursalObj) {
        $scope.SucursalSel = sucursalObj;
        $('#mdlLoading').modal('show');
        $scope.totalUnidades = 0;
        $scope.currentSucursalName = sucursalObj.nombreSucursal;
        $scope.getNewUnitsBySucursal(sessionFactory.empresaID, sucursalObj.sucursalID, $scope.FinancieraSel.financieraID);
    };
    $scope.getNewUnitsBySucursal = function(empresaID, sucursalID, financieraID) {
        $('#tblUnidadesNuevas').DataTable().destroy();
        proveedorFactory.getProviders(empresaID, sucursalID).then(function(result) {
            $scope.lstNewUnits = result.data;
            $scope.initTblProviders();
            $('#mdlLoading').modal('hide');
        });
    };
    $scope.uncheckSchemas = function(itemSchemas) {
        for (var i = 0; i < $scope.lstSchemas.length; i++) {
            $scope.lstSchemas[i].isChecked = false;
        }
        itemSchemas.isChecked = true;
        $scope.selectedSchema = itemSchemas;
    };
    $scope.validaMonto = function(newValue, oldValue, saldo, index) {
        // if (newValue <= saldo) {
            $scope.lstNewUnits[index].montoFinanciar = newValue;
            $scope.lstNewUnits[index].porcentaje = (newValue * 100) / saldo;
        // } else {
        //     $scope.lstNewUnits[index].montoFinanciar = oldValue;
        //     alertFactory.warning('No puede ingresar un valor mayor al saldo');
        // }
    };
    $scope.validaPorcentaje = function(newValue, oldValue, index) {
        // if (newValue > 100) {
        //     $scope.lstNewUnits[index].porcentaje = oldValue;
        //     alertFactory.warning('El porcentaje no puede ser mayor a 100')
        // } else {
            $scope.lstNewUnits[index].porcentaje = newValue;
            $scope.lstNewUnits[index].montoFinanciar = ($scope.lstNewUnits[index].SALDO * (newValue / 100))
        // }
    }

    // proveedorFactory.getLote(0, '1,3').then(function(result) {
    //     $scope.lstUnitsPending = result.data;
    // });

    // proveedorFactory.getLote(1, '1,3').then(function(result) {
    //     $scope.lstUnitsApply = result.data;
    // });


    // proveedorFactory.getproveedorType().then(function(result) {
    //     $scope.lstPayTypes = result.data;
    // });



    // $scope.setCurrentpay = function(id) {

    //     $scope.currentPayName = id.pro_nombre;
    //     $scope.currentPanel = 'pnlPendientes';
    //     proveedorFactory.getLote(id.pro_idtipoproceso).then(function(result) {
    //         $scope.lstUnitsPending = result.data;
    //     });

    // };



    // $scope.prevStep = function() {

    //     $scope.currentPanel = 'pnlPendientes';
    //     $scope.showDropDown = true;
    // };

    // $scope.setTableStyle = function(tableID) {
    //     staticFactory.setTableStyleOne(tableID);
    // };

    // $scope.showDetail = function(lote) {

    //     $scope.showDropDown = false;

    //     if (lote.estatusCID == 0) {
    //         $scope.objEdit.visible = true;
    //     } else {
    //         $scope.objEdit.visible = false;
    //     }

    //     $scope.currentPanel = 'pnlDetalle';
    //     proveedorFactory.getLoteDetail(lote.ple_idplanpiso).then(function(result) {
    //         $scope.lstUnitDeatil = result.data;
    //     });
    // };



});
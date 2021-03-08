appModule.controller('inventarioController', function($scope, $rootScope, $location, filterFilter, commonFactory, staticFactory, inventarioFactory, alertFactory, unuevasFactory) {

    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.lstPermisoBoton = JSON.parse(sessionStorage.getItem("PermisoUsuario"));
    $scope.idUsuario = localStorage.getItem("idUsuario");

    $scope.currentSucursalName = "Sucursal Todas";
    $scope.currentFinancialName = "Seleccionar Financiera";
    $scope.FinancieraSel = [];
    $scope.selectedSchema = [];
    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.topBarNav = inventarioFactory.topNavBar();
    $scope.steps = inventarioFactory.stepsBar();

    $scope.currentStep = 0;
    $scope.showStep = 1;
    // $scope.topBarNav = staticFactory.inventarioBar();
    // $scope.lstPayTypes = [];
    // $scope.lstUnitsPending = [];
    // $scope.lstUnitsApply = [];
    // $scope.lstUnitDeatil = [];
    // $scope.objEdit = { visible: false };
    // $scope.currentPanel = 'pnlPendientes';
    // $scope.currentPayName = 'Todos';
    // $scope.showDropDown = true;
    $('#mdlLoading').modal('show');
    var finalizar = _.where($scope.lstPermisoBoton, { idModulo: 7, Boton: "finalizar" })[0];
    $scope.muestrafinalizar = finalizar != undefined ? false : true;
    commonFactory.getSucursal(sessionFactory.empresaID, $scope.idUsuario).then(function(result) {
        $scope.lstSucursal = result.data;
    });
    commonFactory.getFinancial(sessionFactory.empresaID).then(function(result) {
        $scope.lstFinancial = result.data;
    });
    inventarioFactory.getInventory(sessionFactory.empresaID).then(function(result) {
        $scope.lstNewUnits = result.data;
        $scope.initTblProviders();
        $('#mdlLoading').modal('hide');
    });

    $scope.initTblProviders = function() {
        $scope.setTableStyle('#tblUnidadesInventario');
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
            var table = $('#tblUnidadesInventario').DataTable();
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
                var parainventario = {
                    idUsuario: $scope.idUsuario,
                    idEmpresa: sessionFactory.empresaID,
                    idtipopoliza: 3 //Unidades de inventario
                }
                $scope.lstUnitsinventarios = filterFilter($scope.lstNewUnits, { isChecked: true });
                $scope.guardaDetalle();
                // inventarioFactory.inventarioPoliza(parainventario).then(function(respuesta) {
                //     $scope.LastId = respuesta.data[0].LastId;
                //     $scope.lstUnitsinventarios = filterFilter($scope.lstNewUnits, { isChecked: true });
                //     $scope.guardaDetalle();
                // }, function(error) {
                //     $scope.error(error.data.Message);
                // });



            });
    };

    $scope.LastId = 0;
    var contTraspadoDetalle = 0;
    $scope.guardaDetalle = function() {
        if (contTraspadoDetalle < $scope.lstUnitsinventarios.length) {
            var item = $scope.lstUnitsinventarios[contTraspadoDetalle];

            var parainventarioDetalle = {
                idtipopoliza: 3,
                empresaID: item.idEmpresa,
                sucursalID: item.idSucursal,
                CCP_IDDOCTO: item.veh_numserie,
                idfinancieraO: $scope.FinancieraSel.financieraID,
                idEsquemaO: $scope.selectedSchema.esquemaID,
                idfinancieraD: 0,
                idEsquemaD: 0,
                idUsuario: $scope.idUsuario,
                montoFinanciar: item.montoFinanciar,
                fechaInicio: item.fechaCalculo
            }

            inventarioFactory.inventarioPolizaDetalle(parainventarioDetalle).then(function(response) {
                if (response.data.length != 0) {
                    if (contTraspadoDetalle < $scope.lstUnitsinventarios.length) {
                        contTraspadoDetalle++;
                        $scope.guardaDetalle();
                    }
                }
            }, function(error) {
                $scope.error(error.data.Message);
            });
        } else {
            // swal("inventario Plan Piso", "Se ha efectuado correctamente su inventario.");
            inventarioFactory.procesainventario($scope.LastId).then(function(response) {
                $('#mdlLoading').modal('hide');
                if (response.length != 0) {
                    swal({
                        title: "Unidades de inventario Plan Piso",
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
        inventarioFactory.getInventory(empresaID, sucursalID).then(function(result) {
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
        if ($scope.selectedSchema.tipoColateralId != undefined) {
            var data = {
                idPersona: $scope.FinancieraSel.financieraIDBP,
                idEmpresa: $scope.unidad.idEmpresa,
                idColateral: $scope.selectedSchema.tipoColateralId
            };

            unuevasFactory.SaldoFinanciera(data).then(function(result) {
                if (result.data.length > 0) {
                    $scope.nombreFinanciera = result.data[0].nombrefinanciera;
                    $scope.saldofinanciera = result.data[0].monto - result.data[0].saldofinanciera;
                    $scope.idfinancierabp = result.data[0].idfinancierabp;
                    // if($scope.saldofinanciera-$scope.saldounidad<=0)
                    // {
                    //     for (var i = 0; i < $scope.lstNewUnits.length; i++) {
                    //         if($scope.lstNewUnits[i].CCP_IDDOCTO==$scope.unidad.CCP_IDDOCTO)
                    //         {
                    //             $scope.lstNewUnits[i].isChecked=false;
                    //         }
                    //     }
                    //     $scope.saldounidad=0;
                    //         swal("Aviso", "No puede seleccionar otra unidad ya que no tiene linea de crédito", "warning");

                    // }
                }

            }, function(error) {
                console.log("Error", error);
            });
        }
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
            $scope.lstNewUnits[index].montoFinanciar = ($scope.lstNewUnits[index].IMPORTE * (newValue / 100))
        // }
    }
    $scope.EvaluarUnidad = function(unidadin) {
        $scope.unidad = unidadin;


        $scope.saldounidad = 0;
        for (var i = 0; i < $scope.lstNewUnits.length; i++) {
            if ($scope.lstNewUnits[i].isChecked) {
                $scope.saldounidad = $scope.saldounidad + $scope.lstNewUnits[i].SALDO;
            }
        }
    }

});
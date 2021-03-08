appModule.controller('traspasoController', function($scope, $rootScope, $location, filterFilter, commonFactory, staticFactory, interesFactory, esquemaFactory, traspasoFactory) {
    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.dobleEstrella = false;
    $scope.sumarDias = function(fecha, dias) {
        fecha.setDate(fecha.getDate() + dias);
        return fecha;
    }

    var d = new Date();
    var f = $scope.sumarDias(d, 1);
    $scope.fechaPromesa = {
        pago: f.getFullYear() + "/" + ((f.getMonth() + 1) < 10 ? "0" + (f.getMonth() + 1) : (f.getMonth() + 1)) + "/" + f.getDate(),
        fijo: f.getFullYear() + "/" + ((f.getMonth() + 1) < 10 ? "0" + (f.getMonth() + 1) : (f.getMonth() + 1)) + "/" + f.getDate()
    }

    $scope.inicioTraspaso = function() {
        var valida = filterFilter($scope.lstNewUnits, { isChecked: true });

        var auxList = [];
        valida.forEach(function(item, key) {
            if (auxList.indexOf(item.financieraID) === -1) {
                auxList.push(item.financieraID);
            }
        });

        if (auxList.length === 1) {
            $scope.CurrentFinanciera = auxList[0];
            if ($scope.typeTraspaso == 3) {

                $scope.lstTraspasoFinanciera = filterFilter($scope.lstFinancial, { financieraID: '!' + $scope.CurrentFinanciera });
                $scope.lstFinancieraOrigen = filterFilter($scope.lstFinancial, { financieraID: $scope.CurrentFinanciera });
            } else {
                $scope.lstTraspasoFinanciera = $scope.lstFinancial;
                $scope.lstFinancieraOrigen = filterFilter($scope.lstFinancial, { financieraID: $scope.CurrentFinanciera });
                $scope.setCurrentFinance2($scope.lstFinancieraOrigen[0]);
            }


        } else {
            swal({
                title: "Traspaso entre Financieras",
                text: "Las unidades seleccionadas corresponden a más de una Financiera, asegurate de seleccionar unicamente de una sola."
            }, function() {
                location.reload();
            });
        }
    }
    $scope.setCurrentFinance2 = function(financialObj) {
        //  $scope.currentPanel = "pnlResumen";
        $rootScope.currentFinancialName2 = financialObj.nombre;
        $rootScope.currentFinancial2 = financialObj;
        $rootScope.currentSchemaName2 = 'Seleccione Esquema';
        $rootScope.currentSchema2 = [];

        // $scope.getNewUnitsBySucursal(sessionFactory.empresaID, $scope.currentSucursal.sucursalID);

        commonFactory.getSchemas(financialObj.financieraID).then(function(result) {
            $rootScope.lstSchemas = result.data;
        });
    };
    $scope.setTableStyle = function(tblID) {
        staticFactory.setTableStyleOne(tblID);
    };
    $scope.initTblSchemas = function() {
        $scope.setTableStyle('#tblSchemas');
    };
    $scope.modoTraspaso = null;
    $scope.setResetTable = function(tblID, display, length) {
        $('.' + tblID).DataTable().destroy();
        setTimeout(function() {
            staticFactory.filtrosTabla(tblID, display, length);
        }, 500);
    };
    $scope.setPanelResumen = function() {
        $scope.setResetTable('tblUnidadesNuevas2', 'Unidades Nuevas', 20);
        if ($scope.currentFinancial2 === undefined) {
            swal("Traspaso de Financiera", "Favor de seleccionar la financiera destino.");
        } else if ($scope.currentSchema2 === undefined) {
            swal("Traspaso de Financiera", "Favor de seleccionar el esque de la financiera.");
        } else if ($scope.currentFinancial2.length == 0) {
            swal("Traspaso de Financiera", "Favor de seleccionar la financiera destino.");
        } else if ($scope.currentSchema2.length == 0) {
            swal("Traspaso de Financiera", "Favor de seleccionar el esque de la financiera.");
        } else {
            traspasoFactory.traspasoFlujo($scope.lstFinancieraOrigen[0].financieraID, $scope.currentFinancial2.financieraID).then(function(respuesta) {
                $scope.modoTraspaso = respuesta.data;
                console.log("$scope.modoTraspaso", $scope.modoTraspaso);
                $scope.setPnlResumen();
            }, function(error) {
                $scope.error(error.data.Message);
            });

        }
    };

    $scope.setPanelInteres = function() {
        $scope.regresarTraspaso();
    };

    $scope.Traspaso = function(flujo) {
        if (flujo) {
            $scope.fnFechaPromesaPago();
            $scope.lstNewUnits.forEach(function(item, key) {
                $scope.lstNewUnits[key]["fechaPromesaPago"] = $scope.fechaPromesa.pago;
                $scope.lstNewUnits[key]["estatusPromesaPago"] = 1;
            });
            $("#mod-traspaso").modal('show');
        } else {
            swal({
                    title: "¿Esta seguro?",
                    text: "Se aplicará el traspaso para las unidades seleccionadas.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#21B9BB",
                    confirmButtonText: "Aplicar",
                    closeOnConfirm: false
                },
                function() {

                    if ($scope.typeTraspaso == 3) {

                        // var paraTraspaso = {
                        //     idUsuario: $scope.idUsuario,
                        //     idEmpresa: sessionFactory.empresaID,
                        //     idtipopoliza: 2 //cambio de financiera
                        // }

                        // traspasoFactory.traspasoFinanciera(paraTraspaso).then(function(respuesta) {
                        // $scope.LastId = respuesta.data[0].LastId;
                        $scope.lstUnitsTraspasos = filterFilter($scope.lstNewUnits, { isChecked: true });
                        $scope.guardaDetalle();
                        // }, function(error) {
                        //     $scope.error(error.data.Message);
                        // });
                    } else {
                        var paraTraspaso = {
                            idUsuario: $scope.idUsuario,
                            idEmpresa: sessionFactory.empresaID,
                            idtipopoliza: 9 //cambio de financiera
                        }

                        traspasoFactory.traspasoFinanciera(paraTraspaso).then(function(respuesta) {
                            $scope.LastId = respuesta.data[0].LastId;
                            $scope.lstUnitsTraspasos = filterFilter($scope.lstNewUnits, { isChecked: true });
                            $scope.guardaDetalleEsquema();
                        }, function(error) {
                            $scope.error(error.data.Message);
                        });
                    }

                }
            );
        }
    };

    $scope.LastId = 0;
    var contTraspadoDetalle = 0;
    $scope.guardaDetalle = function() {
        console.log($scope.dobleEstrella);
        var validacionEstrella = $scope.dobleEstrella == true ? 1 : 0;
        if (contTraspadoDetalle < $scope.lstUnitsTraspasos.length) {
            var item = $scope.lstUnitsTraspasos[contTraspadoDetalle];
            var paraTraspasoDetalle = {
                idEmpresa: sessionFactory.empresaID,
                idtipopoliza: 2,
                idmovimiento: item.movimientoID,
                idfinancieraO: $scope.lstFinancieraOrigen[0].financieraID,
                idEsquemaO: item.esquemaID,
                idfinancieraD: $scope.currentFinancial2.financieraID,
                idEsquemaD: $scope.currentSchema2.esquemaID,
                idUsuario: $scope.idUsuario,
                dobleEstrella: validacionEstrella
            }

            traspasoFactory.traspasoFinancieraDetalle(paraTraspasoDetalle).then(function(response) {
                if (response.length != 0) {
                    if (contTraspadoDetalle < $scope.lstUnitsTraspasos.length) {
                        contTraspadoDetalle++;
                        $scope.guardaDetalle();
                    }
                }
            }, function(error) {
                $scope.error(error.data.Message);
            });
        } else {
            // swal("Traspaso Plan Piso", "Se ha efectuado correctamente su traspaso.");
            traspasoFactory.procesaTraspaso($scope.LastId).then(function(response) {
                if (response.length != 0) {
                    swal({
                        title: "Traspaso Plan Piso",
                        text: "Se ha efectuado correctamente su traspaso.",
                        type: "warning"
                    }, function() {
                        location.reload();
                    });
                }
            }, function(error) {
                $scope.error(error.data.Message);
            });
        }
    }
    $scope.guardaDetalleEsquema = function() {
        if (contTraspadoDetalle < $scope.lstUnitsTraspasos.length) {
            var item = $scope.lstUnitsTraspasos[contTraspadoDetalle];
            var paraTraspasoDetalle = {
                idpoliza: $scope.LastId,
                idmovimiento: item.movimientoID,
                idfinancieraO: $scope.lstFinancieraOrigen[0].financieraID,
                idEsquemaO: item.esquemaID,
                idfinancieraD: $scope.currentFinancial2.financieraID,
                idEsquemaD: $scope.currentSchema2.esquemaID,
                idUsuario: $scope.idUsuario
            }

            traspasoFactory.traspasoEsquemaDetalle(paraTraspasoDetalle).then(function(response) {
                if (response.length != 0) {
                    if (contTraspadoDetalle < $scope.lstUnitsTraspasos.length) {
                        contTraspadoDetalle++;
                        $scope.guardaDetalleEsquema();
                    }
                }
            }, function(error) {
                $scope.error(error.data.Message);
            });
        } else {
            // swal("Traspaso Plan Piso", "Se ha efectuado correctamente su traspaso.");
            traspasoFactory.procesaTraspaso($scope.LastId).then(function(response) {
                if (response.length != 0) {
                    swal({
                        title: "Cambio de esquema Plan Piso",
                        text: "Se ha efectuado correctamente su operación.",
                        type: "warning"
                    }, function() {
                        location.reload();
                    });
                }
            }, function(error) {
                $scope.error(error.data.Message);
            });
        }
    }
    $scope.numAlert = 3;
    $scope.fnFechaPromesaPago = function() {
        var f_pago = $scope.fechaPromesa.pago.split("/");
        var fechauno = new Date(f_pago[0], (f_pago[1] - 1), f_pago[2]);

        var f_fijo = $scope.fechaPromesa.fijo.split("/");
        var fechados = new Date(f_fijo[0], (f_fijo[1] - 1), f_fijo[2]);

        if (fechauno < fechados) {
            $scope.numAlert = 1;

            $scope.lstNewUnits.forEach(function(item, key) {
                $scope.lstNewUnits[key]["estatusPromesaPago"] = 0;
            });
        } else if (fechauno > fechados) {
            $scope.numAlert = 3;

            $scope.lstNewUnits.forEach(function(item, key) {
                $scope.lstNewUnits[key]["estatusPromesaPago"] = 2;
            });
        } else {
            $scope.numAlert = 2;

            $scope.lstNewUnits.forEach(function(item, key) {
                $scope.lstNewUnits[key]["estatusPromesaPago"] = 1;
            });
        }

        $scope.lstNewUnits.forEach(function(item, key) {
            $scope.lstNewUnits[key]["fechaPromesaPago"] = $scope.fechaPromesa.pago;
        });
        $scope.flagInputFechaPromesa = false;
    }

    $scope.TraspasoFlujo = function() {
        swal({
                title: "¿Esta seguro?",
                text: "Se guardara el proceso para posteriormente aplicarse.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#21B9BB",
                confirmButtonText: "Aceptar",
                closeOnConfirm: false
            },
            function() {
                var paraTraspaso = {
                    idUsuario: $scope.idUsuario,
                    idEmpresa: sessionFactory.empresaID,
                    idFinancieraDestino: $scope.lstFinancieraOrigen[0].financieraID,
                    idFinancieraOrigen: $scope.currentFinancial2.financieraID,
                    flujo: $scope.numAlert
                }

                traspasoFactory.TraspasoFinancieraFlujo(paraTraspaso).then(function(respuesta) {
                    $scope.LastId = respuesta.data[0].LastId;
                    $scope.lstUnitsTraspasos = filterFilter($scope.lstNewUnits, { isChecked: true });
                    $scope.guardaDetalleFlujo();
                }, function(error) {
                    $scope.error(error.data.Message);
                });
            }
        );
    };

    $scope.guardaDetalleFlujo = function() {
        if (contTraspadoDetalle < $scope.lstUnitsTraspasos.length) {
            var item = $scope.lstUnitsTraspasos[contTraspadoDetalle];
            var paraTraspasoDetalle = {
                idTraspasoFinanciera: $scope.LastId,
                idEsquemaOrigen: item.esquemaID,
                idEsquemaDestino: $scope.currentSchema2.esquemaID,
                CCP_IDDOCTO: item.CCP_IDDOCTO,
                fechaPromesaPago: item.fechaPromesaPago
            }

            traspasoFactory.traspasoFinancieraDetalle(paraTraspasoDetalle).then(function(response) {
                if (response.length != 0) {
                    if (contTraspadoDetalle < $scope.lstUnitsTraspasos.length) {
                        contTraspadoDetalle++;
                        $scope.guardaDetalleFlujo();
                    }
                }
            }, function(error) {
                $scope.error(error.data.Message);
            });
        } else {
            swal({
                title: "Traspaso Plan Piso",
                text: "Se han cambiado correctamente las fechas promesa de pago.",
                type: "warning"
            }, function() {
                location.reload();
            });

            // swal("Traspaso Plan Piso", "Se han cambiado correctamente las fechas promesa de pago.");
            // traspasoFactory.procesaTraspaso($scope.LastId).then(function( response ) {
            //     if( response.length != 0 ){
            //         swal("Traspaso Plan Piso", "Se ha efectuado correctamente su traspaso.");
            //     }
            // }, function(error) {
            //     $scope.error(error.data.Message);
            // });
        }
    }

    $scope.flagInputFechaPromesa = false;
    $scope.showInputFechaPromesa = function() {
        $scope.flagInputFechaPromesa = true;
    }

    $scope.validaFechaPromesaRow = function(unidad, key) {
        console.log("unidad", unidad);
        console.log("key", key);



        var f_pago = unidad.fechaPromesaPago.split("/");
        var fechauno = new Date(f_pago[0], (f_pago[1] - 1), f_pago[2]);

        var f_fijo = $scope.fechaPromesa.fijo.split("/");
        var fechados = new Date(f_fijo[0], (f_fijo[1] - 1), f_fijo[2]);

        if (fechauno < fechados) { // Es menor la fecha uno
            console.log("Cosa", 1);
            $scope.lstNewUnits[key]["estatusPromesaPago"] = 0;
        } else if (fechauno > fechados) { // Es mayos la fecha uno comparado a la 2
            console.log("Cosa", 2);
            $scope.lstNewUnits[key]["estatusPromesaPago"] = 2;
        } else { // Es iguales las fechas
            console.log("Cosa", 3);
            $scope.lstNewUnits[key]["estatusPromesaPago"] = 1;
        }

        var estatus = {
            error: 0,
            success: 0,
            warning: 0
        }

        $scope.lstNewUnits.forEach(function(item) {
            if (item.isChecked) {
                switch (item.estatusPromesaPago) {
                    case 0:
                        estatus.error++;
                        break;
                    case 1:
                        estatus.success++;
                        break;
                    case 2:
                        estatus.warning++;
                        break;
                }
            }
        });

        if (estatus.error != 0) {
            $scope.numAlert = 1;
        } else if (estatus.warning != 0) {
            $scope.numAlert = 3;
        } else {
            $scope.numAlert = 2;
        }
        console.log("estatus", estatus);
        // $scope.lstNewUnits.forEach( function( item, key ){
        //     $scope.lstNewUnits[ key ]["fechaPromesaPago"] = $scope.fechaPromesa.pago;
        // });
        // $scope.lstNewUnits[ key ]["estatusPromesaPago"] = 1;
    }
    $scope.cambioEstrella = function() {
        $scope.dobleEstrella = !$scope.dobleEstrella;
    };

});



// $scope.lstNewUnits.forEach(function(item) {
//     if (item.isChecked === true) {
//         var data = {
//             CCP_IDDOCTO: item.CCP_IDDOCTO,
//             usuarioID: $scope.idUsuario,
//             empresaID: item.empresaID,
//             sucursalID: item.sucursalID,
//             financieraID: $scope.currentFinancial2.financieraID,
//             esquemaID: $scope.currentSchema2.esquemaID,
//             tipoMovimientoId: $scope.typeTraspaso //cambio financiera
//         };

//         traspasoFactory.setChangeSchema(data).then(function() {

//         }, function(error) {
//             $scope.error(error.data.Message);
//         });
//     }
// });
appModule.controller('polizaController', function ($scope, polizaFactory, staticFactory, interesFactory, commonFactory) {
    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.idUsuario = parseInt(localStorage.getItem("idUsuario"))
    $scope.session = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.lstPermisoBoton = JSON.parse(sessionStorage.getItem("PermisoUsuario"));
    $scope.currentEmpresa = $scope.session.nombre;
    $scope.topBarNav = polizaFactory.topNavBar();
    $scope.polizaApi = 0;
    console.log($scope.session)

    $scope.obtienePeriodosActivos = function () {
        var parametros = {
            idEmpresa: $scope.session.empresaID,
            periodo: undefined

        }
        polizaFactory.obtienePeriodosActivos(parametros).then(function (result) {
            if (result.data.length != 0) {
                $scope.lstPeriodos = result.data[1];
                $scope.setPeriodo($scope.lstPeriodos[0]);
            }
        });
    }

    commonFactory.getApiPermissions(sessionFactory.empresaID, 10).then(function (result) {
        if (result.data[0][0].estatus == 1 || result.data[0][0].estatus == 0)
            $scope.polizaApi = result.data[0][0].estatus;
        else if (auxApiPermission <= 2) {
            getApiPermissions();
            auxApiPermission++;
        } else {
            $scope.polizaApi = 2;
            alertFactory.error('Ocurrio un error, favor de reportar a sistemas');
        }
        if ($scope.polizaApi == 1) {
            polizaFactory.obtienePolizaApi({
                empresaID: sessionFactory.empresaID,
                periodo: 10
            }).then(function (result) {
                $scope.detalleApi = result.data;
                $scope.setResetTable('tblNormalesCancel', 'Cancelacion', 6);
            })
        } else if ($scope.polizaApi == 0) {
            $scope.obtienePeriodosActivos()
        }
    });
    $scope.setPeriodo = function (item) {
        // $scope.listUnidades = _.where($scope.lstNewUnits, { isChecked: true });
        $scope.currentPeriodo = item;
        $scope.currentNombrePeriodo = item.periodo;
        var parametros = {
            idEmpresa: $scope.session.empresaID,
            periodo: item.periodo

        }
        polizaFactory.obtienePeriodosActivos(parametros).then(function (result) {
            if (result.data.length != 0) {
                $scope.lstPendiente = result.data[0];
                $scope.setResetTable('tblNormalesCancel', 'Cancelacion', 6);

            }
        });

    };
    $scope.CancelaPoliza = function (item) {
        $scope.cancelarItem = item;
        interesFactory.fechaCierreMes(item.Referencia2, $scope.session.empresaID).then(function success(result) {
            console.log(result.data[0][0].FechaHoy, result.data[0][0].fecha, 'Soy la fecha de cierre de mes y la de hoy')
            $scope.fechaCierreMes = result.data[0][0].fecha;
            $scope.fechaDiaHoy = result.data[0][0].FechaHoy;
            if ($scope.fechaCierreMes != $scope.fechaDiaHoy) {
                $('#modalCierreMes').modal('show');
            } else {
                $scope.cancelar(item);
            }
        }, function error(err) {
            console.log('Ocurrió un error al obtener las fechas de cierre de mes')
        });
        // swal({
        //     title: "Compensación Plan Piso",
        //     text: "¿Desea cancelar la compensación?",
        //     showCancelButton: true,
        //     closeOnConfirm: true,
        //     showLoaderOnConfirm: true
        // }, function () {

        //     var parametros = {
        //         agencia:      item.agencia,
        //         documento:      item.documento,
        //         fechabusqueda:      item.fecha,
        //         horabusqueda:      item.hora

        //     }
        //     polizaFactory.CancelaPoliza(parametros).then(function(result) {
        //         swal("Aviso", "Se ha cancelado correctamente", "warning");
        //         var parametros = {
        //             idEmpresa:      $scope.session.empresaID,
        //             periodo: $scope.currentNombrePeriodo 

        //         }
        //         polizaFactory.obtienePeriodosActivos(parametros).then(function(result) {
        //             if( result.data.length != 0 ){
        //                 $scope.lstPendiente = result.data[0];
        //             }
        //         });
        //     }, function(error) {
        //         console.log("Error", error);
        //     });
        // });
    };
    $scope.cancelarConFecha = function (fecha) {
        $scope.fechaCompensacion = fecha;
        console.log(fecha, 'Soy la fecha que el usuario selecciono')
        $scope.mostrarMensajeFecha = '';
        if ($scope.fechaCierreMes != $scope.fechaDiaHoy && !fecha) {
            swal("Aviso", "Debe seleccionar una fecha", "warning");
        } else {
            $('#modalCierreMes').modal('hide');
            $scope.cancelar($scope.cancelarItem, fecha);
        }

    };
    $scope.cancelar = function (item, fecha) {
        console.log(item, fecha)
        swal({
            title: "Compensación Plan Piso",
            text: "¿Desea cancelar la compensación?",
            showCancelButton: true,
            closeOnConfirm: true,
            showLoaderOnConfirm: true
        }, function () {
            $('#mdlLoading').modal('show');
            if ($scope.polizaApi == 1) {
                $scope.CancelaPolizaApi(item, fecha);
            } {
                var parametros = {
                    agencia: item.agencia,
                    documento: item.documento,
                    fechabusqueda: item.fecha,
                    horabusqueda: item.hora,
                    fecha: fecha

                }
                polizaFactory.CancelaPoliza(parametros).then(function (result) {
                    //swal("Aviso", "Se ha cancelado correctamente", "warning");
                    $scope.fechaSeleccionada = undefined;
                    var parametros = {
                        idEmpresa: $scope.session.empresaID,
                        periodo: $scope.currentNombrePeriodo

                    }
                    polizaFactory.obtienePeriodosActivos(parametros).then(function (result) {
                        if (result.data.length != 0) {
                            $scope.lstPendiente = result.data[0];
                            $scope.setResetTable('tblNormalesCancel', 'Cancelacion', 6);
                        }
                        $('#mdlLoading').modal('hide');
                        swal("Aviso", "Se ha cancelado correctamente", "warning");
                    });
                }, function (error) {
                    console.log("Error", error);
                });
            }

        });
    }
    $scope.setResetTable = function (tblID, display, length) {
        staticFactory.setTableStyleClass('.' + tblID, display, length)
    };
    $scope.CancelaPolizaApi = function (api, fecha) {
        let jsonApi = JSON.parse(api.json)
        console.log(JSON.stringify(JSON.parse(api.json)))
        console.log(JSON.parse(jsonApi.jsonData))
        let jsonCompensacion = JSON.parse(jsonApi.jsonData);
        delete jsonCompensacion.Complemento;
        jsonCompensacion.Tipo = 9;
        jsonCompensacion.Contabilidad.Polizas[0].Proceso = 'D' + jsonCompensacion.Contabilidad.Polizas[0].Proceso;
        jsonCompensacion.Contabilidad.Polizas[0].Canal = 'D' + jsonCompensacion.Contabilidad.Polizas[0].Canal;
        if(fecha){
            jsonCompensacion.Contabilidad.Polizas[0].Fecha = fecha;
            jsonCompensacion.Contabilidad.Polizas[0].FechaRealPago = fecha;
        }
        console.log(jsonCompensacion)

        jsonCompensacion.CancelaComplemento = [];
        interesFactory.getDetallePoliza(api.transaccion, api.IdDealer).then(function (respuesta) {
            console.log(respuesta);
            $('#mdlLoading').modal('hide');
            switch (respuesta.data.status) {
                case 'COMPLETO':
                    let complementos = JSON.parse(respuesta.data.jsonData)
                    angular.forEach(complementos.complementoResponse.ComplementosPago, function (value, key) {
                        console.log(value, key)
                        jsonCompensacion.CancelaComplemento.push({
                            "Partida": key + 1,
                            "Recibo": value.ComplementoPago,
                            "Motivo": 2
                        })
                    });
                    if (complementos.ordenCompraResponse) {
                        jsonCompensacion.CancelarOrdenCompra = {
                            IdDocumento: complementos.ordenCompraResponse.OrdenPedidoVario
                        }
                        delete jsonCompensacion.OrdenCompra;
                    }

                    console.log(jsonCompensacion)
                    let messageWithQuotes = JSON.stringify(jsonCompensacion)
                    let jsonApi = {
                        "Proceso": "PLANPISO",
                        "jsonData": messageWithQuotes
                    }
                    console.log(jsonApi)
                    interesFactory.saveApiPoliza(api.Referencia2, api.movimientoID, jsonApi, api.IdDealer).then(function success(resultApi) {
                        console.log(resultApi)
                        if (resultApi.data[0].respuesta == 1) {
                            swal("Éxito", "Se esta procesando su póliza.", "success");
                            setTimeout(function () {
                                window.location = "/interes";
                            }, 1000);
                        }
                    }, function error(error) {
                        console.log(error, 'Error al tratar de consumir la API ')
                    })
                    break;
                case 'PROCESANDO':
                    swal({
                        title: "Póliza en proceso",
                        text: "¡No puede cancelar, aun se esta procesando!",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "Cerrar"
                    }, function () {

                    });
                    break;
                case 'ERROR':
                    swal({
                        title: "Ocurrio un problema",
                        text: ' ',
                        type: "warning",
                        showCancelButton: true,
                        closeOnConfirm: true,
                        cancelButtonText: "Cerrar"
                    }, function () {
                        $scope.lstNewUnits.forEach(function (item) {
                            if (item.movimientoID == unidad.movimientoID) {
                                item.isChecked = true;
                            }
                        });
                        $scope.callCompensation();
                    });
                    break;
                default:
                    console.log('Ocurrio un error al intentar consultar el estatus de la poliza', respuesta.data[0]);
            }

        },
            function (error) {
                console.log(error);
            });
    }

});
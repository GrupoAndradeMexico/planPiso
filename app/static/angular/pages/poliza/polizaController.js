appModule.controller('polizaController', function($scope, polizaFactory, staticFactory, interesFactory) {

    $scope.idUsuario = parseInt(localStorage.getItem("idUsuario"))
    $scope.session = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.lstPermisoBoton = JSON.parse(sessionStorage.getItem("PermisoUsuario"));
    $scope.currentEmpresa = $scope.session.nombre;
    $scope.topBarNav = polizaFactory.topNavBar();
    console.log($scope.session)

    $scope.obtienePeriodosActivos = function() {
        var parametros = {
            idEmpresa: $scope.session.empresaID,
            periodo: undefined

        }
        polizaFactory.obtienePeriodosActivos(parametros).then(function(result) {
            if (result.data.length != 0) {
                $scope.lstPeriodos = result.data[1];
                $scope.setPeriodo($scope.lstPeriodos[0]);
            }
        });
    }


    $scope.setPeriodo = function(item) {
        // $scope.listUnidades = _.where($scope.lstNewUnits, { isChecked: true });
        $scope.currentPeriodo = item;
        $scope.currentNombrePeriodo = item.periodo;
        var parametros = {
            idEmpresa: $scope.session.empresaID,
            periodo: item.periodo

        }
        polizaFactory.obtienePeriodosActivos(parametros).then(function(result) {
            if (result.data.length != 0) {
                $scope.lstPendiente = result.data[0];
                $scope.setResetTable('tblNormalesCancel', 'Cancelacion', 6);

            }
        });

    };
    $scope.CancelaPoliza = function(item) {
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
    $scope.cancelarConFecha = function(fecha) {
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
    $scope.cancelar = function(item, fecha) {
        console.log(item, fecha)
        swal({
            title: "Compensación Plan Piso",
            text: "¿Desea cancelar la compensación?",
            showCancelButton: true,
            closeOnConfirm: true,
            showLoaderOnConfirm: true
        }, function() {
            $('#mdlLoading').modal('show');
            var parametros = {
                agencia: item.agencia,
                documento: item.documento,
                fechabusqueda: item.fecha,
                horabusqueda: item.hora,
                fecha: fecha

            }
            polizaFactory.CancelaPoliza(parametros).then(function(result) {
                //swal("Aviso", "Se ha cancelado correctamente", "warning");
                $scope.fechaSeleccionada = undefined;
                var parametros = {
                    idEmpresa: $scope.session.empresaID,
                    periodo: $scope.currentNombrePeriodo

                }
                polizaFactory.obtienePeriodosActivos(parametros).then(function(result) {
                    if (result.data.length != 0) {
                        $scope.lstPendiente = result.data[0];
                        $scope.setResetTable('tblNormalesCancel', 'Cancelacion', 6);
                    }
                    $('#mdlLoading').modal('hide');
                    swal("Aviso", "Se ha cancelado correctamente", "warning");
                });
            }, function(error) {
                console.log("Error", error);
            });
        });
    }
    $scope.setResetTable = function(tblID, display, length) {
        staticFactory.setTableStyleClass('.' + tblID, display, length)
    };
});
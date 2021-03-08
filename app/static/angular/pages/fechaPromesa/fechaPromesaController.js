appModule.controller('fechaPromesaController', function($scope, $rootScope, $location, $filter, fechaPromesaFactory, commonFactory, staticFactory, alertFactory) {
    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.idUsuario = localStorage.getItem("idUsuario");
    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.topBarNav = staticFactory.fechaPromesaBar();
    $scope.currentSucursalName = "Seleccione una sucursal";
    $scope.financieraSeleccionada = false;
    commonFactory.getSucursal(sessionFactory.empresaID, $scope.idUsuario).then(function(result) {
        $scope.lstSucursal = result.data;
    });
    $scope.setCurrentSucursal = function(sucursal) {
        console.log(sucursal);
        $scope.financieraSeleccionada = false;
        $scope.currentSucursalName = sucursal.nombreSucursal;
        commonFactory.getFinancial(sessionFactory.empresaID, $scope.idUsuario).then(function success(result) {
            $scope.nombreFinanciera = 'Seleccione Financiera';
            $scope.financieras = result.data;
            console.log(result.data);
        }, function error(err) {
            console.log(err, 'No se pudo obtener las financieras')
        });
        // commonFactory.getFinancieraSucursal(sessionFactory.empresaID, sucursal.sucursalID).then(function success(result) {
        //     $scope.nombreFinanciera = 'Seleccione Financiera';
        //     $scope.financieras = result.data;
        //     console.log(result.data);
        // }, function error(err) {
        //     console.log(err, 'No se pudo obtener las financieras')
        // });
    };
    $scope.seleccionFinanciera = function(financiera) {
        $scope.nombreFinanciera = financiera.nombre;
        $scope.financiera = financiera;
        $scope.financieraSeleccionada = true;
    };
    $scope.getCartera = function() {
        getCarteras(0);
    };
    $scope.getCarteraVencida = function() {
        getCarteras(1);
    };
    var getCarteras = function(tipoCartera) { // 0 Toda la cartera 1 Cartera Vencida
        fechaPromesaFactory.getCartera(sessionFactory.empresaID, $scope.financiera.financieraIDBP, tipoCartera).then(function success(result) {
            console.log(result.data);
            $scope.carteras = result.data;
            staticFactory.setTableStyleFechaPromesa('#carteras')
        }, function error(err) {
            console.log('Ocurrio un error al tratar de obtener la cartera', err);
        });
    };
    $scope.select = function(item) {
        item.seleccionada == false || item.seleccionada == undefined ? item.seleccionada = true : item.seleccionada = false;
    };
    $scope.SeleccionarTodo = function() {
        if ($scope.seleccionarTodo == true) {
            var table = $('#carteras').DataTable();
            var rowSelected = table.rows({ search: 'applied' }).data();
            var cartera = '';
            angular.forEach(rowSelected, function(value, key) {
                cartera = value[0];
                angular.forEach($scope.carteras, function(value, key) {
                    if (value.pbp_consCartera == cartera) {
                        value.seleccionada = true;
                    }
                });

            });
        } else if ($scope.seleccionarTodo == false) {
            angular.forEach($scope.carteras, function(value, key) {
                value.seleccionada = false;
            });
        }
        console.log($scope.carteras);
    };
    $scope.MostrarMensaje = function(item) {
        var fechauno = new Date();
        var fechados = new Date(fechauno);
        var resultado = fechauno.getTime() === fechados.getTime();
        var hoy = new Date();
        var nuevaHoy = zeroFill(hoy.getDate(), 2) + '/' + zeroFill(hoy.getMonth(), 2) + '/' + hoy.getFullYear();

        // var fechaSeleccionada = new Date($scope.fechaPromesa);
        console.log(zeroFill(hoy.getDate(), 2) + '/' + zeroFill(hoy.getMonth(), 2) + '/' + hoy.getFullYear(), 'Fecha Hoy')
        console.log($scope.fechaPromesa, 'Fecha Promesa')
        if ($scope.fechaPromesa < nuevaHoy) {
            swal("Aviso", "Debe seleccionar una fecha mayor al dia de hoy", "warning");
            // alertFactory.warning("Debe seleccionar una fecha mayor al dia de hoy");
        } else {
            swal({
                title: "¿Esta seguro?",
                text: "Se cambiara la fecha promesa de pago a los documentos seleccionados.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#21B9BB",
                confirmButtonText: "Aplicar",
                closeOnConfirm: false
            }, function() {
                var selectedRows = $filter("filter")($scope.carteras, {
                    seleccionada: true
                }, true);
                var seleccionR = '';
                $scope.selectedRows = selectedRows;
                if (!$scope.selectedAll) {
                    $scope.selectedAll = $scope.selectedRows;
                } else {
                    angular.forEach($scope.selectedRows, function(value, key) {
                        seleccionR = $scope.selectedAll.find(cartera);

                        function cartera(car) {
                            return car.pbp_consCartera == value.pbp_consCartera;
                        };
                        if (!seleccionR) {
                            $scope.selectedAll.push(value)
                        }
                        seleccionR = '';

                    });
                }
                if ($scope.selectedRows.length === 0) {
                    swal("Aviso", "Debe seleccionar al menos un registro", "warning");
                    // alertFactory.warning("Debe seleccionar al menos un registro");
                } else {
                    var promises = [];
                    $scope.selectedRows.map((value) => {

                        // Calling the async function timeout(), so  
                        // at this point the async function has started 
                        // and enters the 'pending' state  
                        // pushing the pending promise to an array. 
                        promises.push(fechaPromesaFactory.pushCartera(value.pbp_consCartera, sessionFactory.empresaID, $scope.fechaPromesa, value.pbp_polAnnio, value.pbp_documento));
                    })
                    Promise.all(promises).then(function response(result) {
                        console.log(result);
                        swal({
                            title: "Éxito",
                            text: "Se cambiaron correctamente las fechas promesas de pago.",
                            type: "success",
                            showCancelButton: true,
                            confirmButtonColor: "#21B9BB",
                            confirmButtonText: "OK",
                            closeOnConfirm: true
                        }, function() {
                            $scope.fechaPromesa = '';
                            $scope.getCartera(0);
                        });
                    }).catch(error => console.log('Ocurrio un error al cambiar la fecha promesa' + error))
                    // Promise.all throws an error. 
                    // angular.forEach($scope.selectedRows, function(value, key) {
                    //     admonCarteraRepository.pushCartera(value.pbp_consCartera, $rootScope.datosEmpresa.emp_idempresa, $rootScope.fechaPromesaPago, value.pbp_polAnnio).then(function(result) {

                    //         $scope.respuesta = result.data[0];
                    //     });
                    // });
                    // setTimeout(function() {
                    //     $('#modalAdminCartera').modal('hide')
                    //     alertFactory.success("Se realizó la operación correctamente ");
                    //     $scope.buscaCartera();
                    // }, 1000)
                }
            });
        }

        function zeroFill(number, width) {
            width -= number.toString().length;
            if (width > 0) {
                return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
            }
            return number + "";
        }

    };
});
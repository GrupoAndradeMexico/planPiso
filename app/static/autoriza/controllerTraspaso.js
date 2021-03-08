var appModule = angular.module("planPisoApp",[]);
appModule.controller('traspasoController', function($scope, $http, filterFilter ) {
    var Token = window.location.hash.substr(1);
    var array = Token.split("|");
    Token = array[0]

    $http({
        method: 'GET',
        url: '../apiTraspaso/TraspasoDetalleAutoriza',
        params: { 
                token: Token
            }
    }).then(function successCallback(response) {
        $scope.Data = response.data;
        $scope.Registros = $scope.Data[1];
        $scope.idTraspasoFinanciera = $scope.Data[0][0].idTraspasoFinanciera;
    });

    $scope.validaFechaPromesaRow = function( item, index ){
        var valor = $(".item_" + index).val();
        $scope.Registros[ index ].fechaPromesaPago = valor;

        var f_pago = $scope.Registros[ index ].fechaPromesaPago.split("/");
        var fechauno  = new Date( f_pago[0], (f_pago[1] - 1), f_pago[2] );

        var f_fijo = $scope.Registros[ index ].fechaPormesa.split("/");
        var fechados  = new Date( f_fijo[0], (f_fijo[1] - 1), f_fijo[2] );

        if( fechauno < fechados ){
            item.icon_status = 0;
        }
        else if( fechauno > fechados ){
            item.icon_status = 2;
        }
        else{
            item.icon_status = 1;
        }
    }

    $scope.cancelar = function(){
        swal({
            title: "Traspasos Plan Piso",
            text: "¿Esta seguro de declinar la solicitud?",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
            cancelButtonText: "Cerrar",
            confirmButtonText: "Si, estoy seguro!"
        }, function () {
            $http({
                method: 'GET',
                url: '../apiTraspaso/cancelaTraspasoConFlujo',
                params: { 
                        idTraspaso: $scope.idTraspasoFinanciera
                    }
            }).then(function successCallback(response) {
                swal({
                    title: "Traspasos Plan Piso",
                    text: "Se ha rechazado correctamente la solicitud.",
                    type: "warning"
                }, function(){
                    location.reload();
                });
            });
        });
    }

    $scope.aceptar = function(){
        swal({
            title: "Traspasos Plan Piso",
            text: "¿Estas seguro de confirmar el cambio de fecha promesa de pago?",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
            cancelButtonText: "Cerrar",
            confirmButtonText: "Si, estoy seguro!"
        }, function () {

            var resultados = {sincambios: 0, error: 0, update: 0 }
            $scope.Registros.forEach( function( item, key ){
                switch( parseInt( item.icon_status ) ){
                    case 0:
                        resultados.error++;
                        break;
                    case 1:
                        resultados.sincambios++;
                        break;
                    case 2:
                        resultados.update++;
                        break;
                }
            });

            if( resultados.error != 0 ){
                setTimeout( function(){
                    swal({
                        title: "Traspasos Plan Piso",
                        text: "Se han encontrado al menos una fecha no permitida, asegurate que las fechas sea correctas para su procesamiento.",
                        type: "warning",
                        closeOnConfirm: true
                    });
                }, 500 );
            }
            else if( resultados.update != 0 ){
                $scope.actualizaFechaEnPlanPiso();
            }
            else{
                $scope.CambioFECHPROMPAGBPRO();
            }
        });
    }

    $scope.contaUpdate = 0;
    $scope.actualizaFechaEnPlanPiso = function(){
        if( $scope.contaUpdate <= ( $scope.Registros.length - 1 ) ){
            var item = $scope.Registros[ $scope.contaUpdate ];
            if ( item.icon_status == 2 ) {
                $http({
                    method: 'GET',
                    url: '../apiTraspaso/ActualizaFechaPP',
                    params: {
                            fecha: item.fechaPromesaPago,
                            idTraspaso: item.idTraspasoFinancieraDetalle
                        }
                }).then(function successCallback(response) {
                    console.log( "response", response );
                });
            }
            $scope.contaUpdate++;
            $scope.actualizaFechaEnPlanPiso();
        }
        else{
            $scope.CambioFECHPROMPAGBPRO();
        }
    }

    $scope.CambioFECHPROMPAGBPRO = function(){
        $http({
            method: 'GET',
            url: '../apiTraspaso/CambioFECHPROMPAGBPRO',
            params: { 
                    idTraspaso: $scope.idTraspasoFinanciera
                }
        }).then(function successCallback(response) {
            swal({
                title: "Conciliación Plan Piso",
                text: "Se ha aceptado correctamente la solicitud.",
                type: "success"
            }, function(){
                location.reload();
            });
        });
    }
});
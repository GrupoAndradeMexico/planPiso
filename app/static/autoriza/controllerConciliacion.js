var appModule = angular.module("planPisoApp",[]);
appModule.controller('conciliacionController', function($scope, $http, filterFilter ) {
    var Token = window.location.hash.substr(1);

    $http({
        method: 'GET',
        url: '../apiConciliacion/autorizadorDetalle',
        params: { 
                token: Token
            }
    }).then(function successCallback(response) {
        $scope.dataAut = response.data;

        $http({
            method: 'GET',
            url: '../apiConciliacion/getConciliacion',
            params: { 
                    periodo: $scope.dataAut.periodoContable, 
                    consecutivo: $scope.dataAut.consecutivo,
                    financiera: $scope.dataAut.idFinanciera
                }
        }).then(function successCallback(response) {
            $scope.lstConceal = response.data;
        });
    });

    $scope.cancelar = function(){
        swal({
            title: "Conciliación Plan Piso",
            text: "¿Esta seguro de declinar la solicitud?",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
            cancelButtonText: "Cerrar",
            confirmButtonText: "Si, estoy seguro!"
        }, function () {
            $http({
                method: 'GET',
                url: '../apiConciliacion/autorizaConciliacion',
                params: { 
                        token: Token, 
                        autoriza: 0,
                        idUsuario: 0
                    }
            }).then(function successCallback(response) {
                swal({
                    title: "Conciliación Plan Piso",
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
            title: "Conciliación Plan Piso",
            text: "¿Estas seguro de omitir las unidades?",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
            cancelButtonText: "Cerrar",
            confirmButtonText: "Si, estoy seguro!"
        }, function () {
            $http({
                method: 'GET',
                url: 'apiConciliacion/autorizaConciliacion',
                params: { 
                        token: Token, 
                        autoriza: 1,
                        idUsuario: 0
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
        });
    }
});
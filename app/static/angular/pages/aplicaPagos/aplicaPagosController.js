appModule.controller('aplicaPagosController', function($scope, $rootScope, $location, commonFactory, staticFactory, aplicaPagosFactory, utils, crealoteFactory, alertFactory) {

    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.idUsuario = localStorage.getItem("idUsuario");
    $scope.topBarNav = staticFactory.polizasBar();
    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.lstPayTypes = [];
    $scope.lstUnitsPending = [];
    $scope.lstUnitsApply = [];
    $scope.lstUnitDeatil = [];
    $scope.objEdit = { visible: false };
    $scope.currentPanel = 'pnlPendientes';
    $scope.currentPayName = 'polizass Pendiente';
    $scope.showDropDown = true;

    $scope.fechaInicio = new Date();
    console.log($scope.fechaInicio);
    $scope.fechaInicio = zfill($scope.fechaInicio.getDate(), 2) + '/' + zfill(($scope.fechaInicio.getMonth() + 1), 2) + '/' + $scope.fechaInicio.getFullYear();
    $scope.fechaFin = new Date();
    $scope.fechaFin = zfill($scope.fechaFin.getDate(), 2) + '/' + zfill(($scope.fechaFin.getMonth() + 1), 2) + '/' + $scope.fechaFin.getFullYear();

    function zfill(number, width) {
        var numberOutput = Math.abs(number); /* Valor absoluto del número */
        var length = number.toString().length; /* Largo del número */
        var zero = "0"; /* String de cero */

        if (width <= length) {
            if (number < 0) {
                return ("-" + numberOutput.toString());
            } else {
                return numberOutput.toString();
            }
        } else {
            if (number < 0) {
                return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
            } else {
                return ((zero.repeat(width - length)) + numberOutput.toString());
            }
        }
    }
    $scope.buscarLotes = function() {
        var consultaLote = {
            'fechaInicio': $scope.fechaInicio,
            'fechaFin': $scope.fechaFin,
            'idUsuario': $scope.idUsuario,
            'idEmpresa': sessionFactory.empresaID
        };
        console.log(consultaLote, 'Lo que enviare al SP ');
        aplicaPagosFactory.buscarLotes(consultaLote).then(function success(result) {
            $scope.lotes = result.data;

            console.log(result, 'Es lo que viene en la consulta');
        }, function error(err) {
            console.log('Ocurrio un error al intentar traer la consulta de los lotes')
        });
    };
    $scope.detalleLote = function(lote) {
        console.log(lote, 'Soy el lote');
        aplicaPagosFactory.detalleLote(lote.idLotePago).then(function success(result) {
            console.log(result.data, 'Es el detalle del lote');
            $scope.detalleDelLote = result.data;
            $('#modalDetalleLote').modal('show');
        }, function error(err) {
            console.log('Ocurrio un error al intentar traer el detalle del lote');
        });
    };
    $scope.sacarPlanPiso = function(lote){
        aplicaPagosFactory.sacarPlanPiso(lote.idLotePago, $scope.idUsuario).then(function success(result){
            console.log(result.data, 'Soy la respuesta al sacar la unidad de plan piso')
            $scope.documentosAplicados = result.data;
            $('#modalDetalleAplicado').modal('show');
        }, function error(err){
            console.log('Ocurrio un error al tratar de sacar las unidades de plan piso')
        });
    };
    $scope.agregaIntereses = function(lote){
        var idLote = lote.idLotePago;
        $('#mdlLoading').modal('show');
        crealoteFactory.actualizarCartera(sessionFactory.empresaID).then(function success(result) {
            console.log(result.data);
            $('#mdlLoading').modal('hide');
            aplicaPagosFactory.agregaIntesesLote(idLote).then(function success(result){
                console.log(result.data);
                 alertFactory.success('Se actualizo correctamente');
                 $scope.buscarLotes();
            }, function error(err){
                console.log('Ocurrio un error al intentar agregar los documentos de los intereses')
            });
            // alertFactory.success('Se actualizo correctamente');
        }, function error(err) {
            $('#mdlLoading').modal('hide');
            console.log('Error al actualizar Cartera', err)
        });
    };
    $scope.detalleBitacora = function(lote){
        // $('#mdlLoading').modal('show');
        aplicaPagosFactory.detalleBitacora(lote.idLotePago).then(function success(result){
            // $('#mdlLoading').modal('hide');
            console.log(result.data);
            $scope.interesesBitacora = result.data;
            $('#modalDetalleInteres').modal('show');
        }, function error(err){
            // $('#mdlLoading').modal('hide');
            console.log('Ocurrio un problema al intentar obtener el detalle de la bitacora de los intereses');
        });
    };
});
appModule.controller('tiieController', function($scope, $rootScope, $location, commonFactory, staticFactory, tiieFactory) {
    var sessionFactory      = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.lstPermisoBoton      = JSON.parse(sessionStorage.getItem("PermisoUsuario"));
    
    $scope.idUsuario        = localStorage.getItem("idUsuario");
    $scope.currentEmpresa   = sessionFactory.nombre;

    $scope.topBarNav        = staticFactory.tiieBar();
    var today               = staticFactory.todayDate();
    $scope.currentPanel     = 'pnlTiie';
    $scope.lstTiie          = [];
    $rootScope.currentTIIEData  = {};
    $scope.MuestraAgregar=false;

    setTimeout( function(){
        console.log("rootScope", $rootScope.currentTIIEData);
    }, 2000);
    

    $scope.Init = function(){
        var valor=_.where($scope.lstPermisoBoton, { idModulo: 14,Boton: "agregar" })[0];
        $scope.MuestraAgregar=valor != undefined;
        tiieFactory.getTiie().then(function(result) {
            $scope.lstTiie = result.data;
        });
    }    

    $scope.checkTiie = function() {
        var date = staticFactory.toISODate($rootScope.tiieFields.date);

        tiieFactory.getTiieDateExist(date).then(function(result) {
            console.log( "tiie agregado", result );
            var exist = result.data[0].result;
            if (exist == 1) {
                console.log( result.data[0].idTIIE );
                $scope.actualizaTiie( parseInt( result.data[0].idTIIE ) );
                // swal('Aviso', 'La fecha para esta TIIE ya existe.', 'warning');
            } else {
                $scope.insertTiie(date);
            }
            
            $scope.Init();
            $rootScope.currentTIIE();
        });
    };

    $scope.insertTiie = function(date) {
        var params = {
            fecha: date,
            porcentaje: $rootScope.tiieFields.percent,
            userID: 0
        };

        tiieFactory.insertTiie(params).then(function(result) {
            swal('Aviso', 'Tiie Agregada con exito', 'success');
        });
    };

    $scope.actualizaTiie = function( idTIIE ) {
        var params = {
            idTIIE:     idTIIE,
            porcentaje: $rootScope.tiieFields.percent
        };

        tiieFactory.actualizaTiie( params ).then(function(result) {
            swal('Aviso', 'Tiie Actualizado con exito', 'success');
        });
    };

    $scope.setTableStyle = function(tableID) {
        setTimeout( function(){
            staticFactory.setTableStyleOne(tableID);
            $scope.setStyle();
        }, 500)
    };

    $scope.setStyle = function() {
        staticFactory.setCalendarStyle();
        // $scope.tiieFields.date = today;
        console.log("done");
    };
});
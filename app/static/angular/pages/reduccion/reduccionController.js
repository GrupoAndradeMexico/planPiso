appModule.controller('reduccionController', function($scope, $rootScope, $location, commonFactory, staticFactory, reduccionFactory, filterFilter) {
    var sessionFactory      = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.idUsuario        = localStorage.getItem("idUsuario");
    $scope.currentEmpresa   = sessionFactory.nombre;

    $scope.topBarNav        = staticFactory.tiieBar();
    var today               = staticFactory.todayDate();
    $scope.filterStarus     = 1;

    $scope.lstEsquemas      = [];
    $scope.cantStatus       = { porvencer: 0, vencido: 0, vigente: 0 };

    $scope.OnInit = function(){
        $scope.getEsquema();
    }

    $scope.getEsquema = function(){
        reduccionFactory.getEsquema( 1 ).then(function(result) {
            $scope.lstEsquemas = result.data;

            var aux0 = 0,
                aux1 = 0,
                aux2 = 0;

            filterFilter($scope.lstEsquemas, { estatus: 0 }).forEach(function( item ){
                aux0 = aux0 + parseInt( item['TotalDocumentos'] );
            })

            filterFilter($scope.lstEsquemas, { estatus: 1 }).forEach(function( item ){
                aux1 = aux1 + parseInt( item['TotalDocumentos'] );
            })

            filterFilter($scope.lstEsquemas, { estatus: 2 }).forEach(function( item ){
                aux2 = aux2 + parseInt( item['TotalDocumentos'] );
            })

            $scope.cantStatus['vencido']    = aux0;
            $scope.cantStatus['porvencer']  = aux1;
            $scope.cantStatus['vigente']    = aux2;
        });
    }

    $scope.setStatusFilter = function( status ){
        $scope.filterStarus = status;
    }
    // $rootScope.currentTIIEData  = {};

    // setTimeout( function(){
    //     console.log("rootScope", $rootScope.currentTIIEData);
    // }, 2000);
    

    // $scope.Init = function(){
    //     reduccionFactory.getTiie().then(function(result) {
    //         $scope.lstTiie = result.data;
    //     });
    // }    

    // $scope.checkTiie = function() {
    //     var date = staticFactory.toISODate($rootScope.tiieFields.date);

    //     reduccionFactory.getTiieDateExist(date).then(function(result) {
    //         console.log( "tiie agregado", result );
    //         var exist = result.data[0].result;
    //         if (exist == 1) {
    //             console.log( result.data[0].idTIIE );
    //             $scope.actualizaTiie( parseInt( result.data[0].idTIIE ) );
    //             // swal('Aviso', 'La fecha para esta TIIE ya existe.', 'warning');
    //         } else {
    //             $scope.insertTiie(date);
    //         }
            
    //         $scope.Init();
    //         $rootScope.currentTIIE();
    //     });
    // };

    // $scope.insertTiie = function(date) {
    //     var params = {
    //         fecha: date,
    //         porcentaje: $rootScope.tiieFields.percent,
    //         userID: 0
    //     };

    //     reduccionFactory.insertTiie(params).then(function(result) {
    //         swal('Aviso', 'Tiie Agregada con exito', 'success');
    //     });
    // };

    // $scope.actualizaTiie = function( idTIIE ) {
    //     var params = {
    //         idTIIE:     idTIIE,
    //         porcentaje: $rootScope.tiieFields.percent
    //     };

    //     reduccionFactory.actualizaTiie( params ).then(function(result) {
    //         swal('Aviso', 'Tiie Actualizado con exito', 'success');
    //     });
    // };

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
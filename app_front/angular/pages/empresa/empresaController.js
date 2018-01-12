appModule.controller('empresaController', function($scope, $rootScope, $location, commonFactory, staticFactory, empresaFactory) {
    sessionStorage.removeItem("sessionFactory");
    $scope.lstEmpresa = [];

    empresaFactory.getEmpresa().then(function(result) {

        var rowNumber = result.data.length;
        var extraRow = 0;

        if (rowNumber <= 4) {
            extraRow = 4 - rowNumber;
        } else if ((rowNumber % 4) == 0) {
            extraRow = 0;
        } else {
            extraRow = 4 - (rowNumber % 4);
        }

        for (var i = 0; i < extraRow; i++) {
            var objEmpresa = { empresaID: '', nombre: '', nombreCorto: '', hide: true };
            result.data.push(objEmpresa);
        }

        var fixedRows = (result.data.length / 4);

        for (var i = 0; i < fixedRows; i++) {

            var rowEmpresa = {
                column1: result.data[i * 4],
                column2: result.data[1 + (i * 4)],
                column3: result.data[2 + (i * 4)],
                column4: result.data[3 + (i * 4)]
            };

            $scope.lstEmpresa.push(rowEmpresa);
        }

    });


    $scope.setEmpresa = function(objEmpresa) {
        sessionStorage.setItem("sessionFactory", JSON.stringify(objEmpresa));
        // window.location = "/unuevas";
    };


    // $scope.test = function() {
    //     staticFactory.message();
    // };




});
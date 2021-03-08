appModule.controller('dashboardController', function($scope, $rootScope, $location, commonFactory, staticFactory, dashboardFactory) {


    $scope.lstFinancieras = [];

    dashboardFactory.getDashboard(1).then(function(result) {
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
            var objFinanciera = {
                
                empresaID: 0,
                financieraID: 0,
                nombreFinanciera: '',
                unidades: 0,
                InteresCortePagado: 0,
                InteresMesActual: 0,
                InteresAcumuladoFinanciera: 0,
                InteresTotal: 0,
                hide: true
            };

            result.data.push(objFinanciera);
        }

        var fixedRows = (result.data.length / 4);

        for (var i = 0; i < fixedRows; i++) {

            var rowFinanciera = {
                column1: result.data[i * 4],
                column2: result.data[1 + (i * 4)],
                column3: result.data[2 + (i * 4)],
                column4: result.data[3 + (i * 4)]
            };

            $scope.lstFinancieras.push(rowFinanciera);
        }


        console.log($scope.lstFinancieras);
    });




});
appModule.controller('tiieInfo', function($scope, $rootScope, $location, commonFactory, staticFactory, tiieFactory) {
	$scope.warning 				= false;
	$rootScope.tiieFields       = { date: null, percent: 0 };

	$rootScope.currentTIIE = function(){
		commonFactory.currentTIIE().then(function(result) {
	        var response 				= result.data[0];
	        $rootScope.currentTIIEData	= response;

	        if( response.success == 1 ){
	        	$scope.warning = false;
	        }
	        else{
	        	$scope.warning = true;
	        }
	        $rootScope.tiieFields.percent = response.Tiie;
	    });
	    $rootScope.tiieFields.date		 = $scope.fechaActual();
	}

	$scope.fechaActual = function(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        } 

        if(mm<10) {
            mm = '0'+mm
        } 

        today = dd + '/' + mm + '/' + yyyy;
        return today;
    }

	$rootScope.currentTIIE();
})
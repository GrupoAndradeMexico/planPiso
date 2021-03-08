appModule.factory('templateFactory', function($http) {
    return {        
        gettemplate: function() {
            return $http({
                url: 'apiTemplate/getTemplate',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };

});

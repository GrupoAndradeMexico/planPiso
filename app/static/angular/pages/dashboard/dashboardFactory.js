var dashboardUrl = global_settings.urlCORS + 'api/apiDashboard/';
appModule.factory('dashboardFactory', function($http) {
    return {
        getDashboard: function(empresaID) {
            return $http({
                url: dashboardUrl + 'Dashboard',
                method: "GET",
                params: { empresaID: empresaID },
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };

});
var ApiDashboardView = require('../views/reference'),
    ApiDashboardModel = require('../models/dataAccess')


var ApiDashboard = function(conf) {
    this.conf = conf || {};

    this.view = new ApiDashboardView();
    this.model = new ApiDashboardModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiDashboard.prototype.get_Dashboard = function(req, res, next) {

    var self = this;

    var params = [{ name: 'empresaID', value: req.query.empresaID, type: self.model.types.INT }];

    self.model.query('uspGetInteresDashBoard', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


module.exports = ApiDashboard;

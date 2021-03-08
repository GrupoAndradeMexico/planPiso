appModule.controller('reporteController', function($scope, $rootScope, $location, $interval, commonFactory, reporteFactory, staticFactory, uiGridConstants, uiGridGroupingConstants, empresaFactory) {
    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.idUsuario = localStorage.getItem("idUsuario");
    $scope.currentEmpresa = sessionFactory.nombre;

    $scope.topBarNav = staticFactory.reporteBar();
    $scope.today = staticFactory.todayDate();
    // $scope.totalUnidades = 0;
    // $scope.totalLineaUtilizada = 0;
    // $scope.totalUnidadesInventario = 0;
    // $scope.totalIventario = 0;
    // $scope.unidadesEstrella = 0;
    // $scope.totalEstrella = 0;
    // $scope.unidadesDobleE = 0;
    // $scope.totalDobleE = 0;
    $scope.totalPropiasEstrella = 0;
    $scope.muestraxempresa = true;
    $scope.muestraRepoGeneral = false;
    reporteFactory.getReporteEmpresa(sessionFactory.empresaID).then(function success(result) {
        $scope.datosReporte = result.data;
        var promises = [];
        $scope.datosReporte.map((value) => {
            promises.push(reporteFactory.getReporteUnidades(sessionFactory.empresaID, value.financieraID, value.esquemaID));
        })
        Promise.all(promises).then(function response(result) {
            console.log(result, 'UNIDADEEEES');
            console.log($scope.datosReporte, 'DATOS REPORTE')
            for (i = 0; i < $scope.datosReporte.length; i++) {
                if ($scope.datosReporte[i].financieraID == -5 || $scope.datosReporte[i].financieraID == -6) {
                    $scope.datosReporte[i].subGridOptions = {
                        columnDefs: [{ name: 'Número de Serie', field: 'veh_numserie', width: '5%' },
                            { name: 'Importe', field: 'IMPORTE', cellFilter: 'currency', cellClass: 'currencyGrid', width: '10%' }
                        ],
                        data: result[i].data
                    };
                } else {
                    $scope.datosReporte[i].subGridOptions = {
                        columnDefs: [{ name: 'Documento', field: 'CCP_IDDOCTO' },
                            { name: 'VIN', field: 'VIN' },
                            { name: 'Saldo documento', field: 'saldo', cellFilter: 'currency', cellClass: 'currencyGrid' },
                            { name: 'Plazo', field: 'plazo' },
                            { name: 'Dias', field: 'dias' },
                            { name: 'TIIE', field: 'tiie' },
                            { name: 'Spread', field: 'puntos' },
                            { name: 'Intereses', field: 'totalInteres', cellFilter: 'currency', cellClass: 'currencyGrid' },
                            { name: 'Estrella', field: 'estrella' },
                            { name: 'Doble Estrella', field: 'dobleEstrella' },
                            { name: 'IdCliente', field: 'ucu_idcliente' },
                            { name: 'Nombre Cliente', field: 'nombreCliente' },
                            { name: 'Factura', field: 'ucn_idFactura' },
                            { name: 'Precio Unidad', field: 'ucn_preciounidad' },
                            { name: 'Saldo', field: 'saldoCXC' }
                        ],
                        data: result[i].data
                    };
                }
            }

            console.log($scope.datosReporte)
            $scope.gridOptions.data = $scope.datosReporte;
            $interval(function() {
                $scope.gridApi.core.handleWindowResize();
            }, 500, 10);
        }).catch(error => console.log('Ocurrio un error al obtener datos reporte' + error))
        // console.log(JSON.stringify($scope.datosReporte))
        var totalEstrella = 0;
        var totalUnidadesPropias = 0;
        angular.forEach($scope.datosReporte, function(value, key) {
            if (value.financieraID == -5 || value.financieraID == -6) {
                totalUnidadesPropias = totalUnidadesPropias + value.estrellaMonto;
            } else {
                totalEstrella = totalEstrella + value.estrellaMonto;
            }
        });
        $scope.totalPropiasEstrella = totalUnidadesPropias - totalEstrella;
    }, function err(error) {
        console.log(error);
    });
    $scope.descargarReporteEmpresa = function() {
        descargarReporte($scope.datosReporte, sessionFactory.nombre)
    };
    $scope.descargarReporteEmpresas = function() {        
        console.log($scope.encabezadoReporte)
        angular.forEach($scope.encabezadoReporte, function(value, key) {
            descargarReporte(value.reporte, value.emp_nombre)
        });
    };
    var descargarReporte = function(datosReporte, empresa) {
        var totalUnidades = 0;
        var totalLineaUtilizada = 0;
        var totalUnidadesInventario = 0;
        var totalIventario = 0;
        var unidadesEstrella = 0;
        var totalEstrella = 0;
        var unidadesDobleE = 0;
        var totalDobleE = 0;
        var unidadesDiaGracia = 0;
        var unidadesIntereses = 0;
        var totalUnidadesPropias = 0;
        angular.forEach(datosReporte, function(value, key) {
            totalUnidades = totalUnidades + value.unidades;
            totalLineaUtilizada = totalLineaUtilizada + value.saldo;
            totalUnidadesInventario = totalUnidadesInventario + value.unidades;
            totalIventario = totalIventario + value.saldo;
            unidadesEstrella = unidadesEstrella + value.estrella;
            unidadesDobleE = unidadesDobleE + value.dobleEstrella;
            totalDobleE = totalDobleE + value.dobleEstrellaMonto;
            unidadesDiaGracia = unidadesDiaGracia + value.unidadesDiaGracia;
            unidadesIntereses = unidadesIntereses + value.unidadesGeneraIntereses;
            if (value.financieraID == -5 || value.financieraID == -6) {
                value.muestraPropias = true;
                totalUnidadesPropias = totalUnidadesPropias + value.estrellaMonto;
            } else {
                value.muestraPropias = false;
                totalEstrella = totalEstrella + value.estrellaMonto;
            }
        });
        var contenidoReporte = {
            "empresa": empresa,
            "totalUnidades": totalUnidades,
            "totalLineaUtilizada": totalLineaUtilizada,
            "totalUnidadesInventario": totalUnidadesInventario,
            "totalIventario": totalIventario,
            "unidadesEstrella": unidadesEstrella,
            "totalEstrella": totalUnidadesPropias,
            "unidadesDobleE": unidadesDobleE,
            "totalDobleE": totalDobleE,
            "unidadesDiaGracia": unidadesDiaGracia,
            "unidadesIntereses": unidadesIntereses,
            "detalle": datosReporte,
            "fecha": $scope.today
        };
        console.log('COMPLENTED', JSON.stringify(contenidoReporte));
        reporteFactory.jsReporte(contenidoReporte).then(function success(result) {
            console.log(result);
            var file = new Blob([result.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," });
            var a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = 'Reporte Plan Piso ' + empresa;
            a.click();
        }, function err(error) {
            console.log(error);
        });
    };
    // $scope.descargarReporte = function() {
    //     $scope.contenidoReporte = {
    //         "empresa": sessionFactory.nombre,
    //         "totalUnidades": $scope.totalUnidades,
    //         "totalLineaUtilizada": $scope.totalLineaUtilizada,
    //         "totalUnidadesInventario": $scope.totalUnidadesInventario,
    //         "totalIventario": $scope.totalIventario,
    //         "unidadesEstrella": $scope.unidadesEstrella,
    //         "totalEstrella": $scope.totalEstrella,
    //         "unidadesDobleE": $scope.unidadesDobleE,
    //         "totalDobleE": $scope.totalDobleE,
    //         "detalle": $scope.datosReporte,
    //         "fecha": $scope.today
    //     };
    //     console.log('COMPLENTED', $scope.contenidoReporte);
    //     reporteFactory.jsReporte($scope.contenidoReporte).then(function success(result) {
    //         console.log(result);
    //         var file = new Blob([result.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," });
    //         var a = document.createElement("a");
    //         a.href = URL.createObjectURL(file);
    //         a.download = 'Reporte Plan Piso ' + sessionFactory.nombre;
    //         a.click();
    //     }, function err(error) {
    //         console.log(error);
    //     });
    // };
    //BEGIN UI GRID
    $scope.gridOptions = {
        showColumnFooter: true,
        expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height:150px;"></div>',
        expandableRowHeight: 150,
        enableGridMenu: true,
        //subGridVariable will be available in subGrid scope
        expandableRowScope: {
            subGridVariable: 'subGridScopeVariable'
        },
        headerTemplate: 'header.html',
        headerAppends: {
            index: [0, 1],
            height: 35
        }
    };
    $scope.gridOptions.columnDefs = [{
            field: 'nombre',
            width: 300,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total</div>',
            pinnedLeft: true,
            headers: [
                { label: 'Financiera', rowSpan: 2 },
                { label: '', rowSpan: '#rowSpan' }
            ]
        },
        {
            field: 'tiie',
            width: 80,
            headers: [
                { label: 'TIIE', rowSpan: 2 },
                { label: '', rowSpan: '#rowSpan' }
            ]
        },
        {
            field: 'puntos',
            width: 80,
            headers: [
                { label: 'Spread', rowSpan: 2 },
                { label: '', rowSpan: '#rowSpan' }
            ]
        },
        {
            field: 'sumaTP',
            width: 80,
            headers: [
                { label: 'Tasa', rowSpan: 2 },
                { label: '', rowSpan: '#rowSpan' }
            ]
        },
        {
            field: 'unidadesAutorizadas',
            width: 80,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
            headers: [
                { label: 'Línea Autorizada', colSpan: 2 },
                { label: 'Unidades' }
            ]
        },
        {
            field: 'lineaAutorizada',
            width: 150,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellTemplate: '<div class="ui-grid-cell-contents currencyGrid" >{{col.getAggregationValue() | currency }}</div>',
            cellFilter: 'currency',
            cellClass: 'currencyGrid',
            headers: [
                { label: '', colSpan: '#colSpan' },
                { label: 'Monto' }
            ]
        },
        {
            field: 'unidades',
            width: 80,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
            headers: [
                { label: 'Línea utilizada', colSpan: 2 },
                { label: 'Unidades' }
            ]
        },
        {
            field: 'saldo',
            width: 150,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellTemplate: '<div class="ui-grid-cell-contents currencyGrid" >{{col.getAggregationValue() | currency }}</div>',
            cellFilter: 'currency',
            cellClass: 'currencyGrid',
            headers: [
                { label: '', colSpan: '#colSpan' },
                { label: 'Monto' }
            ]
        },
        {
            field: 'unidadesDisponibles',
            width: 80,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
            headers: [
                { label: 'Línea disponible', colSpan: 2 },
                { label: 'Unidades' }
            ]
        },
        {
            field: 'lineaResto',
            width: 150,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellTemplate: '<div class="ui-grid-cell-contents currencyGrid" >{{col.getAggregationValue() | currency }}</div>',
            cellFilter: 'currency',
            cellClass: 'currencyGrid',
            headers: [
                { label: '', colSpan: '#colSpan' },
                { label: 'Monto' }
            ]
        },
        {
            field: 'unidadesInventario',
            width: 80,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
            headers: [
                { label: 'Inventario', colSpan: 2 },
                { label: 'Unidades' }
            ]
        },
        {
            field: 'saldo',
            width: 150,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellTemplate: '<div class="ui-grid-cell-contents currencyGrid" >{{col.getAggregationValue() | currency }}</div>',
            cellFilter: 'currency',
            cellClass: 'currencyGrid',
            headers: [
                { label: '', colSpan: '#colSpan' },
                { label: 'Monto' }
            ]
        },
        {
            field: 'unidadesCxc',
            width: 80,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
            headers: [
                { label: 'Unidades cxc', colSpan: 2 },
                { label: 'Unidades' }
            ]
        },
        {
            field: 'unidadesCxcMonto',
            width: 150,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellTemplate: '<div class="ui-grid-cell-contents currencyGrid" >{{col.getAggregationValue() | currency }}</div>',
            cellFilter: 'currency',
            cellClass: 'currencyGrid',
            headers: [
                { label: '', colSpan: '#colSpan' },
                { label: 'Monto' }
            ]
        },
        {
            field: 'conciliacion',
            width: 100,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
            headers: [
                { label: 'Conciliacion', colSpan: 2 },
                { label: 'Unidades' }
            ]
        },
        {
            field: 'montoConciliacion',
            width: 150,
            cellFilter: 'currency',
            cellClass: 'currencyGrid',
            footerCellTemplate: '<div class="ui-grid-cell-contents currencyGrid" >{{grid.appScope.totalPropiasEstrella | currency }}</div>',
            headers: [
                { label: '', colSpan: '#colSpan' },
                { label: 'Monto' }
            ]
        },
        {
            field: 'estrella',
            width: 80,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
            headers: [
                { label: 'Unidades en Estrella', colSpan: 2 },
                { label: 'Unidades' }
            ]
        },
        {
            field: 'estrellaMonto',
            width: 150,
            cellFilter: 'currency',
            cellClass: 'currencyGrid',
            footerCellTemplate: '<div class="ui-grid-cell-contents currencyGrid" >{{grid.appScope.totalPropiasEstrella | currency }}</div>',
            headers: [
                { label: '', colSpan: '#colSpan' },
                { label: 'Monto' }
            ]
        },
        {
            field: 'dobleEstrella',
            width: 80,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
            headers: [
                { label: 'Doble Estrella', colSpan: 2 },
                { label: 'Unidades' }
            ]
        },
        {
            field: 'dobleEstrellaMonto',
            width: 150,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellTemplate: '<div class="ui-grid-cell-contents currencyGrid" >{{col.getAggregationValue() | currency }}</div>',
            cellFilter: 'currency',
            cellClass: 'currencyGrid',
            headers: [
                { label: '', colSpan: '#colSpan' },
                { label: 'Monto' }
            ]
        },
        {
            field: 'unidadesDiaGracia',
            width: 180,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
            headers: [
                { label: 'Unidades días de gracia', rowSpan: 2 },
                { label: '', rowSpan: '#rowSpan' }
            ]
        },
        {
            field: 'unidadesGeneraIntereses',
            width: 190,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
            headers: [
                { label: 'Unidades que genera Intereses', rowSpan: 2 },
                { label: '', rowSpan: '#rowSpan' }
            ]
        }
    ];
    $scope.gridOptions.onRegisterApi = function(gridApi) {
        $scope.gridApi = gridApi;
    };

    $scope.expandAllRows = function() {
        $scope.gridApi.expandable.expandAllRows();
    };

    $scope.collapseAllRows = function() {
        $scope.gridApi.expandable.collapseAllRows();
    };

    $scope.toggleExpandAllBtn = function() {
        $scope.gridOptions.showExpandAllButton = !$scope.gridOptions.showExpandAllButton;
    };
    $scope.toggleFooter = function() {
        $scope.gridOptions.showGridFooter = !$scope.gridOptions.showGridFooter;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
    };

    $scope.toggleColumnFooter = function() {
        $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
    };
    // END UI GRID
    $scope.reporteEmpresas = function() {
        $scope.muestraxempresa = false;
        $scope.muestraRepoGeneral = true;
        empresaFactory.getEmpresa($scope.idUsuario).then(function(result) {
            $scope.lstEmpresa = result.data;
            $scope.encabezadoReporte = [];
            var promises = [];
            $scope.lstEmpresa.map((value) => {
                promises.push(reporteFactory.getReporteEmpresa(value.emp_idempresa));
            })
            Promise.all(promises).then(function response(result) {
                console.log(result, 'Reportes');
                var reporteEncabezado = result;
                var contador = 0;
                var contador2 = 0;
                var idEmpresa = 0;
                var idFinanciera = 0;
                angular.forEach($scope.lstEmpresa, function(value, key) {
                    if (reporteEncabezado[key].data.length > 0) {
                        $scope.encabezadoReporte.push(value);
                        idEmpresa = value.emp_idempresa;
                        $scope.encabezadoReporte[contador].reporte = reporteEncabezado[key].data;
                        var promises2 = [];
                        $scope.encabezadoReporte[contador].reporte.map((value) => {
                            promises2.push(reporteFactory.getReporteUnidades(idEmpresa, value.financieraID, value.esquemaID));
                        })
                        Promise.all(promises2).then(function response(result) {
                            console.log(result, 'Sacatelas')
                            var totalUnidadesPropias = 0;
                            var totalEstrella = 0;
                            for (i = 0; i < $scope.encabezadoReporte[contador2].reporte.length; i++) {
                                if ($scope.encabezadoReporte[contador2].reporte[i].financieraID == -5 || $scope.encabezadoReporte[contador2].reporte[i].financieraID == -6) {
                                    totalUnidadesPropias = totalUnidadesPropias + $scope.encabezadoReporte[contador2].reporte[i].estrellaMonto;
                                    $scope.encabezadoReporte[contador2].reporte[i].subGridOptions = {
                                        columnDefs: [{ name: 'Número de Serie', field: 'veh_numserie', width: '5%' },
                                            { name: 'Importe', field: 'IMPORTE', cellFilter: 'currency', cellClass: 'currencyGrid', width: '10%' }
                                        ],
                                        data: result[i].data
                                    };
                                } else {
                                    totalEstrella = totalEstrella + $scope.encabezadoReporte[contador2].reporte[i].estrellaMonto;
                                    $scope.encabezadoReporte[contador2].reporte[i].subGridOptions = {

                                        columnDefs: [{ name: 'Documento', field: 'CCP_IDDOCTO' },
                                            { name: 'VIN', field: 'VIN' },
                                            { name: 'Saldo documento', field: 'saldo', cellFilter: 'currency', cellClass: 'currencyGrid' },
                                            { name: 'Plazo', field: 'plazo' },
                                            { name: 'Dias', field: 'dias' },
                                            { name: 'TIIE', field: 'tiie' },
                                            { name: 'Spread', field: 'puntos' },
                                            { name: 'Intereses', field: 'totalInteres', cellFilter: 'currency', cellClass: 'currencyGrid' },
                                            { name: 'Estrella', field: 'estrella' },
                                            { name: 'Doble Estrella', field: 'dobleEstrella' },
                                            { name: 'IdCliente', field: 'ucu_idcliente' },
                                            { name: 'Nombre Cliente', field: 'nombreCliente' },
                                            { name: 'Factura', field: 'ucn_idFactura' },
                                            { name: 'Precio Unidad', field: 'ucn_preciounidad' },
                                            { name: 'Saldo', field: 'saldoCXC' }
                                        ],
                                        data: result[i].data
                                    };
                                }
                            }
                            contador2++;
                        }).catch(error => console.log('Ocurrio un error al obtener datos reporte' + error))
                        contador++;
                    }
                });
                console.log($scope.encabezadoReporte, 'Soy las empresas que si tiene detalle')
                $scope.muestraRepoGeneral = false;
                angular.forEach($scope.encabezadoReporte, function(value, key) {

                    //BEGIN UI GRID
                    $scope.gridOptions[key] = {
                        showColumnFooter: true,
                        expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height:150px;"></div>',
                        expandableRowHeight: 150,
                        //subGridVariable will be available in subGrid scope
                        expandableRowScope: {
                            subGridVariable: 'subGridScopeVariable'
                        },
                        headerTemplate: 'header.html',
                        headerAppends: {
                            index: [0, 1],
                            height: 35
                        }
                    };
                    // totalPropiasEstrella
                    $scope.gridOptions[key].columnDefs = [{
                            field: 'nombre',
                            width: 300,
                            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total</div>',
                            pinnedLeft: true,
                            headers: [
                                { label: 'Financiera', rowSpan: 2 },
                                { label: '', rowSpan: '#rowSpan' }
                            ]
                        },
                        {
                            field: 'tiie',
                            width: 80,
                            headers: [
                                { label: 'TIIE', rowSpan: 2 },
                                { label: '', rowSpan: '#rowSpan' }
                            ]
                        },
                        {
                            field: 'puntos',
                            width: 80,
                            headers: [
                                { label: 'Spread', rowSpan: 2 },
                                { label: '', rowSpan: '#rowSpan' }
                            ]
                        },
                        {
                            field: 'sumaTP',
                            width: 80,
                            headers: [
                                { label: 'Tasa', rowSpan: 2 },
                                { label: '', rowSpan: '#rowSpan' }
                            ]
                        },
                        {
                            field: 'unidadesAutorizadas',
                            width: 80,
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
                            headers: [
                                { label: 'Línea Autorizada', colSpan: 2 },
                                { label: 'Unidades' }
                            ]
                        },
                        {
                            field: 'lineaAutorizada',
                            width: 150,
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div class="ui-grid-cell-contents currencyGrid" >{{col.getAggregationValue() | currency }}</div>',
                            cellFilter: 'currency',
                            cellClass: 'currencyGrid',
                            headers: [
                                { label: '', colSpan: '#colSpan' },
                                { label: 'Monto' }
                            ]
                        },
                        {
                            field: 'unidades',
                            width: 80,
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
                            headers: [
                                { label: 'Línea utilizada', colSpan: 2 },
                                { label: 'Unidades' }
                            ]
                        },
                        {
                            field: 'saldo',
                            width: 150,
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div class="ui-grid-cell-contents currencyGrid" >{{col.getAggregationValue() | currency }}</div>',
                            cellFilter: 'currency',
                            cellClass: 'currencyGrid',
                            headers: [
                                { label: '', colSpan: '#colSpan' },
                                { label: 'Monto' }
                            ]
                        },
                        {
                            field: 'unidadesDisponibles',
                            width: 80,
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
                            headers: [
                                { label: 'Línea disponible', colSpan: 2 },
                                { label: 'Unidades' }
                            ]
                        },
                        {
                            field: 'lineaResto',
                            width: 150,
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div class="ui-grid-cell-contents currencyGrid" >{{col.getAggregationValue() | currency }}</div>',
                            cellFilter: 'currency',
                            cellClass: 'currencyGrid',
                            headers: [
                                { label: '', colSpan: '#colSpan' },
                                { label: 'Monto' }
                            ]
                        },
                        {
                            field: 'unidadesInventario',
                            width: 80,
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
                            headers: [
                                { label: 'Inventario', colSpan: 2 },
                                { label: 'Unidades' }
                            ]
                        },
                        {
                            field: 'saldo',
                            width: 150,
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div class="ui-grid-cell-contents currencyGrid" >{{col.getAggregationValue() | currency }}</div>',
                            cellFilter: 'currency',
                            cellClass: 'currencyGrid',
                            headers: [
                                { label: '', colSpan: '#colSpan' },
                                { label: 'Monto' }
                            ]
                        },
                        {
                            field: 'unidadesCxc',
                            width: 80,
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
                            headers: [
                                { label: 'Unidades cxc', colSpan: 2 },
                                { label: 'Unidades' }
                            ]
                        },
                        {
                            field: 'unidadesCxcMonto',
                            width: 150,
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div class="ui-grid-cell-contents currencyGrid" >{{col.getAggregationValue() | currency }}</div>',
                            cellFilter: 'currency',
                            cellClass: 'currencyGrid',
                            headers: [
                                { label: '', colSpan: '#colSpan' },
                                { label: 'Monto' }
                            ]
                        },
                        {
                            field: 'conciliacion',
                            width: 100,
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
                            headers: [
                                { label: 'Conciliacion', colSpan: 2 },
                                { label: 'Unidades' }
                            ]
                        },
                        {
                            field: 'montoConciliacion',
                            width: 150,
                            cellFilter: 'currency',
                            cellClass: 'currencyGrid',
                            footerCellTemplate: '<div class="ui-grid-cell-contents currencyGrid" >{{grid.appScope.totalPropiasEstrella | currency }}</div>',
                            headers: [
                                { label: '', colSpan: '#colSpan' },
                                { label: 'Monto' }
                            ]
                        },
                        {
                            field: 'estrella',
                            width: 80,
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
                            headers: [
                                { label: 'Unidades en Estrella', colSpan: 2 },
                                { label: 'Unidades' }
                            ]
                        },
                        {
                            field: 'estrellaMonto',
                            width: 150,
                            cellFilter: 'currency',
                            cellClass: 'currencyGrid',
                            footerCellTemplate: '<div class="ui-grid-cell-contents currencyGrid" >{{grid.appScope.totalPropiasEstrella | currency }}</div>',
                            headers: [
                                { label: '', colSpan: '#colSpan' },
                                { label: 'Monto' }
                            ]
                        },
                        {
                            field: 'dobleEstrella',
                            width: 80,
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
                            headers: [
                                { label: 'Doble Estrella', colSpan: 2 },
                                { label: 'Unidades' }
                            ]
                        },
                        {
                            field: 'dobleEstrellaMonto',
                            width: 150,
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div class="ui-grid-cell-contents currencyGrid" >{{col.getAggregationValue() | currency }}</div>',
                            cellFilter: 'currency',
                            cellClass: 'currencyGrid',
                            headers: [
                                { label: '', colSpan: '#colSpan' },
                                { label: 'Monto' }
                            ]
                        },
                        {
                            field: 'unidadesDiaGracia',
                            width: 180,
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
                            headers: [
                                { label: 'Unidades días de gracia', rowSpan: 2 },
                                { label: '', rowSpan: '#rowSpan' }
                            ]
                        },
                        {
                            field: 'unidadesGeneraIntereses',
                            width: 190,
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue()}}</div>',
                            headers: [
                                { label: 'Unidades que genera Intereses', rowSpan: 2 },
                                { label: '', rowSpan: '#rowSpan' }
                            ]
                        }
                    ];
                    $scope.gridOptions[key].onRegisterApi = function(gridApi) {
                        $scope.gridApi[key] = gridApi;
                    };

                    $scope.expandAllRows = function() {
                        $scope.gridApi[key].expandable.expandAllRows();
                    };

                    $scope.collapseAllRows = function() {
                        $scope.gridApi[key].expandable.collapseAllRows();
                    };

                    $scope.toggleExpandAllBtn = function() {
                        $scope.gridOptions[key].showExpandAllButton = !$scope.gridOptions[key].showExpandAllButton;
                    };
                    $scope.toggleFooter = function() {
                        $scope.gridOptions[key].showGridFooter = !$scope.gridOptions[key].showGridFooter;
                        $scope.gridApi[key].core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
                    };

                    $scope.toggleColumnFooter = function() {
                        $scope.gridOptions[key].showColumnFooter = !$scope.gridOptions[key].showColumnFooter;
                        $scope.gridApi[key].core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
                    };
                    // END UI GRID
                    $scope.gridOptions[key].data = value.reporte;
                    value.group = $scope.gridOptions[key];
                })
                $scope.$apply();
            }).catch(error => console.log('Ocurrio un error al obtener datos reporte' + error))

            console.log($scope.lstEmpresa, 'LASEMPRESAS :S')
        });
    };
});
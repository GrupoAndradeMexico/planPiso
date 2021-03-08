appModule.controller('guardarLoteController', function($scope, $rootScope, $location, $sce, $interval, crealoteFactory, commonFactory, staticFactory, filterFilter, uiGridConstants, uiGridGroupingConstants, utils, alertFactory) {
    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.lstPermisoBoton = JSON.parse(sessionStorage.getItem("PermisoUsuario"));


    $scope.idUsuario = localStorage.getItem("idUsuario");
    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.topBarNav = staticFactory.crealoteBar();
    $scope.currentCuentaName = "Seleccione cuenta";
    $scope.bancoPago = undefined;
    $scope.idPoliza = $location.search().idPre;
    $scope.BotonGuardarLote = false;
    $scope.documentosNoEncontrados = [];
    console.log($location.search().idPre, 'LO QUE VIENE DE LA URL')
    var cargaInfoGridLotes = function() {
        // $('#mdlLoading').modal('show');
        var valor = _.where($scope.lstPermisoBoton, { idModulo: 11, Boton: "guardarLote" })[0];
        $scope.BotonGuardarLote = valor != undefined;
        $scope.sumaDocumentos = undefined;
        crealoteFactory.getescenario(sessionFactory.empresaID).then(function success(result) {
            console.log(result.data, 'SOY EL ESCENARIO');
            $scope.escenarios = result.data;
            $scope.pdPlanta = $scope.escenarios.Pdbanco;
            $scope.pdBanco = $scope.escenarios.Pdplanta;
            $scope.refPlanta = $scope.escenarios.TipoRefPlanta;
            $scope.refpdBanco = $scope.escenarios.tipoRefBanco;
            if ($scope.pdPlanta || $scope.pdBanco) {
                $scope.selPagoDirecto = true;
            } else {
                $scope.selPagoDirecto = false;
            }
            console.log($scope.selPagoDirecto, 'PAGO DIRECTO');
            crealoteFactory.getDocumentosNoEncontrados(sessionFactory.empresaID, $scope.idPoliza).then(function success(result){
                $scope.documentosNoEncontrados = result.data;
                console.log($scope.documentosNoEncontrados, 'Los que no encontre')
            }, function error(err){
                console.log('Ocurrio un error al intentar obtener los documentos no encontrados en pagos');
                $('#mdlLoading').modal('hide');
            });
            crealoteFactory.getPreDocumentos(sessionFactory.empresaID, $scope.idPoliza).then(function success(result) {
                console.log(result.data);
                $scope.documentos = result.data;
                validaDocumentos($scope.documentos);
                $scope.gridOptions.data = $scope.documentos;
                $('#mdlLoading').modal('hide');
            }, function error(err) {
                console.log('Ocusrrio un error al obtener los documentos')
                $('#mdlLoading').modal('hide');
            });

        }, function error(err) {
            console.log('Ocurrio un erro al obtener los escenarios')
            $('#mdlLoading').modal('hide');
        });
    };
    cargaInfoGridLotes();
    crealoteFactory.getCuentas(sessionFactory.empresaID).then(function success(result) {
        console.log(result.data, 'SOY LAS CUENTAS');
        $scope.lstCuentas = result.data;
    }, function error(err) {
        console.log('Ocurrio un erro al obtener cuentas')
    });

    crealoteFactory.getLotes(sessionFactory.empresaID).then(function success(result) {
        console.log('SOY LOS LOTES', result.data)
        $scope.lotes = result.data;
        var date = new Date();
        $scope.nombreLote = ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + date.getFullYear() + '-' + sessionFactory.empresaRfc + '-' + ('0' + ($scope.lotes.length + 1)).slice(-2);
    }, function error(err) {
        console.log('Ocurrio un error al tratar de obtener el nombre del lote')
    });
    var validaDocumentos = function(data) {
        $scope.financieraMasCuenta = [];
        $scope.data = data;
        $scope.carteraVencida = 0;
        $scope.cantidadTotal = 0;
        $scope.cantidadUpdate = 0;
        $scope.noPagable = 0;
        $scope.Reprogramable = 0;
        $scope.TotalSaldoPagar = 0;
        var contador = 1;

        $scope.pdPlanta = $scope.escenarios.Pdplanta;
        $scope.pdBanco = $scope.escenarios.Pdbanco;
        $scope.refPlanta = $scope.escenarios.TipoRefPlanta;
        $scope.refpdBanco = $scope.escenarios.tipoRefBanco;
        $scope.grdPagoDirecto = [];
        var j = 0;
        var tamdata = $scope.data.length;
        for (var i = 0; i < tamdata; i++) {


            $scope.TotalSaldoPagar = $scope.TotalSaldoPagar + $scope.data[i].saldo;
            $scope.data[i].Pagar = $scope.data[i].aPagar;
            $scope.data[i].fechaPago = $scope.data[i].fechaPromesaPago;
            $scope.data[i].agrupar = 0;



            if ($scope.data[i].fechaPromesaPago == "1900-01-01T00:00:00") {
                $scope.data[i].fechaPromesaPago = "";
            }

            //FAL 23052016 dependiendo la lista de 
            if ($scope.pdPlanta) {
                if ($scope.data[i].idProveedor == 7) {
                    $scope.data[i].referencia = 'Planta';
                    var datadirecto = $scope.data[i];
                    $scope.grdPagoDirecto.push(datadirecto);
                } else {
                    $scope.data[i].referencia = '';
                }
            }
            if ($scope.pdPlanta) {
                if ($scope.data[i].idProveedor == 6) {
                    $scope.data[i].referencia = 'Financiera';
                    var datadirecto = $scope.data[i];
                    $scope.grdPagoDirecto.push(datadirecto);
                }
            }
            if ($scope.pdBanco) {
                if ($scope.data[i].esBanco == 'true') {
                    $scope.data[i].referencia = 'Banco';
                }
            }

            if ($scope.data[i].seleccionable == "False") {
                $scope.data[i].estGrid = 'Pago';
            }

            if ($scope.data[i].seleccionable == 'True') {
                $scope.data[i].Pagar = $scope.data[i].saldo;
                $scope.data[i].estGrid = 'No pagar';
            }

            if ($scope.data[i].documentoPagable == 'False') {
                $scope.data[i].Pagar = $scope.data[i].saldo;
            }

            // if (($scope.data[i].numeroSerie).length == 17) {
            //     $scope.data[i].referencia = $scope.data[i].numeroSerie.substring(9, 17);
            // }

            if (($scope.data[i].autorizado == 1) && ($scope.data[i].seleccionable == "False")) {
                $scope.data[i].seleccionable = 'False';
            } else {
                $scope.data[i].seleccionable = 'True';
            }

            if ($scope.data[i].convenioCIE === '') {
                $scope.data[i].agrupar = 0;
            } else {
                $scope.data[i].seleccionable == "False";
                $scope.data[i].estGrid = 'Pago';
            }

            $scope.data[i].agrupar = 0;
            $scope.data[i].numagrupar = i;
            //FAL17052016 Valido si lleva numero de serie y si es de lenght = 17 lo pango en referencia.
            $scope.carteraVencida = $scope.carteraVencida + $scope.data[i].saldo;
            //---------------------------------------
            var ctrCuentaDestinoArr = $scope.data[i].cuentaDestino.split(',');

            if (ctrCuentaDestinoArr.length > 1) {
                // alertFactory.warningCenter('El proveedor tiene mas de una cuenta destino' + $scope.data[i].proveedor);
                $scope.financieraMasCuenta.push($scope.data[i])
            }
            // --------------------------------------
        }
        if ($scope.financieraMasCuenta.length > 0) {
            $scope.cuentasRepetidas = Array.from(new Set($scope.financieraMasCuenta.map(s => s.proveedor))).map(proveedor => {
                return {
                    proveedor: proveedor,
                    currentCuentaDestino: 'Seleccione cuenta destino',
                    cuentaDestino: $scope.financieraMasCuenta.find(s => s.proveedor === proveedor).cuentaDestino.split(',')
                }
            });
            console.log($scope.cuentasRepetidas, 'MMM SI QUEDARA???')
        }
        // -----------
        $scope.noPagable = $scope.carteraVencida - $scope.cantidadTotal;

        //FAL 20062016 separación de cartera en caso de pago directo

        if ($scope.selPlantaBanco) {

            $scope.datosModal = $scope.grdPagoDirecto;

        } else {
            $scope.datosModal = $scope.data;

        }

        // var newLote = { idLotePago: '0', idEmpresa: $rootScope.idEmpresa, idUsuario: $rootScope.currentEmployee, fecha: '', nombre: $scope.formData.nombreLoteNuevo, estatus: 0 };
        // $scope.ObtieneLotes(newLote);
        // $scope.LlenaIngresos();
        $scope.estatusLote = 0;
        //LQMA 15032016
        $scope.accionPagina = true;
        $scope.grdApagar = 0;
        //FAL 19042016 llena totales de bancos desde la consulta
        $scope.grdBancos = [];
        $scope.grdApagar = 0;

        $scope.blTotales = true;
        $scope.idOperacion = 0;
        //FAL grid  x vencer
        $scope.gridOptions.data = $scope.documentos;
    };
    $scope.cambioCuentasGrid = function(cuenta, financiera) {
        console.log($scope.gridOptions.data, 'POR QUE NOOO')
        var financieraSeleccion = financiera;
        angular.forEach($scope.gridOptions.data, function(value, key) {
            if (financieraSeleccion == value.proveedor) {
                value.cuentaDestino = cuenta;
            }
        });
    }
    $scope.getDocumentos = function(cuenta) {
        $scope.currentCuentaName = cuenta.cuenta;
        $scope.bancoPago = cuenta;
    };
    $scope.gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        columnDefs: [
            // {
            //         name: 'nombreAgrupador',
            //         grouping: { groupPriority: 0 },
            //         sort: { priority: 0, direction: 'asc' },
            //         width: '15%',
            //         displayName: 'Grupo',
            //         enableCellEdit: false,
            //         cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>'
            //     }, 
            {
                name: 'proveedor',
                grouping: { groupPriority: 0 },
                sort: { priority: 1, direction: 'asc' },
                width: '40%',
                displayName: 'Proveedor',
                enableCellEdit: false,
                enableFiltering: false,
                cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>'
            },
            {
                name: 'idProveedor',
                displayName: 'Clave',
                width: '5%',
                enableCellEdit: false,
                enableFiltering: false,
                headerTooltip: 'Nombre del provedor',
                cellClass: 'cellToolTip'
            }, ,
            {
                name: 'saldo',
                displayName: 'Saldo',
                width: '15%',
                cellFilter: 'currency',
                enableCellEdit: false,
                enableFiltering: false,
                treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
                customTreeAggregationFinalizerFn: function(aggregation) {
                    aggregation.rendered = aggregation.value
                }
            },
            {
                name: 'documento',
                displayName: '# Documento',
                width: '15%',
                enableCellEdit: false,
                headerTooltip: 'Documento # de factura del provedor',
                cellClass: 'cellToolTip',
                cellTemplate: '<div style="text-align: center;"><span align="center"><a class="urlTabla" href ng-click="grid.appScope.VerDocumento(row.entity)">{{row.entity.documento}}</a></span></div>'
            },
            {
                name: 'agrupar',
                field: 'agrupar',
                displayName: 'No agrupar',
                width: '8%',
                type: 'boolean',
                enableFiltering: false,
                cellTemplate: '<input type="checkbox" ng-model="row.entity.agrupar">'
            },
            {
                name: 'ordenCompra',
                displayName: 'Orden de compra',
                width: '13%',
                enableCellEdit: false,
                cellTemplate: '<div class="urlTabla" ng-class="col.colIndex()" ><a tooltip="Ver en digitalización" class="urlTabla" href="http://192.168.20.92:3200/?id={{row.entity.ordenCompra}}&employee=' + $scope.idUsuario + '&proceso=1" target="_new">{{row.entity.ordenCompra}}</a></div>'
            },
            {
                name: 'monto',
                displayName: 'Monto',
                width: '10%',
                cellFilter: 'currency',
                enableCellEdit: false,
                enableFiltering: false
            },
            {
                name: 'Pagar',
                field: 'Pagar',
                displayName: 'Pagar (total)',
                width: '10%',
                cellFilter: 'currency',
                enableCellEdit: ($scope.currentIdOp == 1) ? false : true,
                enableFiltering: false,
                editableCellTemplate: '<div><form name="inputForm"><input type="number" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>'
            },
            {
                name: 'cuentaPagadora',
                width: '10%',
                displayName: 'Banco Origen',
                enableCellEdit: false,
                enableFiltering: false
            },
            {
                name: 'cuenta',
                width: '15%',
                displayName: '# Cuenta',
                enableCellEdit: false,
                enableFiltering: false
            },
            {
                name: 'fechaPromesaPago',
                displayName: 'Fecha Promesa de Pago',
                type: 'date',
                cellFilter: 'date:"dd/MM/yyyy"',
                width: '15%'
            },
            {
                name: 'referencia',
                displayName: 'Referencia',
                width: '10%',
                visible: true,
                enableCellEdit: true,
                enableFiltering: false
            },
            {
                name: 'tipo',
                width: '15%',
                displayName: 'Tipo',
                enableCellEdit: false,
                enableFiltering: false
            },
            {
                name: 'tipodocto',
                width: '15%',
                displayName: 'Tipo Documento',
                enableCellEdit: false
            },
            {
                name: 'cartera',
                width: '15%',
                displayName: 'Cartera',
                cellTooltip: true,
                enableCellEdit: false
            },
            {
                name: 'moneda',
                width: '10%',
                displayName: 'Moneda',
                enableCellEdit: false
            },
            {
                name: 'numeroSerie',
                width: '20%',
                displayName: 'N Serie',
                enableCellEdit: false
            },
            {
                name: 'facturaProveedor',
                width: '20%',
                displayName: 'Factura Proveedor',
                enableCellEdit: false
            },
            {
                name: 'fechaVencimiento',
                displayName: 'Fecha de Vencimiento',
                type: 'date',
                cellFilter: 'date:"dd/MM/yyyy"',
                width: '17%',
                enableCellEdit: false
            },
            {
                name: 'fechaRecepcion',
                displayName: 'Fecha Recepción',
                type: 'date',
                cellFilter: 'date:"dd/MM/yyyy"',
                width: '17%',
                enableCellEdit: false
            },
            {
                name: 'fechaFactura',
                displayName: 'Fecha Factura',
                type: 'date',
                cellFilter: 'date:"dd/MM/yyyy"',
                width: '17%',
                enableCellEdit: false
            },
            {
                name: 'saldoPorcentaje',
                field: 'saldoPorcentaje',
                displayName: 'Porcentaje %',
                width: '10%',
                cellFilter: 'number: 6',
                enableCellEdit: false
            },
            {
                name: 'estatus',
                displayName: 'Estatus',
                width: '10%',
                cellTooltip: true,
                enableCellEdit: false
            },
            {
                name: 'anticipo',
                displayName: 'Anticipo',
                width: '10%',
                enableCellEdit: false
            },
            {
                name: 'anticipoAplicado',
                displayName: 'Anticipo Aplicado',
                width: '15%',
                enableCellEdit: false
            },
            {
                name: 'documentoPagable',
                width: '15%',
                displayName: 'Estatus del Documento',
                visible: false,
                enableCellEdit: false
            },
            {
                name: 'ordenBloqueada',
                displayName: 'Bloqueada',
                width: '20%',
                enableCellEdit: false
            },
            {
                name: 'fechaPago',
                displayName: 'fechaPago',
                width: '20%',
                visible: false,
                enableCellEdit: false
            },
            {
                name: 'estGrid',
                width: '15%',
                displayName: 'Estatus Grid',
                enableCellEdit: false
            },
            {
                name: 'seleccionable',
                displayName: 'seleccionable',
                width: '20%',
                enableCellEdit: false,
                visible: false
            },
            {
                name: 'cuentaDestino',
                displayName: 'Cuenta Destino',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellTooltip: true,
                width: '20%',
                editDropdownOptionsFunction: function(rowEntity, colDef) {
                    if (rowEntity.cuentaDestino === 'bar') {
                        return [{ id: 'SIN CUENTA', value: 'SIN CUENTA' }];
                    } else {
                        var index;
                        var bancosArray = rowEntity.cuentaDestinoArr.split(',');
                        var bancoSalida = [];

                        for (index = 0; index < bancosArray.length; ++index) {
                            var obj = {};
                            obj.id = bancosArray[index];
                            obj.value = bancosArray[index];
                            bancoSalida.push(obj);
                        }
                        return bancoSalida;
                    }
                }
            },
            {
                name: 'idEstatus',
                displayName: 'idEstatus',
                width: '20%',
                enableCellEdit: false,
                visible: true
            },
            {
                name: 'tipoCartera',
                displayName: 'tipoCartera',
                width: '20%',
                enableCellEdit: false,
                visible: true
            },
            {
                name: 'numagrupar',
                displayName: 'numagrupar',
                width: '20%',
                enableCellEdit: false,
                visible: false
            },
            {
                name: 'bancoPagador',
                displayName: 'bancoPagador',
                width: '20%',
                enableCellEdit: false,
                visible: false
            },
            {
                name: 'autorizado',
                displayName: 'Cuenta Autorizada',
                width: '20%',
                enableCellEdit: false,
                visible: true,
                cellTemplate: '<div ng-if="row.entity.autorizado == 1">Autorizado</div><div ng-if="row.entity.autorizado == 0">No autorizado</div>'
            }
        ],
        rowTemplate: '<div ng-class="{\'ordenBloqueada\':(row.entity.ordenBloqueada==\'True\' && ((row.entity.idEstatus < 1 || row.entity.idEstatus > 5) && row.entity.idEstatus != 20) && !row.isSelected)' +
            ',\'bloqueadaSelec\': (row.isSelected && row.entity.ordenBloqueada==\'True\') || (row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20)),' +
            '\'bancocss\': (row.entity.referencia==\'Banco\'),' +
            '\'plantacss\': (row.entity.referencia==\'Planta\'),' +
            '\'selectNormal\': (row.isSelected && row.entity.ordenBloqueada==\'False\' && ((row.entity.idEstatus < 1 || row.entity.idEstatus > 5) && row.entity.idEstatus != 20))' +
            ',\'docIncompletos\': (!row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20) && row.entity.ordenBloqueada==\'False\')' +
            ',\'bloqDocIncom\': (!row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20) && row.entity.ordenBloqueada==\'True\')' +
            ',\'ordenBloqueada\':(row.entity.ordenBloqueada==\'True\' && ((row.entity.idEstatus < 1 || row.entity.idEstatus > 5) && row.entity.idEstatus != 20) && !row.isSelected)' +
            '}"> <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader == \'True\'}" ui-grid-cell></div></div>',
        onRegisterApi: function(gridApi1) {
            $scope.gridApi1 = gridApi1;
            //FAL14042016 Marcado de grupos y proveedores
            // gridApi1.selection.on.rowSelectionChanged($scope, function(row, rows) {
            //     var filasSeleccionadas = $scope.gridApi1.selection.getSelectedRows();
            //     console.log(filasSeleccionadas)
            //     $scope.sumaDocumentos = 0;
            //     angular.forEach(filasSeleccionadas, function(value, key) {
            //         $scope.sumaDocumentos = $scope.sumaDocumentos + value.monto;
            //     });
            //     if (row.internalRow == true && row.isSelected == true) {
            //         var childRows = row.treeNode.children;
            //         for (var j = 0, length = childRows.length; j < length; j++) {
            //             $scope.selectAllChildren(gridApi1, childRows[j]);
            //         }
            //     }
            //     if (row.internalRow == true && row.isSelected == false) {
            //         var childRows = row.treeNode.children;
            //         for (var j = 0, length = childRows.length; j < length; j++) {
            //             $scope.unSelectAllChildren(gridApi1, childRows[j]);
            //         }
            //     }
            //     if (row.internalRow == undefined && row.isSelected == true && row.entity.seleccionable == "False") {
            //         var ctrCuentaDestinoArr = row.entity.cuentaDestino.split(',');

            //         if (ctrCuentaDestinoArr.length > 1) {
            //             // proveedorcuentaDestino = row.proveedor;
            //             var rowCol = $scope.gridApi1.cellNav.getFocusedCell();
            //             alertFactory.warningCenter('El proveedor tiene mas de una cuenta destino');
            //             $scope.gridApi1.core.scrollTo($scope.gridOptions.data[rowCol.row.entity.id], $scope.gridOptions.columnDefs[32]);
            //             $interval(function() {
            //                 $scope.gridApi1.core.handleWindowResize();
            //             }, 100, 10);
            //             // return true;
            //             console.log('tiene mas de una cuenta destino ')
            //         } else {
            //             var childRows = row.treeNode.parentRow.treeNode.children;
            //             var numchilds = row.treeNode.parentRow.treeNode.aggregations[0].value;
            //             var ctdSeleccionados = 0;
            //             for (var j = 0; j < numchilds; j++) {
            //                 if (childRows[j].row.isSelected == true) {
            //                     ctdSeleccionados = ctdSeleccionados + 1;
            //                 }
            //                 if (ctdSeleccionados == numchilds) {
            //                     id = "closeMenu"
            //                     row.treeNode.parentRow.treeNode.row.isSelected = true;
            //                 }
            //             }
            //         }

            //     }
            //     if (row.internalRow == undefined && row.isSelected == false) {
            //         var childRows = row.treeNode.parentRow.treeNode.children;
            //         var numchildRows = row.treeNode.parentRow.treeNode.aggregations[0].value;
            //         var ctdSeleccionados = 0;
            //         for (var j = 0; j < numchildRows; j++) {
            //             if (childRows[j].row.isSelected == true) {
            //                 ctdSeleccionados = ctdSeleccionados + 1;
            //             }
            //             if (ctdSeleccionados > 0) {
            //                 j = numchildRows;
            //                 row.treeNode.parentRow.treeNode.row.isSelected = false;
            //                 // row.treeNode.parentRow.treeNode.parentRow.treeNode.row.isSelected = false;
            //             }
            //         }
            //     }
            //     //FAL seleccionado de padres sin afectar las sumas
            //     if (row.entity.Pagar == null) {
            //         var grdPagarxdocumento = 0
            //     } else {
            //         grdPagarxdocumento = row.entity.Pagar;
            //     }
            //     if (row.isSelected) {
            //         $scope.grdNoIncluido = Math.round($scope.grdNoIncluido * 100) / 100 - Math.round(grdPagarxdocumento * 100) / 100;
            //         if ($scope.grdNoIncluido < 0) { $scope.grdNoIncluido = 0; }
            //         //FAL actualizar cuenta pagadoras
            //         if ($scope.grdinicia > 0) {
            //             if (row.entity.estGrid == 'Pago Reprogramado') {
            //                 $scope.grdReprogramado = Math.round($scope.grdReprogramado * 100) / 100 - Math.round(row.entity.Pagar * 100) / 100;
            //             };

            //             if ((isNaN(row.entity.Pagar)) == false) {

            //                 $scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 + Math.round(row.entity.Pagar * 100) / 100;
            //                 row.entity.estGrid = 'Pago'

            //             }

            //         }
            //     } else {
            //         $scope.grdNoIncluido = Math.round($scope.grdNoIncluido * 100) / 100 + Math.round(grdPagarxdocumento * 100) / 100;
            //         //FAL actualizar cuenta pagadoras
            //         i = 0;
            //         if ($scope.grdinicia > 0) {

            //             if ((isNaN(row.entity.Pagar)) == false) {

            //                 $scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 - Math.round(row.entity.Pagar * 100) / 100;
            //                 row.entity.estGrid = 'Pago'

            //             }


            //             //$scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 - Math.round(row.entity.Pagar * 100) / 100;
            //             if (row.entity.estGrid != 'Pago Reprogramado') {
            //                 row.entity.estGrid = 'Permitido'
            //             } else {
            //                 $scope.grdReprogramado = Math.round($scope.grdReprogramado * 100) / 100 + Math.round(row.entity.Pagar * 100) / 100;
            //             }

            //         }
            //     }


            // });
            // gridApi1.selection.on.rowSelectionChangedBatch($scope, function(rows) {
            //     //FAL 29042016 cambio de seleccion de padres
            //     var i = 0;
            //     // var numcuentas = $scope.grdBancos.length;
            //     $scope.grdNoIncluido = 0;
            //     if ($scope.grdinicia > 0) {
            //         $scope.grdBancos.forEach(function(banco, l) {
            //             $scope.grdBancos[l].subtotal = 0;
            //             $scope.grdApagar = 0;
            //         });
            //     }
            //     if ($scope.grdinicia > 0) {
            //         rows.forEach(function(row, i) {
            //             if (row.isSelected) {
            //                 if (row.entity.seleccionable == 'False') {
            //                     row.entity.estGrid = 'Pago';
            //                     $scope.grdNoIncluido = 0;
            //                     $scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 + Math.round(row.entity.Pagar * 100) / 100;
            //                     //$scope.grdApagar = $scope.grdApagar + row.entity.Pagar;
            //                     // i = numcuentas;
            //                     $scope.grdNoIncluido = 0;
            //                 }
            //             } else {
            //                 if (row.entity.seleccionable == 'False') {
            //                     row.entity.estGrid = 'Permitido';
            //                     $scope.grdNoIncluido = $scope.grdApagarOriginal;
            //                     row.treeNode.parentRow.treeNode.row.isSelected = false;
            //                     // row.treeNode.parentRow.treeNode.parentRow.treeNode.row.isSelected = false;
            //                     $scope.grdApagar = 0;
            //                 }
            //             }
            //         });
            //     }

            // });
            gridApi1.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                //FAL trabaja con las variables dependiendo si se edita o cambia la fecha
                var i = 0;
                // var numcuentas = $scope.grdBancos.length;
                if (rowEntity.estGrid == 'Pago' || rowEntity.estGrid == 'Pago Reprogramado') {
                    if (rowEntity.fechaPago == "1900-01-01T00:00:00") {
                        old_date = "";
                    } else {
                        old_date = new Date(rowEntity.fechaPago);
                    }
                    if (colDef.name == 'fechaPromesaPago') {
                        dtHoy = Date.now();
                        now_date = new Date($scope.formatDate(dtHoy));
                        new_date = new Date($scope.formatDate(newValue));
                        if (new_date <= now_date) {
                            alertFactory.warning('La fecha promesa de pago no puede ser menor o igual a ' + $scope.formatDate(dtHoy) + ' !!!');
                            rowEntity.fechaPromesaPago = old_date;
                            rowEntity.estGrid = 'Pago';
                        } else {
                            rowEntity.Pagar = rowEntity.saldo;
                            rowEntity.estGrid = 'Pago Reprogramado';
                            $scope.gridApi1.selection.unSelectRow(rowEntity);
                        }
                    }
                    if (colDef.name == 'Pagar') {
                        $scope.cantidadUpdate = newValue - oldValue;
                        if ((newValue > rowEntity.saldo) || (newValue <= 0)) {
                            alertFactory.warning('El pago es inválido !!!');
                            rowEntity.Pagar = oldValue;
                        } else {
                            if (rowEntity.estGrid == 'Pago Reprogramado') {
                                $scope.grdReprogramado = Math.round($scope.grdReprogramado * 100) / 100 - Math.round(rowEntity.Pagar * 100) / 100;
                            }
                            // for (var i = 0; i < numcuentas; i++) {
                            //     if (rowEntity.cuentaPagadora == $scope.grdBancos[i].banco) {
                            //         $scope.grdBancos[i].subtotal = Math.round($scope.grdBancos[i].subtotal * 100) / 100 + Math.round($scope.cantidadUpdate * 100) / 100;
                            //         i = numcuentas;
                            //     }
                            // };
                            $scope.grdNoIncluido = Math.round($scope.grdNoIncluido * 100) / 100 - Math.round($scope.cantidadUpdate * 100) / 100;
                            $scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 + Math.round($scope.cantidadUpdate * 100) / 100;
                            rowEntity.estGrid = 'Pago';
                            rowEntity.fechaPromesaPago = old_date;
                        }
                    }
                    //FAL valido la referencia.
                    if (colDef.name == 'referencia') {
                        if (rowEntity.convenioCIE == "")

                        {
                            if (newValue.length > 30) {
                                alertFactory.warning('La referencia no puede tener más de 30 caracteres');
                                rowEntity.referencia = oldValue;
                            }
                        } else {
                            if ((newValue.length < 5) || (newValue.length > 30)) {
                                alertFactory.warning('La referencia CIE no puede tener más de 30 caracteres ni menos de 5');
                                rowEntity.referencia = oldValue;
                            }
                        }
                    }


                } else {
                    alertFactory.warning('Solo se pueden modificar datos de los documentos seleccionados');
                    if (colDef.name == 'Pagar') {
                        rowEntity.Pagar = oldValue;
                    }
                    if (colDef.name == 'fechaPromesaPago') {
                        rowEntity.fechaPromesaPago = oldValue;
                    }
                }
            });
        }
    };
    $scope.validaDocumentosSeleccionados = function() {
        console.log($scope.bancoPago, 'BANCO')
        var rows = $scope.gridOptions.data;
        if (rows.length > 0) {
            if ($scope.bancoPago) {
                //$scope.gridOptions2.data = rows;
                console.log(rows);
                var pasaxCIE = true;
                var proveedorCIE = '';
                var pasaxbancoDestino = true;
                var proveedorcuentaDestino = '';
                var unaCuenta = true;
                rows.some(function(row, i, j) {
                    if ((row.convenioCIE == null) || (row.convenioCIE == undefined) || (row.convenioCIE == "")) {
                        pasaxCIE = true;
                    } else {
                        pasaxCIE = false;
                    }
                    if (pasaxCIE == false) {
                        if ((row.referencia == null) || (row.referencia == undefined) || (row.referencia == "")) {
                            proveedorCIE = row.proveedor;
                            return true;
                        } else {
                            var ctrCuentaDestinoArr = row.cuentaDestino.split(',');
                            if (ctrCuentaDestinoArr.length > 1) {
                                pasaxbancoDestino = false;
                                proveedorcuentaDestino = row.proveedor;
                                alertFactory.warning('El proveedor CIE' + proveedorcuentaDestino + ' Tiene mas de una cuenta destino');
                                unaCuenta = false;
                                pasaxCIE = false;
                                return true;
                            } else {
                                pasaxCIE = true;
                                return false;
                            }
                        }
                    }
                    var ctrCuentaDestinoArr = row.cuentaDestino.split(',');
                    if (ctrCuentaDestinoArr.length > 1) {
                        pasaxbancoDestino = false;
                        proveedorcuentaDestino = row.proveedor;
                        alertFactory.warning('El proveedor ' + proveedorcuentaDestino + ' Tiene mas de una cuenta destino');
                        unaCuenta = false;
                        return true;
                    }
                });
                if (unaCuenta) {
                    if (pasaxCIE) {
                        $scope.guardarLote();
                    } else {
                        alertFactory.warning('Existe un documento del proveedor ' + proveedorCIE + ' con convenio CIE sin referencia');
                    };
                }
            } else {
                alertFactory.warning('Debe seleccionar una cuenta');
            }
        } else {
            alertFactory.warning('Debe seleccionar por lo menos un documento');
        }
    };
    $scope.guardarLote = function() {
        var rows = $scope.gridOptions.data;
        $scope.sumaDocumentos = 0;
        angular.forEach(rows, function(value, key) {
            $scope.sumaDocumentos = $scope.sumaDocumentos + value.monto;
        });
        var dataEncabezado = {
            idEmpresa: sessionFactory.empresaID,
            idUsuario: $scope.idUsuario,
            nombreLote: $scope.nombreLote,
            estatus: 1,
            esAplicacionDirecta: 0,
            cifraControl: ($scope.sumaDocumentos).toFixed(2)
        };
        crealoteFactory.setEncabezadoPago(dataEncabezado)
            .then(function successCallback(response) {
                $scope.idLotePadre = response.data[0].idLotePadre;
                var array = [];
                var count = 1;
                rows.forEach(function(row, i) {
                    var elemento = {};
                    elemento.pal_id_lote_pago = $scope.idLotePadre; //response.data;
                    elemento.pad_polTipo = row.polTipo; //entity.polTipo;
                    elemento.pad_polAnnio = row.annio;
                    elemento.pad_polMes = row.polMes;
                    elemento.pad_polConsecutivo = row.polConsecutivo;
                    elemento.pad_polMovimiento = row.polMovimiento;
                    elemento.pad_fechaPromesaPago = (row.fechaPromesaPago == '' ? '1900-01-01T00:00:00' : row.fechaPromesaPago);
                    elemento.pad_saldo = parseFloat(row.Pagar) + .00000001; //row.saldo;//
                    //15062018
                    if ((row.referencia == null) || (row.referencia == undefined) || (row.referencia == "")) {
                        row.referencia = "AUT";
                    } else {
                        if (row.convenioCIE == "") {
                            //row.referencia = $scope.idLotePadre + '-' + row.idProveedor + '-' + row.referencia.replace(" ", "");
                        }
                    }
                    //fin 15062018
                    elemento.pad_documento = row.documento;
                    elemento.pad_polReferencia = row.referencia; //FAL 09052015 mandar referencia
                    elemento.tab_revision = '1';
                    if (row.agrupar == 1) {
                        elemento.pad_agrupamiento = count;
                    } else {
                        elemento.pad_agrupamiento = row.agrupar;
                    }

                    elemento.pad_bancoPagador = $scope.bancoPago.cuenta;
                    var lonbancodestino = row.cuentaDestino.length;
                    var primerparentesis = row.cuentaDestino.indexOf("(", 0)
                    var numcuentaDestino = row.cuentaDestino.substring(primerparentesis + 1, lonbancodestino)
                    var res = numcuentaDestino.replace("(", "");
                    res = res.replace(")", "");
                    res = res.replace(",", "");
                    res = res.replace(",", "");
                    res = res.replace(",", "");
                    res = res.replace(" ", "");
                    elemento.pad_bancoDestino = res;
                    array.push(elemento);
                    count = count + 1;
                });

                var jsIngresos = angular.toJson([{}]); //delete $scope.ingresos['$$hashKey'];
                var jsTransf = angular.toJson([{}]);
                var jsEgresos = angular.toJson([{}]);
                // array, $rootScope.currentEmployee, $scope.idLotePadre, jsIngresos, jsTransf, $scope.caja, $scope.cobrar, jsEgresos, ($scope.estatusLote == 0) ? 1 : 2
                crealoteFactory.setDatos(array, $scope.idUsuario, $scope.idLotePadre, jsIngresos, jsTransf, 0, 0, jsEgresos, 1)
                    .then(function successCallback(response) {
                        console.log(response.data[0].estatus, 'INSERTO???MMMM')
                        if (response.data[0].estatus == 1) {
                            alertFactory.success('Se guardaron los datos.');
                            window.location = "/interes";
                        } else {
                            alertFactory.error('Ocurrio un Problema al guardar el lote')
                        }

                    }, function errorCallback(response) {
                        alertFactory.error('Error al guardar Datos');
                    });
            }, function errorCallback(response) {
                alertFactory.error('Error al insertar en tabla padre.');
            });

    };
    $scope.actualizarCartera = function() {
        $('#mdlLoading').modal('show');
        crealoteFactory.actualizarCartera(sessionFactory.empresaID).then(function success(result) {
            console.log(result.data);
            // $('#mdlLoading').modal('hide');
            alertFactory.success('Se actualizo correctamente');
            cargaInfoGridLotes();
        }, function error(err) {
            $('#mdlLoading').modal('hide');
            console.log('Error al actualizar Cartera', err)
        });
    };
});
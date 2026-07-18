appModule.controller('preloteController', function($scope, preloteFactory) {

    $scope.idUsuario     = localStorage.getItem('idUsuario');
    $scope.vistaActual   = 'lista';
    $scope.lstPrelotes   = [];
    $scope.preloteActual = null;
    $scope.lstDetalle    = [];

    // ── Lista de pre-lotes ─────────────────────────────────────────────────────
    $scope.cargarLista = function() {
        preloteFactory.getPrelotes($scope.idUsuario)
            .then(function(result) {
                $scope.lstPrelotes = result.data || [];
            }, function() {
                swal('Error', 'No se pudo cargar la lista de pre-lotes.', 'error');
            });
    };
    $scope.cargarLista();

    // ── Ver detalle (unidades vs sábana vigente) ───────────────────────────────
    $scope.verDetalle = function(prelote) {
        $scope.preloteActual = prelote;
        $scope.lstDetalle    = [];
        preloteFactory.getPreloteVsSabana(prelote.ppl_id)
            .then(function(result) {
                $scope.lstDetalle  = result.data || [];
                $scope.vistaActual = 'detalle';
            }, function() {
                swal('Error', 'No se pudo cargar el detalle del pre-lote.', 'error');
            });
    };

    // ── Regresar a la lista ────────────────────────────────────────────────────
    $scope.regresar = function() {
        $scope.vistaActual   = 'lista';
        $scope.preloteActual = null;
        $scope.lstDetalle    = [];
    };

    // ── Cancelar pre-lote ──────────────────────────────────────────────────────
    $scope.cancelarPrelote = function(prelote) {
        swal({
            title:             '¿Cancelar pre-lote?',
            text:              '"' + prelote.ppl_nombre + '" — ' + prelote.NombreEmpresa,
            type:              'warning',
            showCancelButton:  true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText:  'No'
        }, function(confirmar) {
            if (!confirmar) return;
            preloteFactory.cancelPrelote(prelote.ppl_id)
                .then(function(result) {
                    if (result.data && result.data.ok) {
                        swal('Cancelado', 'Pre-lote cancelado correctamente.', 'success');
                        $scope.cargarLista();
                    } else {
                        swal('Error', 'No se pudo cancelar el pre-lote.', 'error');
                    }
                }, function() {
                    swal('Error', 'Error de comunicación al cancelar.', 'error');
                });
        });
    };

    // ── Grid: lista de pre-lotes ───────────────────────────────────────────────
    $scope.gridListaOptions = {
        bindingOptions:        { dataSource: 'lstPrelotes' },
        showBorders:           true,
        rowAlternationEnabled: true,
        filterRow:             { visible: true },
        searchPanel:           { visible: true, width: 220, placeholder: 'Buscar...' },
        headerFilter:          { visible: true },
        paging:                { pageSize: 15 },
        pager:                 { showPageSizeSelector: true, allowedPageSizes: [10, 15, 30], showInfo: true },
        noDataText:            'Sin pre-lotes registrados.',
        columns: [
            { dataField: 'ppl_nombre',    caption: 'Nombre',        width: 220 },
            { dataField: 'NombreEmpresa', caption: 'Empresa',       width: 240 },
            {
                dataField: 'ppl_fecha',
                caption:   'Fecha creación',
                width:     150,
                dataType:  'datetime',
                format:    'dd/MM/yyyy HH:mm'
            },
            { dataField: 'TotalUnidades', caption: 'Unidades',   width: 90,  dataType: 'number' },
            {
                dataField: 'TotalSaldo',
                caption:   'Saldo total',
                width:     150,
                dataType:  'number',
                format:    { type: 'currency', precision: 2 }
            },
            {
                dataField: 'ppl_estatus',
                caption:   'Estatus',
                width:     110,
                cellTemplate: function(container, options) {
                    var mapa = {
                        1: ['Borrador', 'label-info'],
                        2: ['Enviado',  'label-success'],
                        3: ['Cancelado','label-danger']
                    };
                    var info = mapa[options.value] || [String(options.value), 'label-default'];
                    container.append(
                        '<span class="label ' + info[1] + '" style="font-size:12px;">' + info[0] + '</span>'
                    );
                }
            },
            {
                caption:   'Acciones',
                width:     120,
                alignment: 'center',
                allowFiltering: false,
                allowSorting:   false,
                cellTemplate: function(container, options) {
                    $('<button class="btn btn-xs btn-primary m-r-xs">')
                        .html('<i class="fa fa-eye"></i> Ver')
                        .attr('title', 'Ver unidades y comparar con sábana actual')
                        .on('click', function() {
                            $scope.$applyAsync(function() { $scope.verDetalle(options.data); });
                        })
                        .appendTo(container);

                    $('<button class="btn btn-xs btn-danger">')
                        .html('<i class="fa fa-ban"></i>')
                        .attr('title', 'Cancelar pre-lote')
                        .on('click', function() {
                            $scope.$applyAsync(function() { $scope.cancelarPrelote(options.data); });
                        })
                        .appendTo(container);
                }
            }
        ]
    };

    // ── Grid: detalle (snapshot vs sábana vigente) ─────────────────────────────
    $scope.gridDetalleOptions = {
        bindingOptions:        { dataSource: 'lstDetalle' },
        showBorders:           true,
        rowAlternationEnabled: true,
        filterRow:             { visible: true },
        searchPanel:           { visible: true, width: 220, placeholder: 'Buscar...' },
        headerFilter:          { visible: true },
        paging:                { pageSize: 20 },
        pager:                 { showPageSizeSelector: true, allowedPageSizes: [10, 20, 50], showInfo: true },
        noDataText:            'Sin unidades en este pre-lote.',
        columns: [
            { dataField: 'ppd_serie',         caption: 'Serie',               width: 160 },
            { dataField: 'ppd_ccp_iddocto',   caption: 'Doc. Plan Piso',      width: 170 },
            { dataField: 'ppd_cartera',        caption: 'Cartera',             width: 140 },
            // ─── Snapshot (al crear el pre-lote) ───
            {
                dataField: 'SaldoSnapshot',
                caption:   'Saldo (snapshot)',
                width:     150,
                dataType:  'number',
                format:    { type: 'currency', precision: 2 }
            },
            { dataField: 'SituacionSnapshot', caption: 'Situación (snap.)',   width: 140 },
            // ─── Estado vigente en la sábana ───
            {
                dataField: 'SaldoActual',
                caption:   'Saldo actual',
                width:     150,
                dataType:  'number',
                format:    { type: 'currency', precision: 2 }
            },
            { dataField: 'SituacionActual',   caption: 'Situación actual',    width: 140 },
            {
                dataField: 'EnSabana',
                caption:   'En sábana',
                width:     90,
                dataType:  'boolean'
            },
            {
                dataField: 'Alerta',
                caption:   'Alerta',
                width:     190,
                cellTemplate: function(container, options) {
                    var css = {
                        'Sin cambios':       'label-success',
                        'Saldo cambió':      'label-warning',
                        'Situación cambió':  'label-warning',
                        'No está en sábana': 'label-danger'
                    };
                    var texto = options.value || '';
                    var badge = css[texto] || 'label-default';
                    container.append(
                        '<span class="label ' + badge + '" style="font-size:12px;">' + texto + '</span>'
                    );
                }
            }
        ]
    };

});

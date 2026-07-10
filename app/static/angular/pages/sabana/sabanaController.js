appModule.controller('sabanaController', function($scope, commonFactory, empresaFactory, sabanaFactory) {

    $scope.idUsuario = localStorage.getItem("idUsuario");

    // ── Estado de filtros ──────────────────────────────────────────────────────
    $scope.currentEmpresaName    = 'Selecciona Empresa';
    $scope.currentEmpresaID      = null;
    $scope.currentFinancieraName = 'Selecciona Financiera';
    $scope.currentFinancieraID   = null;
    $scope.lstEmpresas           = [];
    $scope.lstFinancieras        = [];
    $scope.seleccionadas         = [];

    // ── Carga inicial de empresas ──────────────────────────────────────────────
    empresaFactory.getEmpresa($scope.idUsuario).then(function(result) {
        $scope.lstEmpresas = result.data;
    });

    // ── Selección de empresa ───────────────────────────────────────────────────
    $scope.setCurrentEmpresa = function(empresaObj) {
        if (empresaObj === null) {
            $scope.currentEmpresaName = 'Selecciona Empresa';
            $scope.currentEmpresaID   = null;
            _resetFinanciera();
        } else {
            $scope.currentEmpresaName = empresaObj.emp_nombre;
            $scope.currentEmpresaID   = empresaObj.emp_idempresa;
            _resetFinanciera();
            commonFactory.getFinancial(empresaObj.emp_idempresa, $scope.idUsuario).then(function(result) {
                $scope.lstFinancieras = result.data;
            });
        }
    };

    // ── Selección de financiera ────────────────────────────────────────────────
    $scope.setCurrentFinanciera = function(financieraObj) {
        if (financieraObj === null) {
            $scope.currentFinancieraName = 'Selecciona Financiera';
            $scope.currentFinancieraID   = null;
        } else {
            $scope.currentFinancieraName = financieraObj.nombre;
            $scope.currentFinancieraID   = financieraObj.financieraID;
        }
    };

    // ── Limpiar filtros ────────────────────────────────────────────────────────
    $scope.limpiarBusqueda = function() {
        $scope.currentEmpresaName = 'Selecciona Empresa';
        $scope.currentEmpresaID   = null;
        $scope.seleccionadas      = [];
        _resetFinanciera();
        _actualizarGrid([]);
    };

    // ── Buscar ─────────────────────────────────────────────────────────────────
    $scope.buscar = function() {
        $('#mdlLoading').modal('show');
        sabanaFactory.getUnidades($scope.currentEmpresaID, $scope.currentFinancieraID)
            .then(function(result) {
                _actualizarGrid(result.data);
                $('#mdlLoading').modal('hide');
            }, function() {
                $('#mdlLoading').modal('hide');
                swal('Error', 'No se pudo obtener la información.', 'error');
            });
    };

    // ── Quitar filtro individual (re-busca si ya había resultados) ────────────
    $scope.quitarEmpresa = function() {
        $scope.setCurrentEmpresa(null);
        if ($scope.lstUnidades.length > 0) $scope.buscar();
    };

    $scope.quitarFinanciera = function() {
        $scope.setCurrentFinanciera(null);
        if ($scope.lstUnidades.length > 0) $scope.buscar();
    };

    // ── Exportar Excel con formato coloreado ───────────────────────────────────
    $scope.exportarExcel = function() {
        var url = sabanaFactory.getExcelUrl($scope.currentEmpresaID, $scope.currentFinancieraID);
        window.open(url, '_blank');
    };

    // ── Acción sobre seleccionadas ─────────────────────────────────────────────
    $scope.verSeleccionadas = function() {
        if ($scope.seleccionadas.length === 0) {
            swal('Aviso', 'No hay unidades seleccionadas.', 'warning');
            return;
        }
        $('#mdlSeleccionadas').modal('show');
    };

    $scope.exportarSeleccionadas = function() {
        if ($scope.seleccionadas.length === 0) return;
        sabanaFactory.exportarSeleccionadas($scope.seleccionadas)
            .then(function(blob) {
                var url   = window.URL.createObjectURL(blob);
                var a     = document.createElement('a');
                var fecha = new Date().toISOString().slice(0, 10);
                a.href     = url;
                a.download = 'sabana_seleccionadas_' + fecha + '.xlsx';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(function() {
                swal('Error', 'No se pudo generar el Excel de seleccionadas.', 'error');
            });
    };

    // ── Opciones del dx-data-grid ──────────────────────────────────────────────
    $scope.lstUnidades = [];

    $scope.gridOptions = {
        bindingOptions: { dataSource: 'lstUnidades' },
        keyExpr: null,
        showBorders: true,
        rowAlternationEnabled: true,
        filterRow:    { visible: true },
        searchPanel:  { visible: true, width: 260, placeholder: 'Buscar...' },
        headerFilter: { visible: true },
        filterPanel:  { visible: true },
        groupPanel:   { visible: true },
        columnChooser:{ enabled: true },
        paging:       { pageSize: 20 },
        pager:        { showPageSizeSelector: true, allowedPageSizes: [10, 20, 50], showInfo: true },
        export:       { enabled: false },
        selection:    { mode: 'multiple', showCheckBoxesMode: 'always' },
        noDataText:   'Presiona Buscar para cargar la información.',
        summary: {
            totalItems: [
                { column: 'Saldo_actual',  summaryType: 'sum', valueFormat: { type: 'currency', precision: 2 }, displayFormat: 'Total saldo: {0}' },
                { column: 'CCP_IDDOCTO',   summaryType: 'count', displayFormat: '{0} registros' }
            ]
        },
        columns: [
            // ── Grupo 1: Financiera ───────────────────────────────────────────
            { dataField: 'IdEmpresa',            caption: 'IdEmpresa',                   width: 96,  dataType: 'number' },
            { dataField: 'NombreEmpresa',        caption: 'Nombre Empresa',              width: 240 },
            { dataField: 'IdFinanciera',         caption: 'IdFinanciera',                width: 104, dataType: 'number' },
            { dataField: 'NombreFinanciera',            caption: 'Nombre Financiera',           width: 224 },
            { dataField: 'Serie',                caption: 'Serie',                       width: 176 },
            { dataField: 'Modelo',               caption: 'Modelo',                      width: 128 },
            { dataField: 'Marca',                caption: 'Marca',                       width: 128 },
            { dataField: 'Anio_modelo',          caption: 'Anio_modelo',                 width: 96,  dataType: 'number' },
            { dataField: 'NUMFACPTA',            caption: 'NUMFACPTA',                   width: 144 },
            { dataField: 'Importe_original',     caption: 'Importe_original',            width: 144, dataType: 'number', format: { type: 'currency', precision: 2 } },
            { dataField: 'FECHAFACPTA',          caption: 'FECHAFACPTA',                 width: 112, dataType: 'date', format: 'dd/MM/yyyy' },
            { dataField: 'Fecha_inicio',         caption: 'Fecha_inicio',                width: 112, dataType: 'date', format: 'dd/MM/yyyy' },
            { dataField: 'Fecha_vencimiento',    caption: 'Fecha_vencimiento',           width: 144, dataType: 'date', format: 'dd/MM/yyyy' },
            { dataField: 'DIASFIN',              caption: 'DIASFIN',                     width: 80,  dataType: 'number' },
            { dataField: 'Saldo_actual',         caption: 'Saldo_actual',                width: 128, dataType: 'number', format: { type: 'currency', precision: 2 } },
            // ── Grupo 2: Cartera Plan Piso ────────────────────────────────────
            { dataField: 'Empresa_PP',           caption: 'Empresa_PP',                  width: 96,  visible: false },
            { dataField: 'CCP_IDDOCTO',          caption: 'CCP_IDDOCTO',                 width: 112 },
            { dataField: 'MODULO',               caption: 'MODULO',                      width: 80,  visible: false },
            { dataField: 'DES_CARTERA',          caption: 'DES_CARTERA',                 width: 128 },
            { dataField: 'DES_TIPODOCTO',        caption: 'DES_TIPODOCTO',               width: 128 },
            { dataField: 'CCP_FECHADOCTO',       caption: 'CCP_FECHADOCTO',              width: 112, dataType: 'date', format: 'dd/MM/yyyy' },
            { dataField: 'CCP_IDPERSONA',        caption: 'CCP_IDPERSONA',               width: 112 },
            { dataField: 'Nombre',               caption: 'Nombre',                      width: 224 },
            { dataField: 'CCP_FECHVEN',          caption: 'CCP_FECHVEN',                 width: 112, dataType: 'date', format: 'dd/MM/yyyy' },
            { dataField: 'CCP_FECHPROMPAG',      caption: 'CCP_FECHPROMPAG',             width: 128, dataType: 'date', format: 'dd/MM/yyyy' },
            { dataField: 'CCP_FECHREV',          caption: 'CCP_FECHREV',                 width: 112, dataType: 'date', format: 'dd/MM/yyyy' },
            { dataField: 'CCP_OBSGEN',           caption: 'CCP_OBSGEN',                  width: 160 },
            { dataField: 'IMPORTE',              caption: 'IMPORTE',                     width: 128, dataType: 'number', format: { type: 'currency', precision: 2 } },
            { dataField: 'SALDO_PP',             caption: 'SALDO',                       width: 128, dataType: 'number', format: { type: 'currency', precision: 2 } },
            { dataField: 'DIAS',                 caption: 'DIAS',                        width: 80,  dataType: 'number' },
            { dataField: 'DIASVENCIDOS',         caption: 'DIASVENCIDOS',                width: 104, dataType: 'number' },
            { dataField: 'INTERESES',            caption: 'INTERESES',                   width: 112, dataType: 'number', format: { type: 'currency', precision: 2 } },
            { dataField: 'CCP_CARTERA',          caption: 'CCP_CARTERA',                 width: 112 },
            { dataField: 'ClasiMovimiento',      caption: 'ClasiMovimiento',             width: 128 },
            { dataField: 'CCP_CTA',              caption: 'CCP_CTA',                     width: 112 },
            // ── Grupo 3: Cartera Planta ───────────────────────────────────────
            { dataField: 'PTA_Empresa_PP',       caption: 'PTA_Empresa_PP',              width: 112 },
            { dataField: 'PTA_CCP_IDDOCTO',      caption: 'PTA_CCP_IDDOCTO',             width: 128 },
            { dataField: 'PTA_MODULO',           caption: 'PTA_MODULO',                  width: 96,  visible: false },
            { dataField: 'PTA_DES_CARTERA',      caption: 'PTA_DES_CARTERA',             width: 128 },
            { dataField: 'PTA_DES_TIPODOCTO',    caption: 'PTA_DES_TIPODOCTO',           width: 144 },
            { dataField: 'PTA_CCP_FECHADOCTO',   caption: 'PTA_CCP_FECHADOCTO',          width: 144, dataType: 'date', format: 'dd/MM/yyyy' },
            { dataField: 'PTA_CCP_IDPERSONA',    caption: 'PTA_CCP_IDPERSONA',           width: 128 },
            { dataField: 'PTA_Nombre',           caption: 'PTA_Nombre',                  width: 224 },
            { dataField: 'PTA_CCP_FECHVEN',      caption: 'PTA_CCP_FECHVEN',             width: 128, dataType: 'date', format: 'dd/MM/yyyy' },
            { dataField: 'PTA_CCP_FECHPROMPAG',  caption: 'PTA_CCP_FECHPROMPAG',         width: 144, dataType: 'date', format: 'dd/MM/yyyy' },
            { dataField: 'PTA_CCP_FECHREV',      caption: 'PTA_CCP_FECHREV',             width: 128, dataType: 'date', format: 'dd/MM/yyyy' },
            { dataField: 'PTA_CCP_OBSGEN',       caption: 'PTA_CCP_OBSGEN',              width: 160 },
            { dataField: 'PTA_IMPORTE',          caption: 'PTA_IMPORTE',                 width: 128, dataType: 'number', format: { type: 'currency', precision: 2 } },
            { dataField: 'PTA_SALDO',            caption: 'PTA_SALDO',                   width: 128, dataType: 'number', format: { type: 'currency', precision: 2 } },
            { dataField: 'PTA_DIAS',             caption: 'PTA_DIAS',                    width: 96,  dataType: 'number' },
            { dataField: 'PTA_DIASVENCIDOS',     caption: 'PTA_DIASVENCIDOS',            width: 120, dataType: 'number' },
            { dataField: 'PTA_INTERESES',        caption: 'PTA_INTERESES',               width: 128, dataType: 'number', format: { type: 'currency', precision: 2 } },
            { dataField: 'PTA_CCP_CARTERA',      caption: 'PTA_CCP_CARTERA',             width: 128 },
            { dataField: 'PTA_ClasiMovimiento',  caption: 'PTA_ClasiMovimiento',         width: 144 },
            { dataField: 'PTA_CCP_CTA',          caption: 'PTA_CCP_CTA',                 width: 112 },
            // ── Grupo 4: Inventario ───────────────────────────────────────────
            { dataField: 'SUC',                  caption: 'SUC',                         width: 80 },
            { dataField: 'VEH_NUMSERIE',         caption: 'VEH_NUMSERIE',                width: 176 },
            { dataField: 'VEH_TIPOAUTO',         caption: 'VEH_TIPOAUTO',                width: 112 },
            { dataField: 'VEH_CATALOGO',         caption: 'VEH_CATALOGO',                width: 144 },
            { dataField: 'VEH_NOFACTPLAN',       caption: 'VEH_NOFACTPLAN',              width: 128 },
            { dataField: 'VEH_IMPFACTPLAN',      caption: 'VEH_IMPFACTPLAN',             width: 128, dataType: 'number', format: { type: 'currency', precision: 2 } },
            { dataField: 'VEH_SITUACION',        caption: 'VEH_SITUACION',               width: 112 },
            { dataField: 'VTE_DOCTO',            caption: 'VTE_DOCTO',                   width: 112 },
            { dataField: 'VTE_IDCLIENTE',        caption: 'VTE_IDCLIENTE',               width: 112 },
            { dataField: 'VTE_FECHDOCTO',        caption: 'VTE_FECHDOCTO',               width: 112, dataType: 'date', format: 'dd/MM/yyyy' },
            { dataField: 'VTE_REFERENCIA1',      caption: 'VTE_REFERENCIA1',             width: 144 },
            { dataField: 'VTE_FORMAPAGO',        caption: 'VTE_FORMAPAGO',               width: 112 },
            { dataField: 'VTE_VTABRUT',          caption: 'VTE_VTABRUT',                 width: 112, dataType: 'number', format: { type: 'currency', precision: 2 } },
            { dataField: 'VTE_IVA',              caption: 'VTE_IVA',                     width: 112, dataType: 'number', format: { type: 'currency', precision: 2 } },
            { dataField: 'VTE_TOTAL',            caption: 'VTE_TOTAL',                   width: 112, dataType: 'number', format: { type: 'currency', precision: 2 } },
            { dataField: 'VTE_SERIE',            caption: 'VTE_SERIE',                   width: 176 },
            { dataField: 'PEN_FECHAENTREGA_REAL',caption: 'PEN_FECHAENTREGA_REAL',        width: 160, dataType: 'date', format: 'dd/MM/yyyy' },
            { dataField: 'PEN_NUMSERIE',         caption: 'PEN_NUMSERIE',                width: 176 },
            // ── Grupo 5: Cuentas por Cobrar ───────────────────────────────────
            { dataField: 'cliente',              caption: 'cliente',                     width: 96,  visible: false },
            { dataField: 'rfc_cliente',          caption: 'rfc_cliente',                 width: 128 },
            { dataField: 'nombre_cliente',       caption: 'nombre_cliente',              width: 240 },
            { dataField: 'referencia',           caption: 'referencia',                  width: 144 },
            { dataField: 'fecha_movimiento',     caption: 'fecha_movimiento',            width: 144, dataType: 'date', format: 'dd/MM/yyyy' },
            { dataField: 'clasificacion',        caption: 'clasificacion',               width: 128 },
            { dataField: 'nombre_cuenta',        caption: 'nombre_cuenta',               width: 176 },
            { dataField: 'saldo',                caption: 'saldo',                       width: 112, dataType: 'number', format: { type: 'currency', precision: 2 } },
            { dataField: 'INV_CCP_FECHVEN',      caption: 'CCP_FECHVEN',                 width: 112, dataType: 'date', format: 'dd/MM/yyyy' },
            { dataField: 'INV_CCP_FECHPROMPAG',  caption: 'CCP_FECHPROMPAG',             width: 144, dataType: 'date', format: 'dd/MM/yyyy' },
            { dataField: 'COTIZACION',           caption: 'COTIZACION',                  width: 112 },
            { dataField: 'CANAL_VENTA',          caption: 'CANAL_VENTA',                 width: 112 },
            // ── Columnas individuales (fondo azul en Excel) ───────────────────
            { dataField: 'Validacion',           caption: 'En Plan piso Financiera y GA', width: 240,
              cellTemplate: function(container, options) {
                  var css = options.value === 'En Plan piso Correcto' ? 'label-success' : 'label-danger';
                  container.append('<span class="label ' + css + '">' + options.value + '</span>');
              }
            },
            { dataField: 'Resultado',            caption: 'Unidad Estrella',             width: 144, dataType: 'number', format: { type: 'currency', precision: 2 } },
            { dataField: 'SaldoInventario', caption: 'Unidades No financiadas',    width: 192, dataType: 'number', format: { type: 'currency', precision: 2 } }
        ],
        onSelectionChanged: function(e) {
            $scope.$applyAsync(function() {
                $scope.seleccionadas = e.selectedRowsData;
            });
        },
        onInitialized: function(e) { $scope.gridInstance = e.component; },
        onExporting: function(e) { e.component.beginUpdate(); },
        onExported:  function(e) { e.component.endUpdate(); }
    };

    // ── Grid de unidades seleccionadas (modal) ─────────────────────────────────
    $scope.gridSeleccionadasOptions = {
        bindingOptions:      { dataSource: 'seleccionadas' },
        keyExpr:             null,
        showBorders:         true,
        rowAlternationEnabled: true,
        filterRow:           { visible: true },
        searchPanel:         { visible: true, width: 240, placeholder: 'Buscar...' },
        headerFilter:        { visible: true },
        filterPanel:         { visible: true },
        groupPanel:          { visible: true },
        columnChooser:       { enabled: true },
        paging:              { pageSize: 10 },
        pager:               { showPageSizeSelector: true, allowedPageSizes: [10, 25, 50], showInfo: true },
        export:              { enabled: false },
        noDataText:          'No hay unidades seleccionadas.',
        columns:             $scope.gridOptions.columns
    };

    // ── Helpers privados ───────────────────────────────────────────────────────
    function _resetFinanciera() {
        $scope.currentFinancieraName = 'Selecciona Financiera';
        $scope.currentFinancieraID   = null;
        $scope.lstFinancieras        = [];
    }

    function _actualizarGrid(datos) {
        $scope.lstUnidades   = datos;
        $scope.seleccionadas = [];
        if ($scope.gridInstance) {
            $scope.gridInstance.option('dataSource', datos);
        }
    }

});

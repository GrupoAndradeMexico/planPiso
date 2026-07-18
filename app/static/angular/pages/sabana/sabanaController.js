appModule.controller('sabanaController', function($scope, commonFactory, empresaFactory, sabanaFactory, filtroReglasFactory, preloteFactory) {

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
        if ($scope.seleccionadas.length > 0) {
            // Exportar solo las filas seleccionadas
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
        } else {
            // Sin selección: exportar todos los resultados de la búsqueda
            var url = sabanaFactory.getExcelUrl($scope.currentEmpresaID, $scope.currentFinancieraID);
            window.open(url, '_blank');
        }
    };

    // ── Panel swap: grid principal ↔ vista de selección ───────────────────────
    $scope.vistaActual = 'grid';

    $scope.regresarAlGrid = function() {
        $scope.vistaActual = 'grid';
    };

    $scope.verSeleccionadas = function() {
        if ($scope.seleccionadas.length === 0) {
            swal('Aviso', 'No hay unidades seleccionadas.', 'warning');
            return;
        }
        $scope.vistaActual = 'seleccion';
    };

    // ── Crear Pre-Lote ─────────────────────────────────────────────────────────
    $scope.crearPrelote = function() {
        if ($scope.seleccionadas.length === 0) {
            swal('Aviso', 'No hay unidades seleccionadas.', 'warning');
            return;
        }

        // Agrupar por empresa para mostrar resumen al usuario
        var grupos = {};
        $scope.seleccionadas.forEach(function(u) {
            var k = u.IdEmpresa;
            if (!grupos[k]) grupos[k] = { nombre: u.NombreEmpresa || ('Empresa ' + k), total: 0 };
            grupos[k].total++;
        });
        var numEmpresas   = Object.keys(grupos).length;
        var resumen       = Object.keys(grupos).map(function(k) {
            return '• ' + grupos[k].nombre + ' — ' + grupos[k].total + ' unidades';
        }).join('\n');

        swal({
            title:             'Crear Pre-Lote',
            text:              'Se crearán ' + numEmpresas + ' pre-lote(s):\n' + resumen + '\n\nNombre del grupo:',
            type:              'input',
            inputValue:        '',
            showCancelButton:  true,
            confirmButtonText: 'Crear',
            cancelButtonText:  'Cancelar',
            closeOnConfirm:    false
        }, function(nombre) {
            if (nombre === false) return;
            nombre = (nombre || '').trim();
            if (!nombre) {
                swal.showInputError('El nombre es obligatorio.');
                return;
            }

            swal({ title: 'Guardando…', text: 'Por favor espera.', showConfirmButton: false });

            preloteFactory.insertPrelote(nombre, $scope.idUsuario, $scope.seleccionadas)
                .then(function(result) {
                    if (result.data && result.data.ok) {
                        swal('Creado', 'Pre-lote(s) creados correctamente.', 'success');
                    } else {
                        swal('Error', (result.data && result.data.mensaje) || 'No se pudo crear el pre-lote.', 'error');
                    }
                }, function() {
                    swal('Error', 'Error de comunicación al crear el pre-lote.', 'error');
                });
        });
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
            { dataField: 'NombreFinanciera',                caption: 'Nombre Financiera',           width: 224 },
            { dataField: 'Serie',                caption: 'Serie',                       width: 176 },
            { dataField: 'SerieRepetida',        caption: 'Serie repetida',              width: 120, dataType: 'boolean', visible: false },
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
        filterPanel:         { visible: false },
        groupPanel:          { visible: true },
        columnChooser:       { enabled: true },
        paging:              { pageSize: 10 },
        pager:               { showPageSizeSelector: true, allowedPageSizes: [10, 25, 50], showInfo: true },
        export:              { enabled: false },
        noDataText:          'No hay unidades seleccionadas.',
        columns:             $scope.gridOptions.columns
    };

    // ── Filtro Constructor (dxFilterBuilder) ───────────────────────────────────
    var _filterFields = [
        { dataField: 'NombreEmpresa',        caption: 'Empresa',                 dataType: 'string' },
        { dataField: 'NOMBREFIN',            caption: 'Financiera',              dataType: 'string' },
        { dataField: 'Marca',                caption: 'Marca',                   dataType: 'string' },
        { dataField: 'Modelo',               caption: 'Modelo',                  dataType: 'string' },
        { dataField: 'SUC',                  caption: 'Sucursal',                dataType: 'string' },
        { dataField: 'VEH_NUMSERIE',         caption: 'No. Serie',               dataType: 'string' },
        { dataField: 'SerieRepetida',        caption: 'Serie repetida',          dataType: 'boolean' },
        { dataField: 'VEH_SITUACION',        caption: 'Situación',               dataType: 'string' },
        { dataField: 'Saldo_actual',         caption: 'Saldo actual',            dataType: 'number' },
        { dataField: 'SALDO_PP',             caption: 'Saldo PP',                dataType: 'number' },
        { dataField: 'DIAS',                 caption: 'Días',                    dataType: 'number' },
        { dataField: 'DIASVENCIDOS',         caption: 'Días vencidos',           dataType: 'number' },
        { dataField: 'INTERESES',            caption: 'Intereses',               dataType: 'number' },
        { dataField: 'Importe_original',     caption: 'Importe original',        dataType: 'number' },
        { dataField: 'Resultado',            caption: 'Unidad Estrella',         dataType: 'number' },
        { dataField: 'UnidadesNoFinanciadas',caption: 'Unid. No Financiadas',    dataType: 'number' },
        { dataField: 'Validacion',           caption: 'Validación',              dataType: 'string' },
        { dataField: 'FECHAFACPTA',          caption: 'Fecha Factura',           dataType: 'date'   },
        { dataField: 'Fecha_vencimiento',    caption: 'Fecha Vencimiento',       dataType: 'date'   },
        { dataField: 'Fecha_inicio',         caption: 'Fecha Inicio',            dataType: 'date'   }
    ];

    $scope.panelFiltrosVisible    = false;
    $scope.filtroConstructorValue = null;
    $scope.reglaEnEdicion         = null;   // regla que está siendo editada

    // Devuelve true si la expresión actual ya existe en las reglas guardadas
    // (excluye la regla que se está editando para no bloquearse a sí misma)
    $scope.esFiltroYaGuardado = function() {
        if ($scope.reglaEnEdicion) return false;
        if (!$scope.filtroConstructorValue) return false;
        var exprActual = JSON.stringify($scope.filtroConstructorValue);
        return $scope.lstReglas.some(function(r) {
            return r.Expresion === exprActual;
        });
    };

    $scope.filtroConstructorOptions = {
        bindingOptions: { value: 'filtroConstructorValue' },
        fields:         _filterFields,
        groupOperationDescriptions: {
            and:    'Todas se cumplen (Y)',
            or:     'Al menos una se cumple (O)',
            notAnd: 'No todas se cumplen (No Y)',
            notOr:  'Ninguna se cumple (No O)'
        },
        onValueChanged: function(e) {
            $scope.$applyAsync(function() {
                $scope.filtroConstructorValue = e.value;
            });
            if ($scope.gridInstance) {
                $scope.gridInstance.clearFilter('dataSource');
                if (e.value) {
                    $scope.gridInstance.filter(e.value);
                }
            }
        }
    };

    $scope.aplicarFiltroConstructor = function() {
        if ($scope.gridInstance) {
            $scope.gridInstance.clearFilter('dataSource');
            if ($scope.filtroConstructorValue) {
                $scope.gridInstance.filter($scope.filtroConstructorValue);
            }
        }
    };

    $scope.limpiarFiltroConstructor = function() {
        $scope.filtroConstructorValue = null;
        if ($scope.gridInstance) {
            $scope.gridInstance.clearFilter('dataSource');
        }
    };

    // ── Reglas guardadas (dxList) ──────────────────────────────────────────────
    $scope.lstReglas = [];

    function _cargarReglas() {
        filtroReglasFactory.getReglas($scope.idUsuario).then(function(result) {
            $scope.lstReglas = result.data || [];
        });
    }
    _cargarReglas();

    $scope.aplicarRegla = function(regla) {
        try {
            var expr = JSON.parse(regla.Expresion);
            $scope.filtroConstructorValue = expr;
            $scope.reglaEnEdicion         = null;   // salir del modo edición al cambiar de regla
            if ($scope.gridInstance) {
                $scope.gridInstance.clearFilter('dataSource');
                $scope.gridInstance.filter(expr);
            }
        } catch (e) {
            swal('Error', 'La expresión de la regla no es válida.', 'error');
        }
    };

    $scope.guardarReglaActual = function() {
        if ($scope.esFiltroYaGuardado()) {
            swal('Aviso', 'Esta expresión ya está guardada como regla. Modifica el filtro antes de guardar una nueva.', 'warning');
            return;
        }
        if (!$scope.filtroConstructorValue) {
            swal('Aviso', 'No hay ningún filtro activo en el constructor.', 'warning');
            return;
        }

        var modoEdicion  = !!$scope.reglaEnEdicion;
        var nombreActual = modoEdicion ? $scope.reglaEnEdicion.Nombre : '';

        swal({
            title:          modoEdicion ? 'Actualizar regla' : 'Guardar regla',
            text:           'Nombre de la regla:',
            type:           'input',
            inputValue:     nombreActual,
            showCancelButton:  true,
            confirmButtonText: modoEdicion ? 'Actualizar' : 'Guardar',
            cancelButtonText:  'Cancelar',
            closeOnConfirm:    false
        }, function(nombre) {
            if (nombre === false) return;
            nombre = (nombre || '').trim();
            if (!nombre) {
                swal.showInputError('El nombre es obligatorio.');
                return;
            }
            var expresion = JSON.stringify($scope.filtroConstructorValue);

            if (modoEdicion) {
                filtroReglasFactory.updateRegla($scope.reglaEnEdicion.Id, nombre, expresion)
                    .then(function(result) {
                        if (result.data && result.data.ok) {
                            $scope.$applyAsync(function() { $scope.reglaEnEdicion = null; });
                            swal('Actualizado', 'Regla "' + nombre + '" actualizada.', 'success');
                            _cargarReglas();
                        } else {
                            swal('Error', (result.data && result.data.mensaje) || 'No se pudo actualizar.', 'error');
                        }
                    }, function() {
                        swal('Error', 'Error de comunicación al actualizar la regla.', 'error');
                    });
            } else {
                filtroReglasFactory.insertRegla($scope.idUsuario, nombre, expresion)
                    .then(function(result) {
                        if (result.data && result.data.ok) {
                            swal('Guardado', 'Regla "' + nombre + '" guardada.', 'success');
                            _cargarReglas();
                        } else {
                            swal('Error', (result.data && result.data.mensaje) || 'No se pudo guardar.', 'error');
                        }
                    }, function() {
                        swal('Error', 'Error de comunicación al guardar la regla.', 'error');
                    });
            }
        });
    };

    $scope.editarRegla = function(regla) {
        try {
            var expr = JSON.parse(regla.Expresion);
            $scope.filtroConstructorValue = expr;
            $scope.reglaEnEdicion         = regla;
            $scope.panelFiltrosVisible    = true;
            if ($scope.gridInstance) {
                $scope.gridInstance.clearFilter('dataSource');
                $scope.gridInstance.filter(expr);
            }
        } catch (e) {
            swal('Error', 'La expresión de la regla no es válida.', 'error');
        }
    };

    $scope.eliminarRegla = function(regla) {
        swal({
            title:             '¿Eliminar regla?',
            text:              '"' + regla.Nombre + '"',
            type:              'warning',
            showCancelButton:  true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText:  'Cancelar'
        }, function(confirmar) {
            if (!confirmar) return;
            filtroReglasFactory.deleteRegla(regla.Id).then(function(result) {
                if (result.data && result.data.ok) {
                    $scope.$applyAsync(function() {
                        if ($scope.reglaEnEdicion && $scope.reglaEnEdicion.Id === regla.Id) {
                            $scope.reglaEnEdicion         = null;
                            $scope.filtroConstructorValue = null;
                        }
                    });
                    _cargarReglas();
                } else {
                    swal('Error', (result.data && result.data.mensaje) || 'No se pudo eliminar.', 'error');
                }
            }, function() {
                swal('Error', 'Error de comunicación al eliminar la regla.', 'error');
            });
        });
    };

    $scope.lstReglasOptions = {
        bindingOptions: { dataSource: 'lstReglas' },
        displayExpr:    'Nombre',
        onItemClick: function(e) {
            $scope.$applyAsync(function() {
                $scope.aplicarRegla(e.itemData);
            });
        },
        itemTemplate: function(data, _index, element) {
            var $row = $('<div>').css({ display: 'flex', alignItems: 'center', padding: '2px 0' });

            var $icon = $('<i>').addClass(
                data.EsDefault
                    ? 'fa fa-star text-warning m-r-xs'
                    : 'fa fa-bookmark text-info m-r-xs'
            );
            var $nombre = $('<span>').text(data.Nombre).css('flex', '1');

            $row.append($icon).append($nombre);

            if (!data.EsDefault) {
                var $btnEdit = $('<a>')
                    .attr('title', 'Editar regla')
                    .css({ color: '#3498db', cursor: 'pointer', marginLeft: '6px' })
                    .html('<i class="fa fa-pencil"></i>')
                    .on('click', function(evt) {
                        evt.stopPropagation();
                        $scope.$applyAsync(function() {
                            $scope.editarRegla(data);
                        });
                    });

                var $btnDel = $('<a>')
                    .attr('title', 'Eliminar regla')
                    .css({ color: '#e74c3c', cursor: 'pointer', marginLeft: '6px' })
                    .html('<i class="fa fa-trash-o"></i>')
                    .on('click', function(evt) {
                        evt.stopPropagation();
                        $scope.$applyAsync(function() {
                            $scope.eliminarRegla(data);
                        });
                    });

                $row.append($btnEdit).append($btnDel);
            }

            element.append($row);
        }
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

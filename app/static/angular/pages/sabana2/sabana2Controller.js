appModule.controller('sabana2Controller', function($scope, $timeout, empresaFactory, sabana2Repository) {

    console.log('sabana2 controller cargado');

    $scope.idUsuario = localStorage.getItem("idUsuario");

    // ── Fecha efectiva del reporte ("corte al ...") ────────────────────────────
    $scope.mensajeFechaEfectiva = '';

    var DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    var MESES       = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    // uspGetFechaEfectivaReporte regresa FechaConsulta como '2026-08-28' (ISO,
    // sin hora). new Date('2026-08-28') la interpreta como medianoche UTC, así
    // que hay que leerla con los getters *UTC* (getUTCDay/getUTCDate/...) — con
    // los getters locales, en cualquier zona horaria detrás de UTC (México
    // incluido) se corre un día para atrás.
    function _formatearFechaLarga(valor) {
        var d = (valor instanceof Date) ? valor : new Date(valor);
        return DIAS_SEMANA[d.getUTCDay()] + ' ' + d.getUTCDate() + ' de ' + MESES[d.getUTCMonth()] + ' de ' + d.getUTCFullYear();
    }

    // Se pide en cada consulta (no una sola vez al cargar la página): el SP
    // regresa un día distinto según la hora (antes/después de las 12), así que
    // el mensaje debe reflejar el momento en que se hizo ESTA búsqueda.
    function _actualizarFechaEfectiva() {
        sabana2Repository.getFechaEfectiva().then(function(result) {
            if (result.data && result.data.length) {
                $scope.mensajeFechaEfectiva = 'Mostrando información con corte al ' + _formatearFechaLarga(result.data[0].FechaConsulta);
            }
        });
    }

    // ── Estado de filtros ──────────────────────────────────────────────────────
    $scope.currentEmpresaName = 'Selecciona Empresa';
    $scope.currentEmpresaID   = null;
    $scope.haySeleccion       = false; // true tras elegir una empresa O "Todas las empresas"
    $scope.lstEmpresas        = [];

    // ── Estado del pivot ───────────────────────────────────────────────────────
    $scope.pivotData           = [];
    $scope.lstVistasGuardadas  = [];
    $scope.vistaSeleccionadaId = null;
    $scope.vistaActual         = 'pivot'; // 'pivot' | 'detalle'

    // Referencia a la instancia viva de dxPivotGrid (asignada en onInitialized),
    // necesaria para leer el arreglo de campos ACTUAL (incluye lo que el usuario
    // haya movido por drag&drop) al momento de guardar una vista.
    $scope.pivotGridInstance     = null;
    $scope.flatGridInstance      = null;
    $scope.drillDownGridInstance = null;

    // Los widgets con ng-show (pivot/detalle/drill-down) se inicializan en el DOM
    // aunque estén ocultos (display:none). DevExtreme 18.1.6 no tiene
    // ResizeObserver, así que un widget inicializado oculto queda con 0x0 y
    // nunca se repinta solo al mostrarse — hay que forzarlo con updateDimensions()
    // después de que Angular aplique el cambio de visibilidad (de ahí el $timeout).
    function _repintar(instance) {
        if (!instance) return;
        $timeout(function() {
            instance.updateDimensions();
        }, 0);
    }

    $scope.cambiarVista = function(vista) {
        $scope.vistaActual = vista;
        _repintar(vista === 'pivot' ? $scope.pivotGridInstance : $scope.flatGridInstance);
    };

    // Formato moneda para campos numéricos con pinta de importe/saldo. Como los
    // campos/columnas se autogeneran (no se declaran a mano, son ~90), se aplica
    // por patrón de nombre en vez de listarlos uno por uno. Sirve tanto para
    // "fields" de dxPivotGrid como para "columns" de dxDataGrid — ambos objetos
    // tienen .dataField/.dataType/.format con el mismo significado.
    var PATRON_CAMPOS_MONEDA = /importe|saldo|monto|interes|iva|vtabrut|total/i;

    function _formatearComoMoneda(items) {
        items.forEach(function(item) {
            if (item.dataType === 'number' && PATRON_CAMPOS_MONEDA.test(item.dataField)) {
                item.format = { type: 'currency', precision: 2 };
            }
        });
    }

    // dxDataGrid autogenera "columns" a partir del dataSource, pero NO siempre
    // vuelve a pasar por customizeColumns cuando el dataSource cambia después
    // (cachea columnas entre swaps, de forma inconsistente según el momento del
    // primer bind). onContentReady sí dispara SIEMPRE que el grid termina de
    // pintar — incluyendo recargas — así que aplicamos el formato ahí, con
    // columnOption() e imperativamente, sin depender de cuándo se regeneraron
    // las columnas. El guard "!col.format" evita loop infinito (columnOption
    // fuerza un re-render, que vuelve a disparar onContentReady una vez más y
    // ahí ya no encuentra nada que cambiar).
    function _formatearGridPlano(e) {
        e.component.getVisibleColumns().forEach(function(col) {
            if (col.dataType === 'number' && PATRON_CAMPOS_MONEDA.test(col.dataField) && !col.format) {
                e.component.columnOption(col.dataField, 'format', { type: 'currency', precision: 2 });
            }
        });
    }

    // ── Filtro avanzado (aplica sobre pivot Y grid plano por igual) ────────────
    $scope.panelFiltrosVisible    = false;
    $scope.filtroConstructorValue = null;
    $scope.camposFiltro           = []; // se llena con los campos autodetectados del pivot
    $scope.filterBuilderInstance  = null;

    $scope.filtroConstructorOptions = {
        bindingOptions: { value: 'filtroConstructorValue', fields: 'camposFiltro' },
        groupOperationDescriptions: {
            and:    'Todas se cumplen (Y)',
            or:     'Al menos una se cumple (O)',
            notAnd: 'No todas se cumplen (No Y)',
            notOr:  'Ninguna se cumple (No O)'
        },
        onInitialized: function(e) { $scope.filterBuilderInstance = e.component; },
        onValueChanged: function(e) {
            $scope.$applyAsync(function() {
                $scope.filtroConstructorValue = e.value;
                _actualizarDataSources();
            });
        }
    };

    // El panel de filtros usa ng-show → el dx-filter-builder se inicializa
    // oculto y no se repinta solo al mostrarse (mismo problema que ya se
    // resolvió en los grids). Se abre/cierra por acá en vez de un ng-click
    // directo sobre panelFiltrosVisible para poder forzar el repintado.
    $scope.toggleFiltrosAvanzados = function() {
        $scope.panelFiltrosVisible = !$scope.panelFiltrosVisible;
        if ($scope.panelFiltrosVisible) _repintar($scope.filterBuilderInstance);
    };

    $scope.limpiarFiltroConstructor = function() {
        $scope.filtroConstructorValue = null;
        _actualizarDataSources();
    };

    $scope.pivotGridOptions = {
        allowSortingBySummary: true,
        allowSorting:          true,
        allowFiltering:        true,
        allowExpandAll:        true,
        showBorders:           true,
        fieldChooser: { enabled: true, allowSearch: true },
        headerFilter: { allowSearch: true },
        fieldPanel: {
            visible:            true,
            allowFieldDragging: true,
            showColumnFields:   true,
            showDataFields:     true,
            showFilterFields:   true,
            showRowFields:      true
        },
        export:    { enabled: true },
        scrolling: { mode: 'virtual' },
        height:    550,
        noDataText: 'Presiona Buscar o selecciona una empresa para ver los datos.',
        onInitialized: function(e) {
            $scope.pivotGridInstance = e.component;
            _actualizarDataSources();
        },
        // ── Drill-down: SOLO clic en una celda de datos (no en encabezados de
        // fila/columna) → detalle de las filas crudas de esa intersección exacta.
        // Se muestra en un modal de Bootstrap (no un panel inline) para que no
        // se quede pegado en la pantalla al cambiar de filtro o de vista — el
        // usuario tiene que cerrarlo explícitamente o hacer clic afuera.
        onCellClick: function(e) {
            if (e.area !== 'data') return;

            var detailDataSource = e.component.getDataSource().createDrillDownDataSource(e.cell);
            // Se empuja directo a la instancia (NO por bindingOptions/$scope):
            // createDrillDownDataSource() regresa una instancia real de
            // DataSource con referencias internas circulares; si Angular la
            // vigila con $watch profundo (como hace bindingOptions), la
            // comparación recursiva revienta el stack del navegador.
            if ($scope.drillDownGridInstance) {
                $scope.drillDownGridInstance.option('dataSource', detailDataSource);
            }
            $('#mdlDrillDown').modal('show');
        }
    };

    // ── Grid plano (todas las filas sin agrupar) ───────────────────────────────
    // columnAutoWidth:true — con ~90 columnas autogeneradas (no declaramos
    // "columns" a mano), el algoritmo por defecto de DevExtreme intenta
    // repartir el ancho del contenedor entre todas las columnas y con tantas
    // columnas eso puede tronar en "Maximum call stack size exceeded". Con
    // columnAutoWidth cada columna toma su ancho natural y aparece scroll
    // horizontal real en vez de encimarse/truncarse.
    $scope.flatGridOptions = {
        showBorders:           true,
        rowAlternationEnabled: true,
        columnAutoWidth: true,
        columnMinWidth:  100,
        filterRow:    { visible: true },
        searchPanel:  { visible: true, width: 260, placeholder: 'Buscar...' },
        headerFilter: { visible: true, allowSearch: true },
        columnChooser:{ enabled: true },
        paging:       { pageSize: 20 },
        pager:        { showPageSizeSelector: true, allowedPageSizes: [10, 20, 50], showInfo: true },
        export:       { enabled: true },
        scrolling:    { mode: 'virtual', useNative: false },
        height:       550,
        noDataText:   'Selecciona una empresa para ver los datos.',
        onContentReady: _formatearGridPlano,
        onInitialized: function(e) {
            $scope.flatGridInstance = e.component;
            _actualizarDataSources();
        }
    };

    // ── Modal de drill-down (detalle de una celda del pivot) ───────────────────
    // El modal arranca oculto (Bootstrap lo controla con display:none), así que
    // el grid se inicializa con 0x0 igual que los demás — en vez del $timeout de
    // _repintar(), aquí usamos el evento propio de Bootstrap 'shown.bs.modal'
    // (dispara ya terminada la animación, con el modal 100% visible).
    $scope.drillDownGridOptions = {
        showBorders: true,
        columnAutoWidth: true,
        columnMinWidth:  100,
        scrolling:   { mode: 'virtual', useNative: false },
        height:      400,
        export:      { enabled: true },
        noDataText:  '',
        onContentReady: _formatearGridPlano,
        onInitialized: function(e) {
            $scope.drillDownGridInstance = e.component;
            $('#mdlDrillDown').on('shown.bs.modal', function() {
                e.component.updateDimensions();
            });
        }
    };

    // ── Modal: Resumen de carga de financieras ─────────────────────────────────
    // Colores por estatus (uspGetResumenCargaFinancieras, columna [Estatus Carga]
    // con exactamente estos 3 textos, confirmados contra el CASE del SP).
    var CLASE_POR_ESTATUS = {
        'Cargado':       'label-success',
        'Sin carga':     'label-danger',
        'Carga en Cero': 'label-warning'
    };

    $scope.resumenCargaGridInstance = null;
    $scope.resumenCargaGridOptions = {
        showBorders: true,
        rowAlternationEnabled: true,
        columnAutoWidth: true,
        filterRow:    { visible: true },
        headerFilter: { visible: true, allowSearch: true },
        searchPanel:  { visible: true, width: 240, placeholder: 'Buscar...' },
        scrolling:    { mode: 'virtual', useNative: false },
        height:       450,
        noDataText:   'Sin información.',
        columns: [
            { dataField: 'Id Emp',             caption: 'Id Empresa' },
            { dataField: 'Nombre Empresa',      caption: 'Empresa' },
            { dataField: 'Fin',                 caption: 'Id Financiera' },
            { dataField: 'Nombre Financiera',   caption: 'Financiera' },
            {
                dataField: 'Estatus Carga',
                caption:   'Estatus',
                cellTemplate: function(container, options) {
                    var css = CLASE_POR_ESTATUS[options.value] || 'label-default';
                    container.append('<span class="label ' + css + '">' + options.value + '</span>');
                }
            },
            { dataField: 'Fecha', caption: 'Fecha', dataType: 'date', format: 'dd/MM/yyyy' }
        ],
        onInitialized: function(e) {
            $scope.resumenCargaGridInstance = e.component;
            $('#mdlResumenCarga').on('shown.bs.modal', function() {
                e.component.updateDimensions();
            });
        }
    };

    $scope.verResumenCarga = function() {
        $('#mdlLoading').modal('show');
        sabana2Repository.getResumenCarga().then(function(result) {
            $('#mdlLoading').modal('hide');
            if ($scope.resumenCargaGridInstance) {
                $scope.resumenCargaGridInstance.option('dataSource', result.data || []);
            }
            $('#mdlResumenCarga').modal('show');
        }, function() {
            $('#mdlLoading').modal('hide');
            swal('Error', 'No se pudo obtener el resumen de carga.', 'error');
        });
    };

    // ── DataSources del pivot y del grid plano ──────────────────────────────────
    // Siempre se autodetectan TODOS los campos del dataset (retrieveFields:true)
    // para que el fieldChooser nunca pierda acceso a columnas — una vista
    // guardada NO reemplaza la lista de campos, solo le "pinta" el área
    // (row/column/data/filter) encima vía onFieldsPrepared. _configActual se
    // conserva entre cambios de empresa a propósito: el usuario espera ver el
    // mismo agrupamiento al cambiar de empresa, no que se reinicie cada vez.
    // El filtro avanzado (filtroConstructorValue) aplica igual a ambas vistas.
    var _configActual = null; // arreglo de fields (dxPivotGrid), o null = sin vista aplicada

    // Aplica sobre los campos recién autodetectados (fields, mutado in-place por
    // dxPivotGrid) el área/orden que se guardó en _configActual, si aplica.
    // Si _configActual viene en un formato viejo/incompatible (no es arreglo,
    // ej. una fila de prueba con el shape antiguo de pivottable.js) simplemente
    // no se aplica nada y queda la autodetección pura — no rompe el widget.
    // De paso, alimenta camposFiltro para el dx-filter-builder con los mismos
    // campos/dataTypes que dxPivotGrid ya infirió — evita mantener dos listas.
    // Orden fijo de negocio para el campo "Tipo" (no alfabético). sortingMethod
    // es una función, así que no viaja al guardar la vista (JSON.stringify la
    // descarta calladamente) — no importa, se vuelve a aplicar aquí cada vez
    // que dxPivotGrid prepara los campos, sin importar qué vista esté activa.
    var ORDEN_TIPO = ['Financieras', 'Cartera Plan Piso', 'Cartera Planta', 'Inventario Unidades', 'CXC'];

    function _compararTipo(a, b) {
        var ia = ORDEN_TIPO.indexOf(a.value);
        var ib = ORDEN_TIPO.indexOf(b.value);
        if (ia === -1) ia = ORDEN_TIPO.length;
        if (ib === -1) ib = ORDEN_TIPO.length;
        return ia - ib;
    }

    function _aplicarConfigGuardada(fields) {
        if (_configActual && typeof _configActual.length === 'number') {
            var porNombre = {};
            _configActual.forEach(function(f) {
                if (f && f.dataField) porNombre[f.dataField] = f;
            });

            fields.forEach(function(field) {
                var guardado = porNombre[field.dataField];
                if (guardado) {
                    field.area                = guardado.area;
                    field.areaIndex           = guardado.areaIndex;
                    field.summaryType         = guardado.summaryType;
                    field.sortOrder           = guardado.sortOrder;
                    field.sortBySummaryField  = guardado.sortBySummaryField;
                    field.sortBySummaryPath   = guardado.sortBySummaryPath;
                }
            });
        }

        fields.forEach(function(field) {
            if (field.dataField === 'Tipo') {
                field.sortOrder     = 'asc';
                field.sortingMethod = _compararTipo;
            }
        });

        _formatearComoMoneda(fields);

        var camposParaFiltro = fields.map(function(f) {
            return { dataField: f.dataField, caption: f.caption || f.dataField, dataType: f.dataType };
        });
        $scope.$applyAsync(function() {
            $scope.camposFiltro = camposParaFiltro;
        });
    }

    // Empuja el dataSource directo a la instancia del widget (NO vía $scope +
    // bindingOptions): estos configs referencian un dataset de ~90 columnas y,
    // más importante, dxPivotGrid internamente convierte esto en una instancia
    // de PivotGridDataSource con referencias circulares — si Angular la vigila
    // con $watch profundo, la comparación recursiva revienta el stack
    // ("Maximum call stack size exceeded"). Por eso ninguno de los tres grids
    // (pivot/detalle/drill-down) usa bindingOptions para su dataSource.
    function _actualizarDataSources() {
        var data   = $scope.pivotData || [];
        var filtro = $scope.filtroConstructorValue || null;

        if ($scope.pivotGridInstance) {
            $scope.pivotGridInstance.option('dataSource', {
                store:            data,
                retrieveFields:   true,
                filter:           filtro,
                onFieldsPrepared: _aplicarConfigGuardada
            });
        }

        if ($scope.flatGridInstance) {
            $scope.flatGridInstance.option('dataSource', {
                store:  data,
                filter: filtro
            });
        }
    }

    _actualizarDataSources();

    // ── Carga inicial ──────────────────────────────────────────────────────────
    empresaFactory.getEmpresa($scope.idUsuario).then(function(result) {
        $scope.lstEmpresas = result.data;
    });

    sabana2Repository.getPivotViewDefault().then(function(result) {
        if (result.data && result.data.length) {
            _configActual = JSON.parse(result.data[0].ConfigJson);
            _actualizarDataSources();
        }
    });

    _cargarVistasGuardadas(null);

    // ── Selección de empresa (null = todas las empresas, el SP ya lo soporta) ──
    $scope.setCurrentEmpresa = function(empresaObj) {
        if (empresaObj === null) {
            $scope.currentEmpresaName = 'Todas las empresas';
            $scope.currentEmpresaID   = null;
        } else {
            $scope.currentEmpresaName = empresaObj.emp_nombre;
            $scope.currentEmpresaID   = empresaObj.emp_idempresa;
        }

        $scope.haySeleccion = true;
        $('#mdlLoading').modal('show');

        sabana2Repository.getDatos($scope.currentEmpresaID).then(function(result) {
            $scope.pivotData = result.data;
            _actualizarDataSources();
            _actualizarFechaEfectiva();
            // Primera vez que se elige algo: el contenedor de la vista activa
            // pasa de oculto a visible recién ahora — repintar.
            _repintar($scope.vistaActual === 'pivot' ? $scope.pivotGridInstance : $scope.flatGridInstance);
            $('#mdlLoading').modal('hide');
        }, function() {
            $('#mdlLoading').modal('hide');
            swal('Error', 'No se pudo obtener la información.', 'error');
        });

        _cargarVistasGuardadas($scope.currentEmpresaID);
    };

    // ── Selección de una vista guardada ────────────────────────────────────────
    $scope.seleccionarVistaGuardada = function(idVista) {
        var vista = $scope.lstVistasGuardadas.filter(function(v) {
            return v.IdVista === idVista;
        })[0];

        if (!vista) return;

        _configActual = JSON.parse(vista.ConfigJson);
        _actualizarDataSources();
    };

    // ── Guardar la configuración actual como nueva vista ───────────────────────
    $scope.guardarVistaActual = function(nombre, descripcion, esParaEstaEmpresa) {
        if (!$scope.pivotGridInstance) {
            swal('Aviso', 'No hay ninguna configuración de pivot para guardar.', 'warning');
            return;
        }

        // .fields() devuelve el arreglo de campos TAL COMO está ahora mismo en
        // pantalla (áreas, orden, orden por resumen, etc.) — es JSON-serializable.
        var config = $scope.pivotGridInstance.getDataSource().fields();
        _configActual = config;

        var payload = {
            nombre:               nombre,
            descripcion:          descripcion,
            config:               config,
            idEmpresa:            esParaEstaEmpresa ? $scope.currentEmpresaID : null,
            idUsuarioCreador:     $scope.idUsuario,
            nombreUsuarioCreador: localStorage.getItem('nombreUsuario')
        };

        sabana2Repository.guardarPivotView(payload).then(function() {
            _cargarVistasGuardadas($scope.currentEmpresaID);
        }, function() {
            swal('Error', 'No se pudo guardar la vista.', 'error');
        });
    };

    // ── Helpers privados ───────────────────────────────────────────────────────
    function _cargarVistasGuardadas(idEmpresa) {
        sabana2Repository.getPivotViews($scope.idUsuario, idEmpresa).then(function(result) {
            $scope.lstVistasGuardadas = result.data || [];
        });
    }

});

appModule.controller('autorizaController', function($scope, $rootScope, $location, autorizaFactory, provisionFactory, commonFactory, staticFactory, filterFilter ) {
    $scope.idUsuario            = parseInt( localStorage.getItem( "idUsuario" ) )
    
    $scope.currentFinancialName = "Seleccionar Financiera";
    $scope.lbl_btn_descheck     = "Desmarcar Unidades";
    $scope.currentPanel         = 'pnlCargaArchivo';

    $scope.titleDocumentos        = '';
    $scope.titleDocumentosDetalle = '';

    /* =========================== 
        [ estSolAutorizacion ]
    Valida la aplicación de la conci
    liacion mediante autorización de
    usuarios mediante notificaciones

    0 => No aplica; 
    1 => Puede Solicitar;
    2 => Solicitó y esta en espera;
    3 => Aprobada;
    4 => Rechazada;
    ============================== */
    $scope.estSolAutorizacion   = 0;

    $scope.currentMonth         = 0;
    $scope.currentYear          = 0;
    
    $scope.flagAjusteCaseTree   = true;
    $scope.ajusteManual         = false;
    
    $scope.lstMonth             = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    $scope.cierreMes            = [];
    $scope.lstConceal           = [];
    $scope.lstFinancial         = [];
    $scope.lstPendiente         = [];
    $scope.lstConciliacion      = [];
    $scope.autDetalle           = [];
    $scope.lstConciliaDetalle   = [];
    
    $scope.currentFinancial     = {};
    $scope.currentConciliacion  = {};
    $scope.total                = { sistema: 0, archivo: 0 };
    $scope.frmConciliacion      = { lblMes: 0, idFinanciera: 0, loadLayout:false}
    $scope.situacion            = { ok:0, financiera:0, gpoAndrade: 0 };
    $scope.diferencias          = { iguales:0, diferentes: 0 };

    $scope.session  = JSON.parse( sessionStorage.getItem( "sessionFactory" ) );

    var increment   = 0;
    var contador    = 0;

    var date        = new Date();
    var toDay       = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var firstDay    = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay     = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var tenDay      = new Date(date.getFullYear(), date.getMonth(), 10);
    var lastTenDay  = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    lastTenDay.setDate(lastTenDay.getDate() - 10);
    var tenDayNextMonth  = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    tenDayNextMonth.setDate(tenDayNextMonth.getDate() + 10);

    if( toDay.getTime() >= firstDay.getTime() && toDay.getTime() <= tenDay.getTime() ){
        if( toDay.getMonth() == 0 ){
            $scope.currentMonth = 11;
            $scope.currentYear  = date.getFullYear() - 1;
        }
        else{
            $scope.currentMonth = (toDay.getMonth() - 1);
            $scope.currentYear  = date.getFullYear();
        }
    }
    else{
        $scope.currentMonth = toDay.getMonth();
        $scope.currentYear  = date.getFullYear();
    }

    // $scope.currentMonth = 2; // HardCode
    $scope.frmConciliacion.lblMes = $scope.lstMonth[ $scope.currentMonth ];    
    
    // Este es como funciona desde Branch Conciliación
    commonFactory.getFinancial( 1 ).then(function(result) {
        $scope.lstFinancial = result.data;
    });
    
    var myDropzone;
    $scope.Dropzone = function() {
        $("#templeteDropzone").html( '' )

        var html = `<form action="/file-upload" class="dropzone" id="idDropzone">
                        <div class="fallback">
                            <input name="file" type="file" accept="text/csv, .csv" />
                        </div>
                    </form>`;

        $("#templeteDropzone").html( html );
        myDropzone = new Dropzone("#idDropzone", {
            url: "/apiConciliacion/upload",
            uploadMultiple: 0,
            maxFiles: 1,
            autoProcessQueue: false,
            acceptedFiles: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        myDropzone.on("success", function(req, res) {
            var _this = this;

            var filename = res + '.xlsx';
            $scope.loadingPanel = true;
            $('#mdlLoading').modal('show');
            $scope.readLayout(filename);

            $scope.limpiarDropzone = function(){
                _this.removeAllFiles();
                myDropzone.enable()
                $scope.frmConciliacion.loadLayout = true;
            }
        });

        myDropzone.on("addedfile", function() {
            $scope.frmConciliacion.loadLayout = true;
        });
    };

    $scope.validaExistencia = function(){
        console.log( "currentMonth", $scope.currentMonth );
        return new Promise((resolve, reject)=> {
            let parametros = {
                idEmpresa: $scope.session.empresaID,
                idFinanciera: $scope.frmConciliacion.idFinanciera,
                periodo: $scope.currentMonth + 1,
                anio: $scope.currentYear
            }
            autorizaFactory.validaExistencia(parametros).then(function(result) {
                resolve(result.data[0]);
            })
        })
    }

    var execelFields = [];
    $scope.readLayout = function(filename) {
        autorizaFactory.readLayout(filename).then(function(result) {
            var LayoutFile = result.data;
            var aux = [];
            for (var i = 1; i < LayoutFile.length; i++) {
                aux.push(LayoutFile[i]);
            }

            execelFields = $scope.arrayToObject(aux);
            $scope.insertData();
        }, function(error) {
            console.log("Error", error);
        });
    };

    $scope.insertData = function() {
        try{
            execelFields[increment]['consecutivo'] = contador;
            autorizaFactory.insExcelData(execelFields[increment]).then(function(result) {
                if( !result.data ){
                    swal("Conciliación","El archivo que porporciona no contiene el formato que se espera, asegurese de cargar el layout esperado.");
                    $('#mdlLoading').modal('hide');
                    $scope.loadingPanel = false;
                }
                else{
                    if( result.data[0].success == 1 ){
                        contador    = parseInt(result.data[0].consecutivo);

                        if (increment >= (execelFields.length - 1)) {
                            // $scope.nexStep();
                            $scope.frmConciliacion.loadLayout = true;
                            $scope.loadingPanel = false;
                            $('#mdlLoading').modal('hide');

                            $scope.currentPanel = 'pnlConciliar';
                            $scope.conceal();
                            $("#modalNuevaConciliacion").modal('hide');
                            var aux = filterFilter($scope.lstFinancial, { financieraID: $scope.frmConciliacion.idFinanciera });
                            $scope.lblFinanciera = aux[0].nombre;
                        }
                        else{
                            increment++;
                            $scope.insertData();
                        }
                    }                    
                }
            })
            .catch(function(e){
               console.log("got an error in initial processing",e);
               throw e;
            }).then(function(res){
            });            
        }
        catch( e ){
            console.log( "Error", e );
            swal("Conciliación","El archivo que porporciona no contiene el formato que se espera, asegurese de cargar el layout esperado.");
        }
    }

    $scope.arrayToObject = function(array) {
        var lst = [];
        for (var i = 0; i < array.length; i++) {
            var obj = { dato1: array[i][0], dato2: array[i][1], dato3: array[i][2] };
            lst.push(obj);
        }
        return lst;
    };

    $scope.conceal = function() {
        autorizaFactory.getConciliacion( ($scope.currentMonth + 1), contador, $scope.frmConciliacion.idFinanciera ).then(function(result) {
            $scope.lstConceal = result.data;
            $scope.sumTotal();
        });

        $scope.getCierreMes();
    };

    $scope.muestraConciliacionPendiente = function( periodo, consecutivo, financiera ){
        autorizaFactory.getConciliacion( periodo, consecutivo, financiera ).then(function(result) {
            autorizaFactory.autorizacionDetalle( consecutivo  ).then(function(detalle) {
                if( detalle.data.length != 0 ){
                    $scope.lstConceal = result.data;
                    $scope.sumTotal();
                    $scope.currentPanel = 'pnlConciliar';

                    $scope.autDetalle = detalle.data[0];

                    $scope.frmConciliacion.lblMes       = $scope.lstMonth[ ($scope.autDetalle.periodoContable - 1) ];
                    $scope.frmConciliacion.idFinanciera = $scope.autDetalle.idFinanciera;
                    $scope.lblFinanciera                = $scope.autDetalle.nombre;
                    switch( $scope.autDetalle.estatus ){
                        case 0: $scope.estSolAutorizacion = 4; break;
                        case 1: $scope.estSolAutorizacion = 2; break;
                        case 2: $scope.estSolAutorizacion = 3; break;
                    }                    
                    console.log( "estSolAutorizacion", $scope.estSolAutorizacion );

                }
            })
        });
    }

    $scope.muestraDetalleDocumentos = function( item ){
        $scope.currentConciliacion = item;
        $scope.titleDocumentos = item.Descipcion;
        $scope.idConciliacion = item.idConciliacion;
        autorizaFactory.conciliaDetalle( item.idConciliacion ).then(function(result) {
            if( result.data.length != 0 ){
                $scope.lstConciliaDetalle = result.data;
                $scope.currentPanel = 'pnlDocumentos';
            }
        });
    }

    $scope.validaCancelacion = function(){
        autorizaFactory.validaCancelacion($scope.idConciliacion).then(function(resultValida) {
            var validacion = resultValida.data[0][0];
            if( validacion.PROCESADOS == 0 ){
                $scope.CancelaConciliacion();
            }
            else if( validacion.PAGADOS == 0 ){
                $scope.CancelaConciliacion();
            }
            else if( validacion.PAGADOS == 1 ){
                swal("Conciliación Plan Piso","No se puede cancelar la conciliación ya existen documentos pagados, cancele los pagos para poder continuar con esta acción.");
            }
        });
    }

    $scope.CancelaConciliacion = function(){
        swal({
            title: "Conciliación Plan Piso",
            text: "¿Desea cancelar la conciliación?",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            autorizaFactory.CancelaConciliacion($scope.idConciliacion).then(function(resultValida) {
                swal("Conciliación Plan Piso","Se ha efectuado correctamnete la cancelación de la conciliación");
                location.reload();
                // $scope.regresaConciliacionPanel();
                // $scope.obtieneCociliacion();
            });
        });
    }

    $scope.getCierreMes = function() {
        autorizaFactory.getCierreMes( ($scope.currentMonth + 1) ).then(function(result) {
            $scope.cierreMes = result.data;
        });
    };
    
    $scope.sumTotal = function() {
        // consecutivo = 0;
        $scope.total.archivo = 0;
        $scope.total.sistema = 0;

        $scope.lstConceal.forEach(function(item) {
            $scope.total.sistema += item.InteresMesActual;
            $scope.total.archivo += item.interes;

            switch( parseInt(item.equiparante) ){
                case 1:
                    $scope.situacion.ok = $scope.situacion.ok + 1;
                    break;
                case 2:
                    $scope.situacion.financiera = $scope.situacion.financiera + 1;
                    break;
                case 3:
                    $scope.situacion.gpoAndrade = $scope.situacion.gpoAndrade + 1;
                    break;
            }

            if( parseInt(item.esMayor) == 1 ){
                $scope.diferencias.iguales = $scope.diferencias.iguales + 1;
            }
            else{
                $scope.diferencias.diferentes = $scope.diferencias.diferentes + 1;
            }
        });

        $scope.controlCheck();
        $scope.readyConciliation();

        // Valida estatus de autorización
        if($scope.situacion.gpoAndrade != 0 && $scope.situacion.financiera == 0){
            $scope.estSolAutorizacion  = 1;
        }
    };

    $scope.controlCheck = function() {
        $scope.lstConceal.forEach(function(item, key) {
            $scope.lstConceal[key]['checked'] = true;
            $scope.lstConceal[key]['ajuste']  = item.InteresMesActual;
        });
        $scope.lbl_btn_descheck = "Desmarcar Unidades";
        $scope.flagAjusteCaseTree   = true;
    };

    $scope.controlCheckDeseleccionar = function() {
        if( $scope.lbl_btn_descheck == "Desmarcar Unidades" ){
            $scope.lstConceal.forEach(function(item, key) {
                if( item.equiparante == 3 ){
                    $scope.lstConceal[key]['checked'] = false;
                }
            });            

            $scope.total.sistema = 0;
            $scope.lstConceal.forEach(function(item) {
                if( item.equiparante == 1 ){
                    $scope.total.sistema += item.InteresMesActual;
                }
            });

            $scope.lbl_btn_descheck     = "Marcar Unidades";
            $scope.flagAjusteCaseTree   = false;
        }
        else{
            $scope.controlCheck();
            $scope.total.sistema = 0;
            $scope.lstConceal.forEach(function(item) {
                $scope.total.sistema += item.InteresMesActual;
            });
            $scope.ajusteManual         = false;
        }
        $scope.readyConciliation();
    };

    $scope.setCurrentFinancial = function(financialObj) {
        $scope.currentFinancial = financialObj;
        $scope.currentFinancialName = financialObj.nombre;
    };

    $scope.nexStep = function() {
        if($scope.frmConciliacion.lblMes == ''){
            swal("Conciliación","No se ha especificado el periodo contable.");
        }
        else if( $scope.frmConciliacion.idFinanciera == 0){
            swal("Conciliación","No se ha especificado la financiera.");   
        }
        else if( !$scope.frmConciliacion.loadLayout ){
            swal("Conciliación","No se ha cargado el Layout.");
        }
        else{
            $scope.validaExistencia().then( ( result ) => {
                if( result === undefined ){
                    swal("Conciliación","Se perdio la conexión al servidor, favor de verificar su conexión.");
                }
                else if( result.success == 0 ){
                    swal("Conciliación","Ya se encuentra una cociliación para el periodo y financiera especificada.");
                }
                else if( result.success == 1 ){
                    myDropzone.processQueue();
                    $scope.frmConciliacion.loadLayout = true;
                }
            })
        }
    };

    $scope.prevStep = function() {
        location.reload();
        $scope.currentPanel = 'pnlCargaArchivo';
    };

    $scope.setTableStyle = function(tblID) {
        staticFactory.setTableStyleOne(tblID);
    };

    $scope.fnAjusteManual = function(){
            $scope.ajusteManual = true;
    }

    $scope.setIntFinanToAjuste = function( indice ){
        $scope.lstConceal[ indice ].ajuste  = $scope.lstConceal[ indice ].interes;
        $scope.lstConceal[ indice ].esMayor = 3;
        
        $scope.total.sistema = 0;
        $scope.lstConceal.forEach(function(item) {
            if( item.equiparante == 1 ){
                $scope.total.sistema += item.ajuste;
            }
        });

        $scope.readyConciliation();
    }

    $scope.recalculo = function( indice ){
        if( isNaN( $scope.lstConceal[ indice ].ajuste ) ){
            $scope.lstConceal[ indice ].ajuste = 0;
        }

        $scope.total.sistema = 0;
        $scope.lstConceal.forEach(function(item) {
            $scope.total.sistema += parseFloat(item.ajuste);
        });
        $scope.lstConceal[ indice ].esMayor = 3;
        $scope.readyConciliation();
    }

    $scope.ajusteAutomatico = function(){
        $scope.ajusteManual = true;
        $scope.lstConceal.forEach(function(item, key) {
            if( item.equiparante == 1 && item.esMayor != 1 ){
                $scope.lstConceal[ key ].ajuste  = $scope.lstConceal[ key ].interes;
                $scope.lstConceal[ key ].esMayor = 3;
            }
        });
        
        $scope.total.sistema = 0;
        $scope.lstConceal.forEach(function(item) {
            if( item.equiparante == 1 ){
                $scope.total.sistema += item.ajuste;
            }
        });

        $scope.readyConciliation();
    }

    $scope.readyConciliation = function(){
        var modulo = parseFloat($scope.total.sistema) - parseFloat($scope.total.archivo);
        if( modulo >= -1 && modulo <= 1 ){
            $scope.conciliacion = true;
        }
        else{
            $scope.conciliacion = false;
        }        
    }

    $scope.creaConciliacion = function() {
        var parametros = {
            idEmpresa:      $scope.session.empresaID,
            idFinanciera:   $scope.frmConciliacion.idFinanciera,
            periodo:        parseInt($scope.currentMonth) + 1,
            periodoAnio:    $scope.currentYear,
            idUsuario:      $scope.idUsuario
        }
        var parametrosDetalle = {}
        var item = {};
        autorizaFactory.creaConciliacion( parametros ).then(function(result) {
            if( result.data[0].success == 1 ){
                for( var i = 0; i <= ( $scope.lstConceal.length - 1 ); i++ ){
                    item = $scope.lstConceal[ i ];
                    parametrosDetalle = {
                        idConciliacion:         result.data[0].LastId,
                        CCP_IDDOCTO:            item.CCP_IDDOCTO,
                        VIN:                    item.numeroSerie,
                        interesGrupoAndrade:    item.InteresMesActual,
                        interesFinanciera:      item.interes,
                        interesAjuste:          item.ajuste,
                        situacion:              ( item.equiparante == 1 && item.esMayor == 1 ) ? 1 : ( item.equiparante == 1 && item.esMayor != 1 ) ? 2 : 3 // 1 => Montos iguales; 2 => Monto Ajustado; 3 => No Aplica
                    }

                    autorizaFactory.creaConciliacionDetalle( parametrosDetalle );

                    if( i >= ( $scope.lstConceal.length - 1 ) ){
                        swal("Conciliación","Se ha generado de forma correcta la conciliacion del mes de " + $scope.lstMonth[ $scope.currentMonth ],"success");
                        setTimeout( function(){
                            autorizaFactory.generaConciliacion( parametros.periodo, $scope.currentYear, parametros.idFinanciera ).then( function( result ){
                                // location.reload();
                                $scope.prevStep();
                                // location.href = "provision";

                            });
                        },2000);
                    }
                }
            }
        });

    }

    $scope.solicitaAutorizacion = function( estatus ) {
        var parametros = {
            consecutivo: contador,
            estatus: estatus,
            idUsuario: $scope.idUsuario,
            idFinanciera: $scope.frmConciliacion.idFinanciera,
            periodoContable: parseInt($scope.currentMonth) + 1,
            anioContable: $scope.currentYear,
        }

        swal({
            title: "Conciliación", 
            text: "¿Esta seguro de completar esta acción?",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonText: "Solicitar Autorización",
            confirmButtonColor: "#ec6c62",
            cancelButtonText: "Cerrar"
        }, function() {
            autorizaFactory.solicitaAutorizacion( parametros ).then(function(result) {
                if( result.data[0].success == 1 ){
                    for( var i = 0; i <= ( $scope.lstConceal.length - 1 ); i++ ){
                        if( parametros.estatus == 1 ){
                            swal("Listo", "La se ha realizado la notificacón, favor de esperar su respuesta", "success");
                        }
                        else{
                            swal("Listo", "Se ha guardado de forma correcta tus registros.", "success");
                        }
                        $scope.estSolAutorizacion = 2;
                        $scope.$apply();
                    }
                }
            });
        });
    }

    $scope.openModalConciliacion = function(){
        $("#modalNuevaConciliacion").modal('show');
        $scope.Dropzone();
    }

    $scope.resetFromulario = function(){
        $scope.frmConciliacion.idFinanciera = 0;
        $scope.Dropzone();
    }

    $scope.porAutorizar = function(){
        autorizaFactory.porAutorizar().then(function(result) {
            if( result.data.length != 0 ){
                $scope.lstPendiente = result.data;
                console.log( "$scope.lstPendiente", $scope.lstPendiente );
            }
        });
    }

    $scope.obtieneCociliacion = function(){
        autorizaFactory.obtieneCociliacion().then(function(result) {
            if( result.data.length != 0 ){
                $scope.lstConciliacion = result.data;
            }
        });
    }

    $scope.regresaConciliacionPanel = function(){        
        $scope.currentPanel = 'pnlCargaArchivo';
    }

    $scope.showDetail = function(lote){
        $scope.titleDocumentosDetalle = lote.ple_concepto;
        provisionFactory.getLoteDetail(lote.ple_idplanpiso).then(function(result) {
            if( result.data.length != 0 ){
                $scope.lstUnitDeatil = result.data;
                $scope.currentPanel = 'pnlDocumentosDetalle';
            }
        });
    }

    $scope.regresaConciliacionDocumento = function(){
        $scope.currentPanel = 'pnlDocumentos';
    }
});
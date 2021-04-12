appModule.controller('unidadesvinController', function($scope, $rootScope, $location, unidadesvinFactory, commonFactory, staticFactory,utils,$window) {
    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.idUsuario = localStorage.getItem("idUsuario");
    $scope.lstPermisoBoton = JSON.parse(sessionStorage.getItem("PermisoUsuario"));

    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.topBarNav = unidadesvinFactory.topNavBar();
    $scope.steps = unidadesvinFactory.stepsBar();
    $scope.totalUnidades = 0;
    $scope.currentStep = 0;
    $scope.userID =  $scope.idUsuario;
    $scope.currentPanel = $scope.steps[0].panelName;
    $scope.lstSucursal = [];
    $scope.lstNewUnits = [];
    $scope.lstFinancial = [];
    $scope.lstSchemas = [];
    $scope.selectedSchema = [];
    $scope.listPoliza = [];
    $scope.incremental = 0;
    $scope.currentSucursalName = "Sucursal Todas";
    $scope.currentFinancialName = "Seleccionar Financiera";
    $scope.frmConciliacion      = { lblMes: 0, idFinanciera: 0, loadLayout:false}
 
    $scope.allUnits = { isChecked: false };
    $scope.ddlFinancialShow = false;
    $scope.showStep = 1;
    $scope.SucursalSel = [];
    $scope.FinancieraSel = [];
    var increment   = 0;
    $scope.cargandoPro = 0;
    var contador    = 0;
    var finalizar = _.where($scope.lstPermisoBoton, { idModulo: 1, Boton: "finalizar" })[0];
    $scope.muestrafinalizar = finalizar != undefined ? false : true;

   
    
    $scope.getNewUnitsBySucursal = function(empresaID) {
        $('#tblUnidadesNuevasVin').DataTable().destroy();
        unidadesvinFactory.getNewUnitsBySucursal(empresaID).then(function(result) {
            $scope.lstNewUnits = result.data;
            $scope.inittblUnidadesNuevasVin();
            $('#mdlLoading').modal('hide');
        });
        commonFactory.getFinancial(empresaID).then(function(result) {
            $scope.lstFinancial = result.data;
        });
    };

    $scope.setCurrentFinancialHead = function(financialObj) {
        $scope.FinancieraSel = financialObj;
        $('#mdlLoading').modal('show');
        $scope.currentFinancialName = financialObj.nombre;
        $scope.getNewUnitsBySucursal(sessionFactory.empresaID);
        $scope.getSchemas($scope.FinancieraSel.financieraID);
    };
    $scope.setCurrentFinancial = function() {
        $scope.listUnidades = _.where($scope.lstNewUnits, { isChecked: true });
        $scope.currentFinancialName = $scope.listUnidades[0].nombreFinanciera;
        $scope.getSchemasBP($scope.listUnidades[0].idPersona, sessionFactory.empresaID);
    };

    $scope.getSchemas = function(financieraID) {
        commonFactory.getSchemas(financieraID).then(function(result) {
            $('#tblSchemas').DataTable().destroy();
            $scope.lstSchemas = result.data;
        });
    };
    $scope.getSchemasBP = function(financieraID, idempresa) {
        commonFactory.getSchemasBP(financieraID, idempresa).then(function(result) {
            $('#tblSchemas').DataTable().destroy();
            $scope.lstSchemas = result.data;
        });
    };
    $scope.checkAllUnits = function() {

        for (var i = 0; i < $scope.lstNewUnits.length; i++) {
            $scope.lstNewUnits[i].isChecked = $scope.allUnits.isChecked;
        }

    };

    $scope.uncheckSchemas = function(itemSchemas) {
        for (var i = 0; i < $scope.lstSchemas.length; i++) {
            $scope.lstSchemas[i].isChecked = false;
        }
        itemSchemas.isChecked = true;
        $scope.selectedSchema = itemSchemas;
        if($scope.selectedSchema.tipoColateralId !=undefined)
        {
                var data = {
                idPersona: $scope.unidad.idPersona,
            idEmpresa: sessionFactory.empresaID,
            idColateral:$scope.selectedSchema.tipoColateralId
            };
           
            unidadesvinFactory.SaldoFinanciera(data).then(function(result) {
                if(result.data.length>0)
                {
                    $scope.nombreFinanciera=result.data[0].nombrefinanciera;
                    $scope.saldofinanciera=result.data[0].monto-result.data[0].saldofinanciera;
                    $scope.idfinancierabp=result.data[0].idfinancierabp;
                    // if($scope.saldofinanciera-$scope.saldounidad<=0)
                    // {
                    //     for (var i = 0; i < $scope.lstNewUnits.length; i++) {
                    //         if($scope.lstNewUnits[i].CCP_IDDOCTO==$scope.unidad.CCP_IDDOCTO)
                    //         {
                    //             $scope.lstNewUnits[i].isChecked=false;
                    //         }
                    //     }
                    //     $scope.saldounidad=0;
                    //         swal("Aviso", "No puede seleccionar otra unidad ya que no tiene linea de crédito", "warning");
                        
                    // }
                }
                
            }, function(error) {
                console.log("Error", error);
            });
        }
    
    };

    $scope.EvaluarUnidad=function(unidadin)
    {
        $scope.unidad=unidadin;
        
        
            $scope.saldounidad=0;
            for (var i = 0; i < $scope.lstNewUnits.length; i++) {
                if($scope.lstNewUnits[i].isChecked)
                {
                    $scope.saldounidad=$scope.saldounidad+$scope.lstNewUnits[i].SALDO;
                }
            }
            // if($scope.saldofinanciera!=undefined)
            // {
            //     if($scope.saldofinanciera-$scope.saldounidad<=0)
            // {
            //     for (var i = 0; i < $scope.lstNewUnits.length; i++) {
            //         if($scope.lstNewUnits[i].CCP_IDDOCTO==$scope.unidad.CCP_IDDOCTO)
            //         {
            //             $scope.lstNewUnits[i].isChecked=false;
            //         }
            //     }
            //     $scope.saldounidad=0;
            //         swal("Aviso", "No puede seleccionar otra unidad ya que no tiene linea de crédito", "warning");
            //     return;
            // }
            // }
            
           
   
    }
    

    $scope.nextStep = function() {
        if ($scope.currentStep == 0) {
            var contador = 0;
            angular.forEach($scope.lstNewUnits, function(value, key) {
                if (value.isChecked === true) {
                    contador++;
                    $scope.idfinancierabp=value.idPersona;
                }
            });
          
            for (var i = 0; i < $scope.lstNewUnits.length; i++) {
                if($scope.lstNewUnits[i].isChecked==true)
                {
                    if($scope.idfinancierabp != $scope.lstNewUnits[i].idPersona)
                    {
                        swal("Aviso", "La unidad debe de ser de la misma financiera que las otras seleccionadas", "warning");
                    
                        return;
                    }
                }
                
            }
            if (contador === 0) {
                swal("Aviso", "No ha seleccionado ningun documento", "warning");
                return;
            } else {
                $scope.setCurrentFinancial();
            }
        }
        if ($scope.currentStep === 1 && $scope.selectedSchema.esquemaID === undefined) {
            swal("Aviso", "No ha seleccionado un esquema", "warning");
            return;
        } else if (($scope.currentStep + 1) < $scope.steps.length) {
            $scope.steps[$scope.currentStep].className = "visited";
            $scope.currentStep++;
            $scope.showStep = $scope.currentStep + 1;
            $scope.currentPanel = $scope.steps[$scope.currentStep].panelName;
            $scope.steps[$scope.currentStep].className = "active";
            $scope.showFilterButtons($scope.currentStep);
            if ($scope.currentStep == 2) {
                angular.forEach($scope.lstNewUnits, function(value, key) {
                    if (value.isChecked === true) {
                        value.plazo = $scope.selectedSchema.plazo;
                        value.diasgracia = value.dias!=undefined?value.dias:$scope.selectedSchema.diasGracia;
                        value.fechaRecibo = staticFactory.DateFormat(regresafechareal(value.fechaCalculoString));
                        value.fechainicio = regresafechareal(value.fechaCalculoString);
                        value.fechafin = sumarDias(regresafechareal(value.fechaCalculoString), value.plazo);
                    }
                });

            }
        }
    };

    function sumarDias(fecha, dias) {



        if(isDate(fecha))
        {
        var dateObject=new Date(fecha);
        }
        else
        {
        var dateParts = fecha.split("/");


        var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        }

       

        fecha = dateObject.setSeconds(dias * 86400);
        return fecha;
    }
    function isDate(value) {
        switch (typeof value) {
            case 'number':
                return true;
            case 'string':
                return false;
            case 'object':
                if (value instanceof Date) {
                    return !isNaN(value.getTime());
                }
            default:
                return false;
        }
    }
    function regresafechareal(fecha) {
        var dateParts = fecha.split("/");


        var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);


        return dateObject;
    }

    $scope.Cambiarfecha = function(fecha, unidad) {
        angular.forEach($scope.lstNewUnits, function(value, key) {
            if (value.isChecked === true && value.$$hashkey == unidad.$$hashkey) {
                value.plazo = $scope.selectedSchema.plazo;
                value.diasgracia = $scope.selectedSchema.diasGracia;
                value.fechainicio = value.fechaRecibo;
                value.fechafin = sumarDias(value.fechaRecibo, value.plazo);
            }
        });
    }
    $scope.prevStep = function() {
        if (($scope.currentStep - 1) >= 0) {
            $scope.steps[$scope.currentStep].className = "visited";
            $scope.showStep = $scope.currentStep;
            $scope.currentStep--;
            $scope.currentPanel = $scope.steps[$scope.currentStep].panelName;
            $scope.steps[$scope.currentStep].className = "active";
            $scope.showFilterButtons($scope.currentStep);
        }
    };

    $scope.inittblUnidadesNuevasVin = function() {
        $scope.setTableStyle('#tblUnidadesNuevasVin');
        $scope.totalUnidades = $scope.lstNewUnits.length;
        $scope.setCalendarStyle();
    };

    $scope.setTableStyle = function(tableID) {
        staticFactory.setTableStyleOne(tableID);
    };


    $scope.setCalendarStyle = function() {
        staticFactory.setCalendarStyle();
    };


    $scope.showFilterButtons = function(step) {
        if (step === 0)
            $scope.ddlFinancialShow = false;
        else
            $scope.ddlFinancialShow = true;
    };

    $scope.showMsg = function() {
        // if($scope.saldofinanciera-$scope.saldounidad<=0)
        // {
        //     swal("Aviso", "No puede continuar por que ya no tiene linea de crédito", "warning");
        // }
        // else
        // {
        unidadesvinFactory.assignMesage($scope.setSchema);
        // }
    };

    $scope.setSchema = function() {

        $scope.listPoliza = _.where($scope.lstNewUnits, { isChecked: true });
        $scope.incremental = 0;
        $scope.guardandoPoliza();


    };
    $scope.guardandoPoliza = function() {
        var saplica = 0;
        var item = $scope.listPoliza[$scope.incremental];

        var data = {
            CCP_IDDOCTO: item.CCP_IDDOCTO,
            userID: $scope.userID,
            esquemaID: $scope.selectedSchema.esquemaID,
            saldoInicial: item.SALDO,
            interes: parseFloat(item.interes),
            fechaCalculo: staticFactory.toISODate(item.fechaCalculoString),
            fechainicio: staticFactory.todayDateGiven(item.fechainicio),
            fechafin: staticFactory.todayDateGiven(item.fechafin),
            diasgracia: item.diasgracia,
            tipoEntrada:item.tipoCompra,
            idEmpresa : item.idEmpresa,
            idSucursal: item.idSucursal,
            vin: item.veh_numserie
        };

        unidadesvinFactory.setUnitSchema(data).then(function(result) {

            var insercion = result;
            console.log("insercion", insercion);

            if (insercion.status == 200) {

                $scope.incremental++;

                if ($scope.incremental < $scope.listPoliza.length) {
                    $scope.guardandoPoliza();
                } else {
                    $scope.incremental = 0;
                    $scope.consecNum = 0;
                    swal("Unidades asignadas", "Guardado correctamente");
                    setTimeout(function() {
                        console.log('Termino');
                        window.location = "/interes";
                    }, 1000);
                }
            } else {
                swal("Poliza pago interes", "Guardado correctamente");
            }
        }, function(error) {
            console.log("Error", error);
        });
    }
    $scope.success = function() {
        swal("Ok", "Asignación finalizó con exito", "success");
        setTimeout(function() {
            window.location = "/unidadesvin";
        }, 5000);
    };
////////////////////////////////////////Layout
var myDropzone3;
    $scope.Dropzone3 = function() {
        $("#templeteDropzone3").html( '' )

        var html = `<form action="/file-upload" class="dropzone" id="idDropzone">
                        <div class="fallback">
                            <input name="file" type="file" accept="text/csv, .csv" />
                        </div>
                    </form>`;

        $("#templeteDropzone3").html( html );
        myDropzone3 = new Dropzone("#idDropzone", {
            url: "api/apiunidadesvin/upload",
            uploadMultiple: 0,
            maxFiles: 1,
            autoProcessQueue: false,
            acceptedFiles: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            webkitRelativePath:"/uploads"
        });

        myDropzone3.on("success", function(req, xhr) {
            var _this = this;

            var filename = xhr + '.xlsx';
            $scope.loadingPanel = true;
            $('#mdlLoading').modal('show');
            $scope.readLayout(filename);

            $scope.limpiarDropzone = function(){
                _this.removeAllFiles();
                myDropzone3.enable()
                $scope.frmConciliacion.loadLayout = true;
            }
        });

        myDropzone3.on("addedfile", function() {
            $scope.frmConciliacion.loadLayout = true;
        });
    };
    var execelFields = [];
    $scope.readLayout = function(filename) {
        unidadesvinFactory.readLayout(filename).then(function(result) {
            var LayoutFile = result.data;
            var aux = [];
            for (var i = 0; i < LayoutFile.length; i++) {
                aux.push(LayoutFile[i]);
            }

            execelFields = $scope.arrayToObject(aux);
            $scope.maxPro = execelFields.length;
            $scope.insertData();
        }, function(error) {
            console.log("Error", error);
        });
    };

    $scope.insertData = function() {
        try{
            execelFields[increment]['consecutivo'] = contador;
            unidadesvinFactory.insExcelData(execelFields[increment]).then(function(result) {
                if( !result.data ){
                    swal("Pendiente de esquema","El archivo que porporciona no contiene el formato que se espera, asegurese de cargar el layout esperado.");
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
                                // if($scope.frmConciliacion.lbltipoconciliacion== 1)
                                //     $scope.currentPanel = 'pnlConciliar';
                                // else
                                //     $scope.currentPanel = 'pnlConciliarUnidades';
                            $scope.conceal();
                            $("#modalNuevaLayout").modal('hide');
                            var aux = $scope.lstFinancial[0];
                            $scope.lblFinanciera = aux[0].nombre;
                        }
                        else{
                            increment++;
                            $scope.cargandoPro++;
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
$scope.CargarLayout= function(){

    $('#modalNuevaLayout').modal('show');
    $scope.Dropzone3();
}
$scope.VerArchivo=function(){

    var arregloBytes = [];
     $rootScope.pdfUnidades = undefined;
     unidadesvinFactory.getreadFile().then(function(result) {
         arregloBytes = result.data;
 
         if (arregloBytes.length == 0) {
             $rootScope.NohayPdfUnidades = 1;
             $rootScope.pdfUnidades = [];
         } else {
 
             $rootScope.NohayPdfUnidades = undefined;
             $rootScope.excelUnidades = URL.createObjectURL(utils.b64toBlob(arregloBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
 
         }
 
         setTimeout(function() {
             $window.open($rootScope.excelUnidades);
         }, 100);
         $('#mdlLoading').modal('hide');
         console.log( $rootScope.excelUnidades , 'Soy el arreglo ')
     }, function(error) {
         console.log("Error", error);
     });
         
 
    
 }
 $scope.nexStep3 = function() {
    if( !$scope.frmConciliacion.loadLayout ){
        swal("Unidades","No se ha cargado el Layout.");
    }
    else{
       
        myDropzone3.processQueue();
        $scope.frmConciliacion.loadLayout = true;
         
       
    }
};
$scope.arrayToObject = function(array) {
    var lst = [];
    for (var i = 0; i < array.length; i++) {
        var obj = { dato1: array[i].Numeroserie, dato2: array[i].Valor, dato3: array[i].Fecha.substring(0,10) };
        lst.push(obj);
    }
    return lst;
};

$scope.conceal = function() {
      
    $scope.getNewUnitsBySucursal(sessionFactory.empresaID);
};
});
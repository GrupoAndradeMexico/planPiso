var sql = require('mssql'),
    config = {};
var dateFormat = require('dateformat');

//configuración genérica para modelo de acceso a datos
var DataAccess = function(config) {
    //Inicializamos el objeto config
    this.config = config || {};
    //Inicializamos la conexión
    connectionString = {
        user: this.config.parameters.SQL_user,
        password: this.config.parameters.SQL_password,
        server: this.config.parameters.SQL_server, // You can use 'localhost\\instance' to connect to named instance
        database: this.config.parameters.SQL_database,
        connectionTimeout: this.config.parameters.SQL_connectionTimeout,
        requestTimeout: this.config.parameters.SQL_requestTimeout
    };
    this.types = {
        INT: sql.Int,
        DECIMAL: sql.Decimal(18, 2),
        STRING: sql.VarChar(65535),
        DATE: sql.DateTime,
        BIT: sql.bit
    }
    this.connection = new sql.Connection(connectionString);
};

//método genérico para acciones get
DataAccess.prototype.query = function(stored, params, callback) {
    var self = this.connection;
    this.connection.connect(function(err) {
        // Stored Procedure
        var request = new sql.Request(self);
        // Add inputs
        if (params.length > 0) {
            params.forEach(function(param) {
                request.input(param.name, param.type, param.value);
            });
        }

        request.execute(stored)
            .then(function(recordsets) {
                callback(null, recordsets[0]);
            }).catch(function(err) {
                callback(err);
            });
    });
};

//método genérico para acciones post
DataAccess.prototype.post = function(stored, params, callback) {
    var self = this.connection;
    this.connection.connect(function(err) {
        // Stored Procedure
        var request = new sql.Request(self);

        if (params.length > 0) {
            params.forEach(function(param) {
                request.input(param.name, param.type, param.value);
            });
        }
        request.execute(stored, function(err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al realizacion la insercción: ' + params + ' mensaje: ' + err);
            }
        });
    });
};

DataAccess.prototype.queryAllRecordSet = function(stored, params, callback) {
    var self = this.connection;
    this.connection.connect(function(err) {
        // Stored Procedure
        var request = new sql.Request(self);
        // Add inputs
        if (params.length > 0) {
            params.forEach(function(param) {
                request.input(param.name, param.type, param.value);
            });
        }
        request.execute(stored)
            .then(function(recordsets) {
                callback(null, recordsets);
            }).catch(function(err) {
                callback(err);
            });
    });
};

// ── Método aislado para sabana2 ─────────────────────────────────────────────
// SSMS negocia la sesión con language=Español/dateformat=dmy, pero el driver
// mssql/tedious no fija nada por defecto (queda en us_english/mdy). Eso hace
// que conversiones implícitas de VARCHAR a DATE dentro de los SPs (fechas en
// formato dd/mm/yyyy) fallen solo desde Node ("Error converting data type
// varchar to date").
//
// mssql v3.3.0 usa un pool de conexiones físicas (generic-pool). El intento
// inicial (SET en una llamada .execute() aparte, incluso ya fijado con una
// transacción) NO funcionó: la ruta RPC de tedious (request.execute() +
// .input()) no respeta el SET LANGUAGE/DATEFORMAT de la sesión igual que un
// batch de texto plano. Se confirmó empíricamente que SET + EXEC combinados
// en UNA sola llamada request.query() (texto, no RPC) sí funcionan — por eso
// este método arma el EXEC como texto parametrizado con @nombre en vez de
// usar .execute()/.input(). Sigue siendo seguro contra inyección porque los
// valores van bindeados vía request.input(), no concatenados en el string.
//
// NO se aplicó a query/post/queryAllRecordSet (arriba) a propósito: esos los
// usan TODOS los controllers ya en producción, y no se quiso arriesgar ese
// comportamiento. Este método es exclusivo de apiSabana2.js — si otro
// controller nuevo pega con el mismo error de conversión de fecha, migrarlo
// a este método (o promoverlo a compartido) caso por caso.
DataAccess.prototype.queryLocalizado = function(stored, params, callback) {
    var self = this.connection;
    this.connection.connect(function(err) {
        var request = new sql.Request(self);

        var asignaciones = [];
        if (params.length > 0) {
            params.forEach(function(param) {
                request.input(param.name, param.type, param.value);
                asignaciones.push('@' + param.name + ' = @' + param.name);
            });
        }

        var execText = 'EXEC ' + stored + (asignaciones.length ? ' ' + asignaciones.join(', ') : '');

        request.query("SET LANGUAGE Español; SET DATEFORMAT dmy; " + execText)
            .then(function(recordsets) {
                callback(null, recordsets);
            }).catch(function(err) {
                callback(err);
            });
    });
};

DataAccess.prototype.queryInsert = function(tabla, values, callback) {
    var self = this.connection;
    this.connection.connect(function(err) {
        const table = new sql.Table(tabla);
        table.create = false;
        table.columns.add('pal_id_lote_pago', sql.Int)
        table.columns.add('pad_polTipo', sql.VarChar(200))
        table.columns.add('pad_polAnnio', sql.Int)
        table.columns.add('pad_polMes', sql.Int)
        table.columns.add('pad_polConsecutivo', sql.Int)
        table.columns.add('pad_polMovimiento', sql.Int)
        table.columns.add('pad_fechaPromesaPago', sql.VarChar(200), { nullable: true })
        table.columns.add('pad_saldo', sql.VarChar(200), { nullable: true })
        table.columns.add('tab_revision', sql.NVarChar(200), { nullable: true })
        table.columns.add('pad_polReferencia', sql.VarChar(200), { nullable: true })
        table.columns.add('pad_documento', sql.VarChar(200), { nullable: true })
        table.columns.add('pad_agrupamiento', sql.Int, { nullable: true })
        table.columns.add('pad_bancoPagador', sql.VarChar(200), { nullable: true })
        table.columns.add('pad_bancoDestino', sql.VarChar(200), { nullable: true })
        values.forEach(function(element) {            
            table.rows.add(element.pal_id_lote_pago, element.pad_polTipo, element.pad_polAnnio, element.pad_polMes, element.pad_polConsecutivo, element.pad_polMovimiento, element.pad_fechaPromesaPago, element.pad_saldo, element.tab_revision.toString(), element.pad_polReferencia, element.pad_documento, element.pad_agrupamiento, element.pad_bancoPagador, element.pad_bancoDestino);
        });
        var request = new sql.Request(self);
        // console.log(table)
        request.bulk(table)
            .then(function(recordsets) {
                // console.log(recordsets, 'ENtre al exito');
                callback(null, recordsets);
            }).catch(function(err) {
                // console.log(err, 'Entre al ERROR')
                callback(err);
            });
        // request.bulk(table, (err, result) => {
        //     // ... error checks
        // })
        // const table = new sql.Table('table_name')
        // var request = new sql.Request(self);
        // 
        // const transaction = new sql.Transaction(self)
        // transaction.begin(err => {
        //     // ... error checks
        //     let rolledBack = false
        //     transaction.on('rollback', aborted => {
        //         // emited with aborted === true
        //         rolledBack = true
        //     })

        //     new sql.Request(transaction)
        //         .query(query, (err, result) => {
        //             // insert should fail because of invalid value
        //             console.log(result, 'ES AQUI??')
        //             if (err) {
        //                 if (!rolledBack) {
        //                     transaction.rollback(err => {
        //                         console.log(err, 'ENTRE AL rollback')
        //                         callback('Ocurrio un error');
        //                     })
        //                 }
        //             } else {
        //                 transaction.commit(err => {
        //                     console.log(err, 'Entre commit ')                            
        //                         callback(null, result);
        //                 })
        //             }
        //         })
        // })
        // 

        // console.log('conectado');
        // console.log(query);
        // request.query(query)
        //     .then(function(recordsets) {
        //         console.log(recordsets);
        //         callback(null, recordsets);
        //     }).catch(function(err) {
        //         callback(err);
        //     });
    });
};
DataAccess.prototype.queryInsertDocumentosLote = function(tabla, values, callback) {
    var self = this.connection;
    this.connection.connect(function(err) {
        // console.log(tabla)
        // values.forEach(function(element) {            
        //    console.log(element.CCP_IDDOCTO, element.idUsuario, element.idPoliza, element.pagoReduccion, element.estatus) 
        // });

        const table = new sql.Table(tabla);
        table.create = false;
        table.columns.add('documento', sql.VarChar(200))
        table.columns.add('idUsuario', sql.Int)
        table.columns.add('idPoliza', sql.Int)
        table.columns.add('pagoReduccion', sql.Int)
        table.columns.add('estatus', sql.Int)
        values.forEach(function(element) {            
            table.rows.add(element.CCP_IDDOCTO, element.idUsuario, element.idPoliza, element.pagoReduccion, element.estatus);
        });
        var request = new sql.Request(self);
        // console.log(table)
        request.bulk(table)
            .then(function(recordsets) {
                // console.log(recordsets, 'ENtre al exito');
                callback(null, recordsets);
            }).catch(function(err) {
                // console.log(err, 'Entre al ERROR')
                callback(err);
            });
    });
};
DataAccess.prototype.queryInsertDocumentosLoteCompensacion = function(tabla, values, callback) {
    var self = this.connection;
    this.connection.connect(function(err) {
        // console.log(tabla)
        // values.forEach(function(element) {            
        //    console.log(element.CCP_IDDOCTO, element.idUsuario, element.idPoliza, element.pagoReduccion, element.estatus) 
        // });

        const table = new sql.Table(tabla);
        table.create = false;
        table.columns.add('documento', sql.VarChar(200))
        table.columns.add('idUsuario', sql.Int)
        table.columns.add('idPoliza', sql.Int)
        table.columns.add('pagoCompensacion', sql.Int)
        table.columns.add('estatus', sql.Int)
        values.forEach(function(element) {            
            table.rows.add(element.CCP_IDDOCTO, element.idUsuario, element.idPoliza, element.pagoCompensacion, element.estatus);
        });
        var request = new sql.Request(self);
        // console.log(table)
        request.bulk(table)
            .then(function(recordsets) {
                // console.log(recordsets, 'ENtre al exito');
                callback(null, recordsets);
            }).catch(function(err) {
                // console.log(err, 'Entre al ERROR')
                callback(err);
            });
    });
};



//exportación del modelo
module.exports = DataAccess;
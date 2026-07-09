'use strict';
const ExcelJS = require('exceljs');

// 88 columnas en 8 grupos (5 bloques + 3 columnas individuales)
const HEADER_GROUPS = [
  {
    title: 'Financiera',
    color: 'FFFF00',
    soloColumna: false,
    columns: [
      { key: 'IdEmpresa',         label: 'IdEmpresa',          width: 12 },
      { key: 'NombreEmpresa',     label: 'Nombre Empresa',     width: 30 },
      { key: 'IdFinanciera',      label: 'IdFinanciera',       width: 13 },
      { key: 'NOMBREFIN',         label: 'Nombre Financiera',  width: 28 },
      { key: 'Serie',             label: 'Serie',              width: 22 },
      { key: 'Modelo',            label: 'Modelo',             width: 16 },
      { key: 'Marca',             label: 'Marca',              width: 16 },
      { key: 'Anio_modelo',       label: 'Anio_modelo',        width: 12 },
      { key: 'NUMFACPTA',         label: 'NUMFACPTA',          width: 18 },
      { key: 'Importe_original',  label: 'Importe_original',   width: 18, tipo: 'moneda' },
      { key: 'FECHAFACPTA',       label: 'FECHAFACPTA',        width: 14, tipo: 'fecha'  },
      { key: 'Fecha_inicio',      label: 'Fecha_inicio',       width: 14, tipo: 'fecha'  },
      { key: 'Fecha_vencimiento', label: 'Fecha_vencimiento',  width: 18, tipo: 'fecha'  },
      { key: 'DIASFIN',           label: 'DIASFIN',            width: 10 },
      { key: 'Saldo_actual',      label: 'Saldo_actual',       width: 16, tipo: 'moneda' },
    ],
  },
  {
    title: 'Cartera Plan Piso',
    color: '92D050',
    soloColumna: false,
    columns: [
      { key: 'Empresa_PP',      label: 'Empresa_PP',      width: 12 },
      { key: 'CCP_IDDOCTO',     label: 'CCP_IDDOCTO',     width: 14 },
      { key: 'MODULO',          label: 'MODULO',          width: 10 },
      { key: 'DES_CARTERA',     label: 'DES_CARTERA',     width: 16 },
      { key: 'DES_TIPODOCTO',   label: 'DES_TIPODOCTO',   width: 16 },
      { key: 'CCP_FECHADOCTO',  label: 'CCP_FECHADOCTO',  width: 14, tipo: 'fecha'  },
      { key: 'CCP_IDPERSONA',   label: 'CCP_IDPERSONA',   width: 14 },
      { key: 'Nombre',          label: 'Nombre',          width: 28 },
      { key: 'CCP_FECHVEN',     label: 'CCP_FECHVEN',     width: 14, tipo: 'fecha'  },
      { key: 'CCP_FECHPROMPAG', label: 'CCP_FECHPROMPAG', width: 16, tipo: 'fecha'  },
      { key: 'CCP_FECHREV',     label: 'CCP_FECHREV',     width: 14, tipo: 'fecha'  },
      { key: 'CCP_OBSGEN',      label: 'CCP_OBSGEN',      width: 20 },
      { key: 'IMPORTE',         label: 'IMPORTE',         width: 16, tipo: 'moneda' },
      { key: 'SALDO_PP',        label: 'SALDO',           width: 16, tipo: 'moneda' },
      { key: 'DIAS',            label: 'DIAS',            width: 10 },
      { key: 'DIASVENCIDOS',    label: 'DIASVENCIDOS',    width: 13 },
      { key: 'INTERESES',       label: 'INTERESES',       width: 14, tipo: 'moneda' },
      { key: 'CCP_CARTERA',     label: 'CCP_CARTERA',     width: 14 },
      { key: 'ClasiMovimiento', label: 'ClasiMovimiento', width: 16 },
      { key: 'CCP_CTA',         label: 'CCP_CTA',         width: 14 },
    ],
  },
  {
    title: 'Cartera Planta',
    color: 'FFC000',
    soloColumna: false,
    columns: [
      { key: 'PTA_Empresa_PP',      label: 'PTA_Empresa_PP',      width: 14 },
      { key: 'PTA_CCP_IDDOCTO',     label: 'PTA_CCP_IDDOCTO',     width: 16 },
      { key: 'PTA_MODULO',          label: 'PTA_MODULO',          width: 12 },
      { key: 'PTA_DES_CARTERA',     label: 'PTA_DES_CARTERA',     width: 16 },
      { key: 'PTA_DES_TIPODOCTO',   label: 'PTA_DES_TIPODOCTO',   width: 18 },
      { key: 'PTA_CCP_FECHADOCTO',  label: 'PTA_CCP_FECHADOCTO',  width: 18, tipo: 'fecha'  },
      { key: 'PTA_CCP_IDPERSONA',   label: 'PTA_CCP_IDPERSONA',   width: 16 },
      { key: 'PTA_Nombre',          label: 'PTA_Nombre',          width: 28 },
      { key: 'PTA_CCP_FECHVEN',     label: 'PTA_CCP_FECHVEN',     width: 16, tipo: 'fecha'  },
      { key: 'PTA_CCP_FECHPROMPAG', label: 'PTA_CCP_FECHPROMPAG', width: 18, tipo: 'fecha'  },
      { key: 'PTA_CCP_FECHREV',     label: 'PTA_CCP_FECHREV',     width: 16, tipo: 'fecha'  },
      { key: 'PTA_CCP_OBSGEN',      label: 'PTA_CCP_OBSGEN',      width: 20 },
      { key: 'PTA_IMPORTE',         label: 'PTA_IMPORTE',         width: 16, tipo: 'moneda' },
      { key: 'PTA_SALDO',           label: 'PTA_SALDO',           width: 16, tipo: 'moneda' },
      { key: 'PTA_DIAS',            label: 'PTA_DIAS',            width: 12 },
      { key: 'PTA_DIASVENCIDOS',    label: 'PTA_DIASVENCIDOS',    width: 15 },
      { key: 'PTA_INTERESES',       label: 'PTA_INTERESES',       width: 16, tipo: 'moneda' },
      { key: 'PTA_CCP_CARTERA',     label: 'PTA_CCP_CARTERA',     width: 16 },
      { key: 'PTA_ClasiMovimiento', label: 'PTA_ClasiMovimiento', width: 18 },
      { key: 'PTA_CCP_CTA',         label: 'PTA_CCP_CTA',         width: 14 },
    ],
  },
  {
    title: 'Inventario',
    color: '8EA9DB',
    soloColumna: false,
    columns: [
      { key: 'SUC',                   label: 'SUC',                   width: 10 },
      { key: 'VEH_NUMSERIE',          label: 'VEH_NUMSERIE',          width: 22 },
      { key: 'VEH_TIPOAUTO',          label: 'VEH_TIPOAUTO',          width: 14 },
      { key: 'VEH_CATALOGO',          label: 'VEH_CATALOGO',          width: 18 },
      { key: 'VEH_NOFACTPLAN',        label: 'VEH_NOFACTPLAN',        width: 16 },
      { key: 'VEH_IMPFACTPLAN',       label: 'VEH_IMPFACTPLAN',       width: 16, tipo: 'moneda' },
      { key: 'VEH_SITUACION',         label: 'VEH_SITUACION',         width: 14 },
      { key: 'VTE_DOCTO',             label: 'VTE_DOCTO',             width: 14 },
      { key: 'VTE_IDCLIENTE',         label: 'VTE_IDCLIENTE',         width: 14 },
      { key: 'VTE_FECHDOCTO',         label: 'VTE_FECHDOCTO',         width: 14, tipo: 'fecha'  },
      { key: 'VTE_REFERENCIA1',       label: 'VTE_REFERENCIA1',       width: 18 },
      { key: 'VTE_FORMAPAGO',         label: 'VTE_FORMAPAGO',         width: 14 },
      { key: 'VTE_VTABRUT',           label: 'VTE_VTABRUT',           width: 14, tipo: 'moneda' },
      { key: 'VTE_IVA',               label: 'VTE_IVA',               width: 14, tipo: 'moneda' },
      { key: 'VTE_TOTAL',             label: 'VTE_TOTAL',             width: 14, tipo: 'moneda' },
      { key: 'VTE_SERIE',             label: 'VTE_SERIE',             width: 22 },
      { key: 'PEN_FECHAENTREGA_REAL', label: 'PEN_FECHAENTREGA_REAL', width: 20, tipo: 'fecha'  },
      { key: 'PEN_NUMSERIE',          label: 'PEN_NUMSERIE',          width: 22 },
    ],
  },
  {
    title: 'Cuentas por Cobrar',
    color: 'C45911',
    soloColumna: false,
    columns: [
      { key: 'cliente',             label: 'cliente',          width: 12 },
      { key: 'rfc_cliente',         label: 'rfc_cliente',      width: 16 },
      { key: 'nombre_cliente',      label: 'nombre_cliente',   width: 30 },
      { key: 'referencia',          label: 'referencia',       width: 18 },
      { key: 'fecha_movimiento',    label: 'fecha_movimiento', width: 18, tipo: 'fecha'  },
      { key: 'clasificacion',       label: 'clasificacion',    width: 16 },
      { key: 'nombre_cuenta',       label: 'nombre_cuenta',    width: 22 },
      { key: 'saldo',               label: 'saldo',            width: 14, tipo: 'moneda' },
      { key: 'INV_CCP_FECHVEN',     label: 'CCP_FECHVEN',      width: 14, tipo: 'fecha'  },
      { key: 'INV_CCP_FECHPROMPAG', label: 'CCP_FECHPROMPAG',  width: 18, tipo: 'fecha'  },
      { key: 'COTIZACION',          label: 'COTIZACION',       width: 14 },
      { key: 'CANAL_VENTA',         label: 'CANAL_VENTA',      width: 14 },
    ],
  },
  {
    title: null,
    color: '002060',
    fontColor: 'FFFFFF',
    soloColumna: true,
    columns: [
      { key: 'Validacion', label: 'En Plan piso Financiera y GA', width: 30 },
    ],
  },
  {
    title: null,
    color: '002060',
    fontColor: 'FFFFFF',
    soloColumna: true,
    columns: [
      { key: 'Resultado', label: 'Unidad Estrella', width: 18, tipo: 'moneda' },
    ],
  },
  {
    title: null,
    color: '002060',
    fontColor: 'FFFFFF',
    soloColumna: true,
    columns: [
      { key: 'UnidadesNoFinanciadas', label: 'Unidades No financiadas', width: 24, tipo: 'moneda' },
    ],
  },
];

async function generarExcel(rows) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'reporte-planpiso-api';
  wb.created = new Date();

  const ws = wb.addWorksheet('Sábana Plan Piso');

  // Aplanar columnas con referencia a su grupo
  const flatCols = [];
  for (const grp of HEADER_GROUPS) {
    for (const col of grp.columns) {
      flatCols.push({ ...col, _group: grp });
    }
  }

  // Anchos de columna
  flatCols.forEach((col, i) => {
    ws.getColumn(i + 1).width = col.width || 15;
  });

  // Fila 1: títulos de grupo (valores se asignan después de estilar)
  const hRow1 = ws.addRow(flatCols.map(() => null));
  hRow1.height = 22;

  // Fila 2: etiquetas de cada columna
  const hRow2 = ws.addRow(flatCols.map(col => col.label || col.key));
  hRow2.height = 36;

  // Aplicar estilos a las dos filas de encabezado
  let colOffset = 1;
  for (const grp of HEADER_GROUPS) {
    const startCol = colOffset;
    const endCol   = colOffset + grp.columns.length - 1;
    const fgColor  = { argb: 'FF' + grp.color };
    const fontClr  = { argb: 'FF' + (grp.fontColor || '000000') };

    for (let c = startCol; c <= endCol; c++) {
      // Fila 1: fill + alineación centerContinuous en todo el rango del grupo
      const c1 = hRow1.getCell(c);
      c1.fill      = { type: 'pattern', pattern: 'solid', fgColor };
      c1.font      = { bold: true, color: fontClr };
      c1.alignment = { horizontal: 'centerContinuous', vertical: 'middle' };

      // Fila 2: fill + centro con wrap
      const c2 = hRow2.getCell(c);
      c2.fill      = { type: 'pattern', pattern: 'solid', fgColor };
      c2.font      = { bold: true, color: fontClr };
      c2.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    }

    // El título solo va en la primera celda del rango (si no es soloColumna)
    if (!grp.soloColumna && grp.title) {
      hRow1.getCell(startCol).value = grp.title;
    }

    colOffset = endCol + 1;
  }

  // Congelar las dos primeras filas
  ws.views = [{ state: 'frozen', ySplit: 2 }];

  // Filas de datos
  for (const rowData of rows) {
    const values = flatCols.map(col => {
      const v = rowData[col.key];
      return v === undefined ? null : v;
    });

    const dr = ws.addRow(values);

    flatCols.forEach((col, i) => {
      if (!col.tipo) return;
      const cell = dr.getCell(i + 1);
      if (col.tipo === 'fecha' && cell.value instanceof Date) {
        cell.numFmt = 'dd/mm/yyyy';
      } else if (col.tipo === 'moneda' && cell.value !== null && cell.value !== undefined) {
        cell.numFmt = '#,##0.00';
      }
    });
  }

  return wb;
}

module.exports = { generarExcel, HEADER_GROUPS };

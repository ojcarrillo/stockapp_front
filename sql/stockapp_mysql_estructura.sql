# MySQL-Front Dump 2.5
#
# Host: localhost   Database: stockapp
# --------------------------------------------------------
# Server version 4.0.15-nt

USE stockapp;


#
# Table structure for table 'articulos'
#

DROP TABLE IF EXISTS articulos;
CREATE TABLE articulos (
  idArticulos int(10) unsigned NOT NULL auto_increment,
  NombreGenerico varchar(150) default NULL,
  NombreComercial varchar(150) default NULL,
  Presentacion tinyint(3) unsigned default NULL,
  ValorCompra decimal(10,2) default NULL,
  ValorVenta decimal(10,2) default NULL,
  UnidadCompra varchar(30) default NULL,
  Conversion int(10) unsigned default NULL,
  UnidadVenta varchar(30) default NULL,
  Iva tinyint(3) unsigned default NULL,
  Descuento tinyint(3) unsigned default NULL,
  TipoArticulo tinyint(3) unsigned default NULL,
  Referencia varchar(15) default NULL,
  Existencias int(10) unsigned default NULL,
  ExistenciasMinimas int(10) unsigned default NULL,
  Activo tinyint(1) default NULL,
  PRIMARY KEY  (idArticulos),
  KEY Articulos_FKIndex1 (TipoArticulo),
  KEY Articulos_FKIndex2 (Iva),
  KEY Articulos_FKIndex3 (Descuento),
  KEY Articulos_FKIndex4 (Presentacion)
) ENGINE=MyISAM;



#
# Table structure for table 'cierreagno'
#

DROP TABLE IF EXISTS cierreagno;
CREATE TABLE cierreagno (
  idcierreAgno int(10) unsigned NOT NULL auto_increment,
  cierre varchar(10) default NULL,
  fechahoracierre datetime default NULL,
  ivaAgno decimal(12,2) default NULL,
  exentoAgno decimal(12,2) default NULL,
  baseAgno decimal(12,2) default NULL,
  totalAgno decimal(12,2) default NULL,
  idVendCierreAgno tinyint(3) unsigned default NULL,
  PRIMARY KEY  (idcierreAgno)
) ENGINE=MyISAM;



#
# Table structure for table 'cierredia'
#

DROP TABLE IF EXISTS cierredia;
CREATE TABLE cierredia (
  idCierreDia int(10) unsigned NOT NULL auto_increment,
  Cierre varchar(25) default NULL,
  FechaHoraCierre datetime default NULL,
  ivaDia decimal(10,2) default NULL,
  exentoDia decimal(10,2) default NULL,
  totalDia decimal(10,2) default NULL,
  baseDia decimal(10,2) default '0.00',
  idVendCierreDia tinyint(3) unsigned default NULL,
  PRIMARY KEY  (idCierreDia),
  KEY CierreDia_FKIndex1 (idVendCierreDia)
) ENGINE=MyISAM;



#
# Table structure for table 'cierremes'
#

DROP TABLE IF EXISTS cierremes;
CREATE TABLE cierremes (
  idCierreMes int(10) unsigned NOT NULL auto_increment,
  Cierre varchar(35) default NULL,
  FechaHoraCierre datetime default NULL,
  IvaMes decimal(15,2) default NULL,
  ExentoMes decimal(15,2) default NULL,
  TotalMes decimal(15,2) default NULL,
  basemes decimal(10,2) default '0.00',
  idVendCierreMes tinyint(3) unsigned NOT NULL default '0',
  PRIMARY KEY  (idCierreMes),
  KEY CierreMes_FKIndex1 (idVendCierreMes)
) ENGINE=MyISAM;



#
# Table structure for table 'datosprograma'
#

DROP TABLE IF EXISTS datosprograma;
CREATE TABLE datosprograma (
  idDatosPrograma int(10) unsigned NOT NULL auto_increment,
  RazonSocial varchar(100) default NULL,
  Nit varchar(15) default NULL,
  Direccion varchar(100) default NULL,
  Resolucion varchar(30) default NULL,
  FechaResolucion datetime default NULL,
  Prefijo varchar(10) default NULL,
  InicioNum int(10) unsigned default NULL,
  FinNum int(10) unsigned default NULL,
  Logo blob,
  Regimen varchar(50) default NULL,
  FechaMod datetime default NULL,
  PRIMARY KEY  (idDatosPrograma)
) ENGINE=MyISAM;



#
# Table structure for table 'descuentos'
#

DROP TABLE IF EXISTS descuentos;
CREATE TABLE descuentos (
  idDescuentos tinyint(3) unsigned NOT NULL auto_increment,
  Tipo varchar(20) default NULL,
  Valor decimal(2,0) default NULL,
  PRIMARY KEY  (idDescuentos)
) ENGINE=MyISAM;



#
# Table structure for table 'detdevolucion'
#

DROP TABLE IF EXISTS detdevolucion;
CREATE TABLE detdevolucion (
  iddetDevolucion int(10) unsigned NOT NULL auto_increment,
  idVentasFactura int(10) unsigned default NULL,
  idArticulos int(10) unsigned default NULL,
  Cantidad int(10) unsigned default NULL,
  ValorUnitario decimal(10,2) default NULL,
  ValorIva decimal(10,2) default NULL,
  ValorDesc decimal(10,2) default NULL,
  ValorExentoArticulo decimal(10,2) default NULL,
  ValorTotArticulo decimal(10,2) default NULL,
  FechaHoraDev datetime default NULL,
  idUsuario tinyint(3) unsigned default NULL,
  PRIMARY KEY  (iddetDevolucion)
) ENGINE=MyISAM;



#
# Table structure for table 'detfacturaproveedor'
#

DROP TABLE IF EXISTS detfacturaproveedor;
CREATE TABLE detfacturaproveedor (
  idFacturasProveedor int(10) unsigned NOT NULL auto_increment,
  idArticulos int(10) unsigned default NULL,
  Cantidad int(10) unsigned default NULL,
  ValorCompra decimal(10,2) default NULL,
  ValorVenta decimal(10,2) default NULL,
  KEY detFacturaProveedor_FKIndex1 (idFacturasProveedor),
  KEY detFacturaProveedor_FKIndex2 (idArticulos)
) ENGINE=MyISAM;



#
# Table structure for table 'detremisionesproveedor'
#

DROP TABLE IF EXISTS detremisionesproveedor;
CREATE TABLE detremisionesproveedor (
  idremisionesproveedor int(10) unsigned NOT NULL auto_increment,
  idArticulos int(10) unsigned default NULL,
  Cantidad int(10) unsigned default NULL,
  ValorCompra decimal(10,2) default NULL,
  ValorVenta decimal(10,2) default NULL,
  KEY detFacturaProveedor_FKIndex1 (idremisionesproveedor),
  KEY detFacturaProveedor_FKIndex2 (idArticulos)
) ENGINE=MyISAM;



#
# Table structure for table 'detventafactura'
#

DROP TABLE IF EXISTS detventafactura;
CREATE TABLE detventafactura (
  IdVentasFactura int(10) unsigned NOT NULL auto_increment,
  IdArticulos int(10) unsigned default NULL,
  Cantidad int(10) unsigned default NULL,
  ValorUnitario decimal(10,2) default NULL,
  ValorIva decimal(10,2) default NULL,
  ValorDesc decimal(10,2) default NULL,
  ValorExentoArticulo decimal(10,2) default NULL,
  ValorTotArticulo decimal(10,2) default NULL,
  efectivo decimal(10,2) default '0.00',
  cambio decimal(10,2) default '0.00',
  KEY DetVentaFactura_FKIndex1 (IdArticulos),
  KEY DetVentaFactura_FKIndex2 (IdVentasFactura)
) ENGINE=MyISAM;



#
# Table structure for table 'facturasproveedor'
#

DROP TABLE IF EXISTS facturasproveedor;
CREATE TABLE facturasproveedor (
  idFacturasProveedor int(10) unsigned NOT NULL auto_increment,
  idProveedores int(10) unsigned NOT NULL default '0',
  FacturaNum varchar(15) default NULL,
  FechaFact date default NULL,
  ValorFactura decimal(10,2) default NULL,
  IvaFactura decimal(10,2) default NULL,
  FechaVencimiento date default NULL,
  Pago varchar(10) default NULL,
  FechaRegistro datetime default NULL,
  idRegistra int(10) unsigned default NULL,
  anotacion varchar(252) default '',
  PRIMARY KEY  (idFacturasProveedor),
  KEY FacturasProveedor_FKIndex1 (idProveedores)
) ENGINE=MyISAM;



#
# Table structure for table 'gastosmensuales'
#

DROP TABLE IF EXISTS gastosmensuales;
CREATE TABLE gastosmensuales (
  idGastosMensuales int(10) unsigned NOT NULL auto_increment,
  Mes varchar(20) default NULL,
  FechaHoraGastos datetime default NULL,
  Nomina decimal(10,2) default '0.00',
  PrestSalud decimal(12,2) default NULL,
  Arriendo decimal(10,2) default '0.00',
  Luz decimal(10,2) default '0.00',
  Agua decimal(10,2) default '0.00',
  Telefono decimal(10,2) default '0.00',
  Impuestos decimal(10,2) default '0.00',
  Personales decimal(10,2) default '0.00',
  Ocacionales decimal(10,2) default '0.00',
  TotalGastos decimal(12,2) default '0.00',
  PRIMARY KEY  (idGastosMensuales)
) ENGINE=MyISAM;



#
# Table structure for table 'iva'
#

DROP TABLE IF EXISTS iva;
CREATE TABLE iva (
  idIva tinyint(3) unsigned NOT NULL auto_increment,
  Tipo varchar(20) default NULL,
  Valor decimal(2,0) default NULL,
  PRIMARY KEY  (idIva)
) ENGINE=MyISAM;



#
# Table structure for table 'notascontables'
#

DROP TABLE IF EXISTS notascontables;
CREATE TABLE notascontables (
  idnotascontables int(10) NOT NULL auto_increment,
  tiponota char(1) default NULL,
  idProveedores int(10) default NULL,
  notanum varchar(15) default NULL,
  fechanota date default NULL,
  valorfactura decimal(10,2) default NULL,
  facturanum varchar(15) default NULL,
  anotacion varchar(252) default NULL,
  fecharegistra datetime default NULL,
  idregistra int(10) default NULL,
  PRIMARY KEY  (idnotascontables)
) ENGINE=MyISAM;



#
# Table structure for table 'pagofactproveedor'
#

DROP TABLE IF EXISTS pagofactproveedor;
CREATE TABLE pagofactproveedor (
  idPagoFactProveedor int(10) unsigned NOT NULL auto_increment,
  IdFacturasProveedor int(10) unsigned default NULL,
  FechaCancelacion date default NULL,
  MetPago char(1) default NULL,
  ValorPago decimal(10,2) default NULL,
  Cheque varchar(30) default '',
  Banco varchar(35) default NULL,
  Descuento decimal(10,2) default '0.00',
  PRIMARY KEY  (idPagoFactProveedor)
) ENGINE=MyISAM;



#
# Table structure for table 'pagofactura'
#

DROP TABLE IF EXISTS pagofactura;
CREATE TABLE pagofactura (
  idPago int(10) unsigned NOT NULL auto_increment,
  idVentasFactura int(10) unsigned NOT NULL default '0',
  idArticulos int(10) unsigned NOT NULL default '0',
  ValorPagado decimal(10,2) default NULL,
  ValorFacturado decimal(10,2) default NULL,
  ValorCambio decimal(10,2) default NULL,
  PRIMARY KEY  (idPago)
) ENGINE=MyISAM;



#
# Table structure for table 'permisos_us'
#

DROP TABLE IF EXISTS permisos_us;
CREATE TABLE permisos_us (
  idPermisos tinyint(3) unsigned NOT NULL auto_increment,
  opcion varchar(50) default '0',
  activo char(1) default '0',
  PRIMARY KEY  (idPermisos)
) ENGINE=MyISAM;



#
# Table structure for table 'permisos_usuarios'
#

DROP TABLE IF EXISTS permisos_usuarios;
CREATE TABLE permisos_usuarios (
  id int(10) unsigned NOT NULL auto_increment,
  idPermisos tinyint(3) unsigned NOT NULL default '0',
  idUsuarios tinyint(3) unsigned NOT NULL default '0',
  activo char(1) default '0',
  PRIMARY KEY  (id),
  KEY PermisosUsuarios_FKIndex1 (idUsuarios),
  KEY PermisosUsuarios_FKIndex2 (idPermisos)
) ENGINE=MyISAM;



#
# Table structure for table 'presentacion'
#

DROP TABLE IF EXISTS presentacion;
CREATE TABLE presentacion (
  idPresentacion tinyint(3) unsigned NOT NULL auto_increment,
  Nombre varchar(30) default NULL,
  PRIMARY KEY  (idPresentacion)
) ENGINE=MyISAM;



#
# Table structure for table 'proveedores'
#

DROP TABLE IF EXISTS proveedores;
CREATE TABLE proveedores (
  idProveedores int(10) unsigned NOT NULL auto_increment,
  NombreProveedor varchar(100) default NULL,
  NitProveedor varchar(25) default NULL,
  DirProveedor varchar(100) default NULL,
  TelProveedor varchar(10) default NULL,
  Activo tinyint(1) default NULL,
  PRIMARY KEY  (idProveedores)
) ENGINE=MyISAM;



#
# Table structure for table 'remisionesproveedor'
#

DROP TABLE IF EXISTS remisionesproveedor;
CREATE TABLE remisionesproveedor (
  idremisionesproveedor int(10) unsigned NOT NULL auto_increment,
  idProveedores int(10) unsigned NOT NULL default '0',
  FacturaNum varchar(15) default NULL,
  FechaFact date default NULL,
  ValorFactura decimal(10,2) default NULL,
  IvaFactura decimal(10,2) default NULL,
  FechaVencimiento date default NULL,
  Pago varchar(10) default NULL,
  FechaRegistro datetime default NULL,
  idRegistra int(10) unsigned default NULL,
  anotacion varchar(252) default '',
  PRIMARY KEY  (idremisionesproveedor),
  KEY FacturasProveedor_FKIndex1 (idProveedores)
) ENGINE=MyISAM;



#
# Table structure for table 'tipoarticulo'
#

DROP TABLE IF EXISTS tipoarticulo;
CREATE TABLE tipoarticulo (
  idTipoArticulo tinyint(3) unsigned NOT NULL auto_increment,
  Nombre varchar(30) default NULL,
  PRIMARY KEY  (idTipoArticulo)
) ENGINE=MyISAM;



#
# Table structure for table 'unidades'
#

DROP TABLE IF EXISTS unidades;
CREATE TABLE unidades (
  idUnidades tinyint(3) unsigned NOT NULL auto_increment,
  Unidad varchar(30) default NULL,
  PRIMARY KEY  (idUnidades)
) ENGINE=MyISAM;



#
# Table structure for table 'usuarios'
#

DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
  idUsuarios tinyint(3) unsigned NOT NULL auto_increment,
  NombreCompleto varchar(120) default NULL,
  Cedula varchar(15) default NULL,
  TelFijo varchar(10) default NULL,
  TelCelular varchar(15) default NULL,
  Login varchar(15) default NULL,
  PassLogin varchar(15) default NULL,
  Perfil tinyint(3) unsigned default NULL,
  activo char(1) default NULL,
  PRIMARY KEY  (idUsuarios)
) ENGINE=MyISAM;



#
# Table structure for table 'ventasfactura'
#

DROP TABLE IF EXISTS ventasfactura;
CREATE TABLE ventasfactura (
  idVentasFactura int(10) unsigned NOT NULL auto_increment,
  nombreVende varchar(70) default NULL,
  Nit varchar(20) default NULL,
  ValorTotFactura decimal(10,2) default NULL,
  IvaTotFactura decimal(10,2) default NULL,
  exentototfactura decimal(10,2) default NULL,
  DescTotFactura decimal(10,2) default NULL,
  basefactura decimal(10,2) default '0.00',
  FechaHoraVenta datetime default NULL,
  IdVendedor tinyint(3) unsigned default NULL,
  PRIMARY KEY  (idVentasFactura),
  KEY VentasFactura_FKIndex1 (IdVendedor),
  KEY indfechahora (FechaHoraVenta)
) ENGINE=MyISAM;


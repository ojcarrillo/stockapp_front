import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  constructor() { }

  statsPred = {

  };

  /* tipos de stats con max cap - usando orden del reloj */
  tiposStats = [
    new Stat(0, 'defensa', 23, '16-23', false),
    new Stat(1, 'ataque', 19, '14-19', false),
    new Stat(2, 'vida', 299, '209-299', false),
    new Stat(3, 'vida %', 5.8, '4.1-5.8 %', false),
    new Stat(4, 'ataque %', 5.8, '4.1-5.8 %', false),
    new Stat(5, 'defensa %', 7.3, '5.1-7.3 %', false),
    new Stat(6, 'maestria elemental', 23, '16-23', false),
    new Stat(7, 'probabilidad de critico', 3.9, '2.7-3.9 %', false),
    new Stat(8, 'recarga de energia %', 6.5, '4.5-6.5 %', false),
    new Stat(9, 'daño critico', 7.8, '5.4-78 %', false)
  ];

  statPrincipal = new Stat();

  /* stats de entrada para predecir el 4to stat */
  statsArtefacto = {
    uno: new StatArtefacto(),
    dos: new StatArtefacto(),
    tres: new StatArtefacto(),
    cuatro: new StatArtefacto(),
    ruptura: new StatArtefacto()
  };

  ngOnInit(): void {
  }

  compareObjectsId(object1: any, object2: any) {
    return object1 && object2 && object1.id === object2.id;
  }

  filterStats(statPrincipal: any) {
    return this.tiposStats.filter(p => p !== statPrincipal);
  }

  filterSubStats(statPrincipal: any, stat1: any, stat2: any) {
    return this.tiposStats.filter(p => p !== statPrincipal && p !== stat1 && p !== stat2);
  }

  limpiar() {
    this.statsArtefacto = {
      uno: new StatArtefacto(),
      dos: new StatArtefacto(),
      tres: new StatArtefacto(),
      cuatro: new StatArtefacto(),
      ruptura: new StatArtefacto()
    };
    this.statPrincipal = new Stat();
  }

  calcular() {
    /* limpia valores previos */
    this.statsArtefacto.cuatro = new StatArtefacto();
    this.statsArtefacto.ruptura = new StatArtefacto();
    /* pendiente validaciones */
    /* calculo porcentaje de aproximación al max cap por stat */
    for (const key of Object.keys(this.statsArtefacto)) {
      // console.log(key, this.statsArtefacto[key], this.statsArtefacto[key].tipo);
      this.statsArtefacto[key].calc = this.obtenerCap(this.statsArtefacto[key].tipo?.maxcap, this.statsArtefacto[key].valor);
      this.statsArtefacto[key].diff = 100 - this.statsArtefacto[key].calc;
    }
    const statCalculado = this.minimoCercanoAl100();
    console.log(statCalculado[0]);
    const statMandatory = this.arrayMinDiff(this.statsArtefactoToList());
    const statRuptura = this.rompePatronArtefactos(statMandatory.tipo.pos);
    console.log(statRuptura[0]);
    this.statsArtefacto.cuatro.tipo = statCalculado[0];
    this.statsArtefacto.ruptura.tipo = statRuptura[0];
  }

  /* regla de 3 simple en porcentaje */
  obtenerCap(maxcap: number = 0, valor: number = 0) {
    return maxcap === 0 ? 0 : (valor > maxcap ? 0 : (valor * 100) / maxcap);
  }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  minimoCercanoAl100() {
    const statMandatory = this.arrayMinDiff(this.statsArtefactoToList());
    // console.log('el primero mas cercano', statMandatory);
    // console.log('el stat calculado', this.hallarStat(statMandatory.tipo.pos + 1, this.statsArtefactoToList()));
    return this.hallarStat(statMandatory.tipo.pos + 1, this.statsArtefactoToList());
  }

  rompePatronArtefactos(pos: number) {
    const skip = this.statPrincipal.isElemental ? 4 : 3;
    return this.hallarStat(pos + skip, this.statsArtefactoToList());
  }

  arrayMinDiff(arr: any) {
    return arr.reduce((p: any, v: any) => {
      return (p.diff < v.diff ? p : v);
    });
  }

  hallarStat(pos: number, lista: any[]) {
    // console.log('pos---->', pos);
    if (pos > this.filterStats(this.statPrincipal).length) {
      // console.log('mas alla del final');
      return this.hallarStat(0, lista);
    }
    if (pos === this.statPrincipal.pos) {
      // console.log('es stat principal');
      return this.hallarStat(pos + 1, lista);
    }
    const stat = this.filterStats(this.statPrincipal).filter(p => p.pos === pos);
    // console.log('stat', stat[0]);
    // console.log('ll', lista.find(p => p.tipo.pos === stat[0].pos));
    if (lista.find(p => p.tipo === stat[0]) !== undefined) {
      // console.log('existe en los substats');
      return this.hallarStat(pos + 1, lista);
    }
    console.log('salida');
    return stat;

  }

  /* convertimos stats del artefacto a una lista */
  statsArtefactoToList() {
    const listaStatsArtefacto = [];
    for (const key of Object.keys(this.statsArtefacto)) {
      if (this.statsArtefacto[key].tipo !== null) {
        listaStatsArtefacto.push(this.statsArtefacto[key]);
      }
    }
    return listaStatsArtefacto;
  }
}

export class Stat {

  constructor(
    public pos?: number,
    public nombre?: string,
    public maxcap?: number,
    public cap?: string,
    public isElemental?: boolean
  ) {

  }
}

export class StatArtefacto {

  constructor(
    public tipo?: Stat,
    public valor?: number,
    public calc?: number,
    public diff?: number
  ) {

  }
}


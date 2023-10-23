import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashBoardService } from 'src/app/Services/dash-board.service';

Chart.register(...registerables);
@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit{
totalIngresos: string = '0';
totalVentas: string = '0';
totalProductos: string = '0';

constructor(
  private _dashBoardServicio: DashBoardService
){}
  ngOnInit(): void {
    this._dashBoardServicio.resumen().subscribe(
      {
        next: (data) => {
          if (data.status) {
            this.totalIngresos = data.value.totalIngresos;
            this.totalVentas = data.value.totalVentas;
            this.totalProductos = data.value.totalProductos;

            const arrayData:any[]=data.value.ventasUltimaSemana;
            const labelTemp = arrayData.map((value)=>value.fecha);
            const dataTemp = arrayData.map((value)=>value.total);

            this.mostrarGrafico(labelTemp,dataTemp);
          }
        },
        error: (e) => { }
      }
    )
  }
mostrarGrafico(labelGraficos:any[], dataGraficos:any[]){
  const chatBarras = new Chart("chartBarras", {
    type: "bar",
    data: {
      labels: labelGraficos,
      datasets: [
        {
          label: "# de Ventas",
          data: dataGraficos,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
          ],
          borderWidth: 1,
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }

  })

}
}

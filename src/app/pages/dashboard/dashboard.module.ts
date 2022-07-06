import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { EchartsBarComponent } from './echarts-bar.component';
import { EchartsPieComponent } from './echarts-pie.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbAccordionModule, NbAlertModule, NbCardModule, NbMenuModule, NbToastrModule } from '@nebular/theme';
import { ThemeModule } from '../../../assets/@theme/theme.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    DashboardRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    NbCardModule,
    NbToastrModule,
    NbAlertModule,
    NbAccordionModule,
    NbMenuModule
  ],
  exports: [],
  declarations: [
    DashboardComponent,
    EchartsPieComponent,
    EchartsBarComponent
  ],
})
export class DashboardModule { }

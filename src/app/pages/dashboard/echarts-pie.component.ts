import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-echarts-pie',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsPieComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;

  @Input() pieChart: any;
  @Input() type: string;

  constructor(private theme: NbThemeService) { }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: [],
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: 'Type',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };
      for (let e of this.pieChart) {
        this.options.legend.data.push(e._id);
        if (this.type === 'team') {
          this.options.series[0].data.push({ value: e.count, name: e._id?.name });
        } else if (this.type === 'type') {
          this.options.series[0].data.push({ value: e.count, name: e._id });
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

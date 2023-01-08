import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  NgZone, OnInit,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

import * as am5 from '@amcharts/amcharts5';
import am4themes_animated from '@amcharts/amcharts5/themes/animated';
import * as am5map from '@amcharts/amcharts5/map';
import * as am4geodata_uae from '@amcharts/amcharts5-geodata/worldHigh';


@Component({
  selector: 'lr-geo-chart',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements OnInit, AfterContentInit, AfterViewInit  {

  // @ts-ignore
  @ViewChild('chartdiv', {static: true})
  // @ts-ignore
  chartdiv: ElementRef<HTMLElement>;

  private Country:string = "AE";
  private Countries = ["AE"];
  private MapColor:string = "#000000";
  private MapBorderColor:string = "#000000";
  public Height:string ="500px";
  private paddingX:number = 50;
  private paddingY = 50;

  getPoints()
  {
    const points = this.elementRef.nativeElement.querySelectorAll("point");
    for (let index = 0 ; index < points.length ; index++)
    {
      var point =         {
        "type": "Feature",
        "properties": {
          "name": points[index].getAttribute("name"),
          "color": points[index].getAttribute("color"),
          "description": points[index].getAttribute("description"),
          "href":points[index].getAttribute("href")?points[index].getAttribute("href"):"null"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [ points[index].getAttribute("lng"),points[index].getAttribute("lat")]
        }
      };
      // @ts-ignore
      this.points.features.push(point);
    }
  }

  getConfiguration()
  {
    const config = this.elementRef.nativeElement.querySelector("config");
    this.Country = config.getAttribute("country")?config.getAttribute("country") : this.Country;
    this.Countries = this.Country.split(',');
    this.Height = config.getAttribute("height")?config.getAttribute("height") : this.Height;
    this.MapColor = config.getAttribute("map-color")?config.getAttribute("map-color") : this.MapColor;
    this.MapBorderColor = config.getAttribute("border-color")?config.getAttribute("border-color") : this.MapBorderColor;
    this.paddingX =  config.getAttribute("paddingX")? parseInt(config.getAttribute("paddingX"))  : this.paddingX;
    this.paddingY =  config.getAttribute("paddingY")? parseInt(config.getAttribute("paddingY"))  : this.paddingY;
  }

  private map!: am5map.MapChart;
  // @ts-ignore
  private root;
  private colors: any;
  private chart: any;
  private stateSeries: any;
  private uaeSeries: any;

  public  points =
    {
      type: "FeatureCollection",
      features: [

      ]
    };
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone,public elementRef: ElementRef) {
    this.getPoints();
    this.getConfiguration();
  }
  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }
  ngAfterViewInit()  {
    this.browserOnly(() => {
      this.root = am5.Root.new(this.chartdiv.nativeElement);
      this.colors = am5.ColorSet.new(this.root, {
      });
      this.root.setThemes([
        am4themes_animated.new(this.root)
      ]);
      this.chart = this.root.container.children.push(am5map.MapChart.new(this.root, {
        panX: "none",
        panY: "none",
        projection: am5map.geoMercator(),
        paddingTop:this.paddingY,
        paddingBottom:this.paddingY,
        paddingLeft:this.paddingX,
        paddingRight:this.paddingX,
        width:am5.p100
      }));

      if(this.Country.toLowerCase() === "all")
      {
        this.uaeSeries = this.chart.series.push(am5map.MapPolygonSeries.new(this.root, {
          geoJSON: am4geodata_uae.default,
          showingTooltip:true,
          interactive:true
        }));
      }else
      {
        this.uaeSeries = this.chart.series.push(am5map.MapPolygonSeries.new(this.root, {
          geoJSON: am4geodata_uae.default,
          showingTooltip:true,
          interactive:true,
          include: this.Countries
        }));
      }
      this.uaeSeries = this.chart.series.push(am5map.MapPolygonSeries.new(this.root, {
        geoJSON: am4geodata_uae.default,
        showingTooltip:true,
        interactive:true,
        include: [this.Country]
      }));

      this.uaeSeries.mapPolygons.template.setAll({
        stroke: am5.color(this.MapBorderColor),
        strokeWidth: 2,
        fillOpacity: 0.5,
        fill:am5.color(this.MapColor)
      });
      // GeoJSON data

      var pointSeries = this.chart.series.push(
        am5map.MapPointSeries.new(this.root, {
          geoJSON: this.points
        })
      );

      pointSeries.bullets.push( (root:any, series:any, dataItem:any)=> {
        var container = am5.Container.new(this.root, {
          tooltipText: "{title}",
          tooltipHTML: `<div class="card">
                            <div class="header" style="color:var(--light)!important">
                                {name}
                            </div>
                            <div class="body text-light"  style="color:var(--light)!important;max-width: 200px">
                                <p style="color:var(--light)!important">{dataItem.dataContext.description}</p>
                                {dataItem.dataContext.href}
                            </div>
                          </div>`
        });
        var circle = container.children.push(
          am5.Circle.new(this.root, {
            radius: 4,
            tooltipY: 0,
            fill: am5.color(dataItem.dataContext.color),
            strokeOpacity: 0
          })
        );

        var circle2 = container.children.push(
          am5.Circle.new(root, {
            radius: 4,
            tooltipY: 0,
            fill: am5.color(dataItem.dataContext.color),
            strokeOpacity: 0,
            tooltipText: "{title}"
          })
        );

        circle.animate({
          key: "scale",
          from: 1,
          to: 5,
          duration: 1500,
          easing: am5.ease.out(am5.ease.linear),
          loops: Infinity
        });
        circle.animate({
          key: "opacity",
          from: 1,
          to: 0,
          duration: 1500,
          easing: am5.ease.out(am5.ease.linear),
          loops: Infinity
        });
        container.events.on("click", function(ev) {
          // @ts-ignore
          window.location = ev.target.dataItem.dataContext.href;
        });

        return am5.Bullet.new(root, {
          sprite: container
        });
      });

    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.map) {
        this.map.dispose();
      }
    });
  }


  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
  }

}

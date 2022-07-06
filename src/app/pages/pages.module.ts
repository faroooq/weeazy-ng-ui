import { NgModule } from '@angular/core';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbIconModule, NbMenuModule } from '@nebular/theme';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ThemeModule } from '../../assets/@theme/theme.module';
import { HasRoleDirective } from '../../assets/@theme/directives/has-role.directive';
import { QuillModule } from "ngx-quill";

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    MiscellaneousModule,
    NbIconModule,
    NbCardModule,
    NbAccordionModule,
    NbButtonModule,
    QuillModule.forRoot()
  ],
  declarations: [
    PagesComponent,
    HasRoleDirective,
  ],
})
export class PagesModule {
}

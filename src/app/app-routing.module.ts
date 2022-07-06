import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: 'ps',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: "au",
    loadChildren: () => import("./auth/auth.module")
      .then((m) => m.AuthModule),
  },
  { path: '', redirectTo: 'ps', pathMatch: 'full' },
  { path: '**', redirectTo: 'ps' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}

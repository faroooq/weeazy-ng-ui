import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  styleUrls: ['auth.component.scss'],
  template: `
  <ngx-zero-column-layout>
    <router-outlet></router-outlet>
    </ngx-zero-column-layout>
  `,
})
export class AuthComponent {
}

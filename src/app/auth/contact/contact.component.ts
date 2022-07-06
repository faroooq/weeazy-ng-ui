import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../assets/@theme/services/auth.service";

@Component({
  selector: 'ngx-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  isLoading: boolean = false;
  hide: boolean = true;
  signupError: string;
  options: boolean = false;
  optionError: string;

  constructor(private authService: AuthService) { }
  ngOnInit(): void { }

  onContact(form: NgForm) {
    if (form.invalid) {
      this.signupError = "Please fill all the details";
      return;
    }
    this.isLoading = true;
    this.authService.contact(form.value.email, form.value.firstName,
      form.value.lastName, form.value.type, form.value.desc);
    this.isLoading = false;
    form.reset();
  }
}

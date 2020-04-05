import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ServersService } from '../services/servers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-server',
  templateUrl: './add-server.component.html',
  styleUrls: ['./add-server.component.scss']
})
export class AddServerComponent implements OnInit {
  public serverForm = this.form.group({
    name: ['', Validators.required],
    ip: ['', Validators.required],
    port: ['', Validators.required],
  });

  constructor(
    private form: FormBuilder,
    private serverService: ServersService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    this.serverService.addServer(this.serverForm.value);
    this.serverForm.updateValueAndValidity();
    this.router.navigateByUrl('servers');
  }

}

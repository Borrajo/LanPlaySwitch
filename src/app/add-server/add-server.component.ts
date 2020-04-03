import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ServersService } from '../services/servers.service';

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

  constructor(private form: FormBuilder, private serverService: ServersService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    this.serverService.addServer(this.serverForm.value);
    this.serverForm.reset();
  }

}

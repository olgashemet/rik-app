import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FilterMask } from 'src/app/interfaces/filter-mask.interface';
import { CommunicationService } from 'src/app/services/comm.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  constructor(
    private commService: CommunicationService,
    private fb: FormBuilder
  ) {}
  form = this.fb.group<FilterMask>({
    name: null,
    phone: null,
    create_at: null,
    email: null,
    is_admin: null,
    status: null,
    update_at: null,
  });
  ngOnInit() {}

  submitForm() {
    const result = {};
    const controls = this.form.controls;
    for (const controlName in controls) {
      if (
        controls[controlName].value ||
        typeof controls[controlName].value == 'boolean'
      ) {
        typeof controls[controlName].value == 'string'
          ? (result[controlName] = controls[controlName].value.trim())
          : (result[controlName] = controls[controlName].value);
      }
    }

    if ('update_at' in result && 'create_at' in result) {
      this.commService.say({
        ...result,
        update_at: this.form.controls.update_at.value?.setHours(0, 0, 0, 0),
        create_at: this.form.controls.create_at.value?.setHours(0, 0, 0, 0),
      });
      return;
    }

    if ('create_at' in result) {
      this.commService.say({
        ...result,
        create_at: this.form.controls.create_at.value?.setHours(0, 0, 0, 0),
      });
      return;
    }
    if ('update_at' in result) {
      this.commService.say({
        ...result,
        update_at: this.form.controls.update_at.value?.setHours(0, 0, 0, 0),
      });
      return;
    }

    this.commService.say({ ...result });
  }

  resetForm() {
    this.form.reset();
  }
  cancel() {
    this.commService.say('cancel');
    this.form.reset();
  }
}

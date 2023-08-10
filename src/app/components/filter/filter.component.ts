import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FilterMaskForm } from 'src/app/interfaces/filter-mask.interface';
import { CommunicationService } from 'src/app/services/comm.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  form = this.fb.group<FilterMaskForm>({
    name: this.fb.control(null, [Validators.pattern(/^[a-zA-Z0-9_]+$/)]),
    phone: this.fb.control<number>(null, [
      Validators.pattern(/^(\+7|8)?\s?(\(?\d{3}\)?[\s-]?)?[\d\s-]{7,10}$/),
    ]),
    create_at: null,
    email: this.fb.control<string>(null, [
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
    is_admin: null,
    status: null,
    update_at: null,
  });

  get name() {
    return this.form.controls.name as FormControl;
  }

  get phone() {
    return this.form.controls.phone as FormControl;
  }

  get email() {
    return this.form.controls.email as FormControl;
  }

  constructor(
    private commService: CommunicationService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.name.valueChanges.subscribe((val) => {
      console.log(this.name.errors);
    });
  }

  trimValue(controlName: string) {
    const control = this.form.get(controlName);
    if (control && control.value) {
      control.setValue(control.value.trim());
      console.log(control.value);
    }
  }
  get isAtLeastOneFieldFilled() {
    const resultArr = [];
    const controls = this.form.controls;
    for (const controlName in controls) {
      resultArr.push(controls[controlName].value);
    }
    if (resultArr.includes(false)) {
      return true;
    }
    return !!resultArr.filter((v) => v).length;
  }

  submitForm() {
    const result = {};
    const controls = this.form.controls;
    for (const controlName in controls) {
      if (
        controls[controlName].value ||
        controls[controlName].value === false
      ) {
        result[controlName] = controls[controlName].value;
      }
    }

    if ('update_at' in result && 'create_at' in result) {
      this.commService.say({
        ...result,
        update_at: this.form.controls.update_at.value?._d?.setHours(0, 0, 0, 0),
        create_at: this.form.controls.create_at.value?._d?.setHours(0, 0, 0, 0),
      });
      return;
    }

    if ('create_at' in result) {
      this.commService.say({
        ...result,
        create_at: this.form.controls.create_at.value?._d?.setHours(0, 0, 0, 0),
      });
      return;
    }
    if ('update_at' in result) {
      this.commService.say({
        ...result,
        update_at: this.form.controls.update_at.value?._d?.setHours(0, 0, 0, 0),
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

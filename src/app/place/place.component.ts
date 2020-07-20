// Import angular components
import { Component } from '@angular/core';
// Import angular form components
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-place',
    templateUrl: 'place.component.html',
    styleUrls: ['place.component.scss'],
})
export class PlaceComponent {
    placeForm: FormGroup;
    faces = [{
        name: 'North',
        value: 0
    },
    {
        name: 'South',
        value: 180
    },
    {
        name: 'East',
        value: 90
    },
    {
        name: 'West',
        value: 270
    }];
    formSubmitted = false;
    constructor(
        private fb: FormBuilder, private modalCtrl: ModalController) {
        this.placeForm = this.fb.group({
            x: this.fb.control('', [Validators.required, Validators.min(0), Validators.max(5)]),
            y: this.fb.control('', [Validators.required, Validators.min(0), Validators.max(5)]),
            face: this.fb.control('', [Validators.required])
        });
    }

    /**
     * This method used to cancel place popup
     */
    onCancel(): void {
        this.modalCtrl.dismiss();
    }
    /**
     * This method used to submit form value and pass to parent component
     */
    onSubmit(): void {
        this.formSubmitted = true;
        if (this.placeForm.valid) {
            this.modalCtrl.dismiss(this.placeForm.value);
        }
    }
}

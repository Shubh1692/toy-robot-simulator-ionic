import { Component, ViewChild } from '@angular/core';
import { IonGrid, ModalController, AlertController } from '@ionic/angular';
import { PlaceComponent } from '../place/place.component';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  totalTableToyCardsRow = Array(5); // variable for create table platform for toy
  totalTableToyCardsColumn = Array(5); // variable for create table platform for toy
  toyPosition = { // Initial position of toy hide on table before place
    left: '0px',
    bottom: '0px',
    display: 'none',
    transition: '1s',
    height: '0px'
  };
  face: number | null = null;  // Initial position of toy
  @ViewChild('toyTable') toyTableInstance: IonGrid | any; // Table toy grid instance
  tableRowHeight = 0;
  toyIconFace = {
    transform: 'rotate(0deg)',
    transition: '1s',
  };
  constructor(private modalController: ModalController, private alertController: AlertController) {
  }

  ionViewDidEnter() {
    const toyTableHeight = this.toyTableInstance.el.offsetHeight;
    const toyTableWidth = this.toyTableInstance.el.offsetWidth;
    this.tableRowHeight = toyTableWidth / 5;
    this.toyPosition.height = `${this.tableRowHeight}px`;
    console.log(this.toyTableInstance, { toyTableHeight, toyTableWidth });
  }


  /**
   * This method used to move toy to  1step in current direction
   * This method also give information toy reached at max move position
   */
  // tslint:disable-next-line: typedef
  onMoveAction() {
    const toyTableHeight = this.toyTableInstance.el.offsetHeight;
    const toyTableWidth = this.toyTableInstance.el.offsetWidth;
    let left = Number(this.toyPosition.left.split('px')[0]);
    let bottom = Number(this.toyPosition.bottom.split('px')[0]);
    switch ((this.face + 360) % 360) {
      case 0:
        bottom = bottom + (toyTableHeight / 5);
        break;
      case 90:
        left = left + (toyTableWidth / 5);
        break;
      case 180:
        bottom = bottom - (toyTableHeight / 5);
        break;
      case 270:
        left = left - (toyTableWidth / 5);
        break;
    }
    if (left < 0 || bottom < 0 || left >= toyTableWidth || bottom >= toyTableHeight) {
      return;
    }
    this.toyPosition = {
      ...this.toyPosition,
      ...{
        left: `${left}px`,
        bottom: `${bottom}px`,
        transition: '1s'
      }
    };
  }

  /**
   * This method used open place popup for enter placement values of popup
   * This method also used for set current state of toy after submit placement values
   */
  async openPlaceDialog() {
    const modal = await this.modalController.create({
      component: PlaceComponent,
    });
    await modal.present();
    const { data: result } = await modal.onWillDismiss();
    if (!result) {
      return;
    }
    const toyTableHeight = this.toyTableInstance.el.offsetHeight;
    const toyTableWidth = this.toyTableInstance.el.offsetWidth;
    this.face = result.face;
    const left = `${(toyTableWidth / 5) * (result.x - 1)}px`;
    const bottom = `${(toyTableHeight / 5) * (result.y - 1)}px`;
    this.toyPosition = {
      ...this.toyPosition,
      ...{
        left,
        bottom,
        transition: '1s',
        display: 'flex',
      }
    };
    this.toyIconFace = {
      ...this.toyIconFace,
      ...{
        transform: `rotate(${this.face}deg)`,
      }
    };
  }

  /**
   * This method used to set direction based on current direction
   */
  // tslint:disable-next-line: typedef
  onLeftRight(indicator: string) {
    switch (indicator) {
      case 'R':
        this.face = this.face + 90;
        break;
      case 'L':
        this.face = this.face - 90;
        break;
    }
    this.toyIconFace = {
      ...this.toyIconFace,
      ...{
        transform: `rotate(${this.face}deg)`,
      }
    };
  }

  /**
   * This method used to show current state of toy in ionic alert
   */
  // tslint:disable-next-line: typedef
  async showReport() {
    let face = '';
    const toyTableHeight = this.toyTableInstance.el.offsetHeight;
    const toyTableWidth = this.toyTableInstance.el.offsetWidth;
    const left = Number(this.toyPosition.left.split('px')[0]);
    const bottom = Number(this.toyPosition.bottom.split('px')[0]);
    const xPosition = Math.floor((((left * 100) / toyTableWidth) / 20)) + 1;
    const yPosition = Math.floor((((bottom * 100) / toyTableHeight) / 20)) + 1;
    switch (this.face) {
      case 0:
        face = 'North';
        break;
      case 90:
        face = 'East';
        break;
      case 180:
        face = 'South';
        break;
      case 270:
        face = 'West';
        break;
    }
    const alert = await this.alertController.create({
      header: 'Report',
      message: `Toy is placed at ${xPosition} X Position, ${yPosition} Y Position with ${face} Face`,
      buttons: ['OK']
    });
    await alert.present();
  }
}

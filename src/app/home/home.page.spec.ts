import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';

import { HomePage } from './home.page';
import { resolve } from 'dns';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let modalController: any;
  let alertController: any;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();
    modalController = TestBed.get(ModalController);
    alertController = TestBed.get(AlertController);
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initial state height of toy should be 0', () => {
    const toyBlockHeight = component.toyPosition.height;
    expect(toyBlockHeight).toEqual('0px');
  });

  it('initial state face of toy should be not exist', () => {
    const toyFace = component.face;
    expect(toyFace).toEqual(null);
  });

  it('on place button action place modal should be open', async () => {
    spyOn(modalController, 'create').and.callThrough();
    fixture.nativeElement.querySelector('#place').click();
    await fixture.detectChanges();
    expect(modalController.create).toHaveBeenCalled();
  });

  it('If onWillDismiss will return null face should be null', async () => {
    spyOn(modalController, 'create').and.returnValue({
      present() { },
      onWillDismiss() {
        return {
          data: null
        };
      }
    });
    await component.openPlaceDialog();
    expect(component.face).toEqual(null);
  });

  it('If onWillDismiss will return face position be assigned to face', async () => {
    spyOn(modalController, 'create').and.returnValue({
      present() { },
      onWillDismiss() {
        return {
          data: {
            face: 90,
            x: 1,
            y: 2
          }
        };
      }
    });
    await component.openPlaceDialog();
    expect(component.face).toEqual(90);
  });


  it('on onLeftRight with parameter left (L) will decrease face degree rotation with 90 degree', async () => {
    await component.onLeftRight('L');
    expect(component.face).toEqual(-90);
  });

  it('on onLeftRight with parameter right (R) will increase face degree rotation with 90 degree', async () => {
    await component.onLeftRight('R');
    expect(component.face).toEqual(90);
  });

  it('on showReport will call alert controller with test message', async () => {
    const resultMessage  = 'Toy is placed at 3 X Position, 4 Y Position with South Face';
    component.face = 180;
    component.toyTableInstance = {
      el: {
        offsetHeight: 500,
        offsetWidth: 500
      }
    };
    component.toyPosition = {
      left: '200px',
      bottom: '300px',
      display: 'none',
      transition: '1s',
      height: '0px'
    };
    spyOn(alertController, 'create').and.callThrough();
    await component.showReport();
    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Report',
      message: resultMessage,
      buttons: ['OK']
    });
  });
});

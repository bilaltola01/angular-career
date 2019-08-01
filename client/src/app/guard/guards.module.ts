import { NgModule } from '@angular/core';
import { guards } from './index';

@NgModule({
  providers: [
    ...guards
  ]
})

export class GuardsModule {
}

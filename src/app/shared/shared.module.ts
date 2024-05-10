import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { FinishedPipe, GetPipe, TimePipe } from '../pipes';
import { DynamicPipe } from '../pipes/dynamic.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  exports: [MatSnackBarModule, MatDialogModule, MatTooltipModule, ReactiveFormsModule],
  providers: [DynamicPipe, TimePipe, FinishedPipe, GetPipe, DatePipe, DecimalPipe],
})
export class SharedModule {}

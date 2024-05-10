import { TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormUtil } from '../form.util';
import { FormTypes } from 'src/app/util';

describe('Util: Form', () => {
  let service: FormUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormUtil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should emit save event when form is valid', () => {
      const form = new FormGroup({
        name: new FormControl('valid name', Validators.required),
        email: new FormControl('valid@email.com', Validators.email),
      });

      const saveEmitter = new EventEmitter<FormGroup>();
      spyOn(saveEmitter, 'emit');

      FormUtil.onSubmit(form, saveEmitter);

      expect(saveEmitter.emit).toHaveBeenCalledWith(form);
    });

    it('should mark all form controls as touched when form is invalid', () => {
      const form = new FormGroup({
        name: new FormControl('', Validators.required),
        email: new FormControl('', Validators.email),
      });

      form.controls.name.markAsTouched = jasmine.createSpy('markAsTouched');

      const saveEmitter = new EventEmitter<FormGroup>();
      spyOn(saveEmitter, 'emit');

      FormUtil.onSubmit(form, saveEmitter);

      expect(form.controls.name.markAsTouched).toHaveBeenCalled();
      expect(saveEmitter.emit).not.toHaveBeenCalled();
    });
  });

  describe('isCreateForm', () => {
    it('should return true for FormTypes.Create', () => {
      expect(FormUtil.isCreateForm(FormTypes.Create)).toBeTrue();
    });

    it('should return false for other FormTypes', () => {
      expect(FormUtil.isCreateForm(FormTypes.Edit)).toBeFalse();
      expect(FormUtil.isCreateForm(FormTypes.View)).toBeFalse();
      expect(FormUtil.isCreateForm(FormTypes.Duplicate)).toBeFalse();
    });
  });

  describe('isViewForm', () => {
    it('should return true for FormTypes.View', () => {
      expect(FormUtil.isViewForm(FormTypes.View)).toBeTrue();
    });

    it('should return false for other FormTypes', () => {
      expect(FormUtil.isViewForm(FormTypes.Create)).toBeFalse();
      expect(FormUtil.isViewForm(FormTypes.Edit)).toBeFalse();
      expect(FormUtil.isViewForm(FormTypes.Duplicate)).toBeFalse();
    });
  });

  describe('isEditForm', () => {
    it('should return true when type is Edit', () => {
      expect(FormUtil.isEditForm(FormTypes.Edit)).toBe(true);
    });

    it('should return false when type is not Edit', () => {
      expect(FormUtil.isEditForm(FormTypes.Create)).toBe(false);
      expect(FormUtil.isEditForm(FormTypes.View)).toBe(false);
      expect(FormUtil.isEditForm(FormTypes.Duplicate)).toBe(false);
    });
  });

  describe('isDuplicateForm', () => {
    it('should return true when type is Duplicate', () => {
      expect(FormUtil.isDuplicateForm(FormTypes.Duplicate)).toBe(true);
    });

    it('should return false when type is not Duplicate', () => {
      expect(FormUtil.isDuplicateForm(FormTypes.Create)).toBe(false);
      expect(FormUtil.isDuplicateForm(FormTypes.View)).toBe(false);
      expect(FormUtil.isDuplicateForm(FormTypes.Edit)).toBe(false);
    });
  });

  describe('getSubmitLabel', () => {
    it('should return "Create" when type is Create', () => {
      expect(FormUtil.getSubmitLabel(FormTypes.Create)).toBe('Create');
    });

    it('should return "Update" when type is Edit', () => {
      expect(FormUtil.getSubmitLabel(FormTypes.Edit)).toBe('Update');
    });

    it('should return "Duplicate" when type is Duplicate', () => {
      expect(FormUtil.getSubmitLabel(FormTypes.Duplicate)).toBe('Duplicate');
    });

    it('should return empty string when type is View', () => {
      expect(FormUtil.getSubmitLabel(FormTypes.View)).toBe('');
    });
  });

  describe('buildId', () => {
    it('should build the id', () => {
      expect(FormUtil.buildId('title', 'formName')).toBe('formNameTitle');
      expect(FormUtil.buildId('type', 'cProfileForm')).toBe('cProfileFormType');
      expect(FormUtil.buildId('type', '')).toBe('type');
    });

    it('should return an empty string when the input is invalid', () => {
      expect(FormUtil.buildId('', '')).toBe('');
      expect(FormUtil.buildId('', 'formName')).toBe('');
    });
  });
});

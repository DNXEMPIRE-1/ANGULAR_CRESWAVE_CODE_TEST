import { TestBed } from '@angular/core/testing';
import { StoreKeys } from 'src/app/util';
import { STORE_SERVICE, StoreService } from '../interfaces';

describe('Service: Store', () => {
  let service: StoreService;
  let mockStore: StoreService;
  const mockKey = 'mockKey' as StoreKeys;
  const mockType = 'object';
  const mockResponse = {
    id: 1,
    name: 'name',
  };
  const payload = { key: mockKey, value: mockResponse };

  beforeEach(() => {
    mockStore = {
      get: jasmine.createSpy('get'),
      getMany: jasmine.createSpy('getMany'),
      store: jasmine.createSpy('store'),
      remove: jasmine.createSpy('remove'),
      clear: jasmine.createSpy('clear'),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: STORE_SERVICE, useValue: mockStore }],
    });
    service = TestBed.inject(STORE_SERVICE);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the store method in the store service', () => {
    service.store(payload);
    expect(mockStore.store).toHaveBeenCalledWith(payload);
  });

  it('should call the get method in the store service', () => {
    service.get(mockKey, mockType);
    expect(mockStore.get).toHaveBeenCalledWith(mockKey, mockType);
  });

  it('should call the remove method in the store service', () => {
    service.remove(mockKey);
    expect(mockStore.remove).toHaveBeenCalledWith(mockKey);
  });

  it('should call the clear method in the store service', () => {
    service.clear();
    expect(mockStore.clear).toHaveBeenCalledWith();
  });
});

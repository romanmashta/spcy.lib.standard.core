import * as r from '@spcy/lib.core.reflection';
import { IndexModule as StoreModule, Types as StoreTypes } from './store';

const PackageName = 'lib.model.core';

export const IndexModule: r.Module = {
  $id: PackageName,
  $defs: {
    ...StoreModule.$defs
  }
};

export const Types = {
  ...StoreTypes
};

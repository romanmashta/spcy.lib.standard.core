/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as r from '@spcy/lib.core.reflection';
import * as m from './application.model';

const FirebaseConfigType: r.TypeInfo = {
  $id: 'FirebaseConfig',
  $package: 'lib.standard.core',
  type: 'object',
  required: ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'],
  properties: {
    apiKey: {
      type: 'string'
    },
    authDomain: {
      type: 'string'
    },
    databaseURL: {
      type: 'string'
    },
    projectId: {
      type: 'string'
    },
    storageBucket: {
      type: 'string'
    },
    messagingSenderId: {
      type: 'string'
    },
    appId: {
      type: 'string'
    }
  }
};

const FirebaseConfig: r.Prototype<m.FirebaseConfig> = {
  ref: { $ref: FirebaseConfigType.$id!, $refPackage: FirebaseConfigType.$package! },
  typeInfo: FirebaseConfigType
};

const FirebaseAppType: r.TypeInfo = {
  $id: 'FirebaseApp',
  $package: 'lib.standard.core',
  type: 'object',
  required: ['name', 'config'],
  properties: {
    name: {
      type: 'string'
    },
    config: {
      $ref: 'FirebaseConfig',
      $refPackage: 'lib.standard.core'
    },
    collections: {
      type: 'object',
      additionalProperties: {
        $ref: 'Collection',
        $refPackage: 'lib.standard.core'
      }
    }
  }
};

const FirebaseApp: r.Prototype<m.FirebaseApp> = {
  ref: { $ref: FirebaseAppType.$id!, $refPackage: FirebaseAppType.$package! },
  typeInfo: FirebaseAppType
};

export const ApplicationModule: r.Module = {
  $id: 'lib.standard.core',
  $defs: {
    FirebaseConfig: FirebaseConfigType,
    FirebaseApp: FirebaseAppType
  }
};

export const Types = {
  FirebaseConfig,
  FirebaseApp
};

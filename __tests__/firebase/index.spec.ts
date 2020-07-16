import _ from 'lodash';
import '@spcy/lib.dev.tasty';
import * as Reflection from '@spcy/lib.core.reflection';
import { createInstance } from '@spcy/lib.core.mst-model';
import * as firebase from 'firebase';
import * as Core from '../../src';
import { Types as ToDoTypes } from '../models/to-do/index.schema';
import { queryInterface, registerController } from '../../src';

Reflection.SchemaRepository.registerTypes(Reflection.Types);
Reflection.SchemaRepository.registerTypes(ToDoTypes);
Reflection.SchemaRepository.registerTypes(Core.Types);

const collection = <T>(
  name: string,
  proto: Reflection.Prototype<T>,
  init: Partial<Core.Collection> = {}
): Core.TypedCollection<T> => ({ name, type: proto.ref, ...init });

const app = createInstance(Core.Types.FirebaseApp, {
  name: 'Sandbox',
  config: {
    apiKey: 'AIzaSyASh83T79DJ1UI9hEJ61oq0HdS1O40MzNk',
    authDomain: 'mono-space-d38be.firebaseapp.com',
    databaseURL: 'https://mono-space-d38be.firebaseio.com',
    projectId: 'mono-space-d38be',
    storageBucket: 'mono-space-d38be.appspot.com',
    messagingSenderId: '441937998030',
    appId: '1:441937998030:web:fdba428e92505aae8e609f'
  }
});

test('Seed app', async done => {
  done();
  return;
  firebase.initializeApp(app.config);

  const db = firebase.firestore();

  const coreCollections = {
    collections: collection('Collection', Core.Types.Collection),
    types: collection('Types', Reflection.Types.Module)
  };

  const appCollections = Core.createSet(coreCollections.collections, {
    tasks: collection('Tasks', ToDoTypes.ToDo),
    users: collection('Users', ToDoTypes.User),
    roles: collection('Role', ToDoTypes.Role)
  });

  const collections = {
    ...coreCollections,
    ...appCollections
  };

  const roles = Core.createSet(appCollections.roles, {
    admin: { name: 'admin' },
    user: { name: 'user' },
    guest: { name: 'guest' }
  });

  const users = Core.createSet(appCollections.users, {
    bill: { username: 'bill', roles: [roles.admin] },
    joe: { username: 'joe', roles: [roles.user] }
  });

  const tasks = Core.createSet(appCollections.tasks, {
    compile: { isDone: false, description: 'Compile Code', user: Core.objRef(users.bill) },
    compile2: { isDone: true, description: 'Compile Code 2', user: Core.objRef(users.bill) },
    compile3: { isDone: false, description: 'Compile Code 3', user: Core.objRef(users.bill) },
    compile4: { isDone: false, description: 'Compile Code 4', user: Core.objRef(users.bill) },
    deploy: { isDone: false, description: 'Deploy Code', user: Core.objRef(users.joe) }
  });

  const seed = {
    collections,
    roles,
    users,
    tasks,
    ...Reflection.Seed,
    ...Core.Seed
  };

  await Promise.all(
    _.flatten(
      _.map(seed, (objectSet, collectionName) =>
        _.map(objectSet, (obj: object, id) =>
          db
            .collection(collectionName)
            .doc(id)
            .set(JSON.parse(JSON.stringify(obj)))
        )
      )
    )
  );

  console.log(JSON.stringify(seed, undefined, 2));
  done();
});

class FirebaseAppController implements Core.Activable {
  private model: Core.FirebaseApp;
  private firebase?: firebase.app.App;
  private db?: firebase.firestore.Firestore;

  constructor(model: Core.FirebaseApp) {
    this.model = model;
  }

  async activate() {
    console.log('activate ', this.model.name);

    this.firebase = firebase.initializeApp(this.model.config);
    this.db = this.firebase.firestore();
    await this.queryCollection();
  }

  async deactivate() {
    console.log('deactivate', this.model.name);
  }

  async queryCollection() {
    if (!this.db) return;

    const data = await this.db.collection('collections').get();
    const objects = data.docs.map(doc => [doc.id, doc.data()]);
    const snapshot = _.fromPairs(objects);

    this.model.patch(self => {
      self.collections = snapshot;
    });
  }
}

registerController(FirebaseAppController, Core.Types.FirebaseApp, Core.Types.Activable);

test('Seed app', async () => {
  const appController = queryInterface(app, Core.Types.Activable);
  await appController.activate();
  console.log('activated');
  const tasks = app.collections;
  console.log('collection roles', JSON.stringify(tasks, undefined, 2));
  await appController.deactivate();
  console.log('deactivated');
});

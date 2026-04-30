import { Injectable } from '@nestjs/common';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  getFirestore,
  QueryDocumentSnapshot,
  Transaction,
} from 'firebase-admin/firestore';
import { firebaseApp } from '../firebase.admin';

@Injectable()
export class DatabaseService {
  private readonly firestore: Firestore = getFirestore(firebaseApp);

  constructor() {
    this.firestore.settings({
      ignoreUndefinedProperties: true,
    });
  }

  collection<T extends DocumentData>(
    path: string,
  ): CollectionReference<T, DocumentData> {
    return this.firestore.collection(path) as CollectionReference<
      T,
      DocumentData
    >;
  }

  runTransaction<T>(
    updateFunction: (transaction: Transaction) => Promise<T>,
  ): Promise<T> {
    return this.firestore.runTransaction(updateFunction);
  }

  mapSnapshot<T extends DocumentData>(
    snapshot: QueryDocumentSnapshot<T>,
  ): T & { id: string } {
    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  }
}

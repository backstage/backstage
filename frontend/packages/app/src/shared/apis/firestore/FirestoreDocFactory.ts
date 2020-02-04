import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { AppAuth } from 'core/app/auth';

export type DocumentReference = firebase.firestore.DocumentReference;

function defer<T>() {
  let resolve: (t: T) => void;
  let reject: (e: Error) => void;
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return { promise, resolve: resolve!, reject: reject! };
}

// The purpose of this class is to provide a Firestore instance that is
// authenticated with Backstage's existing google auth. It also recreates
// and removes the Firestore instance if the google session changes (login/logout).
export default class FirestoreDocFactory {
  private deferredDoc = defer<DocumentReference>();

  static createWithAppAuth(appAuth: AppAuth, options: Object, appName: string): FirestoreDocFactory {
    const app = firebase.initializeApp(options, appName);
    const docFactory = new FirestoreDocFactory(app);

    (async () => {
      try {
        const authInit = await appAuth.auth();

        const { googleAccessToken, customToken } = authInit.firebaseAuth;
        // Firebase auth with google credentials is much faster, so use if available.
        if (googleAccessToken) {
          const credential = firebase.auth.GoogleAuthProvider.credential(null, googleAccessToken);
          const session = await app.auth().signInWithCredential(credential);
          await docFactory.init(session);
        } else if (customToken) {
          const session = await app.auth().signInWithCustomToken(customToken);
          await docFactory.init(session);
        } else {
          throw new Error('no token available');
        }
      } catch (error) {
        console.error(`Firebase auth failed, ${error}`);
        docFactory.setError(error);
      }
    })();

    return docFactory;
  }

  constructor(private readonly app: firebase.app.App) {}

  getDoc(): Promise<DocumentReference> {
    return this.deferredDoc.promise;
  }

  private async init(session: firebase.auth.UserCredential) {
    if (!session.user) {
      throw new Error('received null user from signIn');
    }
    const firestore = this.app.firestore();
    await firestore.enablePersistence({ synchronizeTabs: true });
    const doc = firestore.collection('users').doc(session.user.uid);

    this.deferredDoc.resolve(doc);
  }

  private setError(error: Error) {
    this.deferredDoc.reject(error);
  }
}

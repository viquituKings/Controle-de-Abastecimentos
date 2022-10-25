import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

  // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBr2sWkhq4Gqu6UFwEPwJYJQyJx7zwhPTg",
  authDomain: "mediacombustivel-e76d9.firebaseapp.com",
  databaseURL: "https://mediacombustivel-e76d9.firebaseio.com",
  projectId: "mediacombustivel-e76d9",
  storageBucket: "mediacombustivel-e76d9.appspot.com",
  messagingSenderId: "992373241917",
  appId: "1:992373241917:web:2f3c1c9df51dd8fff85254",
  measurementId: "G-V289RNTKJV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
# zwinne

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# sciagniecie material designowych elementow
npm install vue-material@beta --save

# install vuefire to fetch data from firebase
npm install --save vuefire

# serve with hot reload at localhost:8080
npm run dev


# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# deploy functions to firebase
firebase deploy --project zwinnexd
```

## Deploying Firebase Functions
```

# Go to functions folder
cd functions
# Install dependencies in that folder
npm install
# deploy functions to firebase
firebase deploy

```

## Deploying to Firebase Hosting
```
# Install firebase-tools
npm install -g firebase-tools
# Build project
npm run build
# Deploy to firebase
firebase deploy

```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

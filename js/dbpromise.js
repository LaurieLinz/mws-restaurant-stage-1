var dbPromise = idb.open('restaurantReviews-db', 2, function(upgradeDb) {
  switch(upgradeDb.oldVersion) {
    case 0:
      // create
      upgradeDb.createObjectStore('restaurants', {keyPath: 'id'});
    case 1:
      // upgradeDb.createObjectStore('reviews', {keyPath: 'id'}).createIndex('restaurant_id', 'restaurant_id');
      let reviewStore = upgradeDb.createObjectStore('reviews', {keyPath: 'id'});
      reviewStore.createIndex('restaurant_id', 'restaurant_id');
  }
});


// TODO: you can delete this after you're done using it as a reference

// read "hello" in "keyval"
// dbPromise.then(function(db) {
//   var tx = db.transaction('keyval');
//   var keyValStore = tx.objectStore('keyval');
  // MAKE SURE THAT THE KEY MATCHES THE TYPE TYPE 
  // if string provide string, if number provide number
//   return keyValStore.get('hello');
// }).then(function(val) {
//   console.log('The value of "hello" is:', val);
// });

// set "foo" to be "bar" in "keyval"
// dbPromise.then(function(db) {
//   var tx = db.transaction('keyval', 'readwrite');
//   var keyValStore = tx.objectStore('keyval');
//   keyValStore.put('bar', 'foo');
//   return tx.complete;
// }).then(function() {
//   console.log('Added foo:bar to keyval');
// });

// dbPromise.then(function(db) {
//   var tx = db.transaction('keyval', 'readwrite');
//   var keyValStore = tx.objectStore('keyval');
//   keyValStore.put('cat', 'favoriteAnimal');
//   return tx.complete;
// }).then(function() {
//   console.log('Added favoriteAnimal:cat to keyval');
// });

// add people to "people"
// dbPromise.then(function(db) {
//   var tx = db.transaction('people', 'readwrite');
//   var peopleStore = tx.objectStore('people');

//   peopleStore.put({
//     name: 'Sam Munoz',
//     age: 25,
//     favoriteAnimal: 'dog'
//   });

//   peopleStore.put({
//     name: 'Susan Keller',
//     age: 34,
//     favoriteAnimal: 'cat'
//   });

//   peopleStore.put({
//     name: 'Lillie Wolfe',
//     age: 28,
//     favoriteAnimal: 'dog'
//   });

//   peopleStore.put({
//     name: 'Marc Stone',
//     age: 39,
//     favoriteAnimal: 'cat'
//   });

//   return tx.complete;
// }).then(function() {
//   console.log('People added');
// });

// // list all cat people
// dbPromise.then(function(db) {
//   var tx = db.transaction('people'); 
//   var peopleStore = tx.objectStore('people');
//   var animalIndex = peopleStore.index('animal'); // <- this is how you open an index

//   return animalIndex.getAll('cat'); // <- this is how you get all records from a given index
// }).then(function(people) {
//   console.log('Cat people:', people);
// });

// people by age
// dbPromise.then(function(db) {
//   var tx = db.transaction('people');
//   var peopleStore = tx.objectStore('people');
//   var ageIndex = peopleStore.index('age');

//   return ageIndex.getAll();
// }).then(function(people) {
//   console.log('People by age:', people);
// });

// Using cursors
// dbPromise.then(function(db) {
//   var tx = db.transaction('people');
//   var peopleStore = tx.objectStore('people');
//   var ageIndex = peopleStore.index('age');

//   return ageIndex.openCursor();
// }).then(function(cursor) {
//   if (!cursor) return;
//   return cursor.advance(2);
// }).then(function logPerson(cursor) {
//   if (!cursor) return;
//   console.log("Cursored at:", cursor.value.name);
//   // I could also do things like:
//   // cursor.update(newValue) to change the value, or
//   // cursor.delete() to delete this entry
//   return cursor.continue().then(logPerson);
// }).then(function() {
//   console.log('Done cursoring');
// });


/* example for saving only one review at a time by its id
const id = 3;
// DATABASE_REVIEWS_URL http://localhost:1337/reviews 
// http://localhost:1337/reviews/3
fetch(`${DBHelper.DATABASE_REVIEWS_URL}/${id}`).then(response => {
  // response.ok is codes 200 - 299
  if (!response.ok) return Promise.reject(`fetch didn't work, returned with code ${response.status}`);
  return response.json();
}).then(review => {
  // this is how you open indexedDB Promised


  // THIS IS WHAT TO USE TO SAVE ONE SINGLE OBJECT INTO IDB
  return dbPromise.then(db => {
    const tx = db.transaction('reviews', 'readwrite');
    const reviewStore = tx.objectStore('reviews');
    reviewStore.put(review);
    return tx.complete;
  });





}).catch(console.error);
*/

/**
 * Returns a Promise that resolves to an array of reviews by restaurant id, or an error
 * if the status wasn't ok ()
 */
// function fetchRestaurantReviewsById(id) {
//   return fetch(`${DBHelper.DATABASE_REVIEWS_URL}/?restaurant_id=${id}`).then(response => {
//     if (!response.ok) return Promise.reject(`Yo it is broke, returned with code ${response.status}`);
//     return response.json();
//   });
// }

//   DBHelper.fetchRestaurantReviewsById(5).then(reviews => {
//     // THIS IS WHAT TO USE TO STORE MULTIPLE OBJECTS FOUND IN AN ARRAY
//   reviews.forEach(review => {
//     dbPromise.then(db => {
//       const tx = db.transaction('reviews', 'readwrite');
//       const reviewStore = tx.objectStore('reviews');
      
//       reviewStore.put(review);
//       return tx.complete;
//     });
//   });
// }).catch(console.error) ;


// pseudocode
/*
//TODO: 
scenario for restaurant.html
1. register service worker DONE
2. Get restaurant html // DONE
   (lines 52-58 dbhelper, 74-79) after getting data for individual restaurant with fetch, save into iDB if not saved already
   b) if user is offline, get data from iDB and serve it, otherwise 

   lines 88-92 dbhelper need something else
   
*/
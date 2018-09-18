/**
 * Common database helper functions.
 */


class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }
  static get DATABASE_REVIEWS_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/reviews`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        const json = JSON.parse(xhr.responseText);
        // const restaurants = json.restaurants;
        const restaurants = JSON.parse(xhr.responseText);
        callback(null, restaurants);
      } else { // Oops!. Got an error from server.
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          //TODO: save restaurant into iDB
          return dbPromise.then(db => {
            const tx = db.transaction('restaurant', 'readwrite');
            const restaurantStore = tx.objectStore('restaurants');
            restaurantStore.put(review);
            return tx.complete; 
          })
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }
  static fetchRestaurantByIdPromise(id) {
    return fetch(`${DBHelper.DATABASE_URL}/${id}`).then(response => {
      // if successful, check if status is not 404 or something
      if (!response.ok) return Promise.reject('failed with code: ' + response.status);
      // if so, return response as json object.
      return response.json();
    }).then(restaurant => {
      // TODO: save restaurant into iDB
      dbPromise.then(db => {
        const tx = db.transaction('restaurants', 'readwrite');
        const restaurantStore = tx.objectStore('restaurants');
        restaurantStore.put(restaurant);
        return tx.complete; 
      })
      // and after saving it, return it back
      return restaurant;
    }).catch(err => {
      console.error(err);
      console.log("Offline, so trying iDB");
      //TODO: try to get restaurant from iDB if available. and make sure id is a Number
      // number = "2"
      // number = Number(number);
      return dbPromise.then(db => {
        id = Number(id);
        const tx = db.transaction('restaurants');
        const restaurantStore = tx.objectStore('restaurants');
        return restaurantStore.get(id);
        // return any record with id "3" <- a string id
      })
    });
  }

  /**
   * Returns a Promise that resolves to an array of reviews by restaurant id, or an error
   * if the status wasn't ok ()
  */
  static fetchRestaurantReviewsById(id) {
    return fetch(`${DBHelper.DATABASE_REVIEWS_URL}/?restaurant_id=${id}`).then(response => {
      if (!response.ok) return Promise.reject(`Yo it is broke, returned with code ${response.status}`);
      return response.json();
    }).then(reviews => {
      //TODO: save reviews fetched from network into indexedDB see: dbpromise.js lines 164-174 as example
      // reviews is an array
      reviews.forEach(review => {
        dbPromise.then(db => {
          const tx = db.transaction('reviews', 'readwrite');
          const reviewStore = tx.objectStore('reviews')
          reviewStore.put(review);
          return tx.complete
        });
      });
      // return what here? Remember that fetchRestaurantReviewsById has to return something. see docs line 99-100
      return reviews 
    }).catch(error => {
      console.log("We could not fetch from the network", error)
      //TODO: handle offline mode
      // serve reviews from indexedDB
      // HINT: you need to fetch all reviews by restaurant_id, so use the restaurant_id index you created in dbpromise.js line 9
      // see dbpromise.js 82-86 as an example of opening an index, and getting all values from it back.
      return dbPromise.then(db => {
        const tx = db.transaction('reviews');
        var reviewStore = tx.objectStore('reviews');
        var reviewIndex = reviewStore.index('restaurant_id');
        return reviewIndex.getAll(Number(id));
      })
      // What do you need to return here if there was an error. see docs line 99-100
      // return
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/images/${restaurant.id}-1600_large_2x.jpg`);
  }
  static smallimageUrlForRestaurant(restaurant) {
    return (`/images/${restaurant.id}-800_small_1x.jpg`);
  }

  static saveReview(id, name, rating, comment, callback) {
    // Block any more clicks on the submit button until the callback
    const btn = document.getElementById("btnReview");
    btn.onclick = null;

    // Create the POST body
    const body = {
      restaurant_id: id,
      name: name,
      rating: rating,
      comments: comment,
      createdAt: Date.now()
    }

    DBHelper.saveNewReview(id, body, (error, result) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, result);
    })
  }

  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  } 
  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

  // favorites
  // I did use some of Doug Brown's methods in an attemp to get stared on this. His walkthrough was really helpful

  static updateFavorite(id, newState, callback) {
    // Push the request into the waiting queue in IDB
    const url = `${DBHelper.DATABASE_URL}/${id}/?is_favorite=${newState}`;
    const method = "PUT";
    DBHelper.updateCachedRestaurantData(id, {"is_favorite": newState});
    DBHelper.addPendingRequestToQueue(url, method);

    // Update the favorite data on the selected ID in the cached data

    callback(null, {id, value: newState});
  }

  static saveNewReview(id, bodyObj, callback) {
    const url = `${DBHelper.DATABASE_REVIEWS_URL}`;
    const method = "POST";
    DBHelper.updateCachedRestaurantReview(id, bodyObj);
    DBHelper.addPendingRequestToQueue(url, method, bodyObj);
    callback(null, null);
  }

  

  static addPendingRequestToQueue(url, method, body) {
    const dbPromise = idb.open("fm-udacity-restaurant");
    dbPromise.then(db => {
      const tx = db.transaction("pending", "readwrite");
      tx
        .objectStore("pending")
        .put({
          data: {
            url,
            method,
            body
          }
        })
    })
      .catch(error => {})
      .then(DBHelper.nextPending());
  }

  static nextPending() {
    DBHelper.attemptCommitPending(DBHelper.nextPending);
  }


  static handleFavoriteClick(id, newState) {
    // Block any more clicks on this until the callback
    const fav = document.getElementById("favorite-icon-" + id);
    fav.onclick = null;

    DBHelper.updateFavorite(id, newState, (error, resultObj) => {
      if (error) {
        console.log("Error updating favorite");
        return;
      }
      // Update the button background for the specified favorite
      const favorite = document.getElementById("favorite-icon-" + resultObj.id);
      favorite.style.background = resultObj.value
        ? `url("/icons/king.svg") no-repeat`
        : `url("/icons/crowncolored.svg") no-repeat`;
    });
  }

  static updateCachedRestaurantData(id, updateObj) {
    const dbPromise = idb.open("fm-udacity-restaurant");
    // Update in the data for all restaurants first
    dbPromise.then(db => {
      console.log("Getting db transaction");
      const tx = db.transaction("restaurants", "readwrite");
      const value = tx
        .objectStore("restaurants")
        .get("-1")
        .then(value => {
          if (!value) {
            console.log("No cached data found");
            return;
          }
          const data = value.data;
          const restaurantArr = data.filter(r => r.id === id);
          const restaurantObj = restaurantArr[0];
          // Update restaurantObj with updateObj details
          if (!restaurantObj)
            return;
          const keys = Object.keys(updateObj);
          keys.forEach(k => {
            restaurantObj[k] = updateObj[k];
          })

          // Put the data back in IDB storage
          dbPromise.then(db => {
            const tx = db.transaction("restaurants", "readwrite");
            tx
              .objectStore("restaurants")
              .put({id: "-1", data: data});
            return tx.complete;
          })
        })
    })
  }
}
window.DBHelper = DBHelper;

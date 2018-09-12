const handleFavoriteClick = (id, newState) => {
  // Update properties of the restaurant data object
  const favorite = document.getElementById("favorite-icon-" + id);
  self.restaurant["is_favorite"] = newState;
  favorite.onclick = event => handleFavoriteClick(restaurant.id, !self.restaurant["is_favorite"]);
  DBHelper.handleFavoriteClick(id, newState);
};


const saveReview = () => {
  const name = document.getElementById("reviewName").value;
  const rating = document.getElementById("reviewRating").value - 0;
  const comment = document.getElementById('reviewComment').value;
    
  DBHelper.saveReview(self.restaurant.id, name, rating, comment, (error, review) => {
      console.log("got saveReview callback");
      if (error) {
        console.log("Error saving review")
      }
      // Update the button onclick event
      const btn = document.getElementById("btnReview");
      btn.onclick = event => saveReview();
  
      window.location.href = "/restaurant.html?id=" + self.restaurant.id;
    });
}



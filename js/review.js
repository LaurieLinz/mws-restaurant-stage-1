const saveReview = () => {
    const comment = document.getElementById('reviewComment').value;
    
    DBHelper.saveReview(self.restaurant.id, name, rating, comment, (error, review) => {
        console.log("got saveReview callback");
        if (error) {
          console.log("Error saving review")
        }
        // Update the button onclick event
        const btn = document.getElementById("btnSaveReview");
        btn.onclick = event => saveReview();
    
        window.location.href = "/restaurant.html?id=" + self.restaurant.id;
      });
}



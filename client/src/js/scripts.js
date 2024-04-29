//Check whether logged in to change navbar btn txt
function checkLoginStatus() {
  //Check cookie true/false
  var isLoggedIn = document.cookie.split(';').some(function (cookie) {
    return cookie.trim().startsWith('loggedIn=');
  });
  //Get nav btn
  var loginButton = document.getElementById('changeBtn');
  //Check cookie status, change btn text
  if (isLoggedIn) {
    loginButton.innerHTML = 'Log out';
  } else {
    loginButton.innerHTML = 'Log in';
  }
}

//Log out by deleting cookies, with back-end route
function logout() {
  //Set expiration date of cookie to past to make null
  document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  //Redirect to login page
  window.location.href = "/src/html/login.html";

  //Fetch API to send POST request to log out endpoint
  fetch('/user/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        //Redirect to login page
        window.location.href = "/src/html/login.html";
      } else {
        console.error('Log out failed');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

//Load navbar on pages
function loadNavbar() {
  //Use fetch to get content of navbar.html
  fetch('/src/html/navbar.html')
    .then(response => response.text())
    .then(data => {
      //Inject the navbar content into the #navbar-container element
      document.getElementById('navbar-container').innerHTML = data;
      //Check log in status
      checkLoginStatus();
    })
    .catch(error => console.error('Error loading navbar:', error));

}
// Call the loadNavbar function to load the navbar when the page loads
window.onload = loadNavbar;


//Hide/show Research elements on title click
function hideContainer(elementID) {
  //Define container to hide
  let container = document.getElementById(elementID);
  //Check display status, if visible - hide, if hidden - show
  if (container.style.display == 'block') {
    container.style.display = 'none';
  } else {
    container.style.display = 'block';
  }
}
//Enlarge picture on click (Research page)
function enlargePic() {
  let image = document.getElementById('phonicsTable');
  if (image.style.height == '300px') {
    image.style.height = '800px';
  } else {
    image.style.height = '300px';
  }
}
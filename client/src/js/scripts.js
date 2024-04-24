//Load navbar on pages
function loadNavbar() {
  //Use fetch to get content of navbar.html
  fetch('/src/html/navbar.html')
    .then(response => response.text())
    .then(data => {
      //Inject the navbar content into the #navbar-container element
      document.getElementById('navbar-container').innerHTML = data;
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
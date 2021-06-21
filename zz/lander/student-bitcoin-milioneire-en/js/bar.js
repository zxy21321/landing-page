window.addEventListener("scroll", function(){
	var header = document.querySelector("header");
	header.classList.toggle("sticky", window.scrollY > 0);
})
// When the user scrolls the page, execute myFunction
$(window).on("scroll", ScrollFunction);

function ScrollFunction() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";

    if ($(window).width() > 460) {
      if(scrolled > 0) {
        document.querySelector(".header__desktop").style.display = "none";
        document.querySelector(".header__desktop__scroll").style.display = "block";
      }
      else {
      document.querySelector(".header__desktop__scroll").style.display = "none";
      document.querySelector(".header__desktop").style.display = "block";
      }
    }
  
  
    if (scrolled > 80) {
      document.querySelector(".progress-bar").style.background = "#0cb04c";
    }
    else if (scrolled > 60) {
      document.querySelector(".progress-bar").style.background = "#0088cf";
    }
    else if (scrolled > 40) {
      document.querySelector(".progress-bar").style.background = "#645fa9";
    }
    else if (scrolled > 20) {
      document.querySelector(".progress-bar").style.background = "#f26f20";
    }
    else {
      document.querySelector(".progress-bar").style.background = "#fcb700";
    }
  
  }
  
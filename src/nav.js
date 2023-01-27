//nav bar


const navbar = document.querySelector('.navbar');

window.addEventListener('scroll' ,() => {
    if (scrollY >=100) {
        navbar.classList.add('bg');
    }

    else {
        navbar.classList.remove('bg');
    }
    
})

const createNavbar = () => {
    let navbar = document.querySelector('.navbar');

    navbar.innerHTML += `
    <ul class="links-container">
    <li class="link-item"><a href="#" class="link-active">Home</a></li>
    <li class="link-item"><a href="#" class="link">Product</a></li>
    <li class="link-item"><a href="#" class="link">About</a></li>
    <li class="link-item"><a href="#" class="link">Contact</a></li>

</ul>

<div class="user-interactions">

    <div class="search-box">
        <input type="text" class="search" placeholder="search item">
        <button class="search-btn"><img src="../Img/search.png" alt=""></button>
    </div>
    <div class = "cart" onclick ="location.href = '/cart'">
        <img src="../img/cart.png"  class="cart-icon" alt="">
        <span class ="cart-item-count">00</span>
    </div>
    <div class="user">
       <img src="../img/user.png" class="user-icon" alt=""> 
       <div class="user-icon-popup">
        <p>Login to your account</p>
        <a>Login</a>

       </div>
    </div>

</div>








`
}

createNavbar();

//user icon popup

let userIcon = document.querySelector('.user-icon');
let userPopupIcon = document.querySelector('.user-icon-popup');

userIcon.addEventListener('click', () => userPopupIcon.classList.toggle('active'));

let text = userPopupIcon.querySelector('p');
let actionBtn = userPopupIcon.querySelector('a');
let user = JSON.parse(sessionStorage.user || null);

if (user!= null) { //user is logged in
    text.innerHTML = 'Login as ' +user.name;
    actionBtn.innerHTML = 'logout';
    actionBtn.addEventListener('click', () => logout());
} else {
    text.innerHTML = 'login to your account';
    actionBtn.innerHTML = 'login';
    actionBtn.addEventListener('click', () => location.href = '/login');
}


const logout = () => {
    sessionStorage.clear();
    location.reload();
}


//search box

let searchBtn = document.querySelector('.search-btn');
let searchBox = document.querySelector('.search');

searchBtn.addEventListener('click', () => {
    if (searchBox.value.length) {
        location.href = `/search/${searchBox.value}`;
    }
})


// nav cart


const updateNavCartCount = () => {
    let cartCounter = document.querySelector('.cart-item-count');

    let cartItem = JSON.parse(localStorage.getItem('cart'));

    if(cartItem == null){
        cartCounter.innerHTML = '00';
    }
    else {
        if(cartCounter.length > 9){
            cartCounter.innerHTML = '9+';
        }
        else if(cartItem.length <= 9) {
            cartCounter.innerHTML = `0${cartItem.length}`
        }
    }
}

updateNavCartCount();

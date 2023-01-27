

//product page setting

let productName = document.querySelector('.product-title');
let shortDes = document.querySelector('.product-description');
let price = document.querySelector('.price');
let detail = document.querySelector('.des');
let productImage = document.querySelector('.product-image');
let title = document.querySelector('title');

let cardBtn = document.querySelector('.cart-btn');



const setData = (data) => {
    productName.innerHTML = title.innerHTML = data.name;
    productImage.src = data.image;
    shortDes.innerHTML = data.shortDes;
    detail.innerHTML = data.des;
    price.innerHTML = ("£" + data.price);

    cardBtn.addEventListener('click', () => {
       
       cardBtn.innerHTML = add_product_to_card(data);
    })

     
}

const fetchProductData = () => {
    fetch('/get-products', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({id: productId})
    }).then(res => res.json())
    .then(data => {
        //console.log(data);
        setData(data);
        getProducts(data.tags[0]).then(res => createProductCards(res, 'similar products', '.best-selling-product-section'));
    })
    .catch(err => {
        console.log(err);
        alert('no product found');
        location.replace('/404');
    })
}

let productId = null;
if(location.pathname != '/add-product') {
    productId = decodeURI(location.pathname.split('/').pop());
    fetchProductData();
    
}


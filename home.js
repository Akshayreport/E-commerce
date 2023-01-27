//image collage

const collageImages = [...document.querySelectorAll('.collage-img')];

collageImages.map((item, i) => {
  item.addEventListener('mouseover', () => {
    collageImages.map((image, index) => {
      console.log('Value of I= ' + i);
      console.log('value of index ' + index);
      if (index != i) {
        image.style.filter = 'blur(10px)';
        item.style.zIndex = 2;

        console.log('this is the image ' + image);
        console.log('this is the item ' + item);

        //The value of index will loop for the amount images (3) and the value of I will depend on which image has the mouseover
      }
    });
  });

  item.addEventListener('mouseleave', () => {
    collageImages.map((image, index) => {
      image.style = null;
    });
  });
});

// get product functions

const getProducts = (tag) => {
  return fetch('/get-products', {
    method: 'post',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ tag: tag }),
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
};

productId = null;

const createProductCards = (data, title, ele) => {
  if (data.length) {
    let container = document.querySelector(ele);
    container.innerHTML += `
            <h1 class="section-title">${title}</h1>
            <div class="product-container">
                ${createCards(data)}
            </div>
        `;
  }
};

const createCards = (data) => {
  let cards = '';
  data.forEach((item) => {
    if (item.id != productId) {
      cards += ` <div class="product-card" onclick="location.href = '/products/${item.id}'">
        <img src="${item.image}" onclick ="location.href = /products/${item.id}" class="product-img"alt="">
        <p class="product-name" onclick="location.href = '/products/${item.id}'">${item.name}</p>

    </div>`;
      console.log(item);
    }
  });

  return cards;
};

//cart function

const add_product_to_card = (product) => {
  updateNavCartCount();
  let cart = JSON.parse(localStorage.getItem('cart'));
  console.log(product);

  if (cart == null) {
    cart = [];
  }

  product = {
    item: 1,
    name: product.name,
    price: product.price,
    shortDes: product.shortDes,
    image: product.image,
  };

  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  return 'added';
};

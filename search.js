const searchKey = decodeURI(location.pathname.split('/').pop());
console.log(searchKey);
getProducts(searchKey).then(data => createProductCards(data, searchKey, '.search-listing'))
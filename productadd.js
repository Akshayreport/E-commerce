


let loader = document.querySelector('.loader');
let applybtn = document.querySelector('.apply-btn');


applybtn.addEventListener('click', () => {
    let productname = document.querySelector('#pname').value;
    let productdescription = document.querySelector('#productdes').value;

    if (!productname.length || !productdescription.length) {
        showFormError("Please fill in all the fields");
    } else {
        loader.style.display = 'block';
        sendData('/productadd', {
            productname : productname,
            productdescription: productdescription,
            email : JSON.parse(sessionStorage.user).email
        })
    }
})
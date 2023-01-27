window.onload = () => {
    if(sessionStorage.user) {
        user = JSON.parse(sessionStorage.user);
        if (user.email){
            location.replace('/');
        }
    }
}

let formBtn = document.querySelector('.submit-btn');
let loader = document.querySelector('.loader');

formBtn.addEventListener('click', () => {
    let fullname = document.querySelector('#name') || null;
    let email = document.querySelector('#email');
    let password = document.querySelector('#password');
    let number = document.querySelector('#number') || null;
    let tac = document.querySelector('#tc') || null;


   


    //form validation

   if (fullname != null) { //signup page
    if (fullname.value.length < 3){
        showFormError('name must have more than 3 characters');
    } else if(!email.value.length) {
        showFormError('Enter your email');

    } else if(!password.value.length) {
        showFormError('Enter your password');

    } else if (Number(number) || number.value.length < 10) {
        showFormError('Enter your number');
    } else if (!tac.checked) {
        showFormError('Accept Terms and Conditions');
    } 
    else {
    //     //submit form

        loader.style.display = 'block';
        sendData('/signup', {
            name: fullname.value,
            email: email.value,
            password: password.value,
            number: number.value,
            tac: tac.checked
        })
    }
   }  
   else {
    if (!email.value.length || !password.value.length) {
        showFormError('Fill in all the inputs')
    } else {
        loader.style.display = 'block';
        sendData('/login' , {
            email: email.value,
            password: password.value
        })
    }
   }
           

});
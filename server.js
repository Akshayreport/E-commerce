import express from 'express';
import bcrypt from 'bcrypt';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  limit,
} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore();

// initialise the server

const app = express();

//middlewares

app.use(express.static('public'));
app.use(express.json()); //enable form sharing

import aws from 'aws-sdk';
import 'dotenv/config';

const region = 'eu-west-2';
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

aws.config.update({
  region,
  accessKeyId,
  secretAccessKey,
});

const s3 = new aws.S3();

async function generateURL() {
  let date = new Date();

  const imageName = `${date.getTime()}.jpeg`;

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 300,
    ContentType: 'image/jpeg',
  };

  const uploadURL = await s3.getSignedUrlPromise('putObject', params);
  return uploadURL;
}

app.get('/s3url', (req, res) => {
  generateURL().then((url) => res.json(url));
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

//signup route
app.get('/signup', (req, res) => {
  res.sendFile('signup.html', { root: 'public' });
});

app.post('/signup', (req, res) => {
  const { name, email, password, number, tac } = req.body;

  //form Validations
  if (name.length < 3) {
    res.json({ alert: 'name must have more than 3 characters' });
  } else if (!email.length) {
    res.json({ alert: 'Enter your email' });
  } else if (!password.length) {
    res.json({ alert: 'Enter your password' });
  } else if (!Number(number) || number.length < 10) {
    res.json({ alert: 'Enter your number' });
  } else if (!tac) {
    res.json({ alert: 'You must agree to the Terms and Conditions' });
  } else {
    //store the  file in db

    const users = collection(db, 'users');

    getDoc(doc(users, email)).then((user) => {
      //getDoc - retrieves the data from the database - look into users and then email
      if (user.exists()) {
        return res.json({ alert: 'email already exists' });
      } else {
        //encrypt the password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            req.body.password = hash;
            req.body.seller = false;

            setDoc(doc(users, email), req.body).then((data) => {
              res.json({
                name: req.body.name,
                email: req.body.email,
                seller: req.body.sellar,
              });
            });
          });
        });
      }
    });
    // store the data in db
  }
});

app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: 'public' });
});

//Dummy productadd file which adds to database

// app.get('/productadd', (req, res) => {
//     res.sendFile("productadd.html", {root : "public"})
// })

// app.post('/productadd', (req, res) => {
//     let {productname , productdescription, email} = req.body

//     if (!productname.length || !productdescription.length){
//         return res.json({'alert' : 'Fill in all fields from back end'})
//     } else {
//         const productadd = collection(db, "productadd");
//         setDoc(doc(productadd, email), req.body)
//         .then(data => {
//             res.json({
//                 productname : req.body.productname,
//                 productdescription : req.body.productdescription,
//                 email : req.body.email
//             })
//         })
//     }
// })

app.post('/login', (req, res) => {
  let { email, password } = req.body;

  if (!email.length || !password.length) {
    res.json({ alert: 'Fill in all the inputs' });
  }

  const users = collection(db, 'users');
  getDoc(doc(users, email)).then((user) => {
    if (!user.exists()) {
      return res.json({ alert: 'email does not exists' });
    } else {
      bcrypt.compare(password, user.data().password, (err, result) => {
        if (result) {
          let data = user.data();
          return res.json({
            name: data.name,
            email: data.email,
            seller: data.sellar,
          });
        } else {
          return res.json({ alert: 'password is incorrect' });
        }
      });
    }
  });
});

// seller route

app.get('/seller', (req, res) => {
  res.sendFile('seller.html', { root: 'public' });
});

app.post('/seller', (req, res) => {
  let { name, address, about, number, email } = req.body; //data from front end

  if (
    !name.length ||
    !address.length ||
    !about.length ||
    number.length < 10 ||
    !Number(number)
  ) {
    return res.json({ alert: 'some information(s) is/are incorrect' });
  } else {
    // update the seller status
    const sellers = collection(db, 'sellers');
    setDoc(doc(sellers, email), req.body).then((data) => {
      const users = collection(db, 'users');
      updateDoc(doc(users, email), {
        seller: true,
      }).then((data) => {
        res.json({ seller: true });
      });
    });
  }
});

//dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile('dashboard.html', { root: 'public' });
});

app.get('/add-product', (req, res) => {
  res.sendFile('add-product.html', { root: 'public' });
});

app.get('/add-product/:id', (req, res) => {
  res.sendFile('add-product.html', { root: 'public' });
});

app.post('/add-product', (req, res) => {
  let { name, shortDes, detail, price, image, tags, email, draft, id } =
    req.body;

  if (!draft) {
    if (!name.length) {
      res.json({ alert: 'Please enter product name' });
    } else if (!shortDes.length) {
      res.json({ alert: 'Please enter product description' });
    } else if (!price.length || !Number(price)) {
      res.json({ alert: 'Please enter a valid price' });
    } else if (!detail.length) {
      res.json({ alert: 'Please enter a valid description' });
    } else if (!tags.length) {
      res.json({ alert: 'Please enter at least one tag' });
    }
  }

  let docName =
    id == undefined
      ? `${name.toLowerCase()}-${Math.floor(Math.random() * 50000)}`
      : id;
  //let docName =  `${name.toLowerCase()}-${Math.floor(Math.random() * 50000)}`
  // its like an if statement

  let products = collection(db, 'products');
  setDoc(doc(products, docName), req.body)
    .then((data) => {
      res.json({ product: name });
    })
    .catch((err) => {
      res.json({ alert: 'some error occured' });
    });
});

app.post('/get-products', (req, res) => {
  let { email, id, tag } = req.body;

  let products = collection(db, 'products');
  let docRef;

  if (id) {
    docRef = getDoc(doc(products, id));
  } else if (tag) {
    docRef = getDocs(query(products, where('tags', 'array-contains', tag)));
  } else {
    docRef = getDocs(query(products, where('email', '==', email)));
  }

  docRef.then((products) => {
    if (products.empty) {
      return res.json('no products');
    }

    let productArr = [];

    if (id) {
      return res.json(products.data());
    } else {
      products.forEach((item) => {
        let data = item.data();
        data.id = item.id;
        productArr.push(data);
      });
    }

    res.json(productArr);
  });
});

app.post('/delete-product', (req, res) => {
  let { id } = req.body;

  deleteDoc(doc(collection(db, 'products'), id))
    .then((data) => {
      res.json('success');
    })
    .catch((err) => {
      res.json('err');
    });
});

//product route

app.get('/products/:id', (req, res) => {
  res.sendFile('product.html', { root: 'public' });
});

app.get('/search/:key', (req, res) => {
  res.sendFile('search.html', { root: 'public' });
});

//review route

// review routes
app.post('/add-review', (req, res) => {
  let { headline, review, rate, email, product } = req.body;

  // form validations
  if (
    !headline.length ||
    !review.length ||
    rate == 0 ||
    email == null ||
    !product
  ) {
    return res.json({ alert: 'Fill all the inputs' });
  }

  // storing in Firestore
  let reviews = collection(db, 'reviews');
  let docName = `review-${email}-${product}`;
  console.log(docName);

  setDoc(doc(reviews, docName), req.body)
    .then((data) => {
      return res.json('review');
    })
    .catch((err) => {
      console.log(err);
      res.json({ alert: 'some err occured' });
    });
});

app.post('/get-reviews', (req, res) => {
  let { product, email } = req.body;

  let reviews = collection(db, 'reviews');

  getDocs(query(reviews, where('product', '==', product)), limit(4)).then(
    (review) => {
      let reviewArr = [];

      if (review.empty) {
        return res.json(reviewArr);
      }

      let userEmail = false;

      review.forEach((item, i) => {
        let reivewEmail = item.data().email;
        if (reivewEmail == email) {
          userEmail = true;
        }
        reviewArr.push(item.data());
      });

      if (!userEmail) {
        getDoc(doc(reviews, `review-${email}-${product}`)).then((data) =>
          reviewArr.push(data.data())
        );
      }

      return res.json(reviewArr);
    }
  );
});

app.get('/cart', (req, res) => {
  res.sendFile('cart.html', { root: 'public' });
});

//404 route, this should always be last

app.get('/404', (req, res) => {
  res.sendFile('404.html', { root: 'public' });
});

app.use((req, res) => {
  res.redirect('/404');
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});

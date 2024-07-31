import {auth, onAuthStateChanged, signOut, getFirestore, doc, db, setDoc, collection, addDoc, getDoc,getDocs,query, where, storage, getStorage, ref, uploadBytesResumable, getDownloadURL} from './firebase.js'

let loginBtn = document.getElementById("loginBtn");
let logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {
    if (user) {
        if(loginBtn || logoutBtn){
            loginBtn.style.display = "none";
            logoutBtn.style.display = "block";
        }
        // if(location.pathname !== '/index.html'){
        //     location.href = "index.html";
        // }
        console.log("register:-",user);
    } else {
        if(loginBtn || logoutBtn){
            loginBtn.style.display = "block";
            logoutBtn.style.display = "none";
        }
        // if(location.pathname !== '/signin.html'){
        //     location.href = "signin.html";
        // }
        console.log("not Signin"); 
    }
});


let logOut = () => {
    signOut(auth).then(() => {
        console.log('Sign-out successful');
        location.href = "signin.html";
    }).catch((error) => {
        console.log("error in signout:-", error);
    });
}
logoutBtn && logoutBtn.addEventListener("click", logOut);

let sell = () => {
    if(auth.currentUser){
        location.href = "sell.html";
    }
    else{
        location.href = "signup.html";
    }
}

let sellBtn = document.getElementById("sellBtn");
sellBtn && sellBtn.addEventListener("click", sell);


// Database
let file = document.getElementById("file");
let prodName = document.getElementById("prodName");
let prodDesD = document.getElementById("prodDesD");
let prodDesS = document.getElementById("prodDesS");
let prodPrice = document.getElementById("prodPrice");
let city = document.getElementById("city");
let category = document.getElementById("category");
let loader = document.getElementById("loader");

let post = async () => {
    const userData = {
        img: file.files[0],
        title: prodName.value,
        desS: prodDesS.value,
        desD: prodDesD.value,
        price: prodPrice.value,
        city: city.value,
        categ: category.value
    };

    const imgRef = ref(storage, userData.img.name);
    const uploadTask = uploadBytesResumable(imgRef, file.files[0]);

    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            console.log("error in storage:-", error);
        },
        async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('Url:-', downloadURL);
            userData.img = downloadURL;

            // Check if category exists
            const categoryQuery = query(collection(db, "categories"), where("name", "==", userData.categ));
            const categorySnapshot = await getDocs(categoryQuery);

            if (categorySnapshot.empty) {
                // Category does not exist, create a new category
                await addDoc(collection(db, "categories"), { name: userData.categ });
            }

            // Add product to the "products" collection
            const docRef = await addDoc(collection(db, "products"), userData);
            console.log("Document written with ID: ", docRef.id);
            getData();
        }
    );
}

// console.log(db);

let postBtn = document.getElementById("postBtn");
postBtn && postBtn.addEventListener("click", post);

let sellCardContainer = document.getElementById("cardsSec");

let getData = async () => {
    if (sellCardContainer) {
        sellCardContainer.innerHTML = '';
    }
    if (loader) {
        loader.style.display = "block";
    }

    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const categories = {};

        querySnapshot.forEach((doc) => {
            const prodData = doc.data();
            const { img, title, desS, desD, price, city, categ } = prodData;

            if (!categories[categ]) {
                categories[categ] = [];
            }
            categories[categ].push({ id: doc.id, img, title, desS, desD, price, city });
        });

        for (const categ in categories) {
            const categorySection = document.createElement('div');
            categorySection.classList.add('categorySection');
            categorySection.innerHTML = `<h2 class="fw-bold py-2 text-center">${categ}</h2>`;

            const mainCardContainer = document.createElement('div');
            mainCardContainer.classList.add('d-flex', 'justify-content-center', 'flex-wrap', 'gap-4');

            categories[categ].forEach((prodData) => {
                const { id, img, title, desS, desD, price, city } = prodData;
                const productCard = document.createElement('div');
                productCard.innerHTML = `
                    <div id="sellCard" class="p-1">
                        <div class="prodImg">
                            <img src="${img}" alt="">
                        </div>
                        <div class="p-1 prodText">
                            <div class="d-flex justify-content-between">
                                <h4>${title}</h4>
                                <p class="mt-1 fw-bold">PKR ${price}</p>
                            </div>
                            <p class="prodDes">${desS}</p>
                            <div class="d-flex justify-content-between">
                                <p class="cardCity mb-0">Gulshan-e-Iqbal, ${city}</p>
                                <button id="buyProd" onclick="buyProd('${id}')" class="py-2">Buy now</button>
                            </div>
                        </div>
                    </div>`;
                
                mainCardContainer.appendChild(productCard);
            });

            categorySection.appendChild(mainCardContainer);
            if(sellCardContainer){
                sellCardContainer.appendChild(categorySection);
            }
        }

    } catch (error) {
        console.log("error found in database:", error);
    } finally {
        if (loader) {
            loader.style.display = "none";
        }
    }
}

getData();


// Fun BuyProduct
async function buyProd(id) {
    console.log(id);
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    let addtoCart = document.getElementById("addtoCart");
    
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        let getCartData = docSnap.data();
        const { title, img, price, desD, city } = getCartData;  // Corrected 'prie' to 'price'
        
        if (addtoCart) {
            addtoCart.innerHTML += `
            <a style="height: 380px;" href="#" class="mt-4 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${title}</h5>
                <p class="font-normal text-gray-700 dark:text-gray-400">${desD}</p>
                <p class="my-2 font-bold text-gray-700 dark:text-gray-400">PKR ${price}</p>
                <p class="my-2 font-semibold text-gray-700 dark:text-gray-400 text-3xl "><i class="me-1 fa-solid fa-location-dot"></i>${city}</p>
                <div>
                    <p>Seller id: 1081841853</p>
                    <p class="my-2 text-xl"><i class="me-2 fa-solid fa-phone"></i>0324789799</p>
                </div>
                <button href="#" class="my-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Place an order
                    <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </button>
            </a>
            <div style="width: 750px;" id="default-carousel" class="relative m-4" data-carousel="slide">
                <div class="relative h-56 overflow-hidden rounded-lg md:h-96">
                    <div class=" duration-700 ease-in-out" data-carousel-item>
                        <img src=${img} class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="Product Image">
                    </div>
                    <!-- Add additional carousel items here if necessary -->
                </div>
                <div class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                    <button type="button" class="w-3 h-3 rounded-full" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
                    <!-- Additional carousel controls -->
                </div>
                <button type="button" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
                    <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                        </svg>
                        <span class="sr-only">Previous</span>
                    </span>
                </button>
                <button type="button" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
                    <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <span class="sr-only">Next</span>
                    </span>
                </button>
            </div>
            `;
        } else {
            console.error("Element with id 'addtoCart' not found.");
        }
    } else {
        console.log("No such document!");
    }
}
window.buyProd = buyProd;
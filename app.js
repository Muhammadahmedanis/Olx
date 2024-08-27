import {auth, onAuthStateChanged, signOut, getFirestore, doc, db, setDoc, collection, addDoc, getDoc,getDocs,query, where, storage, getStorage, ref, uploadBytesResumable, getDownloadURL} from './firebase.js'

let loginBtn = document.getElementById("loginBtn");
let logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {
    if (user) {
        if(loginBtn || logoutBtn){
            loginBtn.style.display = "none";
            logoutBtn.style.display = "block";
        }
        console.log("register:-",user);
    } else {
        if(loginBtn || logoutBtn){
            loginBtn.style.display = "block";
            logoutBtn.style.display = "none";
        }
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
let file1 = document.getElementById("file1");
let file2 = document.getElementById("file2");
let prodName = document.getElementById("prodName");
let prodDesD = document.getElementById("prodDesD");
let prodDesS = document.getElementById("prodDesS");
let prodPrice = document.getElementById("prodPrice");
let city = document.getElementById("city");
let category = document.getElementById("category");
let loader = document.getElementById("loader");

let arr = [];
let post = async () => {
    try {
        const userData = {
            img1: file1.files[0],
            img2: file2.files[0],
            title: prodName.value,
            desS: prodDesS.value,
            desD: prodDesD.value,
            price: prodPrice.value,
            city: city.value,
            categ: category.value
        };

        // Upload the first image
        const imgRef1 = ref(storage, userData.img1.name);
        const uploadTask1 = await uploadBytesResumable(imgRef1, userData.img1);

        const downloadURL1 = await getDownloadURL(uploadTask1.ref);
        console.log('First Image URL:', downloadURL1);
        userData.img1 = downloadURL1;

        // Upload the second image
        const imgRef2 = ref(storage, userData.img2.name);
        const uploadTask2 = await uploadBytesResumable(imgRef2, userData.img2);

        const downloadURL2 = await getDownloadURL(uploadTask2.ref);
        console.log('Second Image URL:', downloadURL2);
        userData.img2 = downloadURL2;

        // Check if category exists
        const categoryQuery = query(collection(db, "categories"), where("name", "==", userData.categ));
        const categorySnapshot = await getDocs(categoryQuery);

        if (categorySnapshot.empty) {
            await addDoc(collection(db, "categories"), { name: userData.categ });
        }
        console.log(userData);

        // Add product to the "products" collection
        const docRef = await addDoc(collection(db, "products"), userData);
        console.log("Document written with ID:", docRef.id);
        getData();
    } catch (error) {
        console.log("Error during upload:", error);
    }
// };

    prodName.value = '';
    prodDesD.value = '';
    prodDesS.value = '';
    prodPrice.value = '';
    city.value = '';
    category.value = '';
    file1.value = '';
    file2.value = '';
};

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
            const { img1, img2, title, desS, desD, price, city, categ } = prodData;

            if (!categories[categ]) {
                categories[categ] = [];
            }
            categories[categ].push({ id: doc.id, img1, img2, title, desS, desD, price, city });
            arr.push({id:doc.id, data:prodData});
            localStorage.setItem("prod", JSON.stringify(arr));
        });

        for (const categ in categories) {
            const categorySection = document.createElement('div');
            categorySection.classList.add('categorySection');
            categorySection.innerHTML = `<h2 class="fw-bold py-2 text-center">${categ}</h2>`;

            const mainCardContainer = document.createElement('div');
            mainCardContainer.classList.add('d-flex', 'justify-content-center', 'flex-wrap', 'gap-4');

            categories[categ].forEach((prodData) => {
                const { id, img1, title, desS, desD, price, city } = prodData;
                const productCard = document.createElement('div');
                productCard.innerHTML = `
                    <div id="sellCard" class="p-1">
                        <div class="prodImg">
                            <img src="${img1}" alt="">
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


let getD = JSON.parse(localStorage.getItem("prod"));
function buyProd(id) {
    location.href = `addtocart.html?id=${id}`;
}

let getProdDetail = async() => {
    let addtoCart = document.getElementById("addtoCart");
    const urlParams = new URLSearchParams(window.location.search);
    const getId = urlParams.get('id');
    if (addtoCart) {
    const docRef = doc(db, "products", getId);
    const docSnap = await getDoc(docRef);
    let {img1, img2, city, price, title, desD} = docSnap.data()
        console.log("Document data:", docSnap.data());
        addtoCart.innerHTML += `<a style="height: 380px; width: 450px;" href="#" class="mt-4 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${title}</h5>
        <p class="font-normal text-gray-700 dark:text-gray-400">${desD}</p>
        <p class="my-2 font-bold text-gray-700 dark:text-gray-400">${price} PKR</p>
        <p class="my-2 font-semibold text-gray-700 dark:text-gray-400 text-3xl "><i class="me-1 fa-solid fa-location-dot"></i>${city}</p>
        <div>
            <p>Seller id: ${getId.toUpperCase()}</p>
            <p class="my-2 text-xl"><i class="me-2 fa-solid fa-phone"></i>0324789799</p>
        </div>
        <button href="#" class="my-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Place an order
            <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </button>
    </a>
    
   <div style="width: 750px;" id="default-carousel" class="relative w-full" data-carousel="slide">
    <div class="relative h-56 overflow-hidden rounded-lg md:h-96">
        <!-- Item 1 -->
        <div class="duration-700 ease-in-out" data-carousel-item>
            <img style="width: 550px; height: 400px; padding-top: 30px;" src="${img1}" class="absolute block -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="Product Image">
        </div>
    </div>
</div>
`
    } else {
        console.log("No such document!");
    }
}

getProdDetail();
window.buyProd = buyProd;
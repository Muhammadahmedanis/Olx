import {auth, createUserWithEmailAndPassword} from './firebase.js'

let signUp = () =>{
    let signupEmail = document.getElementById("signupEmail");
    let signupPassword = document.getElementById("signupPassword");
    createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log("Signup:-", user);
        window.location.href = "index.html";
    })
    .catch((error) => {
        console.log("Sign up fail:-", error);
    });
    signupEmail.value = '';
    signupPassword.value = '';
}



let signupBtn = document.getElementById("signupBtn");
signupBtn && signupBtn.addEventListener("click", signUp)

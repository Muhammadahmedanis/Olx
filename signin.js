import {auth, signInWithEmailAndPassword} from './firebase.js'

let signIn = () => {
    let signinEmail = document.getElementById("signinEmail");
    let signinPassword = document.getElementById("signinPassword");
    signInWithEmailAndPassword(auth, signinEmail.value, signinPassword.value)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log("Sign in:-", user);
        location.href = "index.html";
        })
        .catch((error) => {
            console.log("Sign in fail:-", error);
        });
        signinEmail.value = '';
        signinPassword.value = '';
}

let signinBtn = document.getElementById("signinBtn");
signinBtn && signinBtn.addEventListener("click", signIn);
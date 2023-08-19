import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, signInWithEmailAndPassword, updatePassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getFirestore, doc, getDocs, addDoc, setDoc, serverTimestamp, collection } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
import { getStorage, ref } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyA_ElrZQLVcbjWaAY8qPyrWmgILaP6gbIY",
    authDomain: "heckathon-01.firebaseapp.com",
    projectId: "heckathon-01",
    storageBucket: "heckathon-01.appspot.com",
    messagingSenderId: "662350439445",
    appId: "1:662350439445:web:ca5edb7df08cb02f9d5a1c"
};

const app = initializeApp(firebaseConfig); 
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();
const user = auth.currentUser;




let loginBtn = document.getElementById("login-btn");
loginBtn && loginBtn.addEventListener("click", () => {
    let loginEmail = document.getElementById("loginEmail");
    let loginPassword = document.getElementById("loginPassword");
    createUserWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
        .then((userCredential) => {
            const user = userCredential.user;
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Login Successfully!',
                timer: 1500
            })

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const uid = user.uid;
                    localStorage.setItem("user ID", uid);
                } else {
                }
            });

            location.replace("./dashboard.html")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage
            })
        });

})


let signupBtn = document.getElementById("signup-btn");
signupBtn && signupBtn.addEventListener("click", () => {
    let signupEmail = document.getElementById("signupEmail").value;
    let signupPssword = document.getElementById("signupPssword").value;
    let signupconformPassword = document.getElementById("signupconformPassword").value;
    if (signupPssword === signupconformPassword) {
        let password = signupPssword;


        signInWithEmailAndPassword(auth, signupEmail, password)
            .then((userCredential) => {
                const user = userCredential.user;
                location.replace("./dashboard.html");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: errorMessage
                })

            });
    }
    else {
        console.log("wrong error")
    }

})


const FileInput = document.getElementById("FileInput");

FileInput && FileInput.addEventListener("change", () => {
    let profilePicture = document.getElementById("profile-picture");
    profilePicture = document.getElementById("profile-picture").src = URL.createObjectURL(FileInput.files[0])
    console.log(FileInput.files[0])

    const uploadFile = (file) => {
        return new Promise((resolve, reject) => {
            const mountainsRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(mountainsRef, file);

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
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };


})

let updateBtnInfo = document.getElementById("update-btn");
updateBtnInfo && updateBtnInfo.addEventListener("click", async () => {
    try {
        let proFullname = document.getElementById("proFullname");
        let proEmail = document.getElementById("pro-email");
        let proEducation = document.getElementById("proEducation");
        const imageUrl = await uploadFile(fileInput.files[0])

        const docRef = await addDoc(collection(db, "user"), {
            Fullname: proFullname.value,
            Email: proEmail.value,
            Education: proEducation.value,
            pictureUrl: imageUrl
        });
        console.log("Document written with ID: ", docRef.id);

    } catch {
        console.log("error")
    }
});



let logout = document.getElementById("logoutBtn");
logout && logout.addEventListener("click", () => {
    signOut(auth).then(() => {
        location.replace("./index.html")
    }).catch((error) => {
        console.log(error)
    });
})

let updateEemailBtn = document.getElementById("update-email-btn");
updateEemailBtn && updateEemailBtn.addEventListener("click", () => {
    let email = document.getElementById("pro-email").value;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Check your Email box',
                timer: 1500
            })
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage
            })
        });
})


// add blog

let publishBlog = document.getElementById("publish-blog");
publishBlog && publishBlog.addEventListener("click", async () => {


    const querySnapshot = await getDocs(collection(db, "Blogs"));
    let uploadHeading = document.getElementById("uploadHeading");
    let uploadContent = document.getElementById("uploadContent");
    let mydate = new Date();
    let dateHeading = document.getElementById("date-heading ");
    dateHeading.innerHTML = mydate;



    // console.log(user.id)
    const docRef = await addDoc(collection(db, "Blogs"), {
        Heading: uploadHeading.value,
        Content: uploadContent.value,
        date: mydate
    });
    console.log(docRef)
    querySnapshot.forEach(async (doc) => {
        let commingData = (doc.id, " => ", doc.data());
        console.log(commingData)


        let blogContainer = document.getElementById("blog-container");
        blogContainer.innerHTML += `
    <div class="card">
    <div class="img-card">
    <img src="" alt="" class="blog-img" id="imageblog">
    <div>
    <h5 id="blogHeading" class="card-title">${uploadHeading.value || commingData.Heading}</h5>
    <h2 id="date-heading">${mydate}</h2>
    </div>
    </div>
    <div class="card-body">
    <p id="card-text" class="card-text">${uploadContent.value || commingData.Content}</p>
    <a href="#" class="btn btn-primary">Delete</a>
    </div>
    
    </div>`;
    });
});
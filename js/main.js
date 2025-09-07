// Global vars
var currentUser;
var userList = [];

// Load users
if (localStorage.getItem('userList') != null) {
    userList = JSON.parse(localStorage.getItem('userList'));
}

// ============ SIGNUP ============
if (document.getElementById('signupBtn')) {
    var userNameSignup = document.getElementById('userNameSignup');
    var userEmailSignup = document.getElementById('userEmailSignup');
    var userPasswordSignup = document.getElementById('userPasswordSignup');
    var signupBtn = document.getElementById('signupBtn');
    var successMessage = document.getElementById('successMessage');
    var existUserMessage = document.getElementById('existUserMessage');
    var invalidMessage = document.getElementById('invalidMessage');
    var form = document.querySelector('form');

    form.addEventListener('submit', function (e) { e.preventDefault(); });

    userNameSignup.addEventListener('input',function(e){
        toggleValidation(userNameSignup,isValidUserName);
    });
    userEmailSignup.addEventListener('input',function(e){
        toggleValidation(userEmailSignup,isValidEmail);
        existUserMessage.classList.replace('d-block', 'd-none'); 
    });
    userPasswordSignup.addEventListener('input',function(e){
        toggleValidation(userPasswordSignup, isValidPassword);
    });

    signupBtn.addEventListener('click', function () {
        var user = {
            name: userNameSignup.value,
            email: userEmailSignup.value,
            password: userPasswordSignup.value
        };

        if (!isUserExist(user.email) && isValidEmail(user.email) && isValidUserName(user.name)&& isValidPassword(user.password)) {
            userList.push(user);
            localStorage.setItem('userList', JSON.stringify(userList));
            successMessage.classList.replace('d-none', 'd-block');
            existUserMessage.classList.replace('d-block', 'd-none');

            setTimeout(function () {
                window.location.href = 'login.html';
                clearSignupForm();
            }, 1500);

        } else if (isUserExist(user.email) && isValidUserName(user.name)&& isValidPassword(user.password)) {
            existUserMessage.classList.replace('d-none', 'd-block');
            successMessage.classList.replace('d-block', 'd-none');
        } else{
            existUserMessage.classList.replace('d-block', 'd-none');
            successMessage.classList.replace('d-block', 'd-none');
        }
    });

    function clearSignupForm() {
        userNameSignup.value = '';
        userEmailSignup.value = '';
        userPasswordSignup.value = '';
    }
}

// ============ LOGIN ============
if (document.getElementById('signinBtn')) {
    var userEmailLogin = document.getElementById('userEmailLogin');
    var userPasswordLogin = document.getElementById('userPasswordLogin');
    var signinBtn = document.getElementById('signinBtn');
    var errorMessage = document.getElementById('errorMessage');
    var form = document.querySelector('form');

    form.addEventListener('submit', function (e) { e.preventDefault(); });

    // Hide error when typing
    userEmailLogin.addEventListener('input', function () {
        errorMessage.classList.replace('d-block', 'd-none');
    });
    userPasswordLogin.addEventListener('input', function () {
        errorMessage.classList.replace('d-block', 'd-none');
    });

    signinBtn.addEventListener('click', function () {
        var user = {
            email: userEmailLogin.value,
            password: userPasswordLogin.value
            };
        currentUser = getUser(user);

        if (currentUser == 1) {
            errorMessage.textContent = 'This email is not registered. Please sign up first.';
            errorMessage.classList.replace('d-none', 'd-block');
        } else if(currentUser == -1) {
            errorMessage.textContent = 'Incorrect password. Please try again.';
            errorMessage.classList.replace('d-none', 'd-block');
        } else{
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            errorMessage.classList.replace('d-block', 'd-none');
            setTimeout(function () {
                window.location.href = "index.html";
                clearSigninForm();
            }, 1000);
        }
    });

    function clearSigninForm() {
        userEmailLogin.value = '';
        userPasswordLogin.value = '';
    }
}

// ============ HOME ============
if (document.getElementById('homePage')) {
    currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    var navBar = document.getElementById('navBar');
    var homePage = document.getElementById('homePage');

    if (currentUser == null) {
        var modal = document.getElementById('authModal');
        modal.classList.add('d-block','show');
    } else {
        var logoutBtn = document.getElementById('logoutBtn');
        navBar.classList.remove('d-none');
        homePage.classList.remove('d-none');
        welcomeUser.textContent = 'Welcome, ' + currentUser.name;
        logoutBtn.addEventListener('click', function () {
            sessionStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }
}

// ============ HELPERS ============
function getUser(user) {
    for (var i = 0; i < userList.length; i++) {
        if (userList[i].email == user.email) {
            return userList[i].password == user.password ? userList[i] : -1;
        }
    }
    return 1;
}

function isUserExist(email) {
    for (var i = 0; i < userList.length; i++) {
        if (userList[i].email == email) return true;
    }
    return false;
}

// =========== VALIDATION ===========
function isValidUserName(name){
    var regex = /^[A-Za-z\s]{3,}$/;
    return regex.test(name);
}

function isValidEmail(email){
    var regex = /^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

function isValidPassword(password){
    var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(password);
}

function toggleValidation(input,validator){
    if(validator(input.value)){
        input.classList.add('valid');
        input.classList.remove('invalid');
        input.nextElementSibling.classList.add('d-none')
    }else{
        input.classList.add('invalid');
        input.classList.remove('valid');
        input.nextElementSibling.classList.remove('d-none')
    }
}
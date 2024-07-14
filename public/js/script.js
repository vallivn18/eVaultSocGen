   

/*password strength script starts*/
let passwordInput = document.querySelector('#passwordInput input[type="password"]');
let passwordStrength= document.getElementById('passwordStrength');
let poor = document.querySelector('#passwordStrength #poor');
let weak = document.querySelector('#passwordStrength #weak');
let strong = document.querySelector('#passwordStrength #strong');
let passwordInfo = document.getElementById('passwordInfo');

let poorRegExp = /[a-z]/;
let weakRegExp = /(?=.*?[0-9])/;;
let strongRegExp = /(?=.*?[#?!@$%^&*-])/;
let whitespaceRegExp = /^$|\s+/;


passwordInput.oninput= function(){

     let passwordValue= passwordInput.value;
     let passwordLength= passwordValue.length;

     let poorPassword= passwordValue.match(poorRegExp);
     let weakPassword= passwordValue.match(weakRegExp);
     let strongPassword= passwordValue.match(strongRegExp);
     let whitespace= passwordValue.match(whitespaceRegExp);

if(passwordValue != ""){

 passwordStrength.style.display = "block";
 passwordStrength.style.display = "flex";
 passwordInfo.style.display = "block";
 passwordInfo.style.color = "black";

 if(whitespace)
 {
  passwordInfo.textContent = "whitespaces are not allowed";
 }else{
 poorPasswordStrength(passwordLength, poorPassword, weakPassword, strongPassword);
 weakPasswordStrength(passwordLength, poorPassword, weakPassword, strongPassword);
 strongPasswordStrength(passwordLength, poorPassword, weakPassword, strongPassword);
}

 
}else{
 
 passwordStrength.style.display = "none";
 passwordInfo.style.display = "none";

}
}

function poorPasswordStrength(passwordLength, poorPassword, weakPassword, strongPassword){

  if(passwordLength <= 3 && (poorPassword || weakPassword || strongPassword))
    {
   poor.classList.add("active");
   passwordInfo.style.display = "block";
   passwordInfo.style.color = "orangered";
   passwordInfo.textContent = "Weak";
      
    }
}

function weakPasswordStrength(passwordLength, poorPassword, weakPassword, strongPassword){
if(passwordLength>= 4 && poorPassword && (weakPassword || strongPassword))
{
 weak.classList.add("active");
 passwordInfo.textContent = "Medium";
 passwordInfo.style.color = "orange";

}else{
 weak.classList.remove("active");
}
}

function strongPasswordStrength(passwordLength, poorPassword, weakPassword, strongPassword){

if(passwordLength >= 6 && (poorPassword && weakPassword) && strongPassword)
{
 poor.classList.add("active");
 weak.classList.add("active");
 strong.classList.add("active");
 passwordInfo.textContent = "Strong";
 passwordInfo.style.color = "lime";
}else{
 strong.classList.remove("active");
 
}
}

let showHide = document.querySelector('#passwordInput #showHide');

showHide.onclick = function(){
  showHidePassword()
}

function showHidePassword(){
if(passwordInput.type == "password"){
passwordInput.type = "text";
showHide.textContent = "HIDE";
showHide.style.color = "green";
}else{
passwordInput.type = "password";
showHide.textContent = "SHOW";
showHide.style.color = "red";
}
}
/*
function passwordCheck(){
    if(passwordInfo.textContent === "Weak")
        alert("Password authentication failed");
}*/
//confirm
function checkPassword() {  
    var pw1 = document.getElementById("password").value;  
    var pw2 = document.getElementById("confirm_password").value;  
    if(pw1!==pw2){
        alert("Passwords did not match");
        return false;
    }
    else if(passwordInfo.textContent === "Weak"){
        alert("Password is weak");
        return false;
    }
    else{
        document.getElementById('signin').style.display='block';
        document.getElementById('signup').style.display='none'
    }
    return true;  
  }  

/*password strength script ends*/

function handleSuccessfulLogin(user) {
    // Check if the user object exists and has a truthy cname property
    if (user && user.cname) {
      // Clear the browser's back button history
      window.history.replaceState(null, document.title, window.location.href);
    } else {
      // User is not logged in or doesn't have a cname
      console.log("Please log in to access this content.");
      // Perform other actions for non-logged-in users
    }
  }
  

function handleLogin(redirectPath) {
    // Call the function to handle sign-up success
    handleSignInSuccess(document.getElementById('cname').value);
    
    // Call the function to handle the redirection
    signupClicked(redirectPath);
}

// Function to handle successful sign-in
function handleSignInSuccess(username) {
    // Hide sign-in and sign-up buttons
    document.getElementById('btnSignin').style.display = 'none';
    document.getElementById('btnSignup').style.display = 'none';

    // Display welcome label with the username
    const welcomeLabel = document.getElementById('welcome-label');
    welcomeLabel.style.display = 'inline';
    welcomeLabel.innerHTML = `Welcome ${username}!`;

    // Show the logout button
    document.getElementById('btnLogout').style.display = 'inline';
  }

  // Function to reset the UI after sign-out
  function resetUI() {
    document.getElementById('btnSignin').style.display = 'inline';
    document.getElementById('btnSignup').style.display = 'inline';
    document.getElementById('welcome-label').style.display = 'none';
    document.getElementById('btnLogout').style.display = 'none';
  }

  // Function to handle logout
  function handleLogout() {
    // Perform logout logic (clear session, etc.)

    // Reset the UI
    resetUI();
  }
/*
function updateElementVisibility() {
    const sessionDiv = document.getElementById('session');
    const btnSignup = document.querySelector('.btnSignup');
    const btnSignin = document.querySelector('.btnSignin');
    function isUserSignedIn() {
    return signedIn;
  }
    if (isUserSignedIn()) {
      // User is signed in, display #session and hide sign-up/sign-in buttons
      sessionDiv.style.display = 'block';
      btnSignup.style.display = 'none';
      btnSignin.style.display = 'none';
    } else {
      // User is not signed in, hide #session and display sign-up/sign-in buttons
      sessionDiv.style.display = 'none';
      btnSignup.style.display = 'block';
      btnSignin.style.display = 'block';
    }
  }
  
  // Call the function initially when the page loads
  window.onload = updateElementVisibility;*/

  
  

    
      
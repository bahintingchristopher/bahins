
document.addEventListener('DOMContentLoaded', function(){
    const fblink = document.getElementById('fb-link');
    const linkedinLink = document.getElementById('linkedin-link');
    
    if(fblink) {
        fblink.addEventListener('click', function(event){
            event.preventDefault();
            window.location.href = 'https://www.facebook.com/profile.php?id=61579616556378';
        });
    }


    if(linkedinLink) {
        linkedinLink.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = 'https://www.linkedin.com/in/cbahinting/';
        });
    }

    });
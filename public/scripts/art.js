document.getElementById("art-form").onsubmit = function() {
    clearErrors();
    let isValid = true;

    let color = document.getElementById("color").value;
    let box = document.getElementById("box").value;
    let artist = document.getElementById("artist").value;

    if (color == "") {
        let errSpan = document.getElementById("err-color");
        errSpan.style.display = "inline";
        isValid = false;
    }

    if (box == "" || box > 100 || box < 1) {
        let errSpan = document.getElementById("err-box");
        errSpan.style.display = "inline";
        isValid = false;
    }

    if (artist == "") {
        let errSpan = document.getElementById("err-name");
        errSpan.style.display = "inline";
        isValid = false;
    }

    return isValid;
}

// clear all errors from the page
function clearErrors() {
    let errors = document.getElementsByClassName("err");

    for (let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}
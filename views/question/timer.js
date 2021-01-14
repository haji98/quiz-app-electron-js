
var timer = 300;
var min = 0;
var sec = 0;

function startTimer() {
    min = parseInt(timer / 60);
    sec = parseInt(timer % 60);
 console.log(timer)

    if (timer < 1) {
        window.location = "result.html"
    }
    document.getElementById("timer").innerHTML = min.toString() + ":" + sec.toString();
    timer--;
    console.log("timer-- = " + timer--)
    setTimeout(function() {
        startTimer();
       
    }, 1000);

}


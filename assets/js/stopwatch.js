var handle_time = {
    /* [INIT] */
    etime : null, // holds HTML time display
    erst : null, // holds HTML reset button
    ego : null, // holds HTML start/stop button
    timer : null, // timer object
    now : 0, // current timer
    ticking: false,
    init : function () {
      // Get HTML elements
      handle_time.etime = document.getElementById("handle_time-time");
      handle_time.erst = document.getElementById("handle_time-rst");
      handle_time.ego = document.getElementById("handle_time-go");
  
      // Attach listeners
      handle_time.erst.addEventListener("click", handle_time.reset);
      handle_time.erst.disabled = true;
      handle_time.ego.addEventListener("click", handle_time.start);
      handle_time.ego.disabled = false;
      if(handle_time.ticking){
        handle_time.etime.classList.add("blink");
        clearInterval(handle_time.timer);
        handle_time.start();
      }else if(handle_time.now>-1){
          handle_time.now--;
          handle_time.tick();
      }
    },
  
    /* [ACTIONS] */
    tick : function () {
    // tick() : update display if stopwatch running
  
      // Calculate hours, mins, seconds
      handle_time.now++;
      var remain = handle_time.now;
      var hours = Math.floor(remain / 3600);
      remain -= hours * 3600;
      var mins = Math.floor(remain / 60);
      remain -= mins * 60;
      var secs = remain;
  
      // Update the display timer
      if (hours<10) { hours = "0" + hours; }
      if (mins<10) { mins = "0" + mins; }
      if (secs<10) { secs = "0" + secs; }
      handle_time.etime.innerHTML = hours + ":" + mins + ":" + secs;
    },
  
    start : function () {
    // start() : start the stopwatch
      console.log("timestart");
      
      handle_time.timer = setInterval(handle_time.tick, 1000);
      handle_time.ego.innerHTML = "Stop Call";
      handle_time.etime.classList.add("blink");
      handle_time.ego.removeEventListener("click", handle_time.start);
      handle_time.ego.addEventListener("click", handle_time.stop);
      handle_time.ticking=true;
    },
  
    stop  : function () {
    // stop() : stop the stopwatch
  
      clearInterval(handle_time.timer);
      handle_time.timer = null;
      handle_time.erst.disabled = false;
      handle_time.ego.innerHTML = "Start Call";
      handle_time.etime.classList.remove("blink");
      handle_time.ego.removeEventListener("click", handle_time.stop);
      handle_time.ego.addEventListener("click", handle_time.start);
      handle_time.ticking=false;
    },
  
    reset : function () {
    // reset() : reset the stopwatch
      console.log("reset");
      // Stop if running
      if (handle_time.timer != null) { handle_time.stop(); }
  
      // Reset time
      handle_time.now = -1;
      handle_time.tick();
    }
};

var hold_time = {
    /* [INIT] */
    etime : null, // holds HTML time display
    erst : null, // holds HTML reset button
    ego : null, // holds HTML start/stop button
    timer : null, // timer object
    now : 0, // current timer
    ticking: false,
    init : function () {
      // Get HTML elements
      hold_time.etime = document.getElementById("hold_time-time");
      hold_time.erst = document.getElementById("hold_time-rst");
      hold_time.ego = document.getElementById("hold_time-go");
  
      // Attach listeners
      hold_time.erst.addEventListener("click", hold_time.reset);
      hold_time.erst.disabled = true;
      hold_time.ego.addEventListener("click", hold_time.start);
      hold_time.ego.disabled = false;
      if(hold_time.ticking){
        hold_time.etime.classList.add("blink");
        clearInterval(hold_time.timer);
        hold_time.start();
      }else if(hold_time.now>-1){
        hold_time.now--;
        hold_time.tick();
      }
    },
  
    /* [ACTIONS] */
    tick : function () {
    // tick() : update display if stopwatch running
  
      // Calculate hours, mins, seconds
      hold_time.now++;
      var remain = hold_time.now;
      var hours = Math.floor(remain / 3600);
      remain -= hours * 3600;
      var mins = Math.floor(remain / 60);
      remain -= mins * 60;
      var secs = remain;
  
      // Update the display timer
      if (hours<10) { hours = "0" + hours; }
      if (mins<10) { mins = "0" + mins; }
      if (secs<10) { secs = "0" + secs; }
      hold_time.etime.innerHTML = hours + ":" + mins + ":" + secs;
    },
  
    start : function () {
    // start() : start the stopwatch
        console.log("timestart");
      hold_time.timer = setInterval(hold_time.tick, 1000);
      hold_time.ego.innerHTML = "Stop Hold";
      hold_time.etime.classList.add("blink");
      hold_time.ego.removeEventListener("click", hold_time.start);
      hold_time.ego.addEventListener("click", hold_time.stop);
      hold_time.ticking=true;
    },
  
    stop  : function () {
    // stop() : stop the stopwatch
  
      clearInterval(hold_time.timer);
      hold_time.timer = null;
      hold_time.erst.disabled = false;
      hold_time.ego.innerHTML = "Start Hold";
      hold_time.etime.classList.remove("blink");
      hold_time.ego.removeEventListener("click", hold_time.stop);
      hold_time.ego.addEventListener("click", hold_time.start);
      hold_time.ticking=false;
    },
  
    reset : function () {
    // reset() : reset the stopwatch
  
      // Stop if running
      if (hold_time.timer != null) { hold_time.stop(); }
  
      // Reset time
      hold_time.now = -1;
      hold_time.tick();
    }
};
// https://createjs.com/#!/TweenJS/demos/sparkTable
            // https://createjs.com/Docs/TweenJS/modules/TweenJS.html
            // view-source:https://createjs.com/Demos/EaselJS/Game.html COPY THIS
            var server="https://ph-wings.herokuapp.com";
            //var server="10.54.107.186";
            
            var stage, w, h, loader, pipe1height, pipe2height, pipe3height, startX, startY, wiggleDelta;
            var background, background2, bird, ground, pipe, bottomPipe, pipes, rotationDelta, counter, counterOutline;
            var question, questionOutline, randomQ, pipeIndex, countTop=false;
            var easyLevel=40;
            var moderateLevel=70;
            var hardLevel=90;
            var easyQuestions=[];
            var moderateQuestions=[];
            var hardQuestions=[];
            var allQuestions=[];
            var questiontimer, questiontimertext, questiontimertextoutline, countdowntext=10;
            var started = false; 
            var startJump = false; // Has the jump started?
            var sounds={
                jump:new Audio('/assets/audio/arlee/wing.ogg'),
                score:new Audio('/assets/audio/arlee/point.ogg'),
                hit:new Audio('/assets/audio/arlee/hit.ogg'),
            };
            var evening=false;
            
            var jumpAmount = 120; // How high is the jump?
            var jumpTime = 266;

            var paused = false;
            var dead = false; // is the bird dead?
            var KEYCODE_SPACE = 32;     //usefull keycode
            const initialGap=300;
            const initialPipeDelay=100;




            var gap = initialGap;
            var masterPipeDelay = initialPipeDelay; // delay between pipes
            var pipeDelay = masterPipeDelay; //counter used to monitor delay

            var counterShow = false;

            document.onkeydown = handleKeyDown;

            function shuffleArray(array) {
                for (var i = array.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }

            function saveScore(ces,score){
                //console.log("in save score");
                checkScore(ces,function(found){
                    //console.log(found);
                    if(found==1){
                        var data={
                            arlee_CES:ces,
                            arlee_score:score,
                            arlee_CN:user_CN,
                            update:true
                        }
                    }else if(found==2){
                        var data={
                            arlee_CES:ces,
                            arlee_score:score,
                            arlee_CN:user_CN,
                            update:false
                        }
                    }
                    if(found){
                        $.ajax({
                            type:"POST",
                            url:"/api/arlee/savescore" ,
                            data:JSON.stringify(data),
                            headers:{
                                "Content-Type":"application/json"
                            },
                            //dataType:"json",
                            success:function(data){
                                console.log(data);
                                showTopScores();
                            },
                            error: function(xhr, status, error) {
                               console.log(status);
                               console.log(error);
                              }
                        });
                    }else{
                        showTopScores();
                    }
                })
            }

            function showTopScores(){
                var topscoretext="" ;
                
                $.ajax({
                    type:"GET",
                    url:"/api/arlee/scores",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    //dataType:"json",
                    success:function(data){
                        //console.log(data);
                        var topscore_counter=0;
                        data.data.forEach(function(score){
                            var spacer="";
                            if(topscore_counter>15)
                                return;
                            //console.log(score.arlee_score.toString().length);
                            //console.log(toString(score.arlee_score).length);
                            for(i=0;i<3-parseInt(score.arlee_score.toString().length);i++){
                                spacer+=" ";
                            }
                            //console.log(spacer);
                            topscoretext+=spacer + score.arlee_score+" "+score.arlee_CN + "\n\n";
                            topscore_counter++
                        })
                        topscorebg = new createjs.Bitmap(loader.getResult("topscorebg"));

                        topscorebg.x = w/2 - topscorebg.image.width/2;
                        topscorebg.y = 150;
                        topscorebg.alpha = 1;
        
                        topscoreLabel = new createjs.Text("TOP SCORES", "30px Verdana", "#ffffff");
                        topscore = new createjs.Text(topscoretext, "24px Lucida console", "#ffffff");
                        topscoreOutline = new createjs.Text(topscoretext, "24px Lucida console", "#000000");
        
                        topscoreLabel.textAlign = 'center'
                        topscoreLabel.x = w/2
                        topscoreLabel.y = 170
                        topscoreLabel.alpha = 1

                        topscore.textAlign = 'left'
                        topscore.x = 80
                        topscore.y = 220
                        topscore.alpha = 1
                        topscoreOutline.x = topscore.x + 1
                        topscoreOutline.y = topscore.y + 1
                        topscoreOutline.alpha = 1
        
        
        
                        stage.addChild(topscorebg,topscoreLabel,topscoreOutline,topscore,start);
                    },
                    error:function(error){
                        //console.log(error);
                    }
                })


            }

            function checkScore(ces,callback){
                //console.log(agentid);
                //console.log(date);
                //console.log("in check score");
                $.ajax({
                    type:"GET",
                    url:"/api/arlee/scores",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    //dataType:"json",
                    success:function(data){
                        console.log(data.data);
                        var found = data.data.filter(function(item){ return item.arlee_CES==ces});
                        if(found.length>0){
                            if(found[0].arlee_score<=counter.text){
                                if(callback){
                                    callback(1);
                                }    
                            }else{
                                if(callback){
                                    callback(0);
                                }
                            }
                        }else{
                            if(callback){
                                callback(2);
                            }
                        }
                    },
                    error:function(error){
                        console.log(error);
                    }
                })
            }

            function init() {
                //console.log("in init");
                //return;
				arleeloaded=false;
                if (window.top != window) {
                    //document.getElementById("header").style.display = "none";
                }


                // createjs.MotionGuidePlugin.install();

                stage = new createjs.Stage("testCanvas");

                createjs.Touch.enable(stage);
                // stage.canvas.width = document.body.clientWidth; //document.width is obsolete
                // stage.canvas.height = document.body.clientHeight; //document.height is obsolete
                
                // grab canvas width and height for later calculations:
                w = stage.canvas.width;
                h = stage.canvas.height;

                manifest = [
                    {src:"/assets/img/arlee/bird.png", id:"bird"},
                    {src:"/assets/img/arlee/background.png", id:"background"},
                    {src:"/assets/img/arlee/background-evening.png", id:"backgroundevening"},
                    {src:"/assets/img/arlee/ground.png", id:"ground"},
                    {src:"/assets/img/arlee/pipe.png", id:"pipe"},
                    {src:"/assets/img/arlee/restart.png", id:"start"},
                    {src:"/assets/img/arlee/share.png", id:"share"},
                    {src:"/assets/img/arlee/questionbg.png", id:"questionbg"},
                    {src:"/assets/img/arlee/topscorebg.png", id:"topscorebg"},
                    {src:"/assets/fonts/FB.eot"},
                    //{src:"/assets/fonts/FB.svg"},
                    {src:"/assets/fonts/FB.ttf"},
                    {src:"/assets/fonts/FB.woff"}
                ];

                loader = new createjs.LoadQueue(false);
                loader.addEventListener("complete", handleComplete);
                loader.loadManifest(manifest);
                $.get('/api/trivia/get/E',function(questions){
                        questions.data.forEach(function(question){
                            var optionsArray=question.questions_options.split(",");
                            shuffleArray(optionsArray);
                            easyQuestions.push({question:question.questions_text,options:optionsArray,product:question.questions_device});
                        })
                })
                $.get('/api/trivia/get/M',function(questionsM){
                    questionsM.data.forEach(function(question){
                        var optionsArray=question.questions_options.split(",");
                        shuffleArray(optionsArray);
                        moderateQuestions.push({question:question.questions_text,options:optionsArray,product:question.questions_device});
                    })
                })
                $.get('/api/trivia/get/H',function(questionsH){
                    questionsH.data.forEach(function(question){
                        var optionsArray=question.questions_options.split(",");
                        shuffleArray(optionsArray);
                        hardQuestions.push({question:question.questions_text,options:optionsArray,product:question.questions_device});
                    })
                })
            }

            function handleComplete() {
				arleeloaded=true;
                //console.log("complete");
				
				//$('#arleeloading').css('display','none');
				//$('#testCanvas').css('display','block');
                background = new createjs.Shape();
                background.graphics.beginBitmapFill(loader.getResult("background")).drawRect(0,0,w,h);
                background2 = new createjs.Shape();
                background2.graphics.beginBitmapFill(loader.getResult("backgroundevening")).drawRect(0,0,w,h);

                var groundImg = loader.getResult("ground");
                ground = new createjs.Shape();
                ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, w+groundImg.width, groundImg.height);
                ground.tileW = groundImg.width;
                ground.y = h-groundImg.height;
                
            
                var data = new createjs.SpriteSheet({
                    "images": [loader.getResult("bird")],
                    //set center and size of frames, center is important for later bird roation
                    "frames": {"width": 92, "height": 64, "regX": 46, "regY": 32, "count": 3}, 
                    // define two animations, run (loops, 0.21x speed) and dive (returns to dive and holds frame one static):
                    "animations": {"fly": [0, 2, "fly", 0.21], "dive": [1, 1, "dive", 1]}
                });
                bird = new createjs.Sprite(data, "fly");

                startX = (w/2) - (92/2)
                startY = 512
                wiggleDelta = 18

                // Set initial position and scale 1 to 1
                bird.setTransform(startX, startY, 1, 1);
                // Set framerate
                bird.framerate = 30;

                //338, 512
                // Use a tween to wiggle the bird up and down using a sineInOut Ease
                createjs.Tween.get(bird, {loop:true}).to({y:startY + wiggleDelta}, 380, createjs.Ease.sineInOut).to({y:startY}, 380, createjs.Ease.sineInOut);

                stage.addChild(background2);
                stage.addChild(background);

                pipes = new createjs.Container(); 
                stage.addChild(pipes)

                stage.addChild(bird, ground);
                stage.addEventListener("stagemousedown", handleJumpStart);
                
                counter = new createjs.Text(0, "86px 'Flappy Bird'", "#ffffff");
                counterOutline = new createjs.Text(0, "86px 'Flappy Bird'", "#000000");
                counterOutline.outline = 5
                counterOutline.textAlign = 'center'
                counter.textAlign = 'center'
                counterOutline.x = w/2
                counterOutline.y = 50
                counter.x = w/2
                counter.y = 50
                counter.alpha = 1
                counterOutline.alpha = 1
                stage.addChild(counter, counterOutline)

                createjs.Ticker.timingMode = createjs.Ticker.RAF;
                createjs.Ticker.addEventListener("tick", tick);
            }

            function handleKeyDown(e) {
                //cross browser issues exist
                if((arleeopen)&&(!paused)){
                    if(!e){ var e = window.event; }
                    switch(e.keyCode) {
                        case KEYCODE_SPACE: handleJumpStart();
                    }
                }
                if((arleeopen)&&(paused)){
                    if(!e){ var e = window.event; }
                    if((e.keyCode<53)&&(e.keyCode>48)){
                        clearTimeout(questiontimer);
                        stage.removeChild(questionbg);
                        stage.removeChild(question);
                        stage.removeChild(questionOutline);
                        stage.removeChild(questiontimertext);
                        stage.removeChild(questiontimertextoutline);
                        
                        
                        
                        var answer;
                        if(parseInt(counter.text)<easyLevel){
                            countdowntext=10;
                            answer=easyQuestions[randomQ].answer;
                            easyQuestions.splice(randomQ,1);
                        }else if(parseInt(counter.text)<moderateLevel){
                            countdowntext=12;
                            answer=moderateQuestions[randomQ].answer;
                            moderateQuestions.splice(randomQ,1);
                        }else{
                            countdowntext=15;
                            answer=hardQuestions[randomQ].answer;
                            hardQuestions.splice(randomQ,1);
                        }
                        if(e.keyCode-48==answer){
                            //console.log("correct");
                            continueGame();
                        }else{
                            //console.log("incorrect");
                            paused=false;
                            die();
                        }
                    }
                }
            }

            function handleJumpStart() {
                if ((!dead)&&(!paused)) {
                    createjs.Tween.removeTweens ( bird )
                    bird.gotoAndPlay("jump");
                    startJump = true
                    //console.log(sounds);
                    sounds.jump.play();
                    if (!started) {
                        started = true
                        counterShow = true                        
                    }
                }
            }

            function diveBird() {
                bird.gotoAndPlay("dive");
            }

            function restart() {
                easyQuestions=[];
                moderateQuestions=[];
                hardQuestions=[];
                //hide anything on stage and show the score
                $.get('/api/trivia/get/E',function(questions){
                    questions.data.forEach(function(question){
                        var optionsArray=question.questions_options.split(",");
                        shuffleArray(optionsArray);
                        easyQuestions.push({question:question.questions_text,options:optionsArray,product:question.questions_device});
                    })
                })
                $.get('/api/trivia/get/M',function(questionsM){
                    questionsM.data.forEach(function(question){
                        var optionsArray=question.questions_options.split(",");
                        shuffleArray(optionsArray);
                        moderateQuestions.push({question:question.questions_text,options:optionsArray,product:question.questions_device});
                    })
                })
                $.get('/api/trivia/get/H',function(questionsH){
                    questionsH.data.forEach(function(question){
                        var optionsArray=question.questions_options.split(",");
                        shuffleArray(optionsArray);
                        hardQuestions.push({question:question.questions_text,options:optionsArray,product:question.questions_device});
                    })
                })
                background.alpha=1;
                paused=false;
                stage.removeChild(start);
                stage.removeChild(topscorebg);
                stage.removeChild(topscore);
                stage.removeChild(topscoreOutline);
                stage.removeChild(topscoreLabel);

                pipes.removeAllChildren();
                createjs.Tween.get(start).to({y:start.y + 10}, 50).call(removeStart)
                counter.text = 0
                counterOutline.text = 0
                counterOutline.alpha = 0
                counter.alpha = 0
                counterShow = false
                gap = initialGap;
                masterPipeDelay = initialPipeDelay;
                pipeDelay = masterPipeDelay
                dead = false
                started = false
                startJump = false
                createjs.Tween.removeTweens ( bird )
                bird.x = startX
                bird.y = startY
                bird.rotation = 0
                createjs.Tween.get(bird, {loop:true}).to({y:startY + wiggleDelta}, 380, createjs.Ease.sineInOut).to({y:startY}, 380, createjs.Ease.sineInOut);
            }

            function die() {

                saveScore(user_CES,counter.text);

                //console.log("in die")
                
                dead = true
                bird.gotoAndPlay("dive");
                createjs.Tween.removeTweens ( bird )
                createjs.Tween.get(bird).wait(0).to({y:bird.y + 200, rotation: 90}, (380)/1.5, createjs.Ease.linear) //rotate back
                        .call(diveBird) // change bird to diving position
                        .to({y:ground.y - 30}, (h - (bird.y+200))/1.5, createjs.Ease.linear); //drop to the bedrock
                createjs.Tween.get(stage).to({alpha:0}, 100).to({alpha:1}, 100)
                start = new createjs.Bitmap(loader.getResult("start"));
                start.alpha = 0
                start.x = w/2 - start.image.width/2
                start.y = 4
                share = new createjs.Bitmap(loader.getResult("share"));
                share.alpha = 0
                share.x = w/2 - share.image.width/2
                share.y = h/2 - share.image.height/2 - 50

                
                //stage.addChild(share)
                createjs.Tween.get(start).to({alpha:1, y: start.y + 50}, 400, createjs.Ease.sineIn).call(addClickToStart)
                createjs.Tween.get(share).to({alpha:1, y: share.y + 50}, 400, createjs.Ease.sineIn).call(addClickToStart)
                
            }

            function continueGame(){
                //console.log(pipeIndex);
                pipe = pipes.getChildAt(pipeIndex);
                if(pipe.rotation==0){
                    countTop=true;
                } else {
                    countTop=false;
                }
                pipes.removeChild(pipe);
                
                
                paused=false;
                createjs
                    .Tween
                    .get(bird)
                    .to({y:bird.y - rotationDelta, rotation: -20}, rotationDelta, createjs.Ease.linear) //rotate to jump position and jump bird
                    .to({y:bird.y - jumpAmount, rotation: -20}, jumpTime - rotationDelta, createjs.Ease.quadOut) //rotate to jump position and jump bird
                    .to({y:bird.y}, jumpTime, createjs.Ease.quadIn) //reverse jump for smooth arch
                    .to({y:bird.y + 200, rotation: 90}, (380)/1.5, createjs.Ease.linear) //rotate back
                    .call(diveBird) // change bird to diving position
                    .to({y:ground.y - 30}, (h - (bird.y+200))/1.5, createjs.Ease.linear); //drop to the bedrock
            }

            function trivia() {
                if(easyQuestions.length<1){
                    paused=false;
                    die();
                    return;
                }
                //console.log(Object.keys(questions).length)
                randomQ=Math.floor(Math.random()*(allQuestions).length);
                //console.log(counter.text);
                //dead = true
                //bird.gotoAndPlay("dive");
                //createjs.Tween.removeTweens ( bird )
                //createjs.Tween.get(bird).wait(0).to({y:bird.y + 200, rotation: 90}, (380)/1.5, createjs.Ease.linear) //rotate back
                //        .call(diveBird) // change bird to diving position
                //        .to({y:ground.y - 30}, (h - (bird.y+200))/1.5, createjs.Ease.linear); //drop to the bedrock
                //createjs.Tween.get(stage).to({alpha:0}, 100).to({alpha:1}, 100)
                if(parseInt(counter.text)<easyLevel){
                    randomQ=Math.floor(Math.random()*(easyQuestions).length);
                    var questiontext=easyQuestions[randomQ].product + " Question:\n" + easyQuestions[randomQ].question + "\n";
                    //console.log(easyQuestions[randomQ].options);
                    easyQuestions[randomQ].options.forEach(function(element, index){
                        if(element.charAt(0)=='#'){
                            questiontext+="\n" + (index+1) +". " + element.replace('&#44;',',').slice(1)
                            easyQuestions[randomQ].answer=index+1;
                        }else{
                            questiontext+="\n" + (index+1) +". " + element.replace('&#44;',',');
                        }
                    })
                }else if (parseInt(counter.text)<moderateLevel){
                    randomQ=Math.floor(Math.random()*(moderateQuestions).length);
                    var questiontext=moderateQuestions[randomQ].product + " Question:\n" + moderateQuestions[randomQ].question + "\n";
                    //console.log(moderateQuestions[randomQ].options);
                    moderateQuestions[randomQ].options.forEach(function(element, index){
                        if(element.charAt(0)=='#'){
                            questiontext+="\n" + (index+1) +". " + element.replace('&#44;',',').slice(1)
                            moderateQuestions[randomQ].answer=index+1;
                        }else{
                            questiontext+="\n" + (index+1) +". " + element.replace('&#44;',',');
                        }
                    })

                }else {
                    randomQ=Math.floor(Math.random()*(hardQuestions).length);
                    var questiontext=hardQuestions[randomQ].product + " Question:\n" + hardQuestions[randomQ].question + "\n";
                    //console.log(hardQuestions[randomQ].options);
                    hardQuestions[randomQ].options.forEach(function(element, index){
                        if(element.charAt(0)=='#'){
                            questiontext+="\n" + (index+1) +". " + element.replace('&#44;',',').slice(1)
                            hardQuestions[randomQ].answer=index+1;
                        }else{
                            questiontext+="\n" + (index+1) +". " + element.replace('&#44;',',');
                        }
                    })
                }


              
                bird.stop();
                question = new createjs.Text(questiontext, "24px Verdana", "#ffffff");
                questionOutline = new createjs.Text(questiontext, "24px Verdana", "#000000");
                questiontimertext = new createjs.Text(countdowntext, "48px 'Flappy Bird'", "#ffffff");
                questiontimertextoutline = new createjs.Text(countdowntext, "48px 'Flappy Bird'", "#000000");
                
                questiontimertext.x = 722;
                questiontimertext.y = 614;
                questiontimertext.alpha = 1
                questiontimertext.textAlign = 'right'

                questiontimertextoutline.outline=5
                questiontimertextoutline.x = 722;
                questiontimertextoutline.y = 614;
                questiontimertextoutline.alpha = 1
                questiontimertextoutline.textAlign = 'right'

                question.textAlign = 'left'
                question.x = 65
                question.y = 250
                question.alpha = 1
                questionOutline.alpha = 1
                questionbg = new createjs.Bitmap(loader.getResult("questionbg"));
                questionbg.x = 35
                questionbg.y = 220
                questionbg.alpha = 1
                stage.addChild(questionbg,question,questiontimertext,questiontimertextoutline)
                //console.log('in trivia');
                countDown(countdowntext);
/*              
                start = new createjs.Bitmap(loader.getResult("start"));
                start.alpha = 0
                start.x = w/2 - start.image.width/2
                start.y = h/2 - start.image.height/2 - 150
                share = new createjs.Bitmap(loader.getResult("share"));
 
                stage.addChild(start)
                //stage.addChild(share)
                createjs.Tween.get(start).to({alpha:1, y: start.y + 50}, 400, createjs.Ease.sineIn).call(addClickToStart)
                createjs.Tween.get(share).to({alpha:1, y: share.y + 50}, 400, createjs.Ease.sineIn).call(addClickToStart)
             */   
            }

            function countDown(num){
                questiontimertext.text=num;
                questiontimertextoutline.text=num;
                if(num){
                    questiontimer=setTimeout(function(){countDown(num-1)},1000);
                }else{
                    paused=false;
                    die();
                        
                    clearTimeout(questiontimer);
                    stage.removeChild(questionbg);
                    stage.removeChild(question);
                    stage.removeChild(questionOutline);
                    stage.removeChild(questiontimertext);
                    stage.removeChild(questiontimertextoutline);
                    allQuestions.splice(randomQ,1);
                    countdowntext=10;
                }
            }

            function removeStart() {
                stage.removeChild(start)
                stage.removeChild(share)
            }
            function addClickToStart() {
                start.addEventListener("click", restart);
                share.addEventListener("click", goShare);
            }

            function goShare() {
                var countText
                if (counter.text == 1) {
                    countText = "1 point"
                } else {
                    countText = counter.text + " points"
                }
                window.open("https://twitter.com/share?url=http%3A%2F%2Fappcycle.me/flappy&text=I scored " + countText +  " on HTML5 Flappy Bird.");
            }

            function tick(event) {
                //console.log("in tick");
                var deltaS = event.delta/1000;

                var l = pipes.numChildren;

                if (bird.y > (ground.y - 40)) {
                    if (!dead) {
                        die()
                    }
                    if (bird.y > (ground.y - 30)) {
                        createjs.Tween.removeTweens ( bird )
                    }
                }
                
                
            
                if (paused) {
                    ground.x = ground.x;
                } else if (!dead) {
                    ground.x = (ground.x-deltaS*300) % ground.tileW;
                }

                if (started && !dead && !paused) {

                    if (pipeDelay == 0) {
                        
                        pipe = new createjs.Bitmap(loader.getResult("pipe"));
                        pipe.x = w+600
                        pipe.y = (ground.y - gap*2) * Math.random() + gap*1.5
                        pipes.addChild(pipe);
                        // createjs.Tween.get(pipe).to({x:0 - pipe.image.width}, 5100)

                        pipe2 = new createjs.Bitmap(loader.getResult("pipe"));
                        pipe2.scaleX = -1
                        pipe2.rotation = 180
                        pipe2.x = pipe.x //+ pipe.image.width
                        pipe2.y = pipe.y - gap
                        // createjs.Tween.get(pipe2).to({x:0 - pipe.image.width}, 5100)

                        pipes.addChild(pipe2);

                        pipeDelay = masterPipeDelay

                    } else {
                        pipeDelay = pipeDelay - 1
                    }
                    for(var i = 0; i < l; i++) {
                        pipe = pipes.getChildAt(i);
                        if (pipe) {
                            if (true) { // tried replacing true with this, but it's off: pipe.x < bird.x + 92 && pipe.x > bird.x 
                                var collision = ndgmr.checkRectCollision(pipe,bird,1,true)
                                if (collision) {
                                    if (collision.width > 8 && collision.height > 8) {
                                        //console.log("hit");
                                        sounds.hit.play();
                                        paused=true;
                                        pipeIndex=i;
                                        trivia();
                                        //pause here
                                        //die()
                                        //play();
                                    }
                                }
                            }
                            pipe.x = (pipe.x - deltaS*300);
                            if (pipe.x <= 338 && pipe.rotation == 0 && pipe.name != "counted" && !countTop) {
                                sounds.score.play();
                                pipe.name = "counted" //using the pipe name to count pipes
                                counter.text = counter.text + 1
                                counterOutline.text = counterOutline.text + 1
                                countTop=false;
                            } else if (pipe.x <= 338 && pipe.rotation == 180 && pipe.name != "counted" && countTop) {
                                sounds.score.play();
                                pipe.name = "counted" //using the pipe name to count pipes
                                counter.text = counter.text + 1
                                counterOutline.text = counterOutline.text + 1
                                countTop=false;
                            }
                            if (pipe.x + pipe.image.width <= -pipe.w) { 
                                pipes.removeChild(pipe)
                                
                            }
                        }
                    }
                    if (counterShow) {
                        counter.alpha = 1
                        counterOutline.alpha = 1
                        counterShow = false
                    }

                }
                //console.log(counter.text==10);
                if(counter.text>=20){
                    masterPipeDelay=95;
                    
                }

                if(counter.text>=30){
                    gap=275;
                    masterPipeDelay=91;
                }

                if(counter.text>=50){
                    gap=250;
                    masterPipeDelay=87;
                }
                //console.log(gap);

                if((counter.text>=100)&&(background.alpha>=0)){
                    background.alpha=background.alpha-0.01;
                }
                if(paused){
                    createjs.Tween.removeTweens ( bird )
                }

                if ((startJump == true)&&(!paused)) {
                    startJump = false
                    bird.framerate = 60;
                    bird.gotoAndPlay("fly");
                    if (bird.roation < 0) {
                        rotationDelta = (-bird.rotation - 20)/5
                    } else {
                        rotationDelta = (bird.rotation + 20)/5
                    }
                    if (bird.y < -200) {
                        bird.y = -200
                    }
                    if(!paused){
                        createjs
                            .Tween
                            .get(bird)
                            .to({y:bird.y - rotationDelta, rotation: -20}, rotationDelta, createjs.Ease.linear) //rotate to jump position and jump bird
                            .to({y:bird.y - jumpAmount, rotation: -20}, jumpTime - rotationDelta, createjs.Ease.quadOut) //rotate to jump position and jump bird
                            .to({y:bird.y}, jumpTime, createjs.Ease.quadIn) //reverse jump for smooth arch
                            .to({y:bird.y + 200, rotation: 90}, (380)/1.5, createjs.Ease.linear) //rotate back
                            .call(diveBird) // change bird to diving position
                            .to({y:ground.y - 30}, (h - (bird.y+200))/1.5, createjs.Ease.linear); //drop to the bedrock
                    }
                }

                
                stage.update(event);
            }
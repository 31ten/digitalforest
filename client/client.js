window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

Template.body.onCreated(function() {

  if (window.mobilecheck()) return;
  Meteor.subscribe("trees");
  Meteor.subscribe("squares");
});

Template.body.helpers({
    trees: function () {
        return Trees.find({}, {sort: {createdAt: 1}});
    },
    trees_count: function () {
        var trees_count = Trees.find().count();
        if(trees_count == 1 || trees_count == 0){
            var name = "tree"
        }else{
            var name = "trees"
        }

        return {
            name:name,
            count:trees_count
        };
    }
});



Meteor.startup(function() {
    function generate_uid() {
        var result, i, j;
        result = '';
        for(j=0; j<32; j++) {
            if( j == 8 || j == 12|| j == 16|| j == 20)
                result = result + '-';
            i = Math.floor(Math.random()*16).toString(16).toUpperCase();
            result = result + i;
        }
        return result;
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
        }
        return "";
    }

    function generate_tree_id () {
        if(getCookie("tree_session_id") != ""){
            //cookie already exists, get the id
            var session_id = getCookie("tree_session_id");
            console.log("cookie exists, take the tree_session_id :"+session_id);
        }else{
            // generate a unique sesssion id client and store it on the cookies
            var session_id = generate_uid();
            //store it on cookie
            setCookie("tree_session_id",session_id,1);
            console.log("no cookie, generate a tree_session_id :"+session_id);
        }
        return session_id;
    }

    var session_id = generate_tree_id();


    var d = document.getElementById("main_wrapper");
    if(window.mobilecheck()){
        //mobile, hide big canvas
        d.className =  "mobile_view";
    }else{
        d.className =  "desktop_view";
    }


    var drawing_can = document.getElementById('drawing_can');
    var drawing_ctx = drawing_can.getContext("2d");
    drawing_ctx.lineJoin = "round";

    var display_can = document.getElementById('display_can');
    var display_ctx = display_can.getContext("2d");
    display_ctx.lineJoin = "round";
    var paint;

    function canvasResize (){
        var w = window.innerWidth;
        var h = window.innerHeight;
        display_can.setAttribute('width', w-50);
        drawing_can.setAttribute('width', w);
        display_can.setAttribute('height', h-50);
    }

    canvasResize ();
    window.onresize = function(event) {
        //canvasResize ();
    };


    function erase_all() {
        // Clears the canvas
        drawing_ctx.clearRect(0, 0, drawing_ctx.canvas.width, drawing_ctx.canvas.height);
        display_ctx.clearRect(0, 0, display_ctx.canvas.width, display_ctx.canvas.height);
        Meteor.call("removeAllTrees");
    }

    function erase_tree() {
        drawing_ctx.clearRect(0, 0, drawing_ctx.canvas.width, drawing_ctx.canvas.height);
      console.log(session_id);
        Meteor.call("removeTree",session_id);
    }

    function clean_display() {
        display_ctx.clearRect(0, 0, display_ctx.canvas.width, display_ctx.canvas.height);
    }


    function mouseDownEventHandler(e) {
        console.log("mouseDownEventHandler");
        paint = true;
        if (paint) {
        }
    }

    function touchstartEventHandler(e) {
        // Prevents menu bar from moving when drawing on Android
        e.preventDefault();
        console.log("touchstartEventHandler");
        paint = true;
        if (paint) {
        }
    }

    function mouseUpEventHandler(e) {
        console.log("mouseUpEventHandler");
        drawing_ctx.closePath();
        line.from = {};
        line.to = {};
        paint = false;
    }

    var treshold_pixels = 0;
    var nb_pixels = 0;
    var draw_from = 1;
    var start_drawing = 1;
    var reduction_param = 3;

    var line = {};
    line.from = {};
    line.to = {};

    function createLine(e,canvas,callback){
        if(nb_pixels > treshold_pixels || start_drawing == 1){
            start_drawing = 0;

            if(!e.pageX && !e.pageY) {
                var x = e.touches[0].pageX - canvas.offsetLeft;
                var y = e.touches[0].pageY - canvas.offsetTop;
            }else{
                var x = e.pageX - canvas.offsetLeft;
                var y = e.pageY - canvas.offsetTop;
            }


            if (paint) {
                if(draw_from == 1){
                    line.from = {x:x,y:y};
                    draw_from = 0;
                }else{
                    line.to = {x:x,y:y};
                    draw_from = 1;
                }
                if(line.from.x && line.to.x){
                    //console.log("Line added!");

                    //color
                    var colors_grass = ['#317810','#6c7e44','#3c8126','#539639','#659233'];
                    var colors_wood = ['#876035','#674021','#ba7b1e','#64381f','#f3bd63'];
                    //var colors_leafs = ['#c7350c','#d27029','#cf4030','#da9f1f','#767f30','#788c1b','#375C17','#5B8C17','#5B8C170','#043C05','#5FA449'];
                    var colors_leafs = ['#375C17','#5B8C17','#5B8C170','#043C05','#5FA449'];
                    var colors_leafs_automn = ['#c7350c','#d27029','#cf4030','#da9f1f','#767f30','#788c1b'];

                    //console.log(line.from.y);
                    if(line.from.y > 370) {
                        //base green
                        //console.log("colors_grass");
                        line.color1 = colors_grass[Math.floor(Math.random() * colors_grass.length)];
                        line.color2 = colors_grass[Math.floor(Math.random() * colors_grass.length)];
                        line.squareSize1 = rand(5,15);
                        line.squareSize2 = rand(5,15);
                    }else if(line.from.y > 250 && line.from.y <370) {
                        //tronc braun
                        // console.log("colors_wood");
                        line.color1 = colors_wood[Math.floor(Math.random() * colors_wood.length)];
                        line.color2 = colors_wood[Math.floor(Math.random() * colors_wood.length)];
                        line.squareSize1 = rand(10,20);
                        line.squareSize2 = rand(10,20);
                    }else if(line.from.y > 0 && line.from.y < 250) {
                        //foeuilles green
                        //console.log("colors_leafs");
                        line.color1 = colors_leafs[Math.floor(Math.random() * colors_leafs.length)];
                        line.color2 = colors_leafs[Math.floor(Math.random() * colors_leafs.length)];
                        line.squareSize1 = rand(20,30);
                        line.squareSize2 = rand(20,30);
                    }


                    // callback for the canvas drawing
                    callback(line);
                    //make the size of the line smaller for the desktop display
                    line.from.x = line.from.x/reduction_param;
                    line.from.y = line.from.y/reduction_param;
                    line.to.x = line.to.x/reduction_param;
                    line.to.y = line.to.y/reduction_param;
                    line.squareSize1 = line.squareSize1/reduction_param;
                    line.squareSize2 = line.squareSize1/reduction_param;

                    Meteor.call("addSquare", session_id, line);

                    line.from = {};
                    line.to = {};
                    start_drawing = 1;
                }
            }
            nb_pixels = 0;
        }else{
            nb_pixels++;
        }
    }

    function rand(x,y){
        return Math.floor((Math.random() * y) + x);
    }

    function drawSquare(ctx,line,position) {

        line.from.x = line.from.x -1;

        ctx.lineWidth = 1;
        var reduc_square_param = 1;

        // if we need to position it in the big display canvas
        if(position){
            line.from.x = line.from.x + (position.x * (ctx.canvas.width/100));
            line.to.x = line.to.x + (position.x * (ctx.canvas.width/100));
            line.from.y = line.from.y + (position.y * (ctx.canvas.height/100));
            line.to.y = line.to.y + (position.y * (ctx.canvas.height/100));
            reduc_square_param = reduction_param;
        }

        ctx.beginPath();
        // old line drawing code
        //ctx.moveTo(line.from.x, line.from.y);
        //ctx.lineTo(line.to.x, line.to.y);
        //ctx.closePath();

        var square = {}

        square.x = (line.from.x + line.to.x)/2
        square.y = (line.from.y + line.to.y)/2;
        //console.log(square);
        ctx.fillStyle=line.color1;
        square.width = line.squareSize1;
        square.height = line.squareSize1;
        ctx.fillRect(line.from.x,line.from.y,square.width,square.height);
        ctx.stroke();
        ctx.fillStyle=line.color2;
        square.width = line.squareSize2;
        square.height = line.squareSize2;
        ctx.fillRect(line.to.x,line.to.y,square.width,square.height);
        ctx.stroke();


    }


    /*
     FUNCTIONS RUNNING!
     */



    if(!window.mobilecheck()) {
        var audio = new Audio('audio/amateurcartography.mp3');
        audio.play();
        audio.loop = true;
        document.addEventListener('click', function(e) {
            if ( e.target.id == "toggle_sound" ) {
                e.preventDefault();
                if(!audio.muted){
                    audio.muted = true;
                     document.getElementById("toggle_sound").text =  "Off";
                }else{
                    audio.muted = false;
                    document.getElementById("toggle_sound").text =  "On";
                }
            }
        }, false);
    }

    document.addEventListener('click', function(e) {
        if ( e.target.id == "erase_all" ) {
            erase_all();
        }
        if ( e.target.id == "erase_tree" ) {
            erase_tree();
        }
        if ( e.target.id == "clear_session_cookie" ) {
            setCookie("tree_session_id","",1);
            session_id = generate_tree_id();
            drawing_ctx.clearRect(0, 0, drawing_ctx.canvas.width, drawing_ctx.canvas.height);
        }
        if ( e.target.id == "clear_session_cookie" ) {
            setCookie("tree_session_id","",1);
            session_id = generate_tree_id();
            drawing_ctx.clearRect(0, 0, drawing_ctx.canvas.width, drawing_ctx.canvas.height);
        }
        // Prevent default browser form submit
    }, false);

    document.addEventListener("submit", function(e){
        e.preventDefault();
        if(e.target.id == "name_tree_form"){
            var name_obj = {};
            for(i=0;i<e.target.length;i++){
                name_obj[e.target[i].name] = e.target[i].value;
                name_obj["session_id"] = session_id;
            }
            document.getElementById("nameTreeInput").value = "";
            //console.log(name_obj);
            Meteor.call("addNameTree",name_obj.session_id,name_obj.nameTree);
        }
    },false);

    function drawName (ctx,name,position) {
        if(name) {
            var x = position.x * (ctx.canvas.width/100);
            var y = position.y * (ctx.canvas.height/100);
            y = y + 20;
            x = x + 50;
            ctx.font = "11px arial";
            ctx.fillStyle = "grey";
            ctx.fillText(name, x, y);
        }
    }

    //Meteor.autorun(function() {
    //    if(!window.mobilecheck()){
            //clean_display();
            // draw on the main display all the trees
    //        Trees.find().forEach(function(session) {
    //            session.squares.forEach(function(square) {
    //                drawSquare(display_ctx, square, session.position_display);
    //            });
    //        });
    //    }
    //});

    Squares.find().observe({
      added: function (square) {
        var tree = Trees.findOne(square.treeId);
        drawSquare(display_ctx, square, tree.position_display);
      }
    });

    Trees.find().observe({
        removed: function () {
            redrawAllTrees();
        },
        changed : function (tree) {
            drawName (display_ctx, tree.nameTree, tree.position_display);
        },
        added: function (tree) {
            drawName (display_ctx, tree.nameTree, tree.position_display);
        }
    });

    function redrawAllTrees() {
      clean_display();
      Trees.find().forEach(function(tree) {
        Squares.find({treeId: tree._id}).forEach(function(square) {
           drawSquare(display_ctx, square, tree.position_display);
        });
          drawName (display_ctx, tree.nameTree, tree.position_display);
      });
    }


    function mouseMoveEventHandler(e) {
        createLine(e,display_can,function(square){
            drawSquare(drawing_ctx,square);
        });
    }

    function touchMoveEventHandler(e) {
        createLine(e,display_can,function(square){
            drawSquare(drawing_ctx,square);
        });
    }

    function setUpHandler(isMouseandNotTouch, detectEvent) {
        removeRaceHandlers();
        if (isMouseandNotTouch) {
            drawing_can.addEventListener('mouseup', mouseUpEventHandler);
            drawing_can.addEventListener('mousemove', mouseMoveEventHandler);
            drawing_can.addEventListener('mousedown', mouseDownEventHandler);
            mouseDownEventHandler(detectEvent);
        } else {
            drawing_can.addEventListener('touchstart', touchstartEventHandler);
            drawing_can.addEventListener('touchmove', touchMoveEventHandler);
            drawing_can.addEventListener('touchend', mouseUpEventHandler);
            touchstartEventHandler(detectEvent);
        }
    }

    function mouseWins(e) {
        setUpHandler(true, e);
    }

    function touchWins(e) {
        setUpHandler(false, e);
    }

    function removeRaceHandlers() {
        drawing_can.removeEventListener('mousedown', mouseWins);
        drawing_can.removeEventListener('touchstart', touchWins);
    }

    drawing_can.addEventListener('mousedown', mouseWins);
    drawing_can.addEventListener('touchstart', touchWins);

});

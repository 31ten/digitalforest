var display_canvas_width = 1200;
var display_canvas_height = 600;
var grid_unit_width = 40;
var grid_unit_height = 40;

function random_scale(a,b) {
   return Math.floor((Math.random() * b) + a);
}

function generate_new_grid_position (w,h,treeW,treeH) {
    // generate a position X Y according to the grid
    var new_position = {};
    new_position.x = random_scale(0,w/treeW);
    new_position.y = random_scale(0,h/treeH);
    return new_position;
}

function is_grid_position_available (x,y) {
    var nb_occurences;
    nb_occurences = Trees.find(
        {
            position_display : {
                x : x,
                y : y
            }
        }
    ).count();

    console.log("is_grid_position_available > nb_occurences " + nb_occurences);

    if(nb_occurences > 0) {
        return false
    }else{
        return true
    }
}

function set_new_grid_position (w,h,treeW,treeH) {
    var position_available = false;
    // while the the position is already taken, generate a new one
    while (position_available == false) {
        var new_position = generate_new_grid_position (w,h,treeW,treeH);
        if(is_grid_position_available (new_position.x,new_position.y)){
             //if not taken, return the position
            position_available = true;
            return new_position;
        }
    }
}

Meteor.publish("trees", function () {
    return Trees.find();
});

Meteor.publish("squares", function () {
    return Squares.find();
});

var nb_max_trees = 100;

Meteor.methods({
    addNameTree: function(session_id,nameTree) {
        var searched_session_tree = Trees.findOne({"session_id" : session_id});
         console.log("addNameTree");
        if(searched_session_tree){
            console.log("session found, name inserted");
            Trees.update({_id:searched_session_tree._id},{$set:{"nameTree":nameTree}});
        }
    },
	addSquare: function(session_id,square) {

        //look for the session id
        var searched_session_tree = Trees.findOne({session_id : session_id});
            //if found,
            var position = set_new_grid_position (display_canvas_width,display_canvas_height,grid_unit_width,grid_unit_height)
            if(searched_session_tree){

                square.treeId = searched_session_tree._id;

                Squares.insert(square);

                //searched_session_tree.squares.push(square);
                //Trees.update({_id:searched_session_tree._id},{$set:{"squares":searched_session_tree.squares}});
            }else{
                //no square with the session id
                //check how many trees
                var nb_trees = Trees.find().count();
                if( nb_trees > nb_max_trees){
                    //if there is more than nb_max_trees, delete the oldest tree
                    var oldest_tree = Trees.findOne({}, {sort: {createdAt: 1}, limit: 1});
                    Trees.remove(oldest_tree._id);
                }

                //and insert the new one
                var new_session_tree = {};
                new_session_tree.session_id = session_id;
                new_session_tree.createdAt =  new Date();

                //give it a place
                var grid_position = set_new_grid_position (display_canvas_width,display_canvas_height,grid_unit_width,grid_unit_height)

                new_session_tree.position_display = {};
                new_session_tree.position_display.x = grid_position.x;
                new_session_tree.position_display.y = grid_position.y;

                var treeId = Trees.insert(new_session_tree);
                square.treeId = treeId;
                Squares.insert(square);
            }
	},
    removeTree: function(session_id) {
      var tree = Trees.findOne({session_id: session_id});
		  Trees.remove(tree);
      Squares.remove({treeId: tree._id});
	},
    removeAllTrees: function() {
		  Trees.remove({});
      Squares.remove({});
	}
});


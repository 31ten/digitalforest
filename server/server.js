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
                new_session_tree.position_display = {};
                new_session_tree.position_display.x = Math.floor((Math.random() * 70) + 10);
                new_session_tree.position_display.y = Math.floor((Math.random() * 70) + 10);
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


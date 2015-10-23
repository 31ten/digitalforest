Trees = new Meteor.Collection('trees');

Meteor.publish("trees", function () {
    return Trees.find();
});

var nb_max_trees = 100;

Meteor.methods({
	addSquare: function(session_id,square) {
        //look for the session id
        var searched_session_tree = Trees.findOne({"session_id" : session_id});
            //if found,
            if(searched_session_tree){
                searched_session_tree.squares.push(square);
                Trees.update({_id:searched_session_tree._id},{$set:{"squares":searched_session_tree.squares}});
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
                new_session_tree.squares = [];
                new_session_tree.squares.push(square);
                //give it a place
                new_session_tree.position_display = {};
                new_session_tree.position_display.x = Math.floor((Math.random() * 70) + 10);
                new_session_tree.position_display.y = Math.floor((Math.random() * 70) + 10);
                Trees.insert(new_session_tree);
            }
	},
    removeTree: function(session_id) {
		Trees.remove({"session_id" : session_id});
	},
    removeAllTrees: function() {
		Trees.remove({});
	}
});


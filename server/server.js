/* 

  Two crucial things to remember about meteor application security: 
    - meteor remove autopublish 
        restricts access of user only to data they're intended to see 
    - meteor remove insecure
        command prompt can't be used to modify databases

*/

Meteor.startup(function () {
  // code to run on server at startup
});

Meteor.publish('thePlayers', function(){
  var currentUserId = this.userId;
  return PlayersList.find({createdBy: currentUserId})
});

// Methods for accessing server functionality 
Meteor.methods({
  // methods go here 
  'insertPlayerData': function(playerNameVar) {
    var currentUserId = Meteor.userId(); 
    PlayersList.insert({
      name: playerNameVar,
      score: 0,
      createdBy: currentUserId
    });
  },

  'removePlayerData': function(selectedPlayer) {
    var currentUserId = Meteor.userId();
    PlayersList.remove({_id: selectedPlayer, createdBy: currentUserId});   
  },

  'modifyPlayerScore': function(selectedPlayer, amount) {
    
    var currentUserId = Meteor.userId();

    PlayersList.update(
      {_id: selectedPlayer, createdBy: currentUserId}, // user can only modify data if they're the ones who created it  
      {$inc: {score: amount}} // $set operator: lets us change one specific field without affecting the rest of the document. 
      // $inc operator: lets us increase a specific value 
    );
  }

});

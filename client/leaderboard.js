/* 

  Two crucial things to remember about meteor application security: 
    - meteor remove autopublish 
        restricts access of user only to data they're intended to see 
    - meteor remove insecure
        command prompt can't be used to modify databases

*/

// subscribe to published player data 
// do this BEFORE everything else 
Meteor.subscribe('thePlayers');

Template.leaderboard.helpers({
  'player': function () {
    var currentUserId = Meteor.userId(); 
    return PlayersList.find({}, {sort: {score: -1, name: 1}}); // sort: sorts list according to value of 'score,' in this case in descending order (specified by -1) - returned list is sorted. 
      // sorting: first by number, descending; then, (if tied), by name, ascending 
  },

  'selectedClass': function () {

    var selectedPlayer = Session.get('selectedPlayer'); 
    var playerId = this._id; 

    // should be == instead?
    if (selectedPlayer === playerId) {
      return 'selected'; 
    }
  },

  'showSelectedPlayer': function() { 
    var selectedPlayer = Session.get('selectedPlayer'); 

    return PlayersList.findOne(selectedPlayer); // findOne: retrieves a single document from the collection; pass it unique id of player we're looking for.     
  }

});

Template.leaderboard.events({
  'click li.player': function () {
    // Sessions are temporary data not stored in the database.
    // Sessions have two pieces of information: 
    //    * name of the session
    //    * value of the session

    var playerId = this._id; 

    Session.set('selectedPlayer', playerId);

    var selectedPlayer = Session.get('selectedPlayer'); 

    console.log(selectedPlayer); 
  }, 

  'click #increment': function () { 
    // code that runs when button clicked 
    var selectedPlayer = Session.get('selectedPlayer'); // session is global (I think, or some eqivalent), so we can still access the value here
    Meteor.call('modifyPlayerScore',selectedPlayer,5);
  },

  'click #decrement': function () { 
    // code that runs when button clicked 
    var selectedPlayer = Session.get('selectedPlayer'); // session is global (I think, or some eqivalent), so we can still access the value here
    Meteor.call('modifyPlayerScore',selectedPlayer,-5);
  },

  'click #remove': function() { 
    var selectedPlayer = Session.get('selectedPlayer');
    Meteor.call('removePlayerData', selectedPlayer); 
  }

});

Template.addPlayerForm.events({
  // events go here
  'submit #addPlayerForm': function(theEvent, theTemplate) {
    // code goes here
    theEvent.preventDefault();

    // old way: 
    //var playerNameVar = theTemplate.find('#playerName').value;
    
    // new way:  
    var playerNameVar = theEvent.target.playerName.value;

    var currentUserId = Meteor.userId(); 

    Meteor.call('insertPlayerData', playerNameVar);

    // reset input field
    theEvent.target.playerName.value = '';

    }
});



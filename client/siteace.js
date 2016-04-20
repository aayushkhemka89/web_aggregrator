	/////
	// Router
	/////
	Router.configure({
	  layoutTemplate: 'ApplicationLayout'
	})
	Router.route('/', function () {
		this.render('navbar', {to: 'navbar'});
	  this.render('websites',{to: 'main'});
	});
	Router.route('/websites/:_id', function() {
		this.render('navbar', {to: 'navbar'});
		this.render('website_details' , {to: 'main' , data: function() { 
			return {website: Websites.findOne({_id: this.params._id}),
			comments: Comments.find({websiteId: this.params._id})}
		}
   });

 });

	 //////
		//Accounts
	/////

	 Accounts.ui.config({
		passwordSignupFields: "USERNAME_AND_EMAIL"
	 });

	/////
	// template helpers
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			var searchString = Session.get('searchInput');
			if(searchString == null) { searchString = ''};
			return Websites.find({title: {'$regex' : '.*' + searchString || '' + '.*'} }  , {sort: { rating: -1 , createdOn: -1 }});
		},
		getSearchField: function() {
			return Session.get('searchInput');
		},
		searching_websites: function() {
			if(Session.get('searchInput')) {
				return true;
			} else {
				return false;
			}
		}
	});



	/////
	// template events
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			Websites.update({_id: website_id } , { $inc: {rating: + 1 }})

			return false;// prevent the button from reloading the page
		},
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
		  Websites.update({_id: website_id } , { $inc: {rating: - 1 }})



			return false;// prevent the button from reloading the page
		}
	})

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		},
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
      Meteor.call("getWebData", url);
			//  put your website saving code in here!
			event.target.url.value = '';
      $("#website_form").hide('slow');
			return false;// stop the form submit from reloading the page

		}
	});


	// search
	Template.search_form.events({
		"input .searchfield": function(event) {
			Session.set("searchInput" , event.target.value);
		}
	})

	//comment form
  Template.comment_form.events({
		"click .js-toggle-comment-form": function(event, template) {
			$("#comment_form").toggle('slow');
		},
		"submit .js-save-comment-form": function(event, template){
       var text = event.target.text.value;
			 var websiteId = event.target.websiteId.value;
			  console.log(Session.get('websiteId'));
					 if(Meteor.user()) {
						 Comments.insert({
							 websiteId: websiteId,
		           createdBy: Meteor.user()._id,
							 createdOn: new Date(),
							 text: text
						 });
					 }
					$("#comment_form").hide('slow');
					return false;// stop the form submit from reloading the page
		}
	});
 // comment
  Template.comment.helpers( {
		author: function(userId) {
			var user = Meteor.users.findOne({ _id: userId});
			if(user) {
				return user.username;
			} else {
				return "anonymous";
			}

		}
	})

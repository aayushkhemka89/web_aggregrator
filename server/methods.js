var cheerio = Npm.require('cheerio');

Meteor.methods({
  getWebData: function(url) {
    Meteor.http.call("GET", url,
      function (error, result) {
        if (!error) {
          $ = cheerio.load(result.content);
          var meta = $('meta');
          var keys = Object.keys(meta)

           var title =  $('title').text();
           var description;

           keys.forEach(function(key){
             if (  meta[key].attribs
                && meta[key].attribs.name
                && meta[key].attribs.name === 'description') {
               description = meta[key].attribs.content;
             }
           });


         if(Meteor.user()) {
           Websites.insert({
             title: title ,
             url: url ,
             description: description,
             createdOn: new Date(),
             rating: 0
           });

         }


        }
      });
  }
});



var grid = {
  
   updateCounter: function(timestamp){
       console.log('grid last updated at: ' + timestamp);
   },
   updateView : function (data) {
      if (data.boxID != undefined) {
        $('#box' + data.boxID +' ul').append('<li class=\'cha1\'> Entry: ' 
                                                                        + data.title +
                                                                         ' time: ' 
                                                                         + data.timestamp + 
                                                                         '</li>');        
        }
        else
        {
         $('.box ul').each( function() {
                            $(this).append('<li> Entry: ' 
                                                        + data.title + 
                                                        ' time: ' 
                                                        + data.timestamp +
                                                        '</li>')
                          }); 
        }
   },
   sendBoxMessage: function (data) {
      $('#box1 ul , #box4 ul').each( function() {
                            $(this).append('<li class=\'cha2\'> Entry: ' 
                                                                      + data.title + 
                                                                      ' time: ' 
                                                                      + data.timestamp + 
                                                                      '</li>'
                                                                      )
                          });
      
   }
};  

var gridUpdate = function(topics, data){       
       grid.updateCounter(data.timestamp);
       grid.updateView(data);
}

var sendFromBox = function(topics, data) {
      grid.sendBoxMessage(data);
}

function getTime (){
  var date = new Date();  
  return date.toLocaleTimeString().toLowerCase();
}

var gridSubscription = PubSub.subscribe( 'dataUpdated', gridUpdate );
var boxSubsription = PubSub.subscribe('anotherChannel', sendFromBox);

$(function(){
    var opts = {
          lines: 10, // The number of lines to draw
          length: 5, // The length of each line
          width: 4, // The line thickness
          radius: 25, // The radius of the inner circle
          color: '#000', // #rgb or #rrggbb
          speed: 1.6, // Rounds per second
          trail: 42, // Afterglow percentage
          shadow: false, // Whether to render a shadow
          hwaccel: true // Whether to use hardware acceleration
        };
        
        
        

    $('.box').each(function  () {
        $('p',this).text($(this).attr('id'));
    });

    $('#btnRefresh').click(function () {
        PubSub.publish('dataUpdated',   { 
                                          title: "Microsoft shares", 
                                          timestamp: getTime()  
                                        });  
    });

    $('#btnClear').click(function () {
        $('.box ul').each( function () { $(this).html(''); } );
    });

    $('.box').click(function() {

      var _boxID = $(this).attr('id').replace('box', '');

      
        
         PubSub.publish('dataUpdated',   { 
                                           title: "Dell shares", 
                                           timestamp: getTime(), 
                                           boxID : _boxID  
                                         });
       
    });

    

    $('#btnAutoRefresh').click(function () { 
        var that = this;
        if (intID === 0) { 
          $(that).val('Stop');
          autoRefresh(); 
        }
        else { 
          clearInterval(intID);
          $(that).val('Auto refresh');
          intID=0;
        }
    });
    
    $('#btnSend').click(function() {
      var target = document.getElementById('box4');
      var spinner = new Spinner(opts).spin(target); 

        PubSub.publish('anotherChannel',   { 
                                            title: 'Another channel', 
                                            timestamp: getTime() 
                                          });

         setTimeout( function() { 
          spinner.stop()} , 1000);            
    });
});

var intID = 0;

function autoRefresh(){
   intID = setTimeout(function(){
          PubSub.publish('dataUpdated', { 
                                          title: "Microsoft shares",
                                          timestamp: getTime()  
                                        });
           autoRefresh();
          }, 1500);
}
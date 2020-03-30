 // Create a legend 
 var info = L.control({position: 'bottomright'});

 info.onAdd = function(){
   var div = L.DomUtil.create("div","legend");
   return div;
 }
 
 
 info.addTo(myMap);
 
 document.querySelector(".legend").innerHTML=displayLegend();
 
 
 //color function to be used when creating the legend
 function markerColor(d) {
   switch(true){
     case (magnitude<1):
       return "green";
   case (magnitude<2):
       return "lime";
   case (magnitude<3):
       return "yellow";
   case (magnitude<4):
       return "Orange";
   case (magnitude<5):
       return "orangered";
   default:
       return "red";
 };
 }    
 function displayLegend(){
   var legendInfo = [{
       limit: "Mag: 0-1",
       color: "green"
   },{
       limit: "Mag: 1-2",
       color: "lime"
   },{
       limit:"Mag: 2-3",
       color:"yellow"
   },{
       limit:"Mag: 3-4",
       color:"Orange"
   },{
       limit:"Mag: 4-5",
       color:"orangered"
   },{
       limit:"Mag: 5+",
       color:"red"
   }];
 
   var header = "<h3>Magnitude</h3><hr>";
 
   var strng = "";
  
   for (i = 0; i < legendInfo.length; i++){
       strng += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
   }
   
   return header+strng;
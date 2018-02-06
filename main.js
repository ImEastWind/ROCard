var _CarType=[{'ID':'1', 'Name':'武器'},{'ID':'2', 'Name':'副手'},{'ID':'3', 'Name':'盔甲'},{'ID':'4', 'Name':'披風'},{'ID':'5', 'Name':'鞋子'},{'ID':'6', 'Name':'飾品'},{'ID':'7', 'Name':'頭飾'}];
var c1,c2;

//program init point
function _init(){
  var oCB = $("#CardBlocks");
  c1=$("#C1");
  c2=$("#C2");

	//Get card data.
	var aData = JSON.parse(_CardData);

  //Render card type block.
  $.each(_CarType,function(i,o){
    i+=1;
    oCB.append("<div id='block"+i+"' class='block'><div class='blockcaption'>"+o.Name+"</div><hr class='style1'></div>");
  })

  //Render card data
  var b,c;
  $.each(aData,function(i,o){
    b=oCB.find("div[id='block"+o.Type+"']")
    c=$("<div class='col'><div><p class='caption'>"+o.Name+"</p></div></div>");
    b.append(c);
    c.data("objCard",o);
  })

  //bind card click event
  oCB.delegate(".col", "click", function() {
    $(".overlay").show();
    openChart($(this).data("objCard"));
  });

  //bind return button click event
  c2.find(".btnPanel").on("click",function(){
    $(".overlay").hide();
  	$(".ct-chart").empty();
    enableScroll();
  });
  
}

function openChart(vCard){
  //card info.
  c2.find("span[id='TypeName']").text(getCarTypeName(vCard.Type));
  c2.find("span[id='CardName']").text(vCard.Name);

  //remove empty price and its mapping datadate.
  var aPrice=[],aDataDate=[],iP;
  $.each(vCard.Price,function(i,v){
    iP=myParseInt(v);    
    if(iP>0){
      aPrice.push(iP);
      aDataDate.push(_DataDate[i])
    }
  })

  if (aPrice.length==0){
    $(".overlay").hide();
    alert('還沒有這張卡片的紀錄喔!');
    return;
  }else{
  	  disableScroll();
  }

  //get price info for table
  var hightest=aPrice[0],lowest=aPrice[0];
  $.each(aPrice,function(i,v){
    if(v>hightest){hightest=v;}
    if(v<lowest){lowest=v;}
  });

  //table info.
  c2.find(".latest").text(numberWithCommas(aPrice[aPrice.length-1]));
  c2.find(".hightest").text(numberWithCommas(hightest));
  c2.find(".lowest").text(numberWithCommas(lowest));

  //Gen chart.
  new Chartist.Line('.ct-chart', {
    labels: aDataDate,
    series: [aPrice]
  }, {
    showArea: true,
    width: "100%",
    height: 500,    
    //fullWidth: true,
    axisY: {
      onlyInteger: true,
      labelInterpolationFnc: function(value) {
        return (value / 10000) + '萬';
      },
      offset: 70
    },
    plugins: [
      Chartist.plugins.ctThreshold({
        threshold: 4
      })
    ]
  });
}

function getCarTypeName(vType){
  var arr=$.grep(_CarType,function(o,i){
    return (o.ID==vType);
  });
  return arr[0].Name;
}

function myParseInt(vNum){
  var s=vNum;
  s=s.replace(/,/g, "");  //remove number comma
  return parseInt(s,10);
}

function numberWithCommas(v){
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//lock scroll bar
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};
function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}
function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}
function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}
function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}
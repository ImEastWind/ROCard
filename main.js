var _CarType=[{'ID':'1', 'Name':'武器'},{'ID':'2', 'Name':'副手'},{'ID':'3', 'Name':'盔甲'},{'ID':'4', 'Name':'披風'},{'ID':'5', 'Name':'鞋子'},{'ID':'6', 'Name':'飾品'},{'ID':'7', 'Name':'頭飾'}];
var CB,C1,C2,Chart;

//program init point.
function _init(){
  CB=$("#CardBlocks");
  C1=$("#C1");
  C2=$("#C2");
  Chart=$(".ct-chart");

  //Get card data.
  var aData = JSON.parse(_CardData);

  //Render card type button.
  var b = $(".subtitle-block");
  $.each(_CarType,function(i,o){
    i+=1;
    b.append("<div id='block"+i+"' class='subtitle-link'>"+o.Name+"</div>");
  });
  
  //Render card type block.
  $.each(_CarType,function(i,o){
    i+=1;
    CB.append("<div id='block"+i+"' class='block'><div class='blockcaption'>"+o.Name+"</div><hr class='style1'></div>");
  });

  //Render card data.
  var b,c;
  $.each(aData,function(i,o){
    b=CB.find("div[id='block"+o.Type+"']")
    switch(o.Mob){
      case "1":
        c=$("<div class='col'><div class='MiniIcon'></div><div><p class='caption'>"+o.Name+"</p></div></div>");
        break;
      case "2":
        c=$("<div class='col'><div class='MVPIcon'></div><div><p class='caption'>"+o.Name+"</p></div></div>");
        break;
      default:
        c=$("<div class='col'><div><p class='caption'>"+o.Name+"</p></div></div>");
        break;
    }    
    b.append(c);
    c.data("objCard",o);
  })

  //bind card click event.
  CB.delegate(".col", "click", function() {
    openChart($(this).data("objCard"));
  });

  //bind return button click event.
  C2.find(".btnPanel").on("click",function(){
    var type=Chart.data("type");
    C2.hide();
    C1.show();    
    Chart.empty();
    //go anchor
  	var top=$("div[class='block'][id='block"+type+"']").offset().top;
    window.scrollTo(0, top-10);
  });

  //bind cartype button
   C1.find(".subtitle-link").on("click",function(){
    var id=($(this).attr("id"));
    var top=$("div[class='block'][id='"+id+"']").offset().top;
    window.scrollTo(0, top);
  }); 

  //bind gototop button
  $(".gototop").on("click",function(){
  	window.scrollTo(0, 0);
  });

  //bind donate button
  $(".donate").on("click",function(){
  	window.open('donate.html', '_blank'); 	
  });
  
}

function openChart(vCard){
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
    alert('還沒有這張卡片的紀錄喔!');
    return;
  }else{
    C1.hide();
    C2.show();
    window.scrollTo(0, top);
  }

  //card info.
  C2.find("span[id='TypeName']").text(getCarTypeName(vCard.Type));
  C2.find("span[id='CardName']").text(vCard.Name);

  //get price info for table.
  var hightest=aPrice[0],lowest=aPrice[0];
  $.each(aPrice,function(i,v){
    if(v>hightest){hightest=v;}
    if(v<lowest){lowest=v;}
  });

  //table info.
  C2.find(".latest").text(numberWithCommas(aPrice[aPrice.length-1]));
  C2.find(".hightest").text(numberWithCommas(hightest));
  C2.find(".lowest").text(numberWithCommas(lowest));

  //compute threshold.
  var iThreshold = Math.round((hightest+lowest)/2);
  
  //keep car type for reutun anchor.
  Chart.data("type",vCard.Type);
      
  //Gen chart.
  new Chartist.Line('.ct-chart', {
    labels: aDataDate,
    series: [aPrice]
  }, {
    showArea: true,
    width: "100%",
    height: 400,    
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
        threshold: iThreshold //4
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
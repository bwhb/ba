//$(".jumbotron").hide()
$("#attraktionen,#mittagessen,#abendprogramm,#programmauswahl,#zusammenfassung").hide();

$(document).on("click","nav a",function(event){
  var data = $("body").data()
  event.preventDefault();
  var self = $(this).text().replace(/\d+\.\s(\w+)\s.*/,"$1").toLowerCase();
  $(".active").removeClass('active');
  $(this).parent("li").addClass('active');
  $("#attraktionen,#mittagessen,#abendprogramm, #teilnahme,#programmauswahl,#zusammenfassung").hide();
  $("#"+self).show();
  for (key in bw.programm){
      if(bw.programm[key].length>0&&programm.indexOf(key)!=-1){
        $("."+key).find("."+bw.programm[key].substr(0,3).toLowerCase()).addClass("active");
      }
    }

  if(self == "zusammenfassung"){
      if (bw.programm.vormittag.length>1){$(".z_vormittag").find("td").last().text(bw.programm.vormittag)}
      if (bw.programm.nachmittag1.length>1){$(".z_nachmittag1").find("td").last().text(bw.programm.nachmittag1)}
      if (bw.programm.nachmittag2.length>1){$(".z_nachmittag2").find("td").last().text(bw.programm.nachmittag2)}
      if (data.abend=="0"){
        $(".z_abendprogramm0").show().find("td").last().text("Rückfahrt nach Leipzig (Ankunft ca. 18.00 Uhr)");

        $(".z_abendprogramm1").hide()
      }
      if (data.abend=="1"){
        $(".z_abendprogramm0").hide()
        $(".z_abendprogramm1").show().find("td").each(function(){
          $(this).text($(this).text().replace(/der zweiten Gruppe /,""))
        });
      }
      if(data.name.length>1&&data.abend!=null&&data.teilnahme==1&&data.vormittag.length>3&&data.nachmittag1.length>3&&data.nachmittag2.length>3){
        $("#zusammenfassung").find("a.btn").removeClass('disabled')
      }
      else $("#zusammenfassung").find("a.btn").addClass('disabled')
  }
})


$(document).on('click', '.btn-success, .btn-danger', function(event) {
  event.preventDefault();
  var data = $("body").data()
  that = $(this);
  if($(this).hasClass('btn-success')){
    $.getJSON('io.php', {'do': 'setdata', "k" : $(this).parents("div").prop("id"), "v" : 1, "u": data.id}, function(json, textStatus) {
      jaNein(that.parents("div").prop("id"),1);
      $("body").data(json)
     });
  }
  else if($(this).hasClass('btn-danger')) {
    $.getJSON('io.php', {'do': 'setdata', "k" : $(this).parents("div").prop("id"), "v" : 0, "u": data.id}, function(json, textStatus) {
      jaNein(that.parents("div").prop("id"),0);
      $("body").data(json)

     });
  }
});
$(document).on('keyup', '#name', function(event) {
  that = $(this)
  var data = $("body").data()
  data.name=$(this).val()
  $("body").data(data)
  $.getJSON('io.php', {'do': 'setdata', "k" : 'name', "v" : $(this).val(), "u": data.id}, function(json, textStatus) {;
    if(data.teilnahme==1&&that.val().length>1){
      $("#nav_teilnahme").children(".glyphicon").remove()
      $("#nav_teilnahme").html($("#nav_teilnahme").html()+"<span class='glyphicon glyphicon-ok'></span>");
    }
    else $("#nav_teilnahme").children(".glyphicon").remove()
  })
})

function interesseSubmit(interesse, v){
  var data = $("body").data();
  if(localStorage.locked==0){
    $.getJSON('io.php', {'do': 'interesse', "k" : interesse, "v" : v, "u": data.id}, function(json, textStatus) {
        $(".star-a").parents("h2").append("&nbsp;<span class='glyphicon glyphicon-ok'></span>")
      });
  }
}

function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++){
        hash = hashes[i].split('=');
        vars.push(hash[0]);
    if(hash.length>1){
      hash[1]=hash[1].replace("#","");
      vars[hash[0]] = hash[1];
    }
    }
    return vars;
}

function jaNein(el, dat){
  var data = $("body").data();
  console.dir(data)
  $("#"+el).children(".bg-danger, .bg-success").remove()
  if (dat == 1){
    if(el=="teilnahme"){
      $("#"+el).append('<p class="bg-success">Schön, dass Sie zugesagt haben. Wechseln Sie nun bitte zur Programmauswahl.</p>');
      $ok = $("<span>",{class: "glyphicon glyphicon-ok"});
      if(data.name.length>0){
        $("#nav_"+el).children(".glyphicon").remove()
        $("#nav_"+el).html($("#nav_"+el).html()+"<span class='glyphicon glyphicon-ok'></span>");
      }
    }
    if(el=="mittagessen")$("#"+el).append('<p class="bg-success">Wir haben Sie für ein Fleischgericht vorgemerkt.</p>');
    if(el=="abendprogramm")$("#"+el).append('<p class="bg-success">Schön, dass Sie zugesagt haben.</p>');
    if(el=="teilnahme")$("nav").show()
    if(el=="zusammenfassung"){
      $("nav").hide()
      $("#zusammenfassung").hide()
      $("#fertig").show()
      $.getJSON('io.php', {'do': 'setdata', "k" : 'fertig', "v" : '1', "u": data.id}, function(json, textStatus) {});
    }
  }
  else{
    if(el=="teilnahme")$("#"+el).append('<p class="bg-danger">Schade, Sie haben bereits abgesagt. Noch können Sie Ihre Meinung überdenken.</p>');
    if(el=="mittagessen")$("#"+el).append('<p class="bg-success">Wir haben Sie für ein vegetarisches Gericht vorgemerkt.</p>');
    if(el=="abendprogramm")$("#"+el).append('<p class="bg-danger">Schade. Noch können Sie Ihre Meinung überdenken.</p>');
    if(el=="teilnahme"){
      $("nav").hide()
      $("#teilnahme").hide()
      $("#fertig").show()
      $.getJSON('io.php', {'do': 'setdata', "k" : 'fertig', "v" : '1', "u": data.id}, function(json, textStatus) {});
    }
  }
  $ok = $("<span>",{class: "glyphicon glyphicon-ok"});
  if(el!="teilnahme"){
    console.info('123');
    $("#nav_"+el).children(".glyphicon").remove()
    $("#nav_"+el).html($("#nav_"+el).html()+"<span class='glyphicon glyphicon-ok'></span>");
  }
}

$(document).ready(function() {
  var param = getUrlVars();
  console.log("start")
  $.getJSON('io.php', {'do': 'getdata', 'u': 'attraktionen', ts:  new Date().getTime()}, function(json, textStatus) {
    attraktionen.data=json
    bw = new User("User");
    prog1();
    $.getJSON('io.php', {'do': 'getdata', 'u': param['u'], ts:  new Date().getTime()}, function(json, textStatus) {
      $("body").data(json);
      localStorage.setItem("locked", 1);
      if (json.name.length>0){
        $("#name").val(json.name)
      }
      if(json.teilnahme !== null){
        jaNein("teilnahme",json.teilnahme);
      }
      if(json.abend !== null){
        jaNein("abendprogramm",json.abend);
      }
      if(json.mittag !== null){
        jaNein("mittagessen",json.mittag);
      }
      if(json.vormittag){
        bw.programm.vormittag = json.vormittag;
        $(".vormittag").find("."+json.vormittag.substr(0,3).toLowerCase()).addClass("active");
      }
      if(json.nachmittag1){
        bw.programm.nachmittag1 = json.nachmittag1;
        $(".nachmittag1").find("."+json.nachmittag1.substr(0,3).toLowerCase()).addClass("active");
      }
      if(json.nachmittag2){
        bw.programm.nachmittag2 = json.nachmittag2;
      }
      if(json.vormittag&&json.nachmittag1&&json.nachmittag2){
        $("#nav_attraktionswahl").html($("#nav_attraktionswahl").html()+"<span class='glyphicon glyphicon-ok'></span>");
      }
      if(json.fertig==1){

        $("#fertig").show();
        $("#attraktionen,#mittagessen,#abendprogramm,#programmauswahl,#zusammenfassung,nav,#teilnahme").hide();
      }

      localStorage.setItem("locked", 0);

    });
  });
});

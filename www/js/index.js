 var cadastro;
 var dataConn;
 var conecta;
 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        //alert ("onDeviceReady executando...");
        //app.receivedEvent('deviceready');
        
        var conn = checkConnection();
        conecta = conn.split("|"); 

//remover a linha abaixo
          conecta[0]=2;


        document.getElementById('status_conn').innerHTML = "<img src='img/"+conecta[0]+"conn.png' width='32' height='32' data-inline='true'>"+conecta[1];
        conecta[0] = parseInt(conecta[0]);
        conecta[0]!==0 ? dataCloud(conecta[1]) : app.ok_conn_sync();
    },
    // Aguarda dados de conexão e sincronia de favoritos
    //==============================================================================================
    ok_conn_sync: function() { 
        //buscar dados local do usuário
        var x = localStorage.getItem("user_id");
        
        cadastro = x == null ? false : true;

        if(cadastro){ 
            dataConn = JSON.parse( localStorage.getItem('dataConn') );
            document.getElementById('cadastro_ok').innerHTML = "<img src='img/user.png' width='32' height='32' data-inline='true'>"+dataConn.nome;
            var tribos=dataConn.tribos;
            
            //Construindo o menu de tribos
            var item = "";    
            $.each(tribos, function(index, value) {
                item += "<option value='"+index+"'>"+value.identifica+"</option> ";
            });
            //alert(item);
            var sel_Tribo = $('#select-tribo');
                sel_Tribo.empty().append(item);
                sel_Tribo.selectmenu().selectmenu('refresh');
        }


        if(conecta[0] === 0) { //Não está conectado
            alert("Rede local, sem conexão!");
            document.getElementById("btn_tribus").innerHTML = "Verificar conexão";    

            if(cadastro){//Já tem cadastro - exibir informações na tela
                document.getElementById("cadastrado").style.display = "block";
                selecaoTribo(dataConn.default_tribo);

                //document.getElementById('conn').innerHTML = conecta[1];
            }else{//Não tem cadastro

                document.getElementById("cadastrar").style.display = "block";
            }
        }
        if(conecta[0] === 2) { //Conexão via celular ... consome franquia
            if (cadastro) {
                document.getElementById("cadastrado").style.display = "block";
                selecaoTribo(dataConn.default_tribo);
            }else{
                //abrirTribus('http://www.atendeweb.net/atende/admin/svcs/_page_index.php?id=7&dom=tribus');  
                var url ='http://www.atendeweb.net/atende/admin/svcs/_page_index.php?id=7&dom=tribus'
                fazerCadastro(url);
            }    
        }    
        if(conecta[0] === 1) { //Conectado no wifi ou Ehternet
            if (cadastro) {
              var url =  "http://www.atendeweb.net/atende/login/_login.php?local=tribus&u="+dataConn.login; 
              abrirTribus(url);
            }else{
                fazerCadastro('http://www.atendeweb.net/atende/admin/svcs/_page_index.php?id=7&dom=tribus');  
            }
        }
       /*
        document.getElementById('cordova').innerHTML = device.cordova;
		document.getElementById('model').innerHTML = device.model;
		document.getElementById('manufacturer').innerHTML = device.manufacturer;
		document.getElementById('isVirtual').innerHTML = device.isVirtual;
		document.getElementById('serial').innerHTML = device.serial;
       */ 
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        console.log('Received Event: ' + id);
        //alert('A API deviceready foi carregada!');
    },
    btnTribus: function (){
        var conn = checkConnection();
        conecta = conn.split("|");
        document.getElementById('status_conn').innerHTML = "<img src='img/"+conecta[0]+"conn.png' width='32' height='32' data-inline='true'>"+conecta[1];
        conecta[0] = parseInt(conecta[0]);
        alert("conecta[0]= "+conecta[0]);
        if(conecta[0] !== 0 ){
            document.getElementById('btn_tribus').innerHTML = "Entrar";
            if (cadastro) {
              abrirTribus("http://www.atendeweb.net/atende/login/_login.php?local=tribus&u="+dataConn.login); 
            }else{
                fazerCadastro('http://www.atendeweb.net/atende/admin/svcs/_page_index.php?id=7&dom=tribus');  
            }
        }else{
            document.getElementById('status_conn').innerHTML = "<img src='img/"+conecta[0]+"conn.png' width='32' height='32' data-inline='true'>"+conecta[1];
            document.getElementById("btn_tribus").innerHTML = "Verificar conexão";    
        }
    }
	
};

//===================================================================
function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = '2|Rede ???';  //1:Entra autom..2:Deixa que o usuário cilque, 0-verificar a internet
    states[Connection.ETHERNET] = '1|Ethernet';
    states[Connection.WIFI]     = '1|WiFi';
    states[Connection.CELL_2G]  = '2|2G';
    states[Connection.CELL_3G]  = '2|3G';
    states[Connection.CELL_4G]  = '2|4G';
    states[Connection.CELL]     = '2|Celular?';
    states[Connection.NONE]     = '0|Não conectado';

    return states[networkState];
}
function abrirTribus(url){
	var target = "_blank";
    var options = "location=no,hidden=no";
    inAppBrowserRef = cordova.InAppBrowser.open(url, target, options);
    inAppBrowserRef.addEventListener('loadstart', loadStartCallBack);
    inAppBrowserRef.addEventListener('loadstop', loadStopCallBack);
    inAppBrowserRef.addEventListener('loaderror', loadErrorCallBack);
}

function loadStartCallBack() {
    //$('#status-message').text("Carregando, aguarde ...");
	document.getElementById('status-message').innerHTML = "Carregando, aguarde ...";
}
 
function loadStopCallBack() {
    if (inAppBrowserRef != undefined) {
        inAppBrowserRef.insertCSS({ code: "body{font-size: 25px;" });
        //$('#status-message').text("Carga interrompida!");
		document.getElementById('status-message').innerHTML = "Carga interrompida!";
        inAppBrowserRef.show();
    }
}
 
function loadErrorCallBack(params) {
    //$('#status-message').text("");
	document.getElementById('status-message').innerHTML = "";
    var scriptErrorMesssage =
       "alert('Desculpe a página não pode ser carregada. A resposta do servidor foi : "
       + params.message + "');"
    inAppBrowserRef.executeScript({ code: scriptErrorMesssage }, executeScriptCallBack);
    inAppBrowserRef.close();
    inAppBrowserRef = undefined;
}
function executeScriptCallBack(params) {
     if (params[0] == null) {
        //$('#status-message').text(
        //   "Sorry we couldn't open that page. Message from the server is : '"
        //   + params.message + "'");
		document.getElementById('status-message').innerHTML = "Desculpe, não consegui abrir o app Tribus. Messagem de erro foi : '"
           + params.message + "'";
    }
} 
function fazerCadastro(url){
    var target = "_blank";
    var options = "location=no,hidden=no";
    var win = cordova.InAppBrowser.open(url, target, options);
    //var win = window.open(url, "_blank", "EnableViewPortScale=yes" );
    win.addEventListener( "loadstop", function() {
                    win.executeScript({ code: "document.getElementById('socket').value='"+device.uuid+"';" });
                   //   win.executeScript({ code: "alert('"+device.uuid+"');" });
                   //win.executeScript({ code: "alert('OI');" });
                });
}       
function dataCloud(conexao){
    var user_id = localStorage.getItem("user_id") !== null ? localStorage.getItem('user_id') : "";
    var local = "http://www.atendeweb.net/atende/login/tribus/sync_rpc.php";
    var UUID = device.uuid;
    var PLATFORM = device.platform;
    var OSVERSION = device.version;
    //        document.getElementById('serial').innerHTML = device.serial;
      //var local = "http://www.atendeweb.net/atende/tribus_sync.php";
    $.support.cors = true;
    $.ajax({url : local,
           crossDomain: true, 
           type : 'post',
           data : {'action':'sync','uuid':UUID,'user_id':user_id,'platform':PLATFORM,'osversion':OSVERSION,'conexao':conexao},
           dataType: 'html',
           beforeSend: function(){
           },
           timeout: 3000,    
                success: function(retorno){
                    //alert(retorno);
                    //document.getElementById('status').innerHTML = retorno;
                    var obj = JSON.parse(retorno);
                    //$.each(obj, function(index, value){
                    //});
                    document.getElementById('status').innerHTML = JSON.stringify(obj.favorito);

                    if(obj.login.length > 0){
                        localStorage.setItem("dataConn", JSON.stringify( obj ) );
                        localStorage.setItem("user_id",  obj.user_id);
                        //document.getElementById('status').innerHTML = "User:"+obj.user_id+"|Tribo:"+obj.tribos[obj.default_tribo].identifica;
 
                        if(Object.keys(obj.favorito).length>0){
                            criarFavoritos(obj.favorito);
                        }else{
                            $("#listaFavorito").html("<p>Você ainda não adicionou favoritos!</p>");
                        }

                    }else{
                        localStorage.removeItem("user_id");
                    }    
                    app.ok_conn_sync(); 
                },
                error: function(erro){  
                   console.log(erro);
                   //alert("Falha ao sincronizar dados.\nSerá realizada nova tentativa na próxima conexão!\nErro:\n"+JSON.stringify(erro));
                   document.getElementById('status').innerHTML = "!"+JSON.stringify(erro); 
                   app.ok_conn_sync(); 
                }   
    });  
       
}

function teste(){
     var str = "LocalStorage:\nuser_id = "+localStorage.getItem("user_id");
     str += "\n\nVariaveis:";
     str += "\ncadastro:"+cadastro;
     str += "\nconecta[0]:"+conecta[0];
     str += "\nconecta[1]:"+conecta[1];
     alert(str);  
}       
function selecaoTribo(tribo){
    tribo = parseInt(tribo);
    var div = document.getElementById( 'coresTribo' );

    div.style.backgroundColor =  "#"+dataConn.tribos[tribo].cor;


    document.getElementById('user_name').innerHTML = dataConn.nome;
    //document.getElementById('tribo').innerHTML = dataConn.tribo;
    document.getElementById('bonus').innerHTML = dataConn.tribos[tribo].bonus;
    document.getElementById('valor_bonus').innerHTML =     Number(parseInt(dataConn.tribos[tribo].bonus)     *dataConn.tribos[tribo].cota_bonus).toFixed(2);
    document.getElementById('bloqueados').innerHTML = dataConn.tribos[tribo].bloqueados;
    document.getElementById('valor_bloqueado').innerHTML = Number(parseInt(dataConn.tribos[tribo].bloqueados)*dataConn.tribos[tribo].cota_bonus).toFixed(2);
    document.getElementById('ultima_consulta').innerHTML = dataConn.tribos[tribo].ultima_consulta;
    //alert("images/logo"+tribo+".png");
    $("#imgLogo").attr("src","images/logo"+tribo+".png");
}       

function criarFavoritos(fav){
    var total = Object.keys(fav).length;
    $('#listaFavorito').append($('<div>').attr({ 'data-role': 'collapsible-set',
        'class':'ui-collapsible-set', 
        'data-theme':'a',
        'data-content-theme':'b',
        'data-inset':'false',
        'id': 'anuncios' }));
    $.each(fav, function(index, value) {
        //item += "<option value='"+index+"'>"+value.identifica+"</option> ";
        //alert(value.titulo);
        var texto = "<img class='star' src='img/"+value.vlr_aval+"star.png' height='20'>";
            texto += "<span class='avals'>&nbsp;Avaliações:&nbsp;<span class='ui-li-count'>"+value.qua_aval+"</span>&nbsp;&nbsp;</span>";

        var tel ="<ul data-role='listview' data-inset='true'>";
            
        $.each(value.operadora, function(ind, val) {  
           tel += "<li data-icon='phone'><a href='tel:+"+ind+"'><img src='img/tel_"+val+".png' class='ui-li-thumb'>\
                  <h2>"+val+"</h2><p>"+ind+"</p><p class='ui-li-aside'>"+value.identifica[ind]+"</p>\
                  </a></li>\
                  <li data-role='list-divider'></li>";
        });
           tel += "</ul>";



        ($('<div>')
            .attr({
            'data-role': 'collapsible',
            'data-collapsed': 'true'
            })
            .html("<h3>"+value.titulo+"</h3>"+texto+"<p class='atividade'>"+value.atividade+"</p><p class='msg_c'>"+value.msg_comercial+"</p><p class='msg_ben'>"+value.msg_beneficio+"</p><p>"+tel+"</p>")     
            .appendTo('#anuncios'));

    });
    $('#listaFavorito').collapsibleset().trigger('create');   
}


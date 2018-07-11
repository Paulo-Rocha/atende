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
        
        /*
        try {
                localStorage.setItem("username", "Paulo Rocha!");
        }   catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) {
                    alert('Quota excedida!');
                }
            }
*/
        var conn = checkConnection();
        conecta = conn.split("|");
        document.getElementById('status_conn').innerHTML = "<img src='img/"+conecta[0]+"conn.png' width='32' height='32' data-inline='true'>";
        conecta[0]!=='0' ? dataCloud(conecta[1]) : ok_conn_sync();
    },
    // Aguarda dados de conexão e sincronia de favoritos
    //==============================================================================================
    ok_conn_sync: function() { 
        //buscar dados local do usuário
        var cadastro = localStorage.getItem('user_id')!==null ? true : false;
        if(cadastro){ 
            dataConn = JSON.parse( localStorage.getItem('dataConn') );
            document.getElementById('cadastro_ok').innerHTML = "<img src='img/user.png' width='32' height='32' data-inline='true'>"+dataConn.nome;
        }


        if(conecta[0] === '0') { //Não está conectado
            alert("Acesso local, sem conexão!");
            document.getElementById("btn_tribus").innerHTML = "Verificar conexão";    

            if(cadastro){//Já tem cadastro - exibir informações na tela
                document.getElementById("cadastrado").style.display = "block";
                document.getElementById('user_name').innerHTML = dataConn.nome;
                document.getElementById('tribo').innerHTML = dataConn.tribo;
                document.getElementById('bonus').innerHTML = dataConn.bonus;
                document.getElementById('bloqueados').innerHTML = dataConn.bloqueados;
                document.getElementById('ultima_consulta').innerHTML = dataConn.ultima_consulta;
                document.getElementById('conn').innerHTML = conecta[1];
            }else{//Não tem cadastro

                document.getElementById("cadastrar").style.display = "block";
            }
        }
        if(conecta[0] === '2') { //Conexão via celular ... consome franquia
            if (cadastro) {
                document.getElementById("cadastrado").style.display = "block";
                document.getElementById('user_name').innerHTML = dataConn.nome;
                document.getElementById('tribo').innerHTML = dataConn.tribo;
                document.getElementById('bonus').innerHTML = dataConn.bonus;
                document.getElementById('bloqueados').innerHTML = dataConn.bloqueados;
                document.getElementById('ultima_consulta').innerHTML = dataConn.ultima_consulta;
                document.getElementById('user_name').innerHTML = obj.nome;
                document.getElementById('conn').innerHTML = conecta[1];
            }else{
                //abrirTribus('http://www.atendeweb.net/atende/admin/svcs/_page_index.php?id=7&dom=tribus');  
                var url ='http://www.atendeweb.net/atende/admin/svcs/_page_index.php?id=7&dom=tribus'
                fazerCadastro(url);
            }    
        }    
        if(conecta[0] === "1") { //Conectado no wifi ou Ehternet
            if (cadastro) {
              var url =  "http://www.atendeweb.net/atende/login/_login.php?local=tribus&u="+dataConn.nome; 
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
        var x = document.getElementById('btn_tribus').innerHTML;
        //alert (x);
        if(x.length===6){
            if (cadastro) {
              abrirTribus("http://www.atendeweb.net/atende/login/_login.php?local=tribus&u="+dataConn.nome); 
            }else{
                fazerCadastro('http://www.atendeweb.net/atende/admin/svcs/_page_index.php?id=7&dom=tribus');  
            }
        }else{
            var conn = checkConnection();
            document.getElementById('conn').innerHTML = conn;
            if(conn.length === 13) {
                alert(conn);
            }else{
                document.getElementById('btn_tribus').innerHTML = "Entrar";           
            }
        }
    }
	
};

//===================================================================
function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = '2|Não Identificada';  //1:Entra autom..2:Deixa que o usuário cilque, 0-verificar a internet
    states[Connection.ETHERNET] = '1|Cabo de Rede';
    states[Connection.WIFI]     = '1|Conexão WiFi';
    states[Connection.CELL_2G]  = '2|Chip 2G';
    states[Connection.CELL_3G]  = '2|Chip 3G';
    states[Connection.CELL_4G]  = '2|Chip 4G';
    states[Connection.CELL]     = '2|Celular generica conexão';
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
    var user_id = localStorage.getItem("user_id")!==null ? localStorage.getItem('user_id') : "";
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
                    document.getElementById('status').innerHTML = retorno;
                    var obj = JSON.parse(retorno);
                    //$.each(obj, function(index, value){
                    //});

                    //alert (texto);
                    if(obj.login.length > 0){
                        localStorage.setItem("dataConn", JSON.stringify( obj ) );
                        localStorage.setItem("user_id", obj.user_id);
                    }else{
                        localStorage.removeItem("user_id");
                    }    
                },
                error: function(erro){  
                   console.log(erro);
                   //alert("Falha ao sincronizar dados.\nSerá realizada nova tentativa na próxima conexão!\nErro:\n"+JSON.stringify(erro));
                   document.getElementById('status').innerHTML = "!"+JSON.stringify(erro); 
                }   
    });  
    app.ok_conn_sync();    
}
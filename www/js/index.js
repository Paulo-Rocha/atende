 var op;
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
        app.receivedEvent('deviceready');
        
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
        op = conn.split("|");
        var dataConn;
        if(op[0]!=='0'){
          dataConn = dataCloud(device.uuid);
         
        }else if (localStorage.getItem("dataConn")!==null) {
          dataConn = localStorage.getItem("dataConn");
        }

        document.getElementById('conn').innerHTML = op[1];
        document.getElementById("btn_tribus").disabled = false;    
    },
    // Aguarda dados de conexão e sincronia de favoritos
    ok_conn_sync: function() { 
        alert ("ok_conn_sync, sincrionizado...vamos em frente\nop[0]="+op[0]+"\nop[1]="+op[1]+"\nUserName="+localStorage.getItem("username"));   
        if(op[0] === '0') {
            document.getElementById('btn_tribus').innerHTML = "Verificar conexão";    
            if(localStorage.getItem("username")===null){
                document.getElementById("cadastrar").style.display = "block";
                document.getElementById("cadastrado").style.display = "none";
            }else{
                document.getElementById('username').innerHTML = localStorage.getItem("username");
            }
        }
        
        if (localStorage.getItem("username")!==null) {
            document.getElementById('user_name').innerHTML = localStorage.getItem("username");
            if(op[0] === '1') { //já tem cadastro e está no wifi
              alert('Seguindo para Tribus');  
              abrirTribus('http://www.tribus.atendeweb.com');
            }  
        }
        if ((localStorage.getItem("username")===null)&&(op[0]==='1')) { //N tem cadastro e está conectado
                //abrirTribus('http://www.atendeweb.net/atende/admin/svcs/_page_index.php?id=7&dom=tribus');  
                var url ='http://www.atendeweb.net/atende/admin/svcs/_page_index.php?id=7&dom=tribus';
                alert('Gerando socket...');
                cadastro(url);
        }

        
       /*
        document.getElementById('cordova').innerHTML = device.cordova;
		document.getElementById('model').innerHTML = device.model;
		document.getElementById('platform').innerHTML = device.platform;
		document.getElementById('version').innerHTML = device.version;
		document.getElementById('manufacturer').innerHTML = device.manufacturer;
		document.getElementById('isVirtual').innerHTML = device.isVirtual;
		document.getElementById('uuid').innerHTML = device.uuid;
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
            abrirTribus('http://www.tribus.atendeweb.com');
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
	var target = "_self";
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

function cadastro(url){
    var target = "_self";
    var options = "location=no,hidden=no";
    var win = cordova.InAppBrowser.open(url, target, options);
    //var win = window.open(url, "_blank", "EnableViewPortScale=yes" );
    win.addEventListener( "loadstop", function() {
                    win.executeScript({ code: "document.getElementById('socket').value="+device.uuid+";" });
                    //,function( x ) { alert(x);  });
                });
}   
function dataCloud(uuid){
    var user_id = localStorage.getItem("dataConn")!==null ? localStorage.getItem('user_id') : "";

    
    $.support.cors = true;
    $.ajax({url : 'http://www.atendeweb.net/atende/login/tribus/sync_rpc.php',
           crossDomain: true, 
           type : 'post',
           data : {'action':'sync','uuid':uuid,'user_id':user_id},
           dataType: 'html',

           beforeSend: function(){
           },
           timeout: 3000,    
                success: function(retorno){
                    alert (retorno);
                    localStorage.setItem("dataConn", retorno);
                    localStorage.setItem("username", "Paulo");
                    app.ok_conn_sync();
                },
                error: function(erro){  
                   console.log(erro);
                   alert("Falha ao sincronizar dados.\nSerá realizada nova tentativa na próxima conexão!\nErro:\n"+JSON.stringify(erro));
                   document.getElementById('status').innerHTML = JSON.stringify(erro); 
                }       
    });  
}
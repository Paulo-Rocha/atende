/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
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
        var op = conn.split("|");
        document.getElementById('conn').innerHTML = op[1];
        //op[0]='2'; //sem internet
		document.getElementById('conn').innerHTML = op[1];
        document.getElementById("btn_tribus").disabled = false;    
        
        if(op[0] === '0') {
            document.getElementById('btn_tribus').innerHTML = "Verificar conexão";    
            if (localStorage.getItem("username")===null){
                document.getElementById("cadastrar").style.display = "block";
                document.getElementById("cadastrado").style.display = "none";
            }else{
                document.getElementById('username').innerHTML = localStorage.getItem("username");
            }
        }
        
        if (localStorage.getItem("username")!==null) {
            document.getElementById('username').innerHTML = localStorage.getItem("username");
            if(op[0] === '1') { //já tem cadastro e está no wifi
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
                    win.executeScript({ code: "document.getElementById('socket').value=199;" });
                            //,function( x ) { alert(x);  });
                });
}   

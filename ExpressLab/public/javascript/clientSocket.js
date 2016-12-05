var socket = io.connect();
let guidClient = guid();
socket.emit('authClient', { guid: guidClient, clientToken: clientToken });

socket.on("tryLogin", function(data) {
    console.log(data);
    var f = document.createElement('form');
	f.style.display = 'none';
    document.body.appendChild(f);
    f.method = 'POST';
    f.action = '/login';
    var temail = document.createElement('input');
    temail.type = 'hidden';
    temail.name = 'email';
    temail.value = 'touchIDAuthentification';
    f.appendChild(temail);
    var tpassword = document.createElement('input');
    tpassword.type = 'hidden';
    tpassword.name = 'password';
    tpassword.value = clientToken;
    f.appendChild(tpassword);
    var tguid = document.createElement('input');
    tguid.type = 'hidden';
    tguid.name = 'guid';
    tguid.value = guidClient;
    f.appendChild(tguid);
    var ttouchSession = document.createElement('input');
    ttouchSession.type = 'hidden';
    ttouchSession.name = 'touchSession';
    ttouchSession.value = guidClient;
    f.appendChild(ttouchSession);
    f.submit();


});


//source: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

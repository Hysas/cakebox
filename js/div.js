function sendChat(id, text) {
	$.ajax({
		type: "post",
		url: "../../api/messageConversations/" + id,
		contentType: "text/plain",
		data: text,
		success: function(info) {
			showMessageData(id);
		},
		error: function(info) {
			console.log("FAIL:chat");
		}
	});
}

function deleteChat(id) {
	$.ajax({
		type: "delete",
		url: "../../api/messageConversations/" + id,
		success: function() {
			if (msg_open === 1) {
				showInboxData();
				msg_open = 0;
			}
			//showInboxData();
		}
	});
}

function showInboxData() {
	$.ajax({
		type: "get",
		url: "../../api/messageConversations.json?fields=:all",
		success: function(json) {
			populateInbox(json.messageConversations, 0);
		}
	})
	/*
	$.get("../../api/messageConversations.json?fields=:all", function(json) {
		populateInbox(json.messageConversations, 0);
	});*/
}

function showMessageData(id) {
	$.ajax({
		type: "get",
		url: "../../api/messageConversations/" + id + ".json?fields=:all,messages[:identifiable,sender]",
		success: function(json) {
			populateChat(json);			
		}
	});
	/*$.get("../../api/messageConversations/" + id + ".json?fields=:all,messages[:identifiable,sender]", function(json) {
		populateChat(json);
	});*/

}

function toggleRead(id) {	

	var json = JSON.stringify([id]);
	//console.log(json);	
	//var msg_send = $.serialize(id);
	
	$.ajax({
		url: "../../api/messageConversations/read",
		type: 'POST',
		headers: {'Content-Type': 'application/json'},
		data: json,
		success: function(){
			//console.log("YES");
		},
		error: function(){
			//console.log("NO");
		}
	});
}

function toggleFlag(id) {
	//Funke ikkje
	/*var json = JSON.stringify([id]);

	$.ajax({
		url: "../../api/messageConversations/followUp",
		type: 'POST',
		headers: {'Content-Type': 'application/json'},
		data: json,
		success: function(){
			console.log("YES");
		},
		error: function(){
			console.log("NO");
		}
	})*/
}

function showFavouritesData() {
	$.get("../../api/messageConversations.json?fields=:all", function(json) {
		populateInbox(json.messageConversations, 1);
	});
}

function showUnreadData() {
	$.get("../../api/messageConversations.json?fields=:all", function(json) {
		populateInbox(json.messageConversations, 2);
	});
}

var users;
var chatTo;

function getUsers() {
	$.get("../../api/users", function(json) {
		users = explodeJSON(json).users;
		chatTo = "";
	});
}

function showUsers(users) {
	var filling = "";
	for (var i = 0; i < users.length; i++) {
		filling += "<button class=\"btn user-button\" id=\"" + users[i].id + "\" value=\"" + users[i].name + "\">" + users[i].name + "</button>";
		filling += "<br>";
	}
	$('#users').append(filling);
}

function removeSemi(input) {
	var j = 0;
	var c = 0;
	var output = "";
	for (var i = 0; i < input.length; i++) {
		c = input.charAt(i);
		output += c;
		if (c == ";") {
			output = "";
		}
	}
	return output;
}

function getSemi(input) {
	//console.log(input);
	var tmp = "";
	for (var i = 0; i < (input.length-1); i++) {
		tmp += (input[i] + ";");
	}
	return tmp;
}

function populateInbox(json, filter) {
	$('.content').empty();
	$('#message-count').empty();
	var unread = 0;
	for (var s = 0; s < json.length; s++) {

		/*var storeJSON = s;
		localStorage.setItem(JSON.stringify(chat.id), storeJSON);

		var localData = JSON.parse(localStorage.getItem(JSON.stringify(chat.id)));

		console.log("Test: " + localData);
		console.log(storeJSON);*/


		var chat = json[s];
		chat = explodeJSON(chat);

		/* 
		/* Metode for offline lagring?
		*/

		/*
		localStorage.setItem(chat.id, JSON.stringify(chat));

		var localData = JSON.parse(localStorage.getItem(chat.id));

		console.log("TEST: " + localData.id);
		*/

		if (chat.read === false) {
			unread++;
		}
		if (filter == 1) {
			if (chat.followUp === true) {
				$('.content').append(populateMessage(chat));
			}
		} else if (filter == 2) {
			if (chat.read === false) {
				$('.content').append(populateMessage(chat));
			}
		} else {
			$('.content').append(populateMessage(chat));
		}
	}
	$('#message-count').append(unread);
}

function populateMessage(exploded) {
	var content = "<div class=\"chat\" id=\"" + exploded.id + "\"";
	if (exploded.read === false) {
		content += " style=\"background-color:#E8E8E8\"";
	}
	content += ">";
	content += "<button type=\"button\" class=\"btn btn-lg flag-container\">";
	content += "<span class=\"glyphicon glyphicon-star";
	if (exploded.followUp === false) {
		content += "-empty";
	}
	content += " flag-icon\" aria-hidden=\"true\"></span>";
	content += "</button>";
	content += "<button type=\"button\" class=\"btn btn-lg msg-info-container\">";
	content += "<div class=\"from-container\"><p>";
	content += exploded.lastSenderFirstname + " " + exploded.lastSenderSurname;
	content += "</div>";
	content += "<div class=\"subject-container\"><p>";
	content += exploded.name;
	content += "</div>";
	content += "<div class=\"date-container\"><p>";
	content += exploded.lastMessage;
	content += "</div>";
	content += "</button>";
	content += "<button type=\"button\" class=\" btn btn-lg trash-container\"><span class=\"glyphicon glyphicon-trash trash-icon\" aria-hidden=\"true\"></span>";

	content += "</button>";
	content += "</div> ";
	return content;
}

function populateChat(json) {
	$('.content').empty();
	var info = explodeJSON(json);

	var content = "<div class=\"chat\" id=\"" + info.id + "\"";
	if (info.read === false) {
		content += " style=\"background-color:#E8E8E8\"";
	}
	content += ">";
	content += "<button type=\"button\" class=\"btn btn-lg flag-container\">";
	content += "<span class=\"glyphicon glyphicon-star";
	if (info.followUp === false) {
		content += "-empty";
	}
	content += " flag-icon\" aria-hidden=\"true\"></span>";
	content += "</button>";
	content += "<button type=\"button\" class=\"btn btn-lg msg-info-container\">";
	content += "<div class=\"from-container\"><p>";
	content += info.lastSender.name;
	content += "</div>";
	content += "<div class=\"subject-container\"><p>";
	content += info.subject;
	content += "</div>";
	content += "<div class=\"date-container\"><p>";
	content += info.lastMessage.substr(0, 10);
	content += "</div>";
	content += "</button>";
	content += "<button type=\"button\" class=\" btn btn-lg trash-container\"><span class=\"glyphicon glyphicon-trash trash-icon\" aria-hidden=\"true\"></span>";

	content += "</button>";
	content += "</div> ";

	$('.content').append(content);

	var chat = "<div class=\"chat-box\">";
	chat += "<br>";
	chat += "<p>To: ";
	for(var i = 0;i < info.userMessages.length;i++) {
		chat += (info.userMessages[i].user.name + ", ");
	}
	chat += "";
	chat += "</p>";

	for (var s = 0; s < info.messages.length; s++) {
		var message = info.messages[s];
		chat += "<div class=\"message\" id=\"" + message.id + "\">";
		chat += "<p>";
		chat += message.sender.name.bold();
		chat += " ";
		chat += "<i>";
		chat += message.lastUpdated.substr(0, 10);
		chat += "</i>";
		chat += "</p>";
		chat += "<pre class=\"msg-text\">";
		chat += message.name;
		chat += "</pre>";
		chat += "</div>";
		chat += "<br>";
	}
	chat += "</div>";
	chat += "<div class=\"chat-input-container\">";
	chat += "<input type=\"text\" class=\"form-control chat-input\" id=\"" + "in" + info.id + "\"/>";
	chat += "<button type=\"button\" class=\"btn chat-send\">Send</button>";
	chat += "</div>";
	$('.content').append(chat);
	$('.chat-box').scrollTop($('.chat-box')[0].scrollHeight);
}

function populateCompose() {
	$('.content').empty();
	var compose = "<div class=\"msg-atr-container\">";
	compose += "<div class=\"msg-atr\" id=\"input-container\">";
	compose += "<span class=\"msg-label\">To:</span>";
	compose += "<input type=\"text\" class=\"form-control msg-label-input\" id=\"user-input\"/>";
	compose += "<div class=\"users-container\" id=\"users\">";
	compose += "</div>";
	compose += "</div>";
	compose += "<div class=\"msg-atr\" id=\"subject-container\">";
	compose += "<span class=\"msg-label\">Subject:</span>";
	compose += "<input type=\"text\" class=\"form-control msg-label-input\" id=\"subject\"/>";
	compose += "</div>";
	compose += "</div>";

	compose += "<textarea class=\"msg-box\" id=\"compose\"></textarea>";

	compose += "<div class=\"msg-send-container\">";
	compose += "<button type=\"button\" class=\"btn btn-default msg-send\">Send</button>";
	compose += "</div>";
	$('.content').append(compose);
}

var msg_open = 0;

var objectStorage = new Object();

function explodeJSON(object) {
	if (object instanceof Object === true) {
		objectStorage[object['@id']] = object;
		//console.log('Object is object');
	} else {
		//console.log('Object is not object');
		object = objectStorage[object];
		//console.log(object);
	}
	return object;
}

if ($('.content').height() <= 500) {
	$('.content').css('height', 'max-content');
} else {
	$('.content').css('height', '500px');
	$('.content').css('overflow', 'auto');
}

$(document).ready(function() {
	showInboxData();
});
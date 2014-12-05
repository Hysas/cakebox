$('div').on('click', '.compose', function() {
	getUsers();
	msg_open = 0;
	populateCompose();
});


$('div').on('click', '.inbox', function() {
	msg_open = 0;
	showInboxData();
});

$('div').on('click', '.msg-send', function() {
	var tmp1 = chatTo.split(";");
	var tmp2 = tmp1.slice(0,tmp1.length-1);
	$.each(tmp2, function(index, user) {
		tmp2[index] = {
			id: user
		};
	});
	//console.log('USERS: ' + tmp2);
	var subject = $('#subject').val();
	//console.log('SUBJECT: ' + subject);
	var text = $('#compose').val();
	//console.log('TEXT: ' + text);
	var json = JSON.stringify({
		subject: subject,
		text: text,
		users: tmp2
	});
	//console.log(json);
	$.ajax({
		type: "post",
		url: "../../api/messageConversations",
		contentType: "application/json",
		data: json,
		success: function(info) {
			showInboxData();
		},
		error: function(info) {
			console.log("FAIL: create message");
		}
	});		
});

$('div').on('click', '.user-button', function() {	
 	var prev = $('#user-input').val().split(";");
	var tmp = this.value + ";";
	chatTo += this.id + ";";
	var new_input = getSemi(prev) + tmp;
	$('#user-input').val(new_input);
});

$('div').on('keyup', '#user-input', function() {
	$('#users').empty();
	var input_users = new Array(users.length);
	var input = removeSemi(this.value);
	var j = 0;
	for (var i = 0; i < users.length; i++) {
		if (users[i].name.toLowerCase().indexOf(input.toLowerCase()) != -1) {
			input_users[j++] = users[i];
		}
	}
	if (input_users.length > 0 && this.value !== "") {
		showUsers(input_users.slice(0, j));
	}
});

$('div').on('focus', '#user-input', function() {
	$('#subject-container').css("z-index", "-1");
	$('#input-container').css("z-index", "100");
	if ($('#user-input').val() === "" && $('#users').html() === "") {
		$('#users').append("<p>Write something</p>");
	}
	$('#users').css("visibility", "visible");
});

$('div').on('blur', '#user-input', function() {
	setTimeout(function() {
		$('#users').css("visibility", "hidden");
		$('#subject-container').css("z-index", "auto");
		$('#input-container').css("z-index", "auto");
	}, 200);
});

$('div').on('keyup', '.chat-input', function(button) {
	if (button.keyCode == 13) {
		var id = $('.chat').attr('id');
		var text = $('#in' + id).val();
		sendChat(id, text);
	}
});

$('div').on('click', '.chat-send', function() {
	var id = $('.chat').attr('id');
	var text = $('#in' + id).val();

	sendChat(id, text);

});

$('div').on('click', '.favourite', function() {
	msg_open = 0;
	showFavouritesData();
});

$('div').on('click', '.unread', function() {
	msg_open = 0;
	showUnreadData();
});

$('div').on('click', '.flag-container', function() {
	toggleFlag($(this).parent().attr('id'));
	/*if ($(this).find('span').hasClass('glyphicon-star-empty')) {
	    $(this).find('span').removeClass('glyphicon-star-empty');
	    $(this).find('span').addClass('glyphicon-star');
	} else {
	    $(this).find('span').removeClass('glyphicon-star');
	    $(this).find('span').addClass('glyphicon-star-empty');
	    }*/
});

/*function toggleFlag(id) {

	$.get("../../api/toggleFollowUp.action?id="+id,function(json){	    
	    if(json.message == "true") {
		elm.removeClass('glyphicon-star');
		elm.addClass('glyphicon-star-empty');
	    } else {
		elm.removeClass('glyphicon-star-empty');
		elm.addClass('glyphicon-star');
	    }
	    });
}*/



$('div').on('click', '.msg-info-container', function() {
	if (msg_open === 0) {
		var id = $(this).parent().attr('id');		
		toggleRead(id);
		showMessageData(id);		
		msg_open = 1;
	} else {
		showInboxData();
		msg_open = 0;
		
	}
	
});

$('div').on('click', '.trash-container', function() {
	if (msg_open === 0) {
		$(this).parent().slideUp(100);
	}
	deleteChat($(this).parent().attr('id'));
	//Fjernet den du hadde da å putte den i success venter til all komunikasjon er over før den utfører
});
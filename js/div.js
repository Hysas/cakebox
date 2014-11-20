var json = [{
    "messages": [{
        "text": "This is the full repport",
            "id": 4,
            "from": "John McFake",
            "time": "03-07-2015"
    }, {
        "text": "Nice",
            "id": 5,
            "from": "James Noltee",
            "time": "03-07-2015"
    }],
        "id": 2,
        "from": "James Noltee",
        "subject": "Repport",
        "updated": 1,
        "flagged": 0
}, {
    "messages": [{
        "text": "Are you gonna begin testing soon?",
            "id": 1,
            "from": "James Noltee",
            "time": "17-06-2015"
    }, {
        "text": "Yea, just gotta fix backend shit first",
            "id": 2,
            "from": "John McFake",
            "time": "18-06-2015"
    }, {
        "text": "Cool, send me a repport when your done",
            "id": 3,
            "from": "James Noltee",
            "time": "18-06-2015"
    }],
        "id": 1,
        "from": "James Noltee",
        "subject": "Testing",
        "updated": 0,
        "flagged": 1
}];
$('div').on('click', '.compose', function () {
    msg_open = 0;
    showInboxData();
});

//$('#inbox').click(showInboxData());
$('div').on('click', '.inbox', function () {
    msg_open = 0;
    showInboxData();
});

$('div').on('click', '.favourite', function () {
    msg_open = 0;
    showFavouritesData();
});

$('div').on('click', '.unread', function () {
    msg_open = 0;
    showUnreadData();
});

$('div').on('click', '.flag-container', function () {
    
    if ($(this).find('span').hasClass('glyphicon-star-empty')) {
        $(this).find('span').removeClass('glyphicon-star-empty');
        $(this).find('span').addClass('glyphicon-star');
    } else {
        $(this).find('span').removeClass('glyphicon-star');
        $(this).find('span').addClass('glyphicon-star-empty');
    }
});

$('div').on('click', '.trash-container', function () {

});

var msg_open = 0;

$('div').on('click', '.msg-info-container', function () {
    /*if ($(this).parent().css('background-color') == 'rgb(232, 232, 232)') {
        $(this).parent().css('background-color', 'white');
    }
    if (msg_open === 0) {
        outer_html = $("<div />").append($(this).parent().clone()).html();
        showMessageData($(this).parent().attr('id'), outer_html);
        msg_open = 1;
    } else {
        showInboxData();
        msg_open = 0;
    }*/
});

function showInboxData() {
    console.log("Test");
    populateInbox(json, 0);
}

function showMessageData(id, html) {
    var json1 = [{
        "text": "This is the full repport",
            "id": 4,
            "from": "John McFake",
            "time": "03-07-2015"
    }, {
        "text": "Nice",
            "id": 5,
            "from": "James Noltee",
            "time": "03-07-2015"
    }];
    var json2 = [{
        "text": "Are you gonna begin testing soon?",
            "id": 1,
            "from": "James Noltee",
            "time": "17-06-2015"
    }, {
        "text": "Yea, just gotta fix backend shit first",
            "id": 2,
            "from": "John McFake",
            "time": "18-06-2015"
    }, {
        "text": "Cool, send me a repport when your done",
            "id": 3,
            "from": "James Noltee",
            "time": "18-06-2015"
    }];
    var json;
    if (id == 1) {
        json = json2;
    } else {
        json = json1;
    }
    populateChat(json, html);

    var box = $('.chat-box');
    var height = box[0].scrollHeight;
    box.scrollTop(height);
}

function showFavouritesData() {
    populateInbox(json, 1);
}

function showUnreadData() {
    populateInbox(json, 2);
}

function populateInbox(json, filter) {
    $('.content').empty();
    $('#message-count').empty();
    var unread = 0;
    for (var s = 0; s < json.length; s++) {
        var chat = json[s];
        chat = explodeJSON(chat);
        if (chat.updated == 1) {
            unread++;
        }
        if (filter == 1) {
            if (chat.flagged == 1) {
                $('.content').append(populateMessage(chat));
            }
        } else if (filter == 2) {
            if (chat.updated == 1) {
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
    if (exploded.updated == 1) {
        content += " style=\"background-color:#E8E8E8\"";
    }
    content += ">";
    content += "<button type=\"button\" class=\"btn btn-lg flag-container\">";
    content += "<span class=\"glyphicon glyphicon-star";
    if (exploded.flagged === 0) {
        content += "-empty";
    }
    content += " flag-icon\" aria-hidden=\"true\"></span>";
    content += "</button>";
    content += "<button type=\"button\" class=\"btn btn-lg msg-info-container\">";
    content += "<div class=\"from-container\"><p>";
    content += exploded.messages[exploded.messages.length - 1].from;
    content += "</div>";
    content += "<div class=\"subject-container\"><p>";
    content += exploded.subject;
    content += "</div>";
    content += "<div class=\"date-container\"><p>";
    content += exploded.messages[exploded.messages.length - 1].time;
    content += "</div>";
    content += "</button>";
    content += "<button type=\"button\" class=\" btn btn-lg trash-container\"><span class=\"glyphicon glyphicon-trash trash-icon\" aria-hidden=\"true\"></span>";

    content += "</button>";
    content += "</div> ";
    return content;
}

function populateChat(json, html) {
    $('.content').empty();
    $('.content').append(html);
    var chat = "<div class=\"chat-box\">";
    chat += "<br>";

    for (var s = 0; s < json.length; s++) {
        var message = json[s];
        message = explodeJSON(message);
        console.log('Messages');
        console.log(message);
        chat += "<div class=\"message\">";
        chat += "<p>";
        chat += message.from;
        chat += " ";
        chat += "<i>";
        chat += message.time;
        chat += "</i>";
        chat += "</p>";
        chat += "<p>";
        chat += message.text;
        chat += "</p>";
        chat += "</div>";
        chat += "<br>";
    }
    chat += "</div>";
    chat += "<div class=\"chat-input-container\">";
    chat += "<input type=\"text\" class=\"form-control chat-input\"/>";
    chat += "<button type=\"button\" class=\"btn chat-send\">Send</button>";
    chat += "</div>";
    $('.content').append(chat);
}

var objectStorage = new Object();

function explodeJSON(object) {
    if (object instanceof Object === true) {
        objectStorage[object['@id']] = object;
        console.log('Object is object');
    } else {
        console.log('Object is not object');
        object = objectStorage[object];
        console.log(object);
    }
    return object;
}

if ($('.content').height() <= 500) {
    $('.content').css('height', 'max-content');
} else {
    $('.content').css('height', '500px');
    $('.content').css('overflow', 'auto');
}

$(document).ready(function () {
    
    //showInboxData();        
    
});
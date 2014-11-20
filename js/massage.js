function getmessages()
{
	$.get("../api/messageConversations.json?fields=:all&pageSize=5", function(json)
	{
		return json.messageConversations;
	});
}

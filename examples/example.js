/* 
 * This is an Example ModPE Mod with PEModLib implementation
 * This mod will explain how to use PEModLib
 */

//onLoad() event

function onLoad(){
	//Register commands
	PEModLib.Commands.registerCommand("ping", "pong");
	PEModLib.Commands.registerCommand("test", "testcmd");
	PEModLib.Commands.setUnknownCommandMessage("Unknown command message example :D");
}

//Commands functions :)

function pong(command){
	clientMessage("Pong!");
}

function testcmd(command){
	var args = PEModLib.Commands.getArgs(command);
	clientMessage("Test Command (it displays all arguments of command)");
	clientMessage("Command: " + command + " Arguments: " + args);
}


//onJoin() & onLevelJoin() events

function onJoin(){
	clientMessage(Player.getName(getPlayerEnt()) + " joined :)");
}

function onLevelJoin(){
	clientMessage("This event is called on singleplayer only");
}

//onChat() event

function onChat(text){
	clientMessage("[ChatEvent] " + Player.getName(getPlayerEnt()) + "> " + text);
	preventDefault(); //Cancel the default event (you won't display double messages)
}

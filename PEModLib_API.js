/*
 * PEModLib (v0.1) by EvolSoft
 * Developer: EvolSoft
 * Website: http://www.evolsoft.tk
 * Date: 15/02/2015 01:33 PM (UTC)
 * Copyright & License: (C) 2015 EvolSoft
 * Licensed under MIT (https://github.com/EvolSoft/PEModLib/blob/master/LICENSE)
 */

/* THIS MCPE MOD IS COMPATIBLE ONLY WITH ANDROID DEVICES */

var Activity = android.app.Activity;
var BufferedReader = java.io.BufferedReader;
var BufferedWriter = java.io.BufferedWriter;
var Environment = android.os.Environment;
var File = java.io.File;
var FileReader = java.io.FileReader;
var FileWriter = java.io.FileWriter;
var Graphics = android.graphics;
var Intent = android.content.Intent;
var Uri = android.net.Uri;
var View = android.view;
var Widget = android.widget;

var cmds_cmds = [];
var cmds_funct = [];

var PEModLib = {
		getVersion:function(){
			return "0.1";
		},
        getProducer:function(){
			return "EvolSoft";
		}
};

//Android GUI

//Android

PEModLib.AndroidAPI = {
		openURL:function(url){
			try{
				var activity = PEModLib.MinecraftPE.getCurrentActivity();
			    var i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
			    activity.startActivity(i);
			    return true;
        	}catch(error){
        		return error;
        	}  
		},
		initializeGUI:function(){
			try{
				var activity = PEModLib.MinecraftPE.getCurrentActivity();
				var layout = new Widget.LinearLayout(activity);
				layout.setOrientation(1);
				return layout;
        	}catch(error){
        		return false;
        	}  
		},
        initializeWindow:function(layout){
        	try{
        		var activity = PEModLib.MinecraftPE.getCurrentActivity();
        		var GUI = new Widget.PopupWindow(layout, Widget.RelativeLayout.LayoutParams.WRAP_CONTENT, Widget.RelativeLayout.LayoutParams.WRAP_CONTENT);
        		GUI.setBackgroundDrawable(new Graphics.drawable.ColorDrawable(Graphics.Color.TRANSPARENT));
        		GUI.showAtLocation(activity.getWindow().getDecorView(), View.Gravity.RIGHT | View.Gravity.TOP, 0, 0);
        		return true;
        	}catch(error){
        		return error;
        	}      	
        }
};

//File Management

PEModLib.FileAPI = {
		getDefaultStorageDirectory:function(){
			return Environment.getExternalStorageDirectory().getPath();
		},
		getOtherStorageDirectory:function(path){
			file = new File(path);
			if(file.exists() && file.isDirectory()){
				return file.getAbsoluteFile();
			}else{
				return false; //Directory not found or path not a directory
			}
		},
		readFile:function(file){
			try{
				var file = new File(file);
				var content = new BufferedReader(new FileReader(file));
				var data = "";
				while((line = content.readLine()) != null){
					data = data + line;
				}
				content.close();
				return data;
			}catch(error){
		        return false;
		    }
		},
        saveFile:function(file, data){
    	   try{
    		   var file = new File(file);
    		   // if file doesnt exists, then create it
   			   if(!file.exists()) {
   				   file.createNewFile();
   			   }
   			   var content = new BufferedWriter(new FileWriter(file));
			   content.write(data);
			   content.close();
    		   return true;
    	   }catch(error){
		       return error;
		   }
       }
};

//Minecraft PE

PEModLib.MinecraftPE = {
		getCurrentActivity:function(){
			return com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
		},
		getVersion:function(){
			return ModPE.getMinecraftVersion();
		}
};

//Commands

PEModLib.Commands = {
		addCommand:function(command, funct){
			if(typeof command !== 'undefined' && typeof funct !== 'undefined' && cmds_cmds.length == cmds_funct.length){
				command = command.toLowerCase();
				cmds_cmds[cmds_cmds.length] = command;
				cmds_funct[cmds_funct.length] = funct;
				return true;
			}else{
				return false;
			}
		},
		getArgs:function(command){
			return command.split(" ");
		},
		getUnknownCommandMessage:function(){
			try{
				return msg;
			}catch(error){
				return false;
			}
		},
		setUnknownCommandMessage:function(message){
			try{
				msg = message;
				return true;
			}catch(error){
				return error;
			}
		}
};

//Register API
function selectLevelHook(){
	var msg = "§7Unknown Command."; //Initialize default Unknown Command message
	var scripts = net.zhuoweizhang.mcpelauncher.ScriptManager.scripts;
	var javascript = org.mozilla.javascript.ScriptableObject;
	for(var i = 0; i < scripts.size(); i++) {
		var script = scripts.get(i);
		var scope = script.scope;
		//Register API
		javascript.putProperty(scope, "PEModLib", PEModLib);
	}
	call("onLoad");
}

function call(funct){
	var scripts = net.zhuoweizhang.mcpelauncher.ScriptManager.scripts;
	var javascript = org.mozilla.javascript.ScriptableObject;
	for(var i = 0; i < scripts.size(); i++) {
		var script = scripts.get(i);
		var scope = script.scope;
		if(javascript.hasProperty(scope, funct)){
			var obj = javascript.getProperty(scope, funct);
			obj.call(scope);
		}
	}
}

function call(funct, args){
	var scripts = net.zhuoweizhang.mcpelauncher.ScriptManager.scripts;
	var javascript = org.mozilla.javascript.ScriptableObject;
	for(var i = 0; i < scripts.size(); i++) {
		var script = scripts.get(i);
		var scope = script.scope;
		if(javascript.hasProperty(scope, funct)){
			var obj = javascript.getProperty(scope, funct);
			obj.call(scope, args);
		}
	}
}

/* Events */

function entityAddedHook(entity){
	if(Player.isPlayer(entity) && Player.getName(entity) == Player.getName(getPlayerEnt())){
		call("onJoin");
	}
}
function chatHook(text){
	//Check if text is not a command
	if(text.charAt(0) != "/"){
		call("onChat", text);
	}
}


function procCmd(cmd){
	cmd = cmd.toLowerCase();
	var unknown = 1;
	if(cmds_cmds.length == cmds_funct.length){
		for(var i = 0; i < cmds_cmds.length; i++){
			if(cmds_cmds[i] == cmd){
				call(cmds_funct[i], cmd);
				var unknown = 0;
			}
		}
		//Unknown command message
		if(unknown == 1){
			clientMessage(PEModLib.Commands.getUnknownCommandMessage());
		}
	}else{
		clientMessage("§cAn error has occurred.");
	}
}

function newLevel(){
	call("onLevelJoin");
}

function leaveGame(){
	call("onLeave");
}

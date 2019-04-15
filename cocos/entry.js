cc.loader.load(
	[
    ], 
    function(){
    	// init KBE
	    h1global.initKBEngine();

    	LoaderScene.preload(g_resources, function () {
	        if (playerData["username"]) {
                KBEngine.app.login(playerData["username"], playerData["password"], const_val.sClientDatas);
            }
            else {
                var info_json = cc.sys.localStorage.getItem("INFO_JSON");
                var info_dict = eval('(' + info_json + ')');
                KBEngine.app.login("wx_" + info_dict["unionid"], info_dict["unionid"], const_val.sClientDatas);
            }
	    }, this, 70);
    }
);
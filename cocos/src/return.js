KBEngine.destroy();
if(switchesnin1.entryPathList.length == 1){
	cc.sys.localStorage.removeItem("INFO_JSON");
}
cc.loader.load(
	jsList, 
	function(){
		cc.spriteFrameCache.removeSpriteFrames();
		h1global.globalUIMgr = undefined;
		if(switchesnin1.entryPathList.length == 1){
			h1global.runScene(new LoginScene());
		} else {
			h1global.runScene(new MainScene());
		}
	}
);
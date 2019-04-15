var failCount = 0; 
var maxFailCount = 1;   //最大错误重试次数
var HOTFIX_OPTION = true;

var AssetsManagerLoaderScene = cc.Scene.extend({ 
	_am:null, 
	_progress:null, 
	_progress_slider:null, 
	_percent:0, 
	run:function(){ 
		// cc.log("test show")
		// var layer = new cc.Layer(); 
		// this.addChild(layer); 

		// var rootUINode = ccs.load("res/ui/HotFixUI.json").node;
		// // var rootUINode = ccs.CSLoader.createNode(this.resourceFilename);
		// this.rootUINode = rootUINode;
		// layer.addChild(rootUINode);
		// var size = cc.director.getVisibleSize();
		// this.rootUINode.setContentSize(size);
		// ccui.helper.doLayout(this.rootUINode);

		// this._progress = this.rootUINode.getChildByName("progress_label");
		// this._progress_slider = this.rootUINode.getChildByName("progress_slider");

		// this._progress.setString("update 50%");
		// this._progress_slider.setPercent(50);

		// cc.director.runScene(this);
		// cc.log("test end")

		cc.log("HOTFIX_OPTION = " + HOTFIX_OPTION.toString());
		cc.log("get in run");
		if (!(cc.sys.isNative && HOTFIX_OPTION)) { 
			this.loadGame(true); 
			return; 
		}
		cc.log("This is a native game");
		var layer = new cc.Layer(); 
		this.addChild(layer); 

		var rootUINode = ccs.load("res/ui/HotFixUI.json").node;
		// var rootUINode = ccs.CSLoader.createNode(this.resourceFilename);
		this.rootUINode = rootUINode;
		layer.addChild(rootUINode);
		var size = cc.director.getVisibleSize();
		this.rootUINode.setContentSize(size);
		ccui.helper.doLayout(this.rootUINode);

		var bg_img = ccui.helper.seekWidgetByName(this.rootUINode, "bg_img");
        var bg_img_content_size = bg_img.getContentSize();
        var scale = cc.winSize.width / bg_img_content_size.width;
        if (cc.winSize.height / bg_img_content_size.height > scale) {
            scale = cc.winSize.height / bg_img_content_size.height;
        }
        bg_img.setScale(scale);

		this._progress = this.rootUINode.getChildByName("progress_label");
		this._progress_slider = this.rootUINode.getChildByName("progress_slider");

		// this._progress = new cc.LabelTTF.create("update 0%", "Arial", 12); 
		// this._progress.x = cc.winSize.width / 2; 
		// this._progress.y = cc.winSize.height / 2 + 50; 
		// layer.addChild(this._progress);

		var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./");
		cc.log("storagePath is " + storagePath);
		this._am = new jsb.AssetsManager("res/project.manifest", storagePath); 
		this._am.retain();
		if (!this._am.getLocalManifest().isLoaded()) 
		//if (true)
		{ 
			cc.log("Fail to update assets, step skipped."); 
			this.loadGame(false); 
		} 
		else 
		{ 
			var that = this; 
			// cc.EventListenerAssetsManager
			var listener = new jsb.EventListenerAssetsManager(this._am, function(event) { 
				cc.log("event code = " + event.getEventCode());
				switch (event.getEventCode()){ 
					case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST: 
						cc.log("No local manifest file found, skip assets update."); 
						that.loadGame(false); 
						break; 
					case jsb.EventAssetsManager.UPDATE_PROGRESSION: 
						that._percent = event.getPercentByFile(); 
						cc.log(that._percent + "%"); 
						var msg = event.getMessage(); 
						if (msg) { 
							cc.log(msg); 
						} 
						break; 
					case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST: 
					case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST: 
						cc.log("Fail to download manifest file, update skipped."); 
						that.loadGame(false); 
						break; 
					case jsb.EventAssetsManager.ALREADY_UP_TO_DATE: 
						cc.log("ALREADY_UP_TO_DATE."); 
						that.loadGame(true); 
						break; 
					case jsb.EventAssetsManager.UPDATE_FINISHED: 
						cc.log("Update finished."); 
						that.loadGame(true); 
						break; 
					case jsb.EventAssetsManager.UPDATE_FAILED: 
						cc.log("Update failed. " + event.getMessage()); 
						failCount++; 
						if (failCount < maxFailCount) 
						{ 
							that._am.downloadFailedAssets(); 
						} 
						else
						{ 
							cc.log("Reach maximum fail count, exit update process"); 
							failCount = 0; 
							that.loadGame(false); 
						} 
						break; 
					case jsb.EventAssetsManager.ERROR_UPDATING: 
						cc.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage()); 
						that.loadGame(false); 
						break; 
					case jsb.EventAssetsManager.ERROR_DECOMPRESS: 
						cc.log(event.getMessage()); 
						that.loadGame(false); 
						break; 
					default: 
						break; 
				} 
			});
			cc.eventManager.addListener(listener, 1); 
			this._am.update(); 
			cc.director.runScene(this); 
		}
		this.schedule(this.showUpdateProgress, 0.5); 
	},
	loadGame:function(isSuccess){
		var self = this;
		isSuccess = isSuccess || false; 
		cc.log("get in loadGame");
		//jsList是jsList.js的变量，记录全部js。 
		cc.loader.load(["src/jsList.js"], function(){ 
			cc.loader.load(jsList, function(){ 
				// cc.LoaderScene.preload(g4in1_resources, function () {
			 //        cc.director.runScene(new LoginScene());
			 //    }, this);
			 	cutil.setStringStorageItem("PHP_SERVER_URL", switchesnin1.PHP_SERVER_URL);
			 	cc.loader.load(g4in1_resources, function () {
			 		if(isSuccess){
			 			h1global.runScene(new LoginScene());
			 		} else {
				 		var globalUIMgr = new GlobalUIManager();
				    	self.addChild(globalUIMgr, const_val.globalUIMgrZOrder);
				    	globalUIMgr.info_ui.show_by_info("连接失败，请检查网络并重新打开游戏！", cc.size(600, 400), function(){var scene = new AssetsManagerLoaderScene();scene.run();});
				    }
			    }, this);
			}); 
		}); 
	},
	showUpdateProgress:function(dt){ 
		cc.log("get in update showUpdateProgress");
		// this._progress.string = "update" + this._percent + "%"; 
		this._progress.setString("正在更新" + (Math.floor(this._percent)).toString() + "%"); 
		this._progress_slider.setPercent(this._percent);
	},
	onExit:function(){ 
		cc.log("AssetsManager::onExit");
		this._am.release(); 
		this._super(); 
	} 
});

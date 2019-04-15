var LoginScene = cc.Scene.extend({
    className: "LoginScene",
    onEnter: function () {
        this._super();
        this.loadUIManager();

        if (cc.audioEngine.isMusicPlaying()) {
            cc.audioEngine.stopMusic();
        }
        cc.audioEngine.playMusic("res/sound/music/sound_bgm.mp3", true);

        // TEST:
        if (switchesnin1.TEST_OPTION) {
            cc.sys.localStorage.setItem("INFO_JSON", '{"openid":"obEeHt0SUdbYxOUjhO7Hu93YVhIg","nickname":"Zachary","sex":1,"language":"zh_CN","city":"杭州","province":"浙江","country":"中国","headimgurl":"http:\/\/wx.qlogo.cn\/mmopen\/Q3auHgzwzM6zHFzbk0YyibNTMxxibJ2yhg2eq0sIBOgFHCKvSBsibkm2pjYVcwgjwsJlI4yrJvWzXBYHRohiced8tQ\/0","privilege":[],"user_id":0,"invite_code":0}');
        }

        var weixin_login_btn = h1global.curUIMgr.login_ui.rootUINode.getChildByName("weixin_login_btn");
        if(switchesnin1.appstore_check && cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative){
            weixin_login_btn.setVisible(false);
            var begin_login_btn = h1global.curUIMgr.login_ui.rootUINode.getChildByName("begin_login_btn");
            begin_login_btn.addTouchEventListener(function(sender, eventType){
                if(eventType == ccui.Widget.TOUCH_ENDED){
                    cutil.lock_ui();
                    var xhr = cc.loader.getXMLHttpRequest();
                    xhr.open("GET", switchesnin1.PHP_SERVER_URL + "/anon/anonymous_login?unionid=" + cutil.getUUID(), true);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            var info_json = xhr.responseText;
                            cc.sys.localStorage.setItem("INFO_JSON", info_json);
                            var info_dict = eval('(' + info_json + ')');
                            cutil.setStringStorageItem("userSettings", info_dict["token"]);
                            if(switchesnin1.entryPathList.length==1){
                                cutil.lock_ui();
                                cc.loader.load(switchesnin1.entryPathList[0]+'/entry.js');
                            } else {
                                h1global.runScene(new MainScene());
                            }
                        }
                    };
                    xhr.send();
                }
            });
            begin_login_btn.setVisible(true);
            return;
        }
        if (!((cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) || (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative))) {
            var src = window.location.href;
            if (src.indexOf("?code=") >= 0) {
                weixin_login_btn.setVisible(false);
                var args = src.substr(src.indexOf("?code="));
                var code = args.substr(6, args.indexOf("&state"));
                var xhr = cc.loader.getXMLHttpRequest();
                xhr.open("GET", switchesnin1.PHP_SERVER_URL + "/wechat/h5_access_token?code=" + code, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        var info_json = xhr.responseText;
                        cc.sys.localStorage.setItem("INFO_JSON", info_json);
                        var info_dict = eval('(' + info_json + ')');
                        h1global.runScene(new MainScene());
                    }
                };
                xhr.send();
            } else {
                weixin_login_btn.setVisible(true);
            }
        } else {
            if (switchesnin1.TEST_OPTION) {
                weixin_login_btn.setVisible(false);
            }
            else {
                weixin_login_btn.setVisible(true);
            }
        }
    },

    loadUIManager: function () {
        var curUIManager = new LoginSceneUIManager();
        curUIManager.setAnchorPoint(0, 0);
        curUIManager.setPosition(0, 0);
        this.addChild(curUIManager, const_val.curUIMgrZOrder);

        h1global.curUIMgr = curUIManager;
        // curUIManager.playerselect_ui.show();
        // curUIManager.playerselect_ui.loadRes();
        curUIManager.login_ui.hasPreload = true;
        curUIManager.login_ui.show();

        if (onhookMgr) {
            onhookMgr = undefined;
        }
        onhookMgr = new OnHookManager();
        onhookMgr.init(this);
        this.scheduleUpdateWithPriority(0);
    },

    update: function (delta) {
        onhookMgr.update(delta);
    }
});
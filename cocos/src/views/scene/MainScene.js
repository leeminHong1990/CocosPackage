var MainScene = cc.Scene.extend({
    className: "MainScene",
    onEnter: function () {
        this._super();
        this.loadUIManager();
        cutil.unlock_ui();

        if (cc.audioEngine.isMusicPlaying()) {
            cc.audioEngine.stopMusic();
        }
        cc.audioEngine.playMusic("res/sound/music/sound_bgm.mp3", true);
    },

    loadUIManager: function () {
        var curUIManager = new MainSceneUIManager();
        curUIManager.setAnchorPoint(0, 0);
        curUIManager.setPosition(0, 0);
        this.addChild(curUIManager, const_val.curUIMgrZOrder);

        h1global.curUIMgr = curUIManager;
        // curUIManager.playerselect_ui.show();
        // curUIManager.playerselect_ui.loadRes();
        // curUIManager.maincity_ui.hasPreload = true;
        curUIManager.maincity_ui.show();

        if (!onhookMgr) {
            onhookMgr = new OnHookManager();
        }
        onhookMgr.init(this);
        this.scheduleUpdateWithPriority(0);
    },

    update: function (delta) {
        onhookMgr.update(delta);
    }
});
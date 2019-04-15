/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
/**
 * <p>cc.LoaderScene is a scene that you can load it when you loading files</p>
 * <p>cc.LoaderScene can present thedownload progress </p>
 * @class
 * @extends cc.Scene
 * @example
 * var lc = new cc.LoaderScene();
 */
var LoaderScene = cc.Scene.extend({
    _interval : null,
    _label : null,
    _percent : 0,
    _increment : 0,
    _className:"LoaderScene",
    cb: null,
    target: null,
    /**
     * Contructor of cc.LoaderScene
     * @returns {boolean}
     */
    init : function(){
        var self = this;

        //logo
        // var logoWidth = 160;
        // var logoHeight = 200;

        // bg
        var bgLayer = self._bgLayer = new cc.LayerColor(cc.color(32, 32, 32, 255));
        self.addChild(bgLayer, 0);

        //image move to CCSceneFile.js
        // var fontSize = 24, lblHeight =  -logoHeight / 2 + 100;
        // if(cc._loaderImage){
        //     //loading logo
        //     cc.loader.loadImg(cc._loaderImage, {isCrossOrigin : false }, function(err, img){
        //         logoWidth = img.width;
        //         logoHeight = img.height;
        //         self._initStage(img, cc.visibleRect.center);
        //     });
        //     fontSize = 14;
        //     lblHeight = -logoHeight / 2 - 10;
        // }

        var rootUINode = ccs.load("res/ui/HotFixUI.json").node;
        // var rootUINode = ccs.CSLoader.createNode(this.resourceFilename);
        this.rootUINode = rootUINode;
        bgLayer.addChild(rootUINode);
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

        //loading percent
        // var label = self._label = new cc.LabelTTF("Loading... 0%", "Arial", fontSize);
        // label.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, lblHeight)));
        // label.setColor(cc.color(180, 180, 180));
        // bgLayer.addChild(this._label, 10);

        var label = self._label = this.rootUINode.getChildByName("progress_label");
        var slider = self._slider = this.rootUINode.getChildByName("progress_slider");
        return true;
    },

    // _initStage: function (img, centerPos) {
    //     var self = this;
    //     var texture2d = self._texture2d = new cc.Texture2D();
    //     texture2d.initWithElement(img);
    //     texture2d.handleLoadedTexture();
    //     var logo = self._logo = new cc.Sprite(texture2d);
    //     logo.setScale(cc.contentScaleFactor());
    //     logo.x = centerPos.x;
    //     logo.y = centerPos.y;
    //     self._bgLayer.addChild(logo, 10);
    // },
    /**
     * custom onEnter
     */
    onEnter: function () {
        var self = this;
        cc.Node.prototype.onEnter.call(self);
        self.schedule(self._startLoading, 0.3);
    },
    /**
     * custom onExit
     */
    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        var tmpStr = "Loading... 0%";
        this._label.setString(tmpStr);
        this._slider.setPercent(0);
        this._percent = 0;
        this._increment = 0;
    },

    /**
     * init with resources
     * @param {Array} resources
     * @param {Function|String} cb
     * @param {Object} target
     */
    initWithResources: function (resources, cb, target, limit, increment) {
        if(cc.isString(resources))
            resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
        this.target = target;
        this.limit = limit;
        this._increment = increment;
    },

    _startLoading: function () {
        var self = this;
        self.unschedule(self._startLoading);
        if(self.limit <= 0){
            self.schedule(self._incrementLoading, 0.1);
        }
        var res = self.resources;
        cc.loader.load(res,
            function (result, count, loadedCount) {
                if(self.limit > 0) {
                    var percent = (loadedCount / count * self.limit) | 0;
                    percent = Math.min(percent, self.limit);
                    self.setLoadingPercent(percent);
                }
            }, function () {
                if (self.cb)
                    self.cb.call(self.target);
                if(self._increment > 0 && self._percent < 100){
                    self.schedule(self._incrementLoading, 0.1);
                }
            });
    },

    _incrementLoading: function () {
        var self = this;
        self._percent = self._percent + self._increment;
        if(self._percent > 100){
            self._percent = 100;
        }
        if(self._percent >= 100 || self._increment <= 0){
            self.unschedule(self._incrementLoading);
        }
        self.setLoadingPercent(self._percent);
    },

    setLoadingPercent:function(percent){
        this._percent = percent;
        this._label.setString("Loading... " + percent.toString() + "%");
        this._slider.setPercent(percent);
    },

    _updateTransform: function(){
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        this._bgLayer._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        this._label._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        // this._logo._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        this._slider._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
    }
});
/**
 * <p>cc.LoaderScene.preload can present a loaderScene with download progress.</p>
 * <p>when all the resource are downloaded it will invoke call function</p>
 * @param resources
 * @param cb
 * @param target
 * @returns {cc.LoaderScene|*}
 * @example
 * //Example
 * cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new HelloWorldScene());
    }, this);
 */
var loaderScene = undefined;
LoaderScene.preload = function(resources, cb, target, limit, increment){
    // limit代表进度条在资源完全加载时的百分比，当limit<=0时，进度条将以恒定速度增加，不跟随实际资源加载变化
    limit = limit == undefined? 100 : limit;
    increment = increment || 0;
    if(!loaderScene){
        loaderScene = new LoaderScene();
        loaderScene.retain();
        loaderScene.init();
        cc.eventManager.addCustomListener(cc.Director.EVENT_PROJECTION_CHANGED, function(){
            loaderScene._updateTransform();
        });
    }
    loaderScene.initWithResources(resources, cb, target, limit, increment);
    h1global.runScene(loaderScene);
    return loaderScene;
};
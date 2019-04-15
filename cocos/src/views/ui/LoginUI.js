var LoginUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/LoginUI.json";
    },
    initUI: function () {
        // re-scale background image
        var bg_img = ccui.helper.seekWidgetByName(this.rootUINode, "bg_img");
        var bg_img_content_size = bg_img.getContentSize();
        var scale = cc.winSize.width / bg_img_content_size.width;
        if (cc.winSize.height / bg_img_content_size.height > scale) {
            scale = cc.winSize.height / bg_img_content_size.height;
        }
        bg_img.setScale(scale);

        var is_agree_agreement =1;

        // 测试，账号登录相关
        var account_panel = this.rootUINode.getChildByName("account_panel");
        if (switchesnin1.TEST_OPTION) {
            account_panel.setVisible(true);
        }

        var account_input_tf = ccui.helper.seekWidgetByName(account_panel, "account_input_tf");
        var password_input_tf = ccui.helper.seekWidgetByName(account_panel, "password_input_tf");

        var get_account_btn = ccui.helper.seekWidgetByName(account_panel, "get_account_btn");
        var self = this;

        var login_btn = ccui.helper.seekWidgetByName(account_panel, "login_btn");

        function login_btn_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                cutil.lock_ui();
                var username = account_input_tf.getString();
                var password = password_input_tf.getString();
                cc.log("login, username = " + username + ", password = " + password);
                if(!username){
                    h1global.globalUIMgr.info_ui.show_by_info("请输入用户名");
                    return;
                }
                if (switchesnin1.TEST_OPTION) {
                    cc.sys.localStorage.setItem("INFO_JSON", '{"openid":"obEeHt0SUdbYxOUjhO7Hu93YVhIg","nickname":"'+username+'","sex":1,"language":"zh_CN","city":"杭州","province":"浙江","country":"中国","headimgurl":"http:\/\/wx.qlogo.cn\/mmopen\/Q3auHgzwzM6zHFzbk0YyibNTMxxibJ2yhg2eq0sIBOgFHCKvSBsibkm2pjYVcwgjwsJlI4yrJvWzXBYHRohiced8tQ\/0","privilege":[]}');
                }
                playerData["username"] = username;
                playerData["password"] = password;
                h1global.runScene(new MainScene());
            }
        }
        login_btn.addTouchEventListener(login_btn_event);

        // 微信登录相关
        var weixin_login_btn = this.rootUINode.getChildByName("weixin_login_btn");
        weixin_login_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                sender.setVisible(false);
                var info_json = cc.sys.localStorage.getItem("INFO_JSON");
                if (info_json) {
                    var info_dict = eval('(' + info_json + ')');
                    if ((cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) || (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative)) {
                        if(switchesnin1.entryPathList.length==1){
                            cutil.lock_ui();
                            cc.loader.load(switchesnin1.entryPathList[0]+'/entry.js');
                        } else {
                            h1global.runScene(new MainScene());
                        }
                    } else {
                        var openid = info_dict["openid"];
                        KBEngine.app.login("wx_" + openid, openid, const_val.sClientDatas);
                    }
                } else {
                    if ((cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative)) {
                        cc.log("This is Android Login");
                        jsb.reflection.callStaticMethod(switchesnin1.package_name + "/AppActivity", "callWechatLogin", "()V");
                    } else if ((cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative)) {
                        cc.log("This is iOS Login");
                        jsb.reflection.callStaticMethod("WechatOcBridge", "callWechatLogin");
                    } else {
                        // window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2cdf69ccdc8fd012&redirect_uri=http%3a%2f%2fwww.zhizunhongzhong.com%2fh1hz&response_type=code&scope=snsapi_userinfo&state=" + (new Date() - 0);
                        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + switchesnin1.h5appid + "&redirect_uri=" + encodeURIComponent(switchesnin1.h5entrylink) + "&response_type=code&scope=snsapi_userinfo&state=" + (new Date() - 0);
                    }
                }
            }
        });

        // this.init_anims();

        var user_agree_panel = this.rootUINode.getChildByName("user_agree_panel");
        var user_agree_chx = user_agree_panel.getChildByName("user_agree_chx");
        user_agree_panel.getChildByName("user_agree_img").addTouchEventListener(function (sender,eventType){
            h1global.curUIMgr.useragree_ui.show();
        });

        function user_agree_chx_event(sender,eventType){
            if (eventType == ccui.CheckBox.EVENT_SELECTED) {                
                if(self.is_agree_agreement === 1){
                    self.is_agree_agreement = 0;
                    self.weixin_login_btn.setVisible(false);
                }else{
                    self.is_agree_agreement = 1;
                    self.weixin_login_btn.setVisible(true);
                }
            }
        }
        user_agree_chx.addTouchEventListener(user_agree_chx_event);
        user_agree_chx.setTouchEnabled(false);


        // var about_btn = this.rootUINode.getChildByName("about_btn");
        // about_btn.addTouchEventListener(function(sender, eventType){
        //     if(eventType == ccui.Widget.TOUCH_ENDED){
        //         h1global.curUIMgr.about_ui.show();
        //     }
        // });

    },

    // init_anims:function(){
    //     var self = this;
    //     var bg_img = this.rootUINode.getChildByName("bg_img");
    //     this.rootUINode.reorderChild(bg_img, -2);

    //     UICommonWidget.load_effect_plist("zuozhuzi");
    //     var zuozhuzi = cc.Sprite.create();
    //     zuozhuzi.setAnchorPoint(0, 0.5);
    //     var zuozhuzi_action = UICommonWidget.create_effect_action({"FRAMENUM":21, "TIME":1.0, "NAME":"zuozhuzi/zuozhuzi"});
    //     zuozhuzi.runAction(cc.RepeatForever.create(cc.Sequence.create(zuozhuzi_action, zuozhuzi_action.reverse())));
    //     zuozhuzi.setPosition(cc.p(0, cc.winSize.height * 0.5));
    //     this.rootUINode.addChild(zuozhuzi, -1);

    //     UICommonWidget.load_effect_plist("youzhuzi");
    //     var youzhuzi = cc.Sprite.create();
    //     youzhuzi.setAnchorPoint(1.0, 0.5);
    //     var youzhuzi_action = UICommonWidget.create_effect_action({"FRAMENUM":21, "TIME":1.0, "NAME":"youzhuzi/youzhuzi"});
    //     youzhuzi.runAction(cc.RepeatForever.create(cc.Sequence.create(youzhuzi_action, youzhuzi_action.reverse())));
    //     youzhuzi.setPosition(cc.p(cc.winSize.width, cc.winSize.height * 0.3));
    //     this.rootUINode.addChild(youzhuzi, -1);

    //     var particle_yezi1 = cc.ParticleSystem.create("res/particles/yezi.plist");
    //     particle_yezi1.setPosition(cc.p(0, cc.winSize.height * 0.5));
    //     this.rootUINode.addChild(particle_yezi1, -1);

    //     var particle_yezi2 = cc.ParticleSystem.create("res/particles/yezi.plist");
    //     particle_yezi2.setPosition(cc.p(cc.winSize.width, cc.winSize.height * 0.3));
    //     this.rootUINode.addChild(particle_yezi2, -1);

    //     UICommonWidget.load_effect_plist("dayan");
    //     function create_dayan(from_pos, to_pos, duration_time, interval_time, first_time, scale){
    //         first_time = first_time || 0;
    //         scale = scale || 1;
    //         self.rootUINode.runAction(cc.Sequence.create(
    //             cc.DelayTime.create(first_time),
    //             cc.CallFunc.create(function(){
    //                 self.rootUINode.runAction(cc.RepeatForever.create(
    //                     cc.Sequence.create(
    //                         cc.CallFunc.create(function(){
    //                             var effect = cc.Sprite.create();
    //                             effect.runAction(cc.RepeatForever.create(UICommonWidget.create_effect_action({"FRAMENUM":6, "TIME":1.0, "NAME":"dayan/dayan"})));
    //                             self.rootUINode.addChild(effect, -1);
    //                             effect.setPosition(from_pos);
    //                             effect.setScale(scale);
    //                             effect.runAction(cc.Sequence.create(cc.Spawn.create(cc.MoveTo.create(duration_time, to_pos), cc.FadeOut.create(duration_time)), cc.CallFunc.create(function(){effect.removeFromParent();})));
    //                         }),
    //                         cc.DelayTime.create(interval_time)
    //                     )
    //                 ));
    //             })
    //         ))
                    
    //     }
    //     create_dayan(cc.p(cc.winSize.width*0.2, cc.winSize.height*0.62), cc.p(cc.winSize.width*0.5, cc.winSize.height*0.65), 4.0, 6.0, 0.0, 0.6);
    //     create_dayan(cc.p(cc.winSize.width*0.4, cc.winSize.height*0.65), cc.p(cc.winSize.width*0.6, cc.winSize.height*0.65), 3.0, 5.0, 1.0, 0.3);
    //     create_dayan(cc.p(cc.winSize.width*0.5, cc.winSize.height*0.7), cc.p(cc.winSize.width*0.6, cc.winSize.height*0.7), 3.0, 5.0, 1.5, 0.3);
    //     create_dayan(cc.p(cc.winSize.width*0.65, cc.winSize.height*0.72), cc.p(cc.winSize.width*0.7, cc.winSize.height*0.75), 3.0, 5.0, 0.7, 0.3);
    //     create_dayan(cc.p(cc.winSize.width*0.7, cc.winSize.height*0.7), cc.p(cc.winSize.width*0.75, cc.winSize.height*0.6), 3.0, 5.0, 0.3, 0.3);

    //     UICommonWidget.load_effect_plist("niao");
    //     function create_niao(from_pos, centre_pos, to_pos, duration_time, interval_time, first_time, scale){
    //         first_time = first_time || 0;
    //         scale = scale || 1;
    //         self.rootUINode.runAction(cc.Sequence.create(
    //             cc.DelayTime.create(first_time),
    //             cc.CallFunc.create(function(){
    //                 self.rootUINode.runAction(cc.RepeatForever.create(
    //                     cc.Sequence.create(
    //                         cc.CallFunc.create(function(){
    //                             var effect = cc.Sprite.create();
    //                             effect.runAction(cc.RepeatForever.create(UICommonWidget.create_effect_action({"FRAMENUM":6, "TIME":1.0, "NAME":"niao/niao"})));
    //                             self.rootUINode.addChild(effect, -1);
    //                             effect.setPosition(from_pos);
    //                             effect.setScale(scale);
    //                             effect.runAction(cc.Sequence.create(cc.MoveTo.create(duration_time/2, centre_pos), cc.MoveTo.create(duration_time/2, to_pos), cc.CallFunc.create(function(){effect.removeFromParent();})));
    //                         }),
    //                         cc.DelayTime.create(interval_time)
    //                     )
    //                 ));
    //             })
    //         )) 
    //     }
    //     create_niao(cc.p(cc.winSize.width*0.2, 0), cc.p(cc.winSize.width*0.5, cc.winSize.height*0.08), cc.p(cc.winSize.width*0.8, 0), 5.0, 7.0, 0.0, 1.0);
    //     create_niao(cc.p(cc.winSize.width*0.2, 0), cc.p(cc.winSize.width*0.5, cc.winSize.height*0.08), cc.p(cc.winSize.width*0.8, 0), 4.5, 7.0, 0.5, 0.7);
    // },

});
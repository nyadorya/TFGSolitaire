phina.globalize();

//奉仕スクエア
phina.define('SquereServiceSceneSequence' , {
  superClass: 'ManagerScene' ,
  SquereMark  : 'Service',
  SquereMeaning : i18n.SquereService,
  init: function() {
    this.superInit({
      scenes: [
        {
          label: 'SquereService',
          className: 'SquereServiceScene',
          nextLabel: 'SquereServiceSelectToken',
        },
        {
          label: 'SquereServiceSelectToken',
          className: 'SquereServiceSelectTokenScene',
          nextLabel: 'CloseService',
        },
        {
          label: 'CloseService',
          className: 'CloseServiceScene',
        },
      ],
    });

    this.on('finish',function() {
      CurrentGameData.Scene = 'MainBoard';
      TfAp.saveGameData();
      this.app.replaceScene(MainBoardScene());
    });
  },
});

phina.define('SquereServiceScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      SquereMark  : 'Service',
      SquereMeaning : i18n.SquereService,
    };
    this.superInit(options);
    var self = this;
    var _cbname = TfAp.doneFlareName();

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.SquereServiceStartMessage,],
                          x           :320,
                          y           :450,
                          width       :600,
                          height      :600,
                          buttonAName :i18n.ButtonNext,
                                           }).addChildTo(this);

    this.StartMessage.visible = true;
    this.StartMessage.ButtonA.setInteractive(true);
    this.StartMessage.ButtonA.on('push', function(e) {
      document.getElementById("overlay").style.display='block';
      TfAp.OverLayMessage = i18n.SquereServiceOverLayMessage;
      TfAp.OverLayPlaceHolder = i18n.SquereServiceOverLayPlaceHolder;
      TfAp.OverLayCancel = false;

      app.pushScene(InputScene({cbname:_cbname}));

      app.on(_cbname, function(e) {
        self.beforeInput = TfAp.OverLayInput;
        TfAp.WriteGameLog(i18n.WantServe+':'+self.beforeInput);
        self.exit('SquereServiceSelectToken',{InputService:TfAp.OverLayInput});
      });


    });
  },
});

phina.define('SquereServiceSelectTokenScene', {
  superClass: 'SquereScene',
  init: function(options) {
    var options = ({}).$safe(options, {
      SquereMark  : 'Service',
      SquereMeaning : i18n.SquereService,
    });
    this.superInit(options);
    var self = this;
    var _cbname = TfAp.doneFlareName();

    var _Message = MessageWindow({
                          texts       :[options.InputService + i18n.SquereServiceGetToken,],
                          x           :320,
                          y           :450,
                          width       :600,
                          height      :600,
                          buttonAName :i18n.ButtonNext,
                                           }).addChildTo(this);

    _Message.ButtonA.on('push', function(e) {
      app.pushScene(AmimateGetServiceTokenScene({Reason: i18n.SquereServiceReason, cbname:_cbname,}));
    });

    app.on(_cbname, function(e) {
      self.exit();
    });


  },
});

phina.define('CloseServiceScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      SquereMark  : 'Service',
      SquereMeaning : i18n.SquereService,
    };
    this.superInit(options);
    var self = this;

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.SquereServiceEndMessage,],
                          x           :320,
                          y           :450,
                          width       :600,
                          height      :600,
                          buttonAName :i18n.ButtonEnd,
                                           }).addChildTo(this);

    this.StartMessage.visible = true;
    this.StartMessage.ButtonA.setInteractive(true);
    this.StartMessage.ButtonA.on('push', function(e) {
      self.exit();
    });
  },
});


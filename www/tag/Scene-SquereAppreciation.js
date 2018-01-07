phina.globalize();

//感謝スクエア
phina.define('SquereAppreciationSceneSequence' , {
  superClass: 'ManagerScene' ,
  SquereMark  : 'Appreciation',
  SquereMeaning : i18n.SquereAppreciation,
  init: function() {
    this.superInit({
      scenes: [
        {
          label: 'SquereAppreciation',
          className: 'SquereAppreciationScene',
          nextLabel: 'SquereAppreciationSelectToken',
        },
        {
          label: 'SquereAppreciationSelectToken',
          className: 'SquereAppreciationSelectTokenScene',
          nextLabel: 'CloseAppreciation',
        },
        {
          label: 'CloseAppreciation',
          className: 'CloseAppreciationScene',
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

phina.define('SquereAppreciationScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      SquereMark  : 'Appreciation',
      SquereMeaning : i18n.SquereAppreciation,
    };
    this.superInit(options);
    var self = this;
    var _cbname = TfAp.doneFlareName();

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.SquereAppreciationStartMessage,],
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
      TfAp.OverLayMessage = i18n.SquereAppreciationOverLayMessage;
      TfAp.OverLayPlaceHolder = i18n.SquereAppreciationOverLayPlaceHolder;

      app.pushScene(InputScene({cbname:_cbname}));

      app.on('poped', function(e) {
        //キャンセルで戻ってきたあとは再度定義しなおす
        _cbname = TfAp.doneFlareName();
      });

      app.on(_cbname, function(e) {
        self.beforeInput = TfAp.OverLayInput;
        self.exit('SquereAppreciationSelectToken',{InputAppreciation:TfAp.OverLayInput});
      });


    });
  },
});

phina.define('SquereAppreciationSelectTokenScene', {
  superClass: 'SquereScene',
  init: function(options) {
    var options = ({}).$safe(options, {
      SquereMark  : 'Appreciation',
      SquereMeaning : i18n.SquereAppreciation,
    });
    this.superInit(options);
    var self = this;
    var _cbname = TfAp.doneFlareName();

    var _Message = MessageWindow({
                          texts       :[options.InputAppreciation + i18n.SquereAppreciationMessage,],
                          x           :320,
                          y           :450,
                          width       :600,
                          height      :600,
                          buttonAName :i18n.ButtonNext,
                                           }).addChildTo(this);

    _Message.ButtonA.on('push', function(e) {
      TfAp.WriteGameLog(options.SquereMeaning+'：'+options.InputAppreciation);
      app.pushScene(SelectTokenAwarenessBoxToScoreScene({Target : '',selectNumberOfAwarenessTokens:2,cbname:_cbname}));
    });

    app.on(_cbname, function(e) {
      self.exit();
    });


  },
});

phina.define('CloseAppreciationScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      SquereMark  : 'Appreciation',
      SquereMeaning : i18n.SquereAppreciation,
    };
    this.superInit(options);
    var self = this;

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.SquereAppreciationEndMessage,],
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


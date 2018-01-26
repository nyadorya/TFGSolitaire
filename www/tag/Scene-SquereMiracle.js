phina.globalize();

//ミラクルスクエア
phina.define('SquereMiracleSceneSequence' , {
  superClass: 'ManagerScene' ,
  SquereMark  : 'Miracle',
  SquereMeaning : i18n.SquereMiracle,
  init: function() {
    this.superInit({
      scenes: [
        {
          label: 'BackgroundRainbow',
          className: 'BackgroundRainbowScene',
          nextLabel: 'SquereMiracle',
        },
        {
          label: 'SquereMiracle',
          className: 'SquereMiracleScene',
          nextLabel: 'AmimateClearAllPain',
        },
        {
          label: 'AmimateClearAllPain',
          className: 'AmimateClearAllPainScene',
          nextLabel: 'SelectMiracle',
        },
        {
          label: 'SelectMiracle',
          className: 'SelectMiracleScene',
          nextLabel: 'CloseMiracle',
        },
        {
          label: 'CloseMiracle',
          className: 'CloseMiracleScene',
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

phina.define('SquereMiracleScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      SquereMark  : 'Miracle',
      SquereMeaning : i18n.SquereMiracle,
    };
    this.superInit(options);
    var self = this;

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.SquereMiracleStartMessage,],
                          x           :320,
                          y           :450,
                          width       :600,
                          height      :600,
                          buttonAName :i18n.ButtonNext,
                                           }).addChildTo(this);

    this.StartMessage.visible = true;
    this.StartMessage.ButtonA.setInteractive(true);
    this.StartMessage.ButtonA.on('push', function(e) {
      self.exit('AmimateClearAllPain',{Reason:i18n.SquereMiracleClearAllPainReason,});
    });
  },
});


phina.define('SelectMiracleScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      SquereMark  : 'Miracle',
      SquereMeaning : i18n.SquereMiracle,
    };
    this.superInit(options);
    var self = this;

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.SquereMiracleSelectMessage,],
                          x           :320,
                          y           :250,
                          width       :600,
                          height      :200,
                                           }).addChildTo(this);

    var _cbname = TfAp.doneFlareName();
    var _selectOptions = [
      {Text:i18n.SquereMiracleSelectAngel,Scene:SelectDeckToScoreAngelScene({cbname:_cbname}),},
      {Text:i18n.SquereMiracleSelectTokenAwareness,Scene:SelectTokenAwarenessBoxToScoreScene({cbname:_cbname,selectNumberOfAwarenessTokens:6}),},
      {Text:i18n.SquereMiracleSelectService,Scene:AmimateGetServiceTokenScene({cbname:_cbname}),},
    ];

    this.button = [];
    this.selected = -1;
    this.nextScene = new DisplayScene();

    _selectOptions.forEach (function(val,buttonId,array) {
      self.button[buttonId] = self._selectButton({text:_selectOptions[buttonId].Text,id:buttonId,}).addChildTo(self);

      self.button[buttonId].on('push', function(e) {
        self.nextScene = _selectOptions[buttonId].Scene;
        self.flare('selectButton',{id:buttonId,});
      });
    });

    self.on('selectButton', function(e) {
      self.selected = e.id;

      _selectOptions.forEach (function(val,buttonId,array) {
        if (self.selected == buttonId && self.button[buttonId].fontColor == 'black') {
          self.commitButton.show().setInteractive(true);
          self.button[buttonId].fill = 'purple';
          self.button[buttonId].fontColor = 'white';
        } else if (self.selected == buttonId) {
          self.commitButton.hide().setInteractive(false);
          self.selected = -1;
          self.button[buttonId].fill = '#E8CFE8';
          self.button[buttonId].fontColor = 'black';
        } else {
          self.button[buttonId].fill = '#E8CFE8';
          self.button[buttonId].fontColor = 'black';
        }
      });
    });


    this.commitButton = Button({text:i18n.Decision}).setPosition(320,600).addChildTo(this);
    this.commitButton.hide().setInteractive(false);

    this.commitButton.on('push', function(e) {
      app.pushScene(self.nextScene);
    });

    app.on(_cbname, function(e) {
      self.exit('CloseMiracle');
    });

  },
});

phina.define('CloseMiracleScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      SquereMark  : 'Miracle',
      SquereMeaning : i18n.SquereMiracle,
    };
    this.superInit(options);
    var self = this;

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.SquereMiracleEndMessage,],
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


phina.globalize();

phina.define('SquereFlashSceneSequence' , {
  superClass: 'ManagerScene' ,
  SquereMark  : 'Flash',
  SquereMeaning : i18n.SquereFlash,
  init: function() {
    this.superInit({
      scenes: [
        {
          label: 'SquereFlash',
          className: 'SquereFlashScene',
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

//ひらめきスクエア
phina.define('SquereFlashScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      nextLabel   : 'Start',
      SquereMark  : 'Flash',
      SquereMeaning : i18n.SquereFlash,
    };
    this.superInit(options);
    var self = this;

    //あとからまとめて消すので定義
    var _DispComments = DisplayElement().addChildTo(this);

    var label0 = self._label({text:i18n.SquereFlashSelectAction}).setPosition(50,150).addChildTo(_DispComments);

    var coinhead = Sprite('coin').setPosition(50,225)
                  .setSize(96,96).setScale(0.5,0.5).addChildTo(_DispComments);
    coinhead.frameIndex = 0;
    var label1 = self._label({text:i18n.SquereFlashOpenFlash}).setPosition(100,210).addChildTo(_DispComments);

    var cointail = Sprite('coin').setPosition(50,275)
                  .setSize(96,96).setScale(0.5,0.5).addChildTo(_DispComments);
    cointail.frameIndex = 9;
    var label2 = self._label({text:i18n.SquereFlashOpenPain}).setPosition(100,270).addChildTo(_DispComments);

    this.commitButton = Button({text:i18n.Decision}).setPosition(500,850).addChildTo(this);
    this.commitButton.hide().setInteractive(false);

    this.nextButton = Button({text:i18n.ButtonNext}).setPosition(500,850).addChildTo(this);
    this.nextButton.hide().setInteractive(false);

    this.imgCoin = FlashCoin().setPosition(320,350).addChildTo(this);
    this.imgCoin.hide().setInteractive(false);

    var _cbname = TfAp.doneFlareName();
    var _selectOptions = [
      {Text:i18n.AngelFromEnvelope,Scene:SelectEnvelopeToScoreAngelScene({cbname:_cbname}),CardType:'Angel',SelectFrom:'Envelope',},
      {Text:i18n.InsightFromEnvelope,Scene:SelectEnvelopeToScoreInsightScene({cbname:_cbname}),CardType:'Insight',SelectFrom:'Envelope',},
      {Text:i18n.SetbackFromEnvelopeWithPain,Scene:SelectEnvelopeToScoreSetbackScene({cbname:_cbname}),CardType:'Setback',SelectFrom:'Envelope',},
      {Text:i18n.SetbackFromEnvelopeNoPain,Scene:SelectEnvelopeToScoreSetbackScene({isNoPain:true,cbname:_cbname}),CardType:'Setback',SelectFrom:'Envelope',},
      {Text:i18n.AngelFromDeck,Scene:SelectDeckToScoreAngelScene({cbname:_cbname}),CardType:'Angel',SelectFrom:'Deck',},
      {Text:i18n.InsightFromDeck,Scene:SelectDeckToScoreInsightScene({cbname:_cbname}),CardType:'Insight',SelectFrom:'Deck',},
      {Text:i18n.SetbackFromDeckWithPain,Scene:SelectDeckToScoreSetbackScene({cbname:_cbname}),CardType:'Setback',SelectFrom:'Deck',},
      {Text:i18n.SetbackFromDeckNoPain,Scene:SelectDeckToScoreSetbackScene({isNoPain:true,cbname:_cbname}),CardType:'Setback',SelectFrom:'Deck',},
    ];

    this.button = [];
    this.selected = -1;
    this.nextScene = new DisplayScene();
    _selectOptions.forEach (function(val,buttonId,array) {
      self.button[buttonId] = self._selectButton({text:_selectOptions[buttonId].Text,id:buttonId}).addChildTo(self);
      //封筒の枚数をチェックし、引けない場合は選択非活性
      if (_selectOptions[buttonId].SelectFrom == 'Envelope') {
        var _UnconsciousLength = 0;
        var _Unconscious = TfAp.CurrentUnconscious(_selectOptions[buttonId].CardType);

        _UnconsciousLength = (_Unconscious == void 0?0:_Unconscious.length);
        if (_UnconsciousLength == 0) {
          self.button[buttonId].alpha = 0.5;
          self.button[buttonId].setInteractive(false);
        }
      }

      self.button[buttonId].on('push', function(e) {
        self.nextScene = _selectOptions[buttonId].Scene;
        self.flare('selectButton',{id:buttonId});
      });
    });

    var labelThrowCoin    = self._label({text:i18n.ThrowCoin}).addChildTo(this).hide();
    var labelStopCoin     = self._label({text:i18n.StopCoin}).addChildTo(this).hide();
    var labelStopingCoin  = self._label({text:i18n.StoppingCoin}).addChildTo(this).hide();


    //失敗時のメッセージウインドウ
    this.PainMessageWindow = MessageWindow({
                          texts       :[i18n.SquereFlashFailEnd,],
                          x           :320,
                          y           :500,
                          width       :400,
                          height      :400,
                          buttonAName :i18n.ButtonEnd,
                                           }).addChildTo(this);
    this.PainMessageWindow.hide();
    this.PainMessageWindow.ButtonA.setInteractive(false);

    this.on('selectButton', function(e) {
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

    this.commitButton.on('push', function(e) {
      _DispComments.hide().setInteractive(false);
      this.hide().setInteractive(false);

      for (var buttonId=0; buttonId< _selectOptions.length;buttonId++) {
        if (self.selected == buttonId) {
        } else {
          self.button[buttonId].hide().setInteractive(false);
        }
      };

      self.button[self.selected].tweener
        .clear()
        .to({y:200},1000,'default')
        .call(function(){
          self.imgCoin.show().setInteractive(true);
          labelThrowCoin.show();
        });

    });

    //コインを投げる
    this.imgCoin.on('pointend', function(e) {
      self.imgCoin.throwCoin();
      labelThrowCoin.hide();
      labelStopCoin.show();
    });

    //コイン止めてる途中
    this.imgCoin.on('stoppingCoin', function(e) {
      self.imgCoin.setInteractive(false);
      labelStopCoin.hide();
      labelStopingCoin.show();
    });

    //コイン結果後のイベント
    this.imgCoin.on('resultCoin', function(e) {
      labelStopingCoin.visible   = false;
//      this.isFace = true; //とりあえず
      if (this.isFace) {
        self._label({text:i18n.SquereFlashCoinFlash}).addChildTo(self);
        self.nextButton.show().setInteractive(true);
      } else {
        self._label({text:i18n.SquereFlashCoinPain}).addChildTo(self);
        self.PainMessageWindow.show();
        self.PainMessageWindow.ButtonA.setInteractive(true);

        var _cbname = TfAp.doneFlareName();
        app.pushScene(AmimateDepressionScene({numberOfDepressionTokens:1,PutPainScene: 'Flash',CardId: 0,cbname: _cbname}));
        app.on(_cbname, function() {
        });

      }
    });

    this.nextButton.on('push', function(e) {
      app.replaceScene(self.nextScene);
    });

    this.PainMessageWindow.ButtonA.on('push', function(e) {
      self.exit();
    });

  },
});


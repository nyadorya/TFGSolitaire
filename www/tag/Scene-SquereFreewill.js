phina.globalize();

//自由意志スクエア
phina.define('SquereFreewillSceneSequence' , {
  superClass: 'ManagerScene' ,
  SquereMark  : 'Freewill',
  SquereMeaning : i18n.SquereFreewill,
  init: function() {
    this.superInit({
      scenes: [
        {
          label: 'SquereFreewill',
          className: 'SquereFreewillScene',
          nextLabel: 'SelectDeckToScoreUniversalFeedback',
          arguments: {selectNumberOfCards : 1},
        },
        {
          label: 'SelectDeckToScoreUniversalFeedback',
          className: 'SelectDeckToScoreUniversalFeedbackScene',
          nextLabel: '',
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

phina.define('SquereFreewillScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      nextLabel   : 'Start',
      SquereMark  : 'Freewill',
      SquereMeaning : i18n.SquereFreewill,
    };
    this.superInit(options);
    var self = this;

    //メッセージウインドウ
    this.MessageWindow = MessageWindow({
                          texts       :[i18n.SquereFreewillStartMessage,],
                          x           :320,
                          y           :220,
                          width       :600,
                          height      :180,
                                           }).addChildTo(this);
    this.MessageWindow.visible = true;

    this.commitButton = Button({text:i18n.Decision}).setPosition(500,880).addChildTo(this);
    this.commitButton.hide().setInteractive(false);

    this.nextButton = Button({text:i18n.ButtonNext}).setPosition(500,880).addChildTo(this);
    this.nextButton.hide().setInteractive(false);

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
      {Text:i18n.NoAction,Scene:'',CardType:'',SelectFrom:'',},
    ];

    this.button = [];
    this.selected = -1;
    this.nextScene = new DisplayScene();

    _selectOptions.forEach (function(val,buttonId,array) {
      self.button[buttonId] = self._selectButton({text:_selectOptions[buttonId].Text,id:buttonId,}).addChildTo(self);
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

    this.commitButton.on('push', function(e) {
      self.MessageWindow.hide().setInteractive(false);
      this.hide().setInteractive(false);

      for (var buttonId=0; buttonId< _selectOptions.length;buttonId++) {
        if (self.selected == buttonId) {
        } else {
          self.button[buttonId].hide().setInteractive(false);
        }
      };

      self.button[self.selected].tweener
        .clear()
        .call(function(){
          if (self.nextScene == void 0) {
            self.doUniversalFeedback();
          } else {
            app.pushScene(self.nextScene);
          }
        })
        .to({y:200},1,'default');
    });

    app.on(_cbname, function(e) {
      self.doUniversalFeedback();
    });
  },
  doUniversalFeedback : function() {
    var self = this;
    //メッセージウインドウ
    this.MessageWindow = MessageWindow({
                          texts       :[i18n.SquereFreewillUniversalFeedback,],
                          x           :300,
                          y           :400,
                          width       :500,
                          height      :250,
                          buttonAName :i18n.ButtonNext,
                                           }).addChildTo(this);
    this.MessageWindow.visible = true;
    this.MessageWindow.ButtonA.setInteractive(true);
    this.MessageWindow.ButtonA.on('push', function(e) {
      self.exit();
    });
  },
});


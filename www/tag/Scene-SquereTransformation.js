phina.globalize();

//変容スクエア
phina.define('SquereTransformationSceneSequence' , {
  superClass: 'ManagerScene' ,
  SquereMark  : 'Transformation',
  SquereMeaning : i18n.SquereTransformation,
  init: function() {
    this.superInit({
      scenes: [
        {
          label: 'SquereTransformation',
          className: 'SquereTransformationScene',
          nextLabel: 'AmimateTransformation',
        },
        {
          label: 'AmimateClearAllPain',
          className: 'AmimateClearAllPainScene',
          nextLabel: 'Select1stCardTransformation',
        },
        {
          label: 'Select1stCardTransformation',
          className: 'SelectCardTransformationScene',
          nextLabel: 'Select2ndCardTransformation',
          arguments: {ChoiceOrder:1,},
        },
        {
          label: 'Select2ndCardTransformation',
          className: 'SelectCardTransformationScene',
          nextLabel: 'LevelUp',
          arguments: {ChoiceOrder:2,},
        },
        {
          label: 'LevelUp',
          className: 'LevelUpSceneSequence',
          nextLabel: 'CloseTransformation',
          arguments: {isExit:true,},
        },
        {
          label: 'CloseTransformation',
          className: 'CloseTransformationScene',
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

phina.define('SquereTransformationScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      SquereMark  : 'Transformation',
      SquereMeaning : i18n.SquereTransformation,
    };
    this.superInit(options);
    var self = this;
    var _cbname = TfAp.doneFlareName();

    var _msg = i18n.SquereTransformationStartMessage;
    if (CurrentGameData.ScoreCardLevel >= 3) {
      _msg = i18n.LevelUpMax;
    }

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[_msg,],
                          x           :320,
                          y           :450,
                          width       :600,
                          height      :600,
                          buttonAName :i18n.ButtonNext,
                                           }).addChildTo(this);
    this.StartMessage.visible = true;
    this.StartMessage.ButtonA.setInteractive(true);
    this.StartMessage.ButtonA.on('push', function(e) {
      if (CurrentGameData.ScoreCardLevel >= 3) {
        //スピリチュアルレベルであれば、ゲーム終了へ
        app.replaceScene(GameCloseSceneSequence());
      } else {
        self.exit('AmimateClearAllPain',{Reason:i18n.SquereTransformationClearAllPainReason,});
      }
    });
  },
});

phina.define('SelectCardTransformationScene', {
  superClass: 'SquereScene',
  init: function(options) {
    options = ({}).$safe(options, {
      SquereMark  : 'Transformation',
      SquereMeaning : i18n.SquereTransformation,
      ChoiceOrder : 1,
    });
    this.superInit(options);
    var self = this;
    self.ChoiceOrder = options.ChoiceOrder;

    var _UnconsciousAngel = CurrentGameData.UnconsciousAngel;
    var _UnconsciousInsight = CurrentGameData.UnconsciousInsight;
    var _UnconsciousSetback = CurrentGameData.UnconsciousSetback;

    var _msg = i18n.SquereTransformationCard;
    _msg = _msg.replace(/α/g,_UnconsciousAngel)
                .replace(/γ/g,_UnconsciousInsight)
                .replace(/δ/g,_UnconsciousSetback);

    if (options.ChoiceOrder == 2) {
      _msg = i18n.SquereTransformation2ndCard + _msg;
    } else {
      _msg = i18n.SquereTransformation1stCard + _msg;
    }

    //無意識の封筒にカードがない場合はイベントなし
    if (_UnconsciousAngel.length == 0 && _UnconsciousInsight.length == 0 && _UnconsciousSetback.length == 0) {
      _msg = i18n.SquereTransformationNoCard;
      this.on('pointend', function(e) {
        self.exit('CloseTransformation');
      });
    }

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[_msg,],
                          x           :320,
                          y           :250,
                          width       :600,
                          height      :250,
                                           }).addChildTo(this);

    var _cbname = TfAp.doneFlareName();

    var _selectOptions = [
      {Text:i18n.NameCardAngel,CardType:'Angel',Scene:SelectEnvelopeToScoreAngelScene({selectNumberOfCards : 1,cbname:_cbname,}),},
      {Text:i18n.NameCardInsight,CardType:'Insight',Scene:SelectEnvelopeToScoreInsightScene({selectNumberOfCards : 1,cbname:_cbname,}),},
      {Text:i18n.NameCardSetback,CardType:'Setback',Scene:SelectEnvelopeToScoreSetbackScene({selectNumberOfCards : 1,cbname:_cbname,isNoPain:true,}),},
    ];

    this.button = [];
    this.selected = -1;
    this.nextScene = new DisplayScene();

    _selectOptions.forEach (function(val,buttonId,array) {
      self.button[buttonId] = self._selectButton({text:_selectOptions[buttonId].Text,id:buttonId,y:430,}).addChildTo(self);
      //封筒の枚数をチェックし、引けない場合は選択非活性
      var _UnconsciousLength = 0;
      var _Unconscious = TfAp.CurrentUnconscious(_selectOptions[buttonId].CardType);

      _UnconsciousLength = (_Unconscious == void 0?0:_Unconscious.length);
      if (_UnconsciousLength == 0) {
        self.button[buttonId].alpha = 0.5;
        self.button[buttonId].setInteractive(false);
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

    this.commitButton = Button({text:i18n.Decision}).setPosition(320,650).addChildTo(this);
    this.commitButton.hide().setInteractive(false);

    this.commitButton.on('push', function(e) {
      app.pushScene(self.nextScene);
    });

    app.on(_cbname, function(e) {
      self.exit();
    });

  },
});


phina.define('CloseTransformationScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      SquereMark  : 'Transformation',
      SquereMeaning : i18n.SquereTransformation,
    };
    this.superInit(options);
    var self = this;

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.SquereTransformationEndMessage,],
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


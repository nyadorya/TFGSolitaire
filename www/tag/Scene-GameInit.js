phina.globalize();

phina.define('GameInitSceneSequence' , {
  superClass: 'ManagerScene' ,
  init: function() {
    this.superInit({
      scenes: [
        {
          label: 'GameStart',
          className: 'GameStartScene',
          nextLabel: 'ComfirmPlayingFocus',
        },
        {
          label: 'ComfirmPlayingFocus',
          className: 'ComfirmPlayingFocusScene',
          nextLabel: 'IntoEnvelopeAngel',
        },
        {
          label: 'IntoEnvelopeAngel',
          className: 'IntoEnvelopeAngelScene',
          nextLabel: 'SelectDeckToEnvelopeAngelScene',
        },
        {
          label: 'SelectDeckToEnvelopeAngelScene',
          className: 'SelectDeckToEnvelopeAngelScene',
          nextLabel: 'IntoEnvelopeInsight',
        },
        {
          label: 'IntoEnvelopeInsight',
          className: 'IntoEnvelopeInsightScene',
          nextLabel: 'SelectDeckToEnvelopeInsight',
        },
        {
          label: 'SelectDeckToEnvelopeInsight',
          className: 'SelectDeckToEnvelopeInsightScene',
          nextLabel: 'IntoEnvelopeSetback',
        },
        {
          label: 'IntoEnvelopeSetback',
          className: 'IntoEnvelopeSetbackScene',
          nextLabel: 'SelectDeckToEnvelopeSetback',
        },
        {
          label: 'SelectDeckToEnvelopeSetback',
          className: 'SelectDeckToEnvelopeSetbackScene',
          nextLabel: 'CompleteEnvelope',
        },
        {
          label: 'CompleteEnvelope',
          className: 'CompleteEnvelopeScene',
          nextLabel: 'SelectGuardianAngel',
        },
        {
          label: 'SelectGuardianAngel',
          className: 'SelectGuardianAngelScene',
        },
        {
          label: 'SelectDirection',
          className: 'SelectDirectionScene',
        },
        {
          label: 'FlashCoin',
          className: 'FlashCoinScene',
        },
        {
          label: 'ResultDirection',
          className: 'ResultDirectionScene',
        },
      ],
    });

    this.on('finish',function() {
      app.replaceScene(MainBoardScene());
    });
  },
});

//ゲームスタート
phina.define('GameStartScene', {
  superClass: 'PrimitiveMessageScene',
  init: function(options) {
    options = ({}).$safe(options, {
      Messages : i18n.GameStartMessage,
      nextLabel : 'ComfirmPlayingFocus',
    });
    this.superInit(options);
  },
});

//パーソナルフォーカス確認
phina.define('ComfirmPlayingFocusScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    this.superInit(options);
    app.backgroundColor = appBackGroundColor;

    var _Message = [i18n.EmptyPlayingFocusMessage];
    var _buttonAName = '';
    var _Message0 = i18n.ComfirmPlayingFocusMessage;
    if (CurrentGameData.PlayingFocus != void 0 && CurrentGameData.PlayingFocus != '') {
      _Message = [
            _Message0.replace(/α/g,CurrentGameData.PlayingFocus)
            ];
      _buttonAName = i18n.OK;
    }

    this.MessageWindow = MessageWindow({
                          texts       :_Message,
                          x           :320,
                          y           :450,
                          width       :400,
                          height      :400,
                          buttonAName  :i18n.ButtonRecomfirm,
                          buttonBName  :_buttonAName,
                          buttonWidth: 300,
                                           }).addChildTo(this);

    var self = this;
    this.MessageWindow.ButtonA.on('push', function(e) {
      self.exit('ComfirmPlayingFocus');
    });

    this.MessageWindow.ButtonB.on('push', function(e) {
      self.exit('IntoEnvelopeAngel');
    });

  },
});

//無意識の封筒作成（メッセージ→サイコロ→メッセージ）
phina.define('IntoEnvelopeScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    this.superInit(options);
    options = ({}).$safe(options, {
      RollDiceMessages : [],
      IntoEnvelopeSelectMessages : [],
    });

    app.backgroundColor = appBackGroundColor;

    //メッセージウインドウ
    this.RollDiceMessage = MessageWindow({
                          texts       :options.RollDiceMessages,
                          x           :320,
                          y           :250,
                          width       :600,
                          height      :300,
                          buttonWidth: 200,
                                           }).addChildTo(this);
    this.RollDiceMessage.setInteractive(false);
    this.RollDiceMessage.showAllText();

    this.SelectMessage = MessageWindow({
                          texts       :options.IntoEnvelopeSelectMessages,
                          x           :320,
                          y           :450,
                          width       :400,
                          height      :200,
                          buttonAName  :i18n.ButtonNext,
                          buttonWidth: 200,
                                           }).addChildTo(this).hide();

    //サイコロボタン
    this.MarkDice = MarkDice({diceNumber:CurrentGameData.LastDiceNumber}).addChildTo(this);

    var self = this;
    var _diceNumber = 0;
    this.MarkDice.on('rolleddice', function(e) {
      self.RollDiceMessage.hide();
      self.showDice({easing:'swing',});
      _diceNumber = e.diceNumber;

      options.IntoEnvelopeSelectMessages[0] = options.IntoEnvelopeSelectMessages[0].replace(/α/g,_diceNumber);
      self.SelectMessage.resetText({texts:options.IntoEnvelopeSelectMessages});
      self.SelectMessage.show();
    });

    this.SelectMessage.ButtonA.on('push', function(e) {
      self.exit({selectNumberOfCards : _diceNumber});
    });

  },
  showDice: function(e) {
    this.MarkDice.showRandom();
  },
});

//無意識の封筒作成（エンジェル）
phina.define('IntoEnvelopeAngelScene', {
  superClass: 'IntoEnvelopeScene',

  init: function(options) {
    options = ({}).$safe(options, {
      RollDiceMessages : i18n.IntoEnvelopeAngelRollDiceMessage,
      IntoEnvelopeSelectMessages : i18n.IntoEnvelopeAngelSelectMessage,
    });
    this.superInit(options);
  },
});

//無意識の封筒作成（インサイト）
phina.define('IntoEnvelopeInsightScene', {
  superClass: 'IntoEnvelopeScene',

  init: function(options) {
    options = ({}).$safe(options, {
      RollDiceMessages : i18n.IntoEnvelopeInsightRollDiceMessage,
      IntoEnvelopeSelectMessages : i18n.IntoEnvelopeInsightSelectMessage,
    });
    this.superInit(options);
  },
});

//無意識の封筒作成（セットバック）
phina.define('IntoEnvelopeSetbackScene', {
  superClass: 'IntoEnvelopeScene',

  init: function(options) {
    options = ({}).$safe(options, {
      RollDiceMessages : i18n.IntoEnvelopeSetbackRollDiceMessage,
      IntoEnvelopeSelectMessages : i18n.IntoEnvelopeSetbackSelectMessage,
    });
    this.superInit(options);
  },
});

//無意識の封筒完了＋誕生
phina.define('CompleteEnvelopeScene', {
  superClass: 'PrimitiveMessageScene',
  init: function(options) {

    //誕生判定
    var _hit = 0;
    var _getBirth = Random.randint(1,1000);
    var _completeEnvelopeMessage = i18n.CompleteEnvelopeMessage[1];
    for (var _i in i18n.BirthMessage) {
      _hit = _hit + i18n.BirthMessage[_i].probability;
      if (_hit > _getBirth) {
        _completeEnvelopeMessage = _completeEnvelopeMessage.replace(/α/g,i18n.BirthMessage[_i].message);
        TfAp.WriteGameLog(i18n.LogBirth + i18n.BirthMessage[_i].message)
        break;
      }
    }

    options.Messages = [i18n.CompleteEnvelopeMessage[0],_completeEnvelopeMessage];
    options.nextLabel = 'SelectGuardianAngel';
    this.superInit(options);
  },
});

//守護天使選択from無意識の封筒
phina.define('SelectGuardianAngelScene', {
  superClass: 'SelectEnvelopeToScoreScene',

  init: function(options) {
    options = ({}).$safe(options, {
      CardClass : AngelCard,
      Master : i18n.CardAngels,
      OpenMessage : true,
      Deck : CurrentGameData.UnconsciousAngel,
      Message : i18n.SelectedGuardianAngelMessage,
      Log : i18n.SelectedGuardianAngelLog,
    });

    if (CurrentGameData.GuardianAngel == void 0 ) {
      CurrentGameData.GuardianAngel = [];
    }
    options.SelectedCard = CurrentGameData.GuardianAngel;

    this.superInit(options);
  },
});

phina.define('FlashCoinScene', {
  superClass: 'DisplayScene',
  init: function(options) {
    options = ({}).$safe(options, {
      Direction : 0,  //1か-1どちらか
    });
    this.superInit(options);
    this.backgroundColor = appBackGroundColor;

    var self = this;
    var _cbname = TfAp.doneFlareName();

    //演出のために全オブジェクトをまとめる
    this._DisplayObjects = DisplayElement().addChildTo(this);

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.LeaveHeavenlyIntentionToFlashCoinTheDirection,],
                          x           :320,
                          y           :150,
                          width       :600,
                          height      :200,
                          buttonAName :'',
                                           }).addChildTo(this._DisplayObjects);
    this.StartMessage.showAllText();
    this.StartMessage.ButtonA.hide().setInteractive(false);

    this.StartMessage.ButtonA.on('push', function(e) {
      if (self.imgCoin.isFace == false) {
        var _cbname = TfAp.doneFlareName();
        app.pushScene(SelectTokenAwarenessBoxToScoreScene({selectNumberOfAwarenessTokens:1,cbname: _cbname,}));
        app.on(_cbname, function() {
          self.exit('ResultDirection');
        });
      } else {
        self.exit('ResultDirection');
      }
    });

    //コインを表示
    this.imgCoin = FlashCoin().setPosition(320,350).addChildTo(this);
    this.imgCoin.setInteractive(true);

    //コインを投げる
    this.imgCoin.on('pointend', function(e) {
      self.imgCoin.throwCoin();
    });

    //コイン止めてる途中
    this.imgCoin.on('stoppingCoin', function(e) {
      self.imgCoin.setInteractive(false);
    });

    //コイン結果後のイベント
    this.imgCoin.on('resultCoin', function(e) {
      //this.isFace = false; //とりあえず
      if (this.isFace) {
        self.StartMessage.resetText({texts:[i18n.FlashTheDirection]});
        CurrentGameData.Direction = options.Direction;
        self.StartMessage.ButtonA.text = i18n.ButtonNext;
        self.StartMessage.ButtonA.show().setInteractive(true);
      } else {
        var _cbname = TfAp.doneFlareName();
        app.pushScene(AmimateDepressionScene({numberOfDepressionTokens:1,PutPainScene: 'Born',CardId: 0,cbname: _cbname,}));
        app.on(_cbname, function() {
          self.StartMessage.resetText({texts:[i18n.PainTheDirection]});
          CurrentGameData.Direction = options.Direction * -1;
          self.StartMessage.ButtonA.text = i18n.ButtonNext;
          self.StartMessage.ButtonA.setInteractive(true);
        });
      }
    });

  },
});

phina.define('SelectDirectionScene', {
  superClass: 'DisplayScene',
  init: function(options) {
    options = ({}).$safe(options, {
    });
    this.superInit(options);
    this.backgroundColor = appBackGroundColor;

    var self = this;
    var _cbname = TfAp.doneFlareName();

    //演出のために全オブジェクトをまとめる
    this._DisplayObjects = DisplayElement().addChildTo(this);

    //マップを表示
    this.pathMap = PathMap({ratio:1.2,x:320,y:550,isFocus:true,isInterActive:false,isDisplayArrow:true}).addChildTo(this._DisplayObjects);

    var _btnName = i18n.ButtonEndOfSelect;
    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.ChoiceTheDirection,],
                          x           :320,
                          y           :150,
                          width       :600,
                          height      :200,
                          buttonAName :_btnName,
                                           }).addChildTo(this._DisplayObjects);
    this.StartMessage.showAllText();
    this.StartMessage.ButtonA.setInteractive(true);

    this._selectButton = function(opt){ return Button({
                          text      :opt.text,
                          x         :opt.x||320,
                          y         :210,
                          height    :45,
                          width     :150,
                          align: 'left',
                          fontWeight:'bold',
                          strokeWidth : 3,
                          fill: 'purple',
                          fontSize  :25})};

    this.OKButton = this._selectButton({text:i18n.OK,width:150,x:150}).addChildTo(this._DisplayObjects).hide().setInteractive(false);
    this.NGButton = this._selectButton({text:i18n.NG,width:150,x:450}).addChildTo(this._DisplayObjects).hide().setInteractive(false);

    this.StartMessage.ButtonA.on('push', function(e) {
      _msg = i18n.Direction + '：' + (self.pathMap.selectedDirection==1?i18n.Right:i18n.Left) + '\n' + i18n.AreYouReady;
      self.StartMessage.ButtonA.text = '';
      self.StartMessage.resetText({texts:[_msg]});
      self.StartMessage.ButtonA.hide().setInteractive(false);
      self.OKButton.show().setInteractive(true);
      self.NGButton.show().setInteractive(true);
    });

    this.OKButton.on('push', function(e) {
      self.exit('FlashCoin',{Direction:self.pathMap.selectedDirection});
    });

    this.NGButton.on('push', function(e) {
      self.exit('SelectDirection');
    });
  },
});

phina.define('ResultDirectionScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    this.backgroundColor = appBackGroundColor;
    var self = this;

    this.StartMessage = MessageWindow({
                          texts       :[i18n.ResultDirection,],
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


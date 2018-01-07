phina.globalize();

phina.define('GameCloseSceneSequence' , {
  superClass: 'ManagerScene' ,
  init: function() {
    this.superInit({
      scenes: [
        {
          label: 'GameCloseAngel',
          className: 'GameCloseAngelScene',
          nextLabel: 'GameCloseInsight',
        },
        {
          label: 'GameCloseInsight',
          className: 'GameCloseInsightScene',
          nextLabel: 'GameCloseSetback',
        },
        {
          label: 'GameCloseSetback',
          className: 'GameCloseSetbackScene',
          nextLabel: 'GameCloseOver',
        },
        {
          label: 'GameCloseOver',
          className: 'GameCloseOverScene',
        },
      ],
    });
    this.on('finish',function() {
      var _date = new Date();
      CurrentGameData.CloseTime = _date.getTime();
      CurrentGameData.Scene = 'MainBoard';
      TfAp.WriteGameLog(i18n.LogGameEnd);
      TfAp.saveGameData();
    });
  },
});

//ゲーム終了確認
phina.define('ConfirmGameCloseScene', {
  superClass: 'DisplayScene',
  init: function(options) {
    options = ({}).$safe(options, {
      Messages : [i18n.ConfirmGameClose],
    });
    this.superInit(options);

    app.backgroundColor = appBackGroundColor;

    //メッセージウインドウ
    var _msg = MessageWindow({
                          texts       :options.Messages,
                          x           :320,
                          y           :200,
                          width       :500,
                          height      :300,
                                           }).addChildTo(this);
    var _btnOK = Button({text:'OK'}).setPosition(180,500).addChildTo(this);
    var _btnNG = Button({text:'NG'}).setPosition(460,500).addChildTo(this);
    var _btnGO = Button({text:'GO'}).setPosition(320,500).addChildTo(this).hide().setInteractive(false);

    var self = this;
    _btnOK.on('push', function(e) {
      _btnOK.hide().setInteractive(false);
      _btnNG.hide().setInteractive(false);
      _btnGO.show().setInteractive(true);
      _msg.resetText({texts:[i18n.StartGameClose]});
    });
    _btnNG.on('push', function(e) {
      app.replaceScene(MainBoardScene());
    });

    _btnGO.on('push', function(e) {
      app.replaceScene(GameCloseSceneSequence());
    });
  },
});

//ゲーム終了
phina.define('GameCloseOverScene', {
  superClass: 'DisplayScene',
  init: function(options) {
    options = ({}).$safe(options, {
      Messages : [i18n.GameEnd],
    });
    this.superInit(options);

    app.backgroundColor = appBackGroundColor;

    //メッセージウインドウ
    var _msg = MessageWindow({
                          texts       :options.Messages,
                          x           :320,
                          y           :200,
                          width       :500,
                          height      :300,
                                           }).addChildTo(this);
    var _btnGO = Button({text:'FIN'}).setPosition(320,300).addChildTo(this);

    var self = this;
    _btnGO.on('push', function(e) {
      self.exit();
    });
  },
});

//無意識の封筒
phina.define('GameCloseScene', {
  superClass: 'DisplayScene',
  init: function(options) {
    options = ({}).$safe(options, {
      Messages : [i18n.ClickCardAndTurnOverMessage + '\n' + i18n.SkipNextButton],
      Deck : CurrentGameData.UnconsciousAngel,
      CardClass : AngelCard,
      Master : i18n.CardAngels,
      CardType : 'Angel',
    });
    this.superInit(options);

    app.backgroundColor = appBackGroundColor;

    //メッセージウインドウ
    var _msg = MessageWindow({
                          texts       :options.Messages,
                          x           :320,
                          y           :150,
                          width       :500,
                          height      :200,
                                           }).addChildTo(this);
    var _btnGO = Button({text:i18n.ButtonNext}).setPosition(320,320).addChildTo(this);

    var ImageEnvelope = Sprite('envelope').setSize(550,600).setPosition(320,700).addChildTo(this);

    this._openDeck = DisplayElement().addChildTo(this);
    this._deckCard = [];
    for (i in options.Deck) {
      this._deckCard[i] = options.CardClass({layer:i,id:options.Deck[i],isFace:false,Master:options.Master}).setPosition(200 + 240 * (i/3<1?0:1),450 + 160 * (i%3)).addChildTo(this._openDeck);

      this._deckCard[i].on('pointend', function(e) {
        this.openFace(e);
        var _relatedToThisPlayFocus = i18n.RelatedToThisPlayFocus;
        _relatedToThisPlayFocus = _relatedToThisPlayFocus.replace(/β/g,this.getMessage());

        var _tmp = this.getMeaning()+_relatedToThisPlayFocus;
        _msg.resetText({texts:[_tmp]});

        var _log = i18n.Envelope + '(' + options.CardType + '):' + this.getMeaning()+'('+this.getMessage()+')';
        TfAp.WriteGameLog(_log);
        
      });
    }

    var self = this;
    _btnGO.on('push', function(e) {
      self.exit();
    });
  },
});


//無意識の封筒（エンジェル）
phina.define('GameCloseAngelScene', {
  superClass: 'GameCloseScene',
  init: function(options) {
    options = ({}).$safe(options, {
      Deck : CurrentGameData.UnconsciousAngel,
      CardClass : AngelCard,
      Master : i18n.CardAngels,
      CardType : 'Angel',
    });
    this.superInit(options);
  },
});

//無意識の封筒（セットバック）
phina.define('GameCloseSetbackScene', {
  superClass: 'GameCloseScene',
  init: function(options) {
    options = ({}).$safe(options, {
      Deck : CurrentGameData.UnconsciousSetback,
      CardClass : SetbackCard,
      Master : i18n.CardSetbacks,
      CardType : 'Setback',
    });
    this.superInit(options);
  },
});

//無意識の封筒（インサイト）
phina.define('GameCloseInsightScene', {
  superClass: 'GameCloseScene',
  init: function(options) {
    options = ({}).$safe(options, {
      Deck : CurrentGameData.UnconsciousInsight,
      CardClass : InsightCard,
      Master : i18n.CardInsights,
      CardType : 'Insight',
    });
    this.superInit(options);
  },
});



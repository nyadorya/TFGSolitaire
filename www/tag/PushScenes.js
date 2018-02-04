phina.globalize();

//文字入力画面（オーバーレイする際にロックする）
phina.define('InputScene', {
  superClass: 'DisplayScene',
  init: function(opt) {
    //see app-globalobjects
    //TfAp.OverLayMessage = '';  //メッセージ
    //TfAp.OverLayInput = '';  //入力結果
    //see phina-main.tag.html
    //listenUserVoice
    //see SquereBlessingScene //利用例
    //this.on(opt.cbname
    
    // 親クラス初期化
    this.superInit();
    // 背景を半透明化
    this.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.beforeInput = TfAp.OverLayInput;
    this.cbname = opt.cbname;
  },
  update:function(app){
    //疑似連係なので入力値変更とキャンセルは別々に処理

    //更新１：入力値変更時、コールバックイベント発火して戻る。
    if(this.beforeInput != TfAp.OverLayInput){
      this.beforeInput = TfAp.OverLayInput;
      app.flare(this.cbname);
      app.popScene();
    }

    //更新２：キャンセルボタン押下時、何もせず戻る。
    if(TfAp.OverLayCancel == true){
      TfAp.OverLayCancel = false;
      app.popScene();
    }
  },

});

//初歩的なメッセージ表示シーン
phina.define('PrimitiveMessageScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    this.superInit(options);
    //上位クラスで使うoptionsではないのでここで空白対策
    options = ({}).$safe(options, {
      Messages    :['',],
      x           :320,
      y           :450,
      width       :600,
      height      :500,
      nextLabel   :'',
    });
    app.backgroundColor = appBackGroundColor;

    //メッセージウインドウ
    this.MessageWindow = MessageWindow({
                          texts       :options.Messages,
                          x           :options.x,
                          y           :options.y,
                          width       :options.width,
                          height      :options.height,
                          buttonAName  :i18n.OK,
                          buttonWidth: 300,
                                           }).addChildTo(this);

    var self = this;
    this.MessageWindow.ButtonA.on('push', function(e) {
      self.exit(options.nextLabel);
    });

  },
});

//各スクエアの基本定義
phina.define('SquereScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    this.superInit(options);
    app.backgroundColor = appBackGroundColor;

    //スクエアマーク
    var imageSquere = SquareMark({
                            name    : 'mark_' + options.SquereMark,
                            x       : 50,
                            y       : 50,
                            width   : 90,
                            height  : 90,
                            rotation: 0,
                          }).addChildTo(this);

    //スクエア名
    var labelSquereName = Label({text:options.SquereMark + ' Squere',
                        x       : 100,
                        y       : 30,
                        width   : 200,
                        height  : 50,
                        align: 'left',
                        baseline: 'middle',
                        fontSize:32,
                        fontColor :'black',
                        fontWeight:'bold',}).addChildTo(this);

    var labelSquereMeaning = Label({text:options.SquereMeaning + i18n.Squere,
                        x       : 150,
                        y       : 60,
                        width   : 200,
                        height  : 50,
                        align: 'left',
                        baseline: 'middle',
                        fontSize:20,
                        fontColor :'black',}).addChildTo(this);

    this._label = function(opt){ return Label({
                        text: opt.text,
                        align: opt.align||'left',
                        baseline: 'top',
                        fontSize:opt.fontSize||20,
                        fontColor :opt.fontColor||'black',
                        x:opt.x|| 50,
                        y:opt.y||250,
                        });}

    this._selectButton = function(opt){ return Button({
                          text      :opt.text,
                          id        :opt.id,
                          x         :opt.x||320,
                          y         :(opt.y||400)+opt.id*50,
                          height    :opt.height||40,
                          width     :opt.width||600,
                          align: 'left',
                          fontColor :'black',
                          fontWeight:'bold',
                          fill      :'#E8CFE8',
                          stroke    :'purple',
                          strokeWidth : 3,
                          fontFamily:'monospace',
                          fontSize  :20})};
  },
});

//エンジェルデッキ選択to無意識の封筒
phina.define('SelectDeckToEnvelopeAngelScene', {
  superClass: 'SelectDeckToEnvelopeScene',

  init: function(options) {
    options = ({}).$safe(options, {
      CardClass : AngelCard,
      Master : i18n.CardAngels,
    });

    if (CurrentGameData.DeckAngel == void 0 || CurrentGameData.DeckAngel.length == 0) {
      var _deck = [];
      for (i in options.Master) {
        _deck.push(options.Master[i].id);
      }
      CurrentGameData.DeckAngel = _deck.shuffle();
    }
    options.Deck = CurrentGameData.DeckAngel;

    if (CurrentGameData.UnconsciousAngel == void 0 ) {
      CurrentGameData.UnconsciousAngel = [];
    }
    options.UnconsciousEnvelope = CurrentGameData.UnconsciousAngel;

    var _inPlayCard = [].concat(CurrentGameData.UnconsciousAngel);
    options.InPlayCard = _inPlayCard;

    this.superInit(options);
  },
});

//インサイトデッキ選択
phina.define('SelectDeckToEnvelopeInsightScene', {
  superClass: 'SelectDeckToEnvelopeScene',

  init: function(options) {
    options = ({}).$safe(options, {
      CardClass : InsightCard,
      Master : i18n.CardInsights,
    });

    if (CurrentGameData.DeckInsight == void 0 || CurrentGameData.DeckInsight.length == 0) {
      var _deck = [];
      for (i in options.Master) {
        _deck.push(options.Master[i].id);
      }
      CurrentGameData.DeckInsight = _deck.shuffle();
    }
    options.Deck = CurrentGameData.DeckInsight;

    if (CurrentGameData.UnconsciousInsight == void 0 ) {
      CurrentGameData.UnconsciousInsight = [];
    }
    options.UnconsciousEnvelope = CurrentGameData.UnconsciousInsight;

    var _inPlayCard = [].concat(CurrentGameData.UnconsciousInsight);
    options.InPlayCard = _inPlayCard;
    this.superInit(options);
  },
});

//セットバックデッキ選択
phina.define('SelectDeckToEnvelopeSetbackScene', {
  superClass: 'SelectDeckToEnvelopeScene',

  init: function(options) {
    options = ({}).$safe(options, {
      CardClass : SetbackCard,
      Master : i18n.CardSetbacks,
    });

    if (CurrentGameData.DeckSetback == void 0 || CurrentGameData.DeckSetback.length == 0) {
      var _deck = [];
      for (i in options.Master) {
        _deck.push(options.Master[i].id);
      }
      CurrentGameData.DeckSetback = _deck.shuffle();
    }
    options.Deck = CurrentGameData.DeckSetback;

    if (CurrentGameData.UnconsciousSetback == void 0 ) {
      CurrentGameData.UnconsciousSetback = [];
    }
    options.UnconsciousEnvelope = CurrentGameData.UnconsciousSetback;

    var _inPlayCard = [].concat(CurrentGameData.UnconsciousSetback);
    options.InPlayCard = _inPlayCard;
    this.superInit(options);
  },
});

//天使from無意識の封筒
phina.define('SelectEnvelopeToScoreAngelScene', {
  superClass: 'SelectEnvelopeToScoreScene',

  init: function(options) {
    options = ({}).$safe(options, {
      CardClass : AngelCard,
      Master : i18n.CardAngels,
      OpenMessage : true,
      Deck : CurrentGameData.UnconsciousAngel,
      Message : i18n.SelectedAngelMessage + i18n.SelectedAngelAfterMessage,
      Log : i18n.SelectedAngelLog,
    });

    if (CurrentGameData.ScoreCardLevel == void 0 || CurrentGameData.ScoreCardLevel < 0) {
      CurrentGameData.ScoreCardLevel = 0;
    }

    if (CurrentGameData.Angel[CurrentGameData.ScoreCardLevel] == void 0) {
      CurrentGameData.Angel[CurrentGameData.ScoreCardLevel] = [];
    }
    //スコアカードに入れる
    options.SelectedCard = CurrentGameData.Angel[CurrentGameData.ScoreCardLevel];

    this.superInit(options);
  },
});

//インサイトカードfrom無意識の封筒
phina.define('SelectEnvelopeToScoreInsightScene', {
  superClass: 'SelectEnvelopeToScoreScene',

  init: function(options) {
    options = ({}).$safe(options, {
      CardClass : InsightCard,
      Master : i18n.CardInsights,
      OpenMessage : true,
      Deck : CurrentGameData.UnconsciousInsight,
      Message : i18n.SelectedInsightMessage,
      Log : i18n.SelectedInsightLog,
    });

    if (CurrentGameData.ScoreCardLevel == void 0 || CurrentGameData.ScoreCardLevel < 0) {
      CurrentGameData.ScoreCardLevel = 0;
    }

    if (CurrentGameData.TransformInsight[CurrentGameData.ScoreCardLevel] == void 0) {
      CurrentGameData.TransformInsight[CurrentGameData.ScoreCardLevel] = [];
    }
    //スコアカードに入れる
    options.SelectedCard = CurrentGameData.TransformInsight[CurrentGameData.ScoreCardLevel];

    this.superInit(options);
  },
});

//セットバックカードfrom無意識の封筒
phina.define('SelectEnvelopeToScoreSetbackScene', {
  superClass: 'SelectEnvelopeToScoreScene',

  init: function(options) {
    options = ({}).$safe(options, {
      CardClass : SetbackCard,
      Master : i18n.CardSetbacks,
      OpenMessage : true,
      Deck : CurrentGameData.UnconsciousSetback,
      Message : i18n.SelectedSetbackMessage,
      Log : i18n.SelectedSetbackLog,
      isNoPain : false,
    });

    if (CurrentGameData.ScoreCardLevel == void 0 || CurrentGameData.ScoreCardLevel < 0) {
      CurrentGameData.ScoreCardLevel = 0;
    }

    if (CurrentGameData.TransformSetback[CurrentGameData.ScoreCardLevel] == void 0 ) {
      CurrentGameData.TransformSetback[CurrentGameData.ScoreCardLevel] = [];
    }
    //スコアカードに入れる
    options.SelectedCard = CurrentGameData.TransformSetback[CurrentGameData.ScoreCardLevel];

    this.superInit(options);
  },
});

//デッキ選択→無意識の封筒へ
phina.define('SelectDeckToEnvelopeScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    options = ({}).$safe(options, {
      selectNumberOfCards : 1,
      CardClass : '', //カードクラス名
      Master: [], //カードのマスタ定義
      Deck: [], //デッキ
      UnconsciousEnvelope : [],  //選択したカードを入れる
      InPlayCard: [], //オープンされたカード
    });

    this.superInit(options);
    app.backgroundColor = appBackGroundColor;
    this.selectNumberOfCards = options.selectNumberOfCards;

    var self = this;

    //メッセージウインドウ
    var _selectDeckMessage = [];
    _selectDeckMessage[0] = i18n.SelectDeckMessage[0];
    _selectDeckMessage[0] = _selectDeckMessage[0].replace(/α/g,this.selectNumberOfCards);
    this.SelectDeckMessage = MessageWindow({
                          texts       :_selectDeckMessage,
                          x           :500,
                          y           :300,
                          width       :200,
                          height      :500,
                          buttonAName  :i18n.ButtonEndOfSelect,
                          buttonWidth: 150,
                                           }).addChildTo(this);
    this.SelectDeckMessage.ButtonA.setInteractive(false);

    //デッキのカード全部表示
    this._openDeck = DisplayElement().addChildTo(this);
    for (i in options.Deck) {
      options.CardClass({layer:i,id:options.Deck[i]}).setPosition(200,100+i*10).addChildTo(this._openDeck);
    }

    this.SelectDeckMessage.ButtonA.on('push', function(e) {
      self._openDeck.children.each(function(child) {
        if (child.isSelected == true) {
          //選ばれたカードを無意識の封筒へ
          options.UnconsciousEnvelope.push(child.id);
          //選ばれたカードをデッキから削除
          var _delId = options.Deck.indexOf(child.id);
          options.Deck.splice(_delId,1);
        }
      }, self);
      self.app.popScene();
    });
  },
  update: function(e){
    selectCard({deck: this._openDeck,
                selectNumberOfCards:this.selectNumberOfCards,
                interActiveButton:this.SelectDeckMessage.ButtonA,
                delta_x:50,
              });
  },
});

//気づきのトークン選択
phina.define('SelectTokenAwarenessBoxToScoreScene', {
  superClass: 'SelectTokenBoxToScoreScene',

  init: function(options) {
    //気づきのトークン以外を選択することがあった場合を考慮した
    //実際にあるかな？
    this.superInit(options);
  },
});

//トークン選択
phina.define('SelectTokenBoxToScoreScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    options = ({}).$safe(options, {
      selectNumberOfAwarenessTokens : 1,
      TokenClass : TokenAwareness, //トークンクラス名
      Target     : '',  //自分の場合は''とする。
      ScoreLevel : CurrentGameData.ScoreCardLevel,
    });

    var _scoreLevel = options.ScoreLevel;

    this.superInit(options);
    //半透明も面白いが
//    this.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.backgroundColor = appBackGroundColor;

    this.selectNumberOfAwarenessTokens = options.selectNumberOfAwarenessTokens;

    if (CurrentGameData.InboxAwareness[_scoreLevel] == void 0) {
      CurrentGameData.InboxAwareness[_scoreLevel] = [];
    }
    this.Inbox = CurrentGameData.InboxAwareness[_scoreLevel];
    this.NowSelectAwareness = []; //今回選んだトークン
    this.Target = options.Target;
    this.cbname = options.cbname;
    this._selectedToken = [];

    this.openNumberOfTokens = 0;

    var _Master = TfAp.TokenAwareness[_scoreLevel];

    if (this.Inbox == void 0 || this.Inbox.length == 0) {
      var _Inbox = [];
      for (i in _Master) {
        _Inbox.push(_Master[i].id);
      }
      CurrentGameData.InboxAwareness[_scoreLevel] = _Inbox.shuffle();
      this.Inbox = CurrentGameData.InboxAwareness[_scoreLevel];
    }

    //あとからアニメーションするために選ばれてないオブジェクトをグループ化する
    var nonSelectObjects = DisplayElement().addChildTo(this);

    var self = this;

    //メッセージウインドウ
    var _selectTokenMessage = i18n.SelectTokenAndPushButtonMessage;
    _selectTokenMessage = _selectTokenMessage.replace(/α/g,this.selectNumberOfAwarenessTokens);
    this.SelectTokenMessage = MessageWindow({
                          texts       :[_selectTokenMessage],
                          x           :320,
                          y           :100,
                          width       :500,
                          height      :100,
                          buttonAName  :i18n.ButtonEndOfSelect,
                          buttonWidth: 150,
                                           }).addChildTo(this);
    this.SelectTokenMessage.ButtonA.setInteractive(true);

    //選択エリア表示
    this.AreaSelectedTokens = AreaSelectedTokens().addChildTo(nonSelectObjects);

    //ハコのトークン全部表示
    this._openToken = DisplayElement().addChildTo(this);
    //トークン配列定義
    this._Token = [];
    for (i in this.Inbox) {
      this._Token.push(
        options.TokenClass({layer:i,id:this.Inbox[i],ratio:0.55,
                            x : Random.randint(100,600),
                            y : Random.randint(400,900),
                            rotation : Random.randint(0,359),
                            level : _scoreLevel,
                            })
      );
      this._Token[i].addChildTo(this._openToken);
    }

    this.SelectTokenMessage.ButtonA.on('push', function(e) {
      var _tempNonSelectToken = [];  //非選択トークン

      //まずは枚数を判定
      var _checkSelectedCards = 0;
      self._Token.each(function(child) {
        if(self.AreaSelectedTokens.hitTestElement(child)){
          _checkSelectedCards = _checkSelectedCards + 1;
        }
      });
      //枚数不一致なら以下の処理は行わない
      if (_checkSelectedCards != self.selectNumberOfAwarenessTokens) return;

      //ここから本格的な処理
      self.SelectTokenMessage.ButtonA.setInteractive(false);

      var _selectedCards = 0;
      self._Token.each(function(child) {
        if(self.AreaSelectedTokens.hitTestElement(child)){
          _selectedCards = _selectedCards + 1;
          //選ばれたトークンのIDを登録
          self.NowSelectAwareness.push(child.id);
          //ターゲットが空白(自分)なら選択結果をCurrentGameDataに反映

          if (CurrentGameData.Awareness[_scoreLevel] == void 0) {
            CurrentGameData.Awareness[_scoreLevel] = [];
          }
          if (options.Target == void 0 || options.Target == '') {
            CurrentGameData.Awareness[_scoreLevel].push(child.id);
          }
          //選ばれたトークンオブジェクトを登録
          self._selectedToken.push(child);
          //表示で残すため再定義
          child.addChildTo(self);
          //裏返す前に位置を移動
          child.tweener.to({
            rotation:0,
            x : 220+120*((_selectedCards-1)%3),
            y : 100+150*((_selectedCards-1)<3?0:1),
            width : 100,
            height : 140,
            ratio  : 0.8,
          },1000,"swing");
        } else {
          _tempNonSelectToken.push(child.id);
        }
      });
      //他のトークンすべて非選択オブジェクトに
      self._openToken.addChildTo(nonSelectObjects);

      //選択結果をCurrentGameDataに反映
      CurrentGameData.InboxAwareness[_scoreLevel] = _tempNonSelectToken;

      //メッセージエリアを非表示へ
      self.SelectTokenMessage.hide();

      //選択してないトークンは下へスクロール
      nonSelectObjects.tweener.by({
        y:1000,
      },1000,"swing")
      .wait(1000)
      .call(function(){
        self.SelectTokenMessage = MessageWindow({
                              texts       :[i18n.ClickCardAndTurnOverMessage,],
                              x           :350,
                              y           :600,
                              width       :400,
                              height      :200,
                              buttonWidth :150,
                                               }).addChildTo(self);

        //これでイベントはとれる
        for (var _id = 0;_id < self._selectedToken.length;_id++) {
          self._selectedToken[_id].one('pointend', function(e) {
            this.openFace(e);
            self.flare('visibleButton',{message:this.getMessage(),meaning:this.getMeaning()});
          });
        }
      });
    });

    this.on('visibleButton', function(options) {
      self.openNumberOfTokens = self.openNumberOfTokens + 1;

      self.SelectTokenMessage.texts = [options.message+'\n'+options.meaning];
      self.SelectTokenMessage.showAllText();

      if (self.openNumberOfTokens >= self.selectNumberOfAwarenessTokens)  {
        this.buttonEnd.show();
        if (self.Target == void 0 || self.Target == '') {
          self.SelectTokenMessage.texts = [options.message+'\n'+options.meaning+'\n\n'+i18n.MoveTokenToScoreCard];
        } else {
          self.SelectTokenMessage.texts = [options.message+'\n'+options.meaning+'\n\n'+self.Target + i18n.MoveTokenToTarget];
        }
        self.SelectTokenMessage.showAllText();
      }
    });

    this.buttonEnd = Button({
      text: i18n.ButtonBack,
      x: 350,
      y: 350,
      fill: 'purple',
      width: 100,
      height: 45,
      }).addChildTo(this).hide();

    this.buttonEnd.on('push' , function(options) {
      //ログに書き込む
      var _tempLogging = '';
      if (self.Target == void 0 || self.Target == '') {
        _tempLogging = ScoreCardNames[_scoreLevel] + i18n.OnLevel + i18n.GetToken + ':';
      } else {
        _tempLogging = ScoreCardNames[_scoreLevel] + i18n.GivenToken +self.Target + ']:';
      };

      self._selectedToken.forEach(function(val,_id,array) {
        if (_id>0) {_tempLogging = _tempLogging + ','};
        _tempLogging = _tempLogging + val.getMessage();
        if (CurrentGameData.Language!='EN') {_tempLogging = _tempLogging + '（' +val.getMeaning() + '）';};
      });
      
      CurrentGameData.Scene = 'MainBoard';
      TfAp.WriteGameLog(_tempLogging);
      TfAp.saveGameData();

      app.flare(self.cbname);
      app.popScene();
    });

  },
  update: function(e){
    moveToken({Token: this._openToken,});
  },
});

phina.define('AreaSelectedTokens', {
  superClass: 'RectangleShape',
  init: function(options) {
    options = ({}).$safe(options, {
        x   :320,
        y   :240,
        width: 540,
        height: 120,
        backgroundColor: '#E8CFE8',
        stroke: '#E8CFE8',
        fill: 'white',
        strokeWidth: 4,
        cornerRadius: 4,
    });
    this.superInit(options);

    var label = Label({
                      text      :i18n.SelectArea,
                      align     :'Left',
                      fontColor :'black',
                      fontSize  :16,
                      x         :-255,
                      y         :-40,
                    }).addChildTo(this);

  },
});


//見た目が一番上のトークンを移動する処理
var moveToken = function(options) {
  options = ({}).$safe(options, {
    Token: [],
  });

  //一番手前（に見える）カードを判定するための変数
  var _maxlayer = -1;

  //各オブジェクトのpointoverを取得すると重なったオブジェクトすべて反応するため
  //selectedしているobjectのうちidの最大を取得
  options.Token.children.each(function(child) {
    if (child.isMoving == true && _maxlayer < child.layer) {
      _maxlayer = child.layer;
    }
  }, this);
  if (_maxlayer != -1) {
    //一番手前（に見える）カードのみ処理する
    options.Token.children[_maxlayer].moveSelected(options);
  }
  for (var k = 0;k < options.Token.children.length; k++) {
    //一通り処理を終えたのですべての選択中状態は解除
    options.Token.children[k].isMoving = false
  }
}

//ユニバーサルフィードバックデッキ選択（toスコアカード）
phina.define('SelectDeckToScoreUniversalFeedbackScene', {
  superClass: 'SelectDeckToScoreScene',

  init: function(options) {
    options = ({}).$safe(options, {
      CardClass : UniversalFeedbackCard,
      Master : i18n.CardUniversalFeedbacks,
      Transform : 'Feedback',
      Log : i18n.SelectedDeckUniversalFeedbackLog,
      Message : i18n.SelectedDeckUniversalFeedbackMessage,
      OpenMessage : true,
    });

    //ユニバーサルフィードバックだけは常にデッキに全数あり常にシャッフル
    var _deck = [];
    for (i in options.Master) {
      _deck.push(options.Master[i].id);
    }
    options.Deck = _deck.shuffle();

    if (CurrentGameData.ScoreCardLevel == void 0 || CurrentGameData.ScoreCardLevel < 0) {
      CurrentGameData.ScoreCardLevel = 0;
    }

    if (CurrentGameData.TransformFeedback[CurrentGameData.ScoreCardLevel] == void 0) {
      CurrentGameData.TransformFeedback[CurrentGameData.ScoreCardLevel] = [];
    }
    //スコアカードに入れる
    options.SelectedCard = CurrentGameData.TransformFeedback[CurrentGameData.ScoreCardLevel];

    this.superInit(options);
  },
});

//インサイトデッキ選択toスコアカード
phina.define('SelectDeckToScoreInsightScene', {
  superClass: 'SelectDeckToScoreScene',

  init: function(options) {
    options = ({}).$safe(options, {
      Transform : 'Insight',

      CardClass : InsightCard,
      Master : i18n.CardInsights,
      OpenMessage : true,
      Message : i18n.SelectedInsightMessage,
      Log : i18n.SelectedInsightLog,

    });

    if (CurrentGameData.DeckInsight == void 0 || CurrentGameData.DeckInsight.length == 0) {
      var _deck = [];
      for (i in options.Master) {
        _deck.push(options.Master[i].id);
      }
      CurrentGameData.DeckInsight = _deck.shuffle();
    }
    options.Deck = CurrentGameData.DeckInsight;

    if (CurrentGameData.ScoreCardLevel == void 0 || CurrentGameData.ScoreCardLevel < 0) {
      CurrentGameData.ScoreCardLevel = 0;
    }

    if (CurrentGameData.TransformInsight[CurrentGameData.ScoreCardLevel] == void 0 ) {
      CurrentGameData.TransformInsight[CurrentGameData.ScoreCardLevel] = [];
    }
    //スコアカードに入れる
    options.SelectedCard = CurrentGameData.TransformInsight[CurrentGameData.ScoreCardLevel];

    this.superInit(options);
  },
});

//セットバックデッキ選択toスコアカード
phina.define('SelectDeckToScoreSetbackScene', {
  superClass: 'SelectDeckToScoreScene',

  init: function(options) {
    options = ({}).$safe(options, {
      Transform : 'Setback',

      CardClass : SetbackCard,
      Master : i18n.CardSetbacks,
      OpenMessage : true,
      Message : i18n.SelectedSetbackMessage,
      Log : i18n.SelectedSetbackLog,
      isNoPain : false,

    });

    if (CurrentGameData.DeckSetback == void 0 || CurrentGameData.DeckSetback.length == 0) {
      var _deck = [];
      for (i in options.Master) {
        _deck.push(options.Master[i].id);
      }
      CurrentGameData.DeckSetback = _deck.shuffle();
    }
    options.Deck = CurrentGameData.DeckSetback;

    if (CurrentGameData.ScoreCardLevel == void 0 || CurrentGameData.ScoreCardLevel < 0) {
      CurrentGameData.ScoreCardLevel = 0;
    }

    if (CurrentGameData.Setback[CurrentGameData.ScoreCardLevel] == void 0) {
      CurrentGameData.Setback[CurrentGameData.ScoreCardLevel] = [];
    }
    //スコアカードに入れる
    options.SelectedCard = CurrentGameData.Setback[CurrentGameData.ScoreCardLevel];

    this.superInit(options);
  },
});

//天使デッキ選択toスコアカード
phina.define('SelectDeckToScoreAngelScene', {
  superClass: 'SelectDeckToScoreScene',

  init: function(options) {
    options = ({}).$safe(options, {
      Transform : 'Angel',

      CardClass : AngelCard,
      Master : i18n.CardAngels,
      OpenMessage : true,
      Message : i18n.SelectedAngelMessage + i18n.SelectedAngelAfterMessage,
      Log : i18n.SelectedAngelLog,

    });

    if (CurrentGameData.DeckAngel == void 0 || CurrentGameData.DeckAngel.length == 0) {
      var _deck = [];
      for (i in options.Master) {
        _deck.push(options.Master[i].id);
      }
      CurrentGameData.DeckAngel = _deck.shuffle();
    }
    options.Deck = CurrentGameData.DeckAngel;

    if (CurrentGameData.ScoreCardLevel == void 0 || CurrentGameData.ScoreCardLevel < 0) {
      CurrentGameData.ScoreCardLevel = 0;
    }

    if (CurrentGameData.Angel[CurrentGameData.ScoreCardLevel] == void 0) {
      CurrentGameData.Angel[CurrentGameData.ScoreCardLevel] = [];
    }
    //スコアカードに入れる
    options.SelectedCard = CurrentGameData.Angel[CurrentGameData.ScoreCardLevel];

    this.superInit(options);
  },
});

//選択元からスコアカードへ記録するシーン（抽象クラス）
phina.define('SelectToScoreScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    options = ({}).$safe(options, {
      selectNumberOfCards : 1,
      CardClass : '', //カードクラス名
      Master: [], //カードのマスタ定義
      Deck: [], //デッキ
      SelectedCard: [], //カード格納場所（LvXAngel,LvXSetback,LvXTransformInsight,LvXTransformFeedback）
      OpenMessage : false,  //選択後、メッセージをカードに表示するかどうか
      SelectFrom : 'Deck', //どこから選択するか(Deck or Envelope)
      isNoPain: false,  //基本的に痛みあり（false）
      cbname : '',  //戻り先のイベント名
    });

    this.superInit(options);
    var self = this;

    this.backgroundColor = appBackGroundColor;
    this.selectNumberOfCards = options.selectNumberOfCards;
    this.CardClass = options.CardClass;
    this.SelectedCard = options.SelectedCard;
    this.cardSelected = false;
    this.Log = options.Log;
    this.selectedMessage = options.Message;
    this.causeEvents = [];
    this.OpenMessage = options.OpenMessage;
    this.activeUpdate = true;
    this.selectId = -1;
    this.SelectFrom = options.SelectFrom=='Deck'?'Deck':'Envelope';
    this.Transform = options.Transform;
    this.isNoPain = options.isNoPain;
    this.cbname = options.cbname;
    this._lockCard = false;
    this.openNumberOfCards = 0;


    //あとからアニメーションするために選ばれてないオブジェクトをグループ化する
    var nonSelectObjects = DisplayElement().addChildTo(this);

    //封筒からの選択の場合、背景に封筒を表示する
    if (this.SelectFrom == 'Envelope') {
      var ImageEnvelope = Sprite('envelope').setSize(550,600).setPosition(320,400).addChildTo(nonSelectObjects);
    }

    //メッセージウインドウ
    var _selectDeckMessage = [];
    _selectDeckMessage[0] = i18n.SelectDeckMessage[0];
    _selectDeckMessage[0] = _selectDeckMessage[0].replace(/α/g,this.selectNumberOfCards);

    if (this.SelectFrom == 'Envelope') {
      this.SelectDeckMessage = MessageWindow({
                            texts       :_selectDeckMessage,
                            x           :320,
                            y           :750,
                            width       :600,
                            height      :350,
                            buttonAName :i18n.ButtonEndOfSelect,
                            buttonWidth :150,
                                             }).addChildTo(this);
    } else {
      this.SelectDeckMessage = MessageWindow({
                            texts       :_selectDeckMessage,
                            x           :500,
                            y           :500,
                            width       :200,
                            height      :500,
                            buttonAName :i18n.ButtonEndOfSelect,
                            buttonWidth :150,
                                             }).addChildTo(this);
    }

    this.SelectDeckMessage.ButtonA.setInteractive(false);

    //this.SelectFromのカードすべて表示
    this._openDeck = DisplayElement().addChildTo(this);
    //処理都合上選ばれたカードがどれかを把握する必要があるため配列_deckCardを定義
    this._deckCard = [];
    for (i in options.Deck) {
      if (this.SelectFrom == 'Envelope') {
        this._deckCard[i] = options.CardClass({layer:i,id:options.Deck[i],isFace:false,Master:options.Master}).setPosition((350-(options.Deck.length/2)*50)+i*50,(400-(options.Deck.length/2)*30)+i*30).addChildTo(this._openDeck);
      } else {
        this._deckCard[i] = options.CardClass({layer:i,id:options.Deck[i],isFace:false,Master:options.Master}).setPosition(200,100+i*10).addChildTo(this._openDeck);
      }
    }

    this.SelectDeckMessage.ButtonA.on('push', function(e) {
      var _selectedCard = [];
      //カードを選び終わったのでupdateの処理は止める
      self.activeUpdate = false;

      //選択されたカードを判定
      for (var _id = 0;_id < self._deckCard.length;_id++) {
        if (self._deckCard[_id].isSelected == true) {
          //ユニバーサルフィードバック以外はデッキから抜く
          if (options.Transform != 'Feedback') {
            options.Deck.splice(_id,1);
          }
          //選択したカードに入れる
          self.SelectedCard.push(self._deckCard[_id].id);
          self.selectId = _id;
          _selectedCard.push(self._deckCard[_id]);
        } else {
          //選択されなかったオブジェクトに登録
          self._deckCard[_id].addChildTo(nonSelectObjects);
        }
      }

      //選択した枚数により配置を変える
      var _selectedCards = 0;
      _selectedCard.each(function(child) {
        var _px = 0;
        _selectedCards = _selectedCards + 1;

        switch (self.selectNumberOfCards) {
          case 3:
            _px = 180+130*((_selectedCards-1)%3);
            break;
          case 2:
            _px = 240+130*((_selectedCards-1)%2);
            break;
          default :
            _px = 320;
        }

        child.tweener.to({
          x : _px,
          y : 250,
        },1000,"swing");
      });

      self.SelectDeckMessage.remove();

      //選択してないカードと封筒は下へスクロール
      nonSelectObjects.tweener.by({
        y:1000,
      },1000,"swing")
      .wait(1000)
      .call(function(){
        self.cardSelected = true;
        self.SelectDeckMessage = MessageWindow({
                              texts       :[i18n.ClickCardAndTurnOverMessage,],
                              x           :320,
                              y           :700,
                              width       :600,
                              height      :500,
                              buttonWidth: 150,
                                               }).addChildTo(self);

        for (var _id = 0;_id < _selectedCard.length;_id++) {
          _selectedCard[_id].on('pointend', function(e) {
            if (self._lockCard == false && this.isOpen == false) {
              this.openFace(e);
              self.openSelectCard(this);
              self._lockCard = true;
            }
          });
        }
      }); //call
    });

    this.on('doneSelectCard', function(options) {
      self.exit();
      //カードを選んだ後のイベントがあるシーン用（例：SquereFreewillScene）
      app.flare(self.cbname);
    });

  },
  openSelectCard : function(opt) {
    var _selCard = opt;
    var _log = this.Log;
    
    this.causeEvents = [];

    //開いたカード数＋１
    this.openNumberOfCards++;

    _log = _log
            .replace(/α/g,_selCard.getMessage())
            .replace(/β/g,_selCard.getMeaning())
            .replace(/γ/g,(this.SelectFrom=='Deck'?i18n.Deck:i18n.Envelope));

    CurrentGameData.Scene = 'MainBoard';
    TfAp.WriteGameLog(_log);
    TfAp.saveGameData();

    var _selectDeckMessage = [];
    _selectDeckMessage[0] = this.selectedMessage
                            .replace(/α/g,_selCard.getMessage())
                            .replace(/β/g,_selCard.getMeaning())
                            .replace(/γ/g,(this.SelectFrom=='Deck'?i18n.Deck:i18n.Envelope));

    //気づきのトークン枚数表示
    var _getTokenAwareness = _selCard.getTokenAwareness();
    if (_getTokenAwareness > 0) {
      _selectDeckMessage[0] = _selectDeckMessage[0] + i18n.SelectedInsightGetTokenMessage.replace(/#Awareness#/g,_getTokenAwareness);
      this.causeEvents.push({Event:'AwarenessBoxToScore',selectNumberOfCards : _getTokenAwareness});    }
    //失うトークン
    if (_getTokenAwareness < 0) {
      _selectDeckMessage[0] = _selectDeckMessage[0] + i18n.SelectedInsightLostTokenMessage.replace(/#Awareness#/g,_getTokenAwareness*-1);
      this.causeEvents.push({Event:'AwarenessScoreToBox',selectNumberOfCards : _getTokenAwareness*-1});
    }
    //いたみのトークン枚数表示
    var _getTokenPain = _selCard.getTokenPain();
    if (_getTokenPain > 0) {
      if(this.isNoPain) {
        _selectDeckMessage[0] = _selectDeckMessage[0] + i18n.SelectedSetbackButNoPainMessage.replace(/#Pain#/g,_getTokenPain);
      } else {
        _selectDeckMessage[0] = _selectDeckMessage[0] + i18n.SelectedSetbackGetTokenMessage.replace(/#Pain#/g,_getTokenPain);
        this.causeEvents.push({Event:'PainBoxToScore',selectNumberOfCards : _getTokenPain, CardId:_selCard.id,});
      }
    } else if (_getTokenPain > 0) {
        _selectDeckMessage[0] = _selectDeckMessage[0] + i18n.ChanceClearPainMessage.replace(/#Pain#/g,_getTokenPain*-1);
        this.causeEvents.push({Event:'PainScoreToBox',selectNumberOfCards : _getTokenPain*-1,});
    } else {
    }

    //サービストークン枚数表示
    var _getTokenService = _selCard.getTokenService();
    if (_getTokenService != 0) {
      _selectDeckMessage[0] = _selectDeckMessage[0].replace(/#Service#/g,_getTokenService);
      this.causeEvents.push({Event:'ServiceToScore',selectNumberOfCards : _getTokenService});
    }
    //天使枚数表示
    var _getCardAngel = _selCard.getCardAngel();
    if (_getCardAngel != 0) {
      _selectDeckMessage[0] = _selectDeckMessage[0].replace(/#Angel#/g,_getCardAngel);
      this.causeEvents.push({Event:'Angel',selectNumberOfCards : _getCardAngel});
    }
    //インサイト枚数表示
    var _getCardInsight = _selCard.getCardInsight();
    if (_getCardInsight != 0) {
      _selectDeckMessage[0] = _selectDeckMessage[0].replace(/#Insight#/g,_getCardInsight);
      this.causeEvents.push({Event:'Insight',selectNumberOfCards : _getCardInsight});
    }
    //セットバック枚数表示
    var _getCardSetback = _selCard.getCardSetback();
    if (_getCardSetback != 0) {
      _selectDeckMessage[0] = _selectDeckMessage[0].replace(/#Setback#/g,_getCardSetback);
      this.causeEvents.push({Event:'Setback',selectNumberOfCards : _getCardSetback});
    }
    //レベル
    var _getLevel = _selCard.getLevel();
    if (_getLevel > 0) {
      _selectDeckMessage[0] = _selectDeckMessage[0].replace(/#_Level#/g,_getLevel);
      this.causeEvents.push({Event:'LevelUp', NumberOfLevels: _getLevel});
    } else if (_getLevel < 0) {
      _selectDeckMessage[0] = _selectDeckMessage[0].replace(/#_Level#/g,_getLevel*-1);
      this.causeEvents.push({Event:'LevelDown', NumberOfLevels: _getLevel*-1});
    }
    //移動
    var _getMove = _selCard.getMove();
    if (_getMove != '') {
      _selectDeckMessage[0] = _selectDeckMessage[0].replace(/#Move#/g,_getMove);
      this.causeEvents.push({Event:'Move', MoveSquere: _getMove});
    }

    if (this.OpenMessage) {
      this.SelectDeckMessage = MessageWindow({
                            texts       :_selectDeckMessage,
                            x           :320,
                            y           :700,
                            width       :600,
                            height      :500,
                            buttonAName :i18n.ButtonNext,
                            buttonWidth : 300,
                                             }).addChildTo(this);
    }

    var self = this;
    var _causeEvents = self.causeEvents;
    _causeEvents.reverse();

    this.SelectDeckMessage.ButtonA.on('push', function(e) {
      this.hide();
      this.setInteractive(false);

      //カードをオープンして、追加イベントがないときはここで終了
      //例）エンジェルカードを引く（そこから次のイベントはない）
      if (_causeEvents.length == 0) {
        if (self.selectNumberOfCards <= self.openNumberOfCards) {
          self.flare('doneSelectCard');
        } else {
          self._lockCard = false;
        }
        return;
      }

      var flows = [];

      _causeEvents.forEach (function(value,index,array) {
        var _cbname = TfAp.doneFlareName();

        flows.push(
          Flow(function(resolve) {
            switch (array[index].Event) {
              case 'AwarenessBoxToScore':
                self.app.pushScene(SelectTokenAwarenessBoxToScoreScene({selectNumberOfAwarenessTokens: array[index].selectNumberOfCards,cbname:_cbname,}));
                break;
              case 'AwarenessScoreToBox':
                self.app.pushScene(SelectTokenAwarenessScoreToBoxScene({selectNumberOfAwarenessTokens: array[index].selectNumberOfCards,cbname:_cbname,}));
                break;
              case 'PainScoreToBox':
                self.app.pushScene(AmimateClearPainScene({numberOfDepressionTokens:array[index].selectNumberOfCards,cbname:_cbname,}));
                break;
              case 'PainBoxToScore':
                self.app.pushScene(AmimateDepressionScene({numberOfDepressionTokens:array[index].selectNumberOfCards,cbname:_cbname,CardId:array[index].CardId,PutPainScene:'Setback',}));
                break;
              case 'LevelUp':
                self.app.pushScene(LevelUpSceneSequence({isExit: true, cbname:_cbname,}));
                break;
              case 'LevelDown':
                self.app.pushScene(LevelDownSceneSequence({isExit: true, cbname:_cbname,}));
                break;
              case 'Move':
                self.app.pushScene(MoveSquereSceneSequence({conditions: array[index].MoveSquere, cbname:_cbname,}));
                break;
              case 'ServiceToScore':
                self.app.pushScene(AmimateGetServiceTokenScene({Reason: 'From Card', cbname:_cbname,}));
                break;
              default:
                self.app.pushScene(SelectCardScene({selectCard:array[index].Event,selectNumberOfCards:array[index].selectNumberOfCards,cbname:_cbname}));
            }

            self.app.on(_cbname, function(e) {
              if (self.selectNumberOfCards <= self.openNumberOfCards) {
                resolve(array[index].Event + ' done');
              } else {
                self._lockCard = false;
                self.SelectDeckMessage.texts = [i18n.TurnOverNextCardMessage];
              }
            }); //self.on
          })  //Flow
        );  //push
      }); //_cause

      Flow.all(flows).then(function(messages) {
        self.app.one('poped', function(e) {
          self.flare('doneSelectCard');
        });
      });

    });

  },
  update: function(e){
    if (this.activeUpdate == true && this.cardSelected == false) {
      selectCard({deck: this._openDeck,
                  selectNumberOfCards:this.selectNumberOfCards,
                  interActiveButton:this.SelectDeckMessage.ButtonA,
                  delta_x:this.SelectFrom=='Envelope'?0:50,
                  delta_y:this.SelectFrom=='Envelope'?-200:0,
                 });
    } else {
    }
  },
});

//封筒選択→スコアカードへ（最大3枚）
phina.define('SelectEnvelopeToScoreScene', {
  superClass: 'SelectToScoreScene',

  init: function(options) {
    options = ({}).$safe(options, {
      selectNumberOfCards : 1,
      CardClass : '', //カードクラス名
      Master: [], //カードのマスタ定義
      Deck: [], //デッキ
      OpenMessage : false,  //選択後、メッセージをカードに表示するかどうか
      SelectedCard: [],  //選択したカードを入れる
      SelectFrom : 'Envelope' //どこから選択するか(Deck or Envelope)
    });
    this.superInit(options);
  },
});

//デッキ選択→スコアカードへ（最大3枚）
phina.define('SelectDeckToScoreScene', {
  superClass: 'SelectToScoreScene',

  init: function(options) {
    options = ({}).$safe(options, {
      selectNumberOfCards : 1,
      CardClass : '', //カードクラス名
      Master: [], //カードのマスタ定義
      Deck: [], //デッキ
      SelectedCard: [], //カード格納場所（LvXAngel,LvXSetback,LvXTransformInsight,LvXTransformFeedback）
      OpenMessage : false,  //選択後、メッセージをカードに表示するかどうか
      SelectFrom : 'Deck' //どこから選択するか(Deck or Envelope)
    });
    this.superInit(options);
  },
});

//選択肢選択
phina.define('SelectOptionScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    options = ({}).$safe(options, {
      messages : [i18n.AfterSelectionAndDecision,],
      buttonLabel:i18n.Decision,
      opts : [{id:0,value:i18n.Envelope+i18n.From},{id:1,value:i18n.Deck+i18n.From}],
    });
    this.superInit(options);
    this.backgroundColor = appBackGroundColor;

    var self = this;

    var _buttonOptions = {height    :40,
                          width     :580,
                          align: 'left',
                          fontColor :'black',
                          fontWeight:'bold',
                          fill      :'#E8CFE8',
                          stroke    :'purple',
                          strokeWidth : 3,
                          fontFamily:'monospace',
                          fontSize  :20};


    //メッセージウインドウ
    this.MessageWindow = MessageWindow({
                          texts       :options.messages,
                          x           :320,
                          y           :100,
                          width       :560,
                          height      :160,
                          buttonAName :options.buttonLabel,
                          showButtonA :true,
                                           }).addChildTo(this);
    this.MessageWindow.ButtonA.setInteractive(false);

    this.MessageWindow.ButtonA.on('push', function(e) {
      TfAp.SelectedOptId = self.selected;
//      self.app.flare('SelectedOption');
      self.exit();
    });

    this.button = [];
    var buttonId = 0;
    this.selected = -1;
    options.opts.forEach (function(val,idx,array) {
      self.button[buttonId] = Button(({}).$safe(_buttonOptions, {text:val.value})).setPosition(320,250+buttonId*50).addChildTo(self);
      if (val.enable == false) {
        self.button[buttonId].fill = 'gray';
        self.button[buttonId].fontColor = 'darkgray';
        self.button[buttonId].setInteractive(false);
      }

      self.button[buttonId].on('push', function(e) {
        self.selected = val.id;
        self.flare('selectButton');
      });

      buttonId = buttonId + 1;

    });

    this.on('selectButton', function(e) {
      for (var buttonId=0; buttonId< options.opts.length;buttonId++) {
        if (self.selected == buttonId && self.button[buttonId].fontColor == 'black') {
          self.button[buttonId].fill = 'purple';
          self.button[buttonId].fontColor = 'white';

          self.MessageWindow.ButtonA.setInteractive(true);

        } else if (self.selected == buttonId) {
          self.button[buttonId].fill = '#E8CFE8';
          self.button[buttonId].fontColor = 'black';

          self.MessageWindow.ButtonA.setInteractive(false);

          self.selected = -1;
        } else if (self.button[buttonId].fontColor == 'darkgray') {
          //何もしない
        } else {
          self.button[buttonId].fill = '#E8CFE8';
          self.button[buttonId].fontColor = 'black';
        }
      };
    });
  },
});

//カードを引く（デッキか封筒かも選択）
phina.define('SelectCardScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    options = ({}).$safe(options, {
      selectNumberOfCards : 5,
      selectCard : 'Angel',
    });

    this.superInit(options);
    this.backgroundColor = appBackGroundColor;
    this.cbname = options.cbname;
    this.Transform = options.selectCard;

    switch (options.selectCard) {
      case 'Angel':
        this.SceneDeck = SelectDeckToScoreAngelScene;
        this.SceneEnvelope =SelectEnvelopeToScoreAngelScene;
        break;
      case 'Insight':
        this.SceneDeck = SelectDeckToScoreInsightScene;
        this.SceneEnvelope =SelectEnvelopeToScoreInsightScene;
        break;
      case 'Setback':
      default :
        this.SceneDeck = SelectDeckToScoreSetbackScene;
        this.SceneEnvelope =SelectEnvelopeToScoreSetbackScene;
     }

    this.selectNumberOfCards = options.selectNumberOfCards;

    var self = this;

    var _tmp = 'Unconscious' + options.selectCard;
    if (CurrentGameData[_tmp] == void 0 ) {
      //無意識の封筒がすでに空白の可能性もある。
      CurrentGameData[_tmp] = [];
    }
    var _unconsciousInEnvelope = i18n.UnconsciousInEnvelope;
    _unconsciousInEnvelope = _unconsciousInEnvelope.replace(/α/g,options.selectCard);
    options.messages = [i18n.AfterSelectionAndDecision + '\n' + _unconsciousInEnvelope + CurrentGameData[_tmp].length,];

    //選択肢の作成
    options.opts = [];
    var _enable = false;
    for (var i=0;i<this.selectNumberOfCards+1;i++) {
      _preFix = this.selectNumberOfCards==1?'':i18n.All
      _enable = this.selectNumberOfCards-1-i<CurrentGameData[_tmp].length?true:false;
      switch (i) {
        case 0:
          //すべて封筒から
          options.opts.push({id:i,value:_preFix+i18n.Envelope+i18n.From,enable:_enable});
          break;
        case this.selectNumberOfCards:
          //すべてデッキから
          options.opts.push({id:i,value:_preFix+i18n.Deck+i18n.From,enable:true});
          break;
        default:
          //封筒からx枚　デッキからy枚(i18n.From take x unit)
          options.opts.push({id:i,value:i18n.Envelope+i18n.From+(this.selectNumberOfCards-i)+i18n.UnitOfCard+'　'+i18n.Deck+i18n.From+i+i18n.UnitOfCard,enable:_enable});
      }
    }


    //メッセージウインドウ
    this.MessageWindow = MessageWindow({
                          texts       :[i18n.SelectDeckOrEnvelope,],
                          x           :320,
                          y           :100,
                          width       :560,
                          height      :160,
                          buttonAName :i18n.Decision,
                          showButtonA :true,
                                           }).addChildTo(this);
    this.MessageWindow.ButtonA.setInteractive(true);

    this.MessageWindow.ButtonA.one('push', function(e) {
      self.app.one('poped',function () {
        self.afterPoped();
      });
      self.MessageWindow.hide();
      this.setInteractive(false);
      self.app.pushScene(SelectOptionScene(options));
    });

  },
  afterPoped : function() {
    var self = this;

    switch (TfAp.SelectedOptId) {
      case 0:
        //すべて封筒から
        this.selectEnvelope({selectNumberOfCards:this.selectNumberOfCards,Transform:this.Transform});
        break;
      case this.selectNumberOfCards:
        //すべてデッキから
        this.selectDeck({selectNumberOfCards:this.selectNumberOfCards,Transform:this.Transform});
        break;
      default:
        //封筒からx枚　デッキからy枚(i18n.From take x unit)
        this.selectDeck({selectNumberOfCards:TfAp.SelectedOptId,Transform:this.Transform});
        this.selectEnvelope({selectNumberOfCards:this.selectNumberOfCards-TfAp.SelectedOptId,Transform:this.Transform});
    }

    //終了のメッセージ
    this.AfterMessage = MessageWindow({
                          texts       :[i18n.EndOfSelectCard,],
                          x           :320,
                          y           :400,
                          width       :560,
                          height      :160,
                          buttonAName :i18n.ButtonNext,
                          showButtonA :true,
                                           }).addChildTo(this);
    this.AfterMessage.ButtonA.setInteractive(true);

    this.AfterMessage.ButtonA.on('push', function(e) {
      self.app.flare(self.cbname);
      self.app.popScene();
    });
  },
  selectDeck : function(opt) {
    this.app.pushScene(this.SceneDeck(opt));
  },
  selectEnvelope : function(opt) {
    this.app.pushScene(this.SceneEnvelope(opt));
  },

});


//失う気づきのトークン選択
phina.define('SelectTokenAwarenessScoreToBoxScene', {
  superClass: 'SelectTokenScoreToBoxScene',

  init: function(options) {
    //気づきのトークン以外を選択することがあった場合を考慮した
    //実際にあるかな？
    this.superInit(options);
  },
});

//失うトークン選択
phina.define('SelectTokenScoreToBoxScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    options = ({}).$safe(options, {
      selectNumberOfAwarenessTokens : 1,
      TokenClass : TokenAwareness, //トークンクラス名
    });

    var _scoreLevel = CurrentGameData.ScoreCardLevel;

    this.superInit(options);
    this.backgroundColor = appBackGroundColor;

    this.selectNumberOfAwarenessTokens = options.selectNumberOfAwarenessTokens;

    this.Inbox = CurrentGameData.InboxAwareness[_scoreLevel];
    this.SelectedAwareness = CurrentGameData.Awareness[_scoreLevel];


    this.NowSelectAwareness = []; //今回選んだトークン
    this.Target = options.Target;

    this.openNumberOfTokens = 0;

    var _Master = TfAp.TokenAwareness[_scoreLevel];

    if (this.Inbox == void 0 || this.Inbox.length == 0) {
      var _Inbox = [];
      for (i in _Master) {
        _Inbox.push(_Master[i].id);
      }
      CurrentGameData.InboxAwareness[_scoreLevel] = _Inbox.shuffle();
      this.Inbox = CurrentGameData.InboxAwareness[_scoreLevel];
    }

    if (this.SelectedAwareness == void 0) {
      CurrentGameData.Awareness[_scoreLevel] = [];
      this.SelectedAwareness = CurrentGameData.Awareness[_scoreLevel];
    }

    var self = this;

    //メッセージウインドウ
    var _selectLostTokenMessage = '';
    _selectLostTokenMessage = i18n.SelectLostTokenAndPushButtonMessage;
    _selectLostTokenMessage = _selectLostTokenMessage.replace(/α/g,this.selectNumberOfAwarenessTokens);
    this.SelectLostTokenMessage = MessageWindow({
                          texts       :[_selectLostTokenMessage],
                          x           :320,
                          y           :100,
                          width       :500,
                          height      :100,
                          buttonAName  :i18n.ButtonEndOfSelect,
                          buttonWidth: 150,
                                           }).addChildTo(this);
    this.SelectLostTokenMessage.ButtonA.setInteractive(true);

    //選択後のメッセージウインドウ
    var _SelectedLostTokenMessage = [i18n.GoToBoxSelectedToken];
    this.SelectedLostTokenMessage = MessageWindow({
                          texts       :_SelectedLostTokenMessage,
                          x           :320,
                          y           :400,
                          width       :500,
                          height      :100,
                          buttonAName  :i18n.ButtonEnd,
                          buttonWidth: 150,
                                           }).addChildTo(this).hide();
    this.SelectedLostTokenMessage.ButtonA.setInteractive(false);

    //スコアのトークン全部表示
    this._openToken = DisplayElement().addChildTo(this);
    //あとからアニメーションするために選ばれてないオブジェクトをグループ化する
    var nonSelectObjects = DisplayElement().addChildTo(this);
    var SelectObjects = DisplayElement().addChildTo(this);

    //トークン配列定義
    this._Token = [];
    this._SelectedToken = [];

    var _selectedNumberOfTokens = 0;
    for (i in this.SelectedAwareness) {
      this._Token.push(
        options.TokenClass({layer:i,id:this.SelectedAwareness[i],ratio:0.7,
                            isFace  :true,
                            }).setPosition(120+(100*(i%5)),250+(140*Math.floor(i/5)))
      );
      this._Token[i].addChildTo(this);

      this._Token[i].on('pointend', function(e) {
        if (this.fill == 'gray') {
          _selectedNumberOfTokens = _selectedNumberOfTokens - 1;
          this.fill = 'white';
          this.isSelected = false;
          var _delId = self._SelectedToken.indexOf(this);
          self._SelectedToken.splice(_delId, 1);
        } else if (_selectedNumberOfTokens < self.selectNumberOfAwarenessTokens) {
          _selectedNumberOfTokens = _selectedNumberOfTokens + 1;
          this.fill = 'gray';
          this.isSelected = true;
          self._SelectedToken.push(this);
        }
      });
    }

    this.SelectLostTokenMessage.ButtonA.on('push', function(e) {
      //消すトークン数をチェック
      if (_selectedNumberOfTokens == self.selectNumberOfAwarenessTokens) {
        //選択するメッセージは消す
        self.SelectLostTokenMessage.hide();
        self.SelectLostTokenMessage.ButtonA.setInteractive(false);

        //選択されたカードを判定
        for (var i = self._Token.length -1; i>=0; i--) {
          if (self._Token[i].isSelected == true) {
            //選択されたカード
            self._Token[i].addChildTo(SelectObjects);

            //ハコにもどす
            self.Inbox.push(self._Token[i].id);

            //スコアカードから削除
            var _SelId = self.SelectedAwareness.indexOf(self._Token[i].id);
            self.SelectedAwareness.splice(_SelId, 1);

          } else {
            self._Token[i].addChildTo(nonSelectObjects);
          }
        }

        //選択されなかったトークンはスコアカードに戻す（下へ）
          nonSelectObjects.tweener.by({
            y:1000,
          },1000,"swing")
          .wait(1000)
          .call(function(){
          });

        //選択されたカードはハコに戻す（消滅）
          SelectObjects.tweener
          .wait(1000)
          .fadeOut(2000)
          .call(function(){
            self.SelectedLostTokenMessage.show();
            self.SelectedLostTokenMessage.ButtonA.setInteractive(true);
          });
      }
    });

    this.SelectedLostTokenMessage.ButtonA.on('push', function(e) {
      self.app.flare(options.cbname);
      self.app.popScene();
    });

  },
});

//なみだのアニメーションシーン
phina.define('AmimateDepressionScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    options = ({}).$safe(options, {
      numberOfDepressionTokens : 4,
      CardType : 'Setback',
      CardId : 0,
      PutPainScene : '',
    });

    if (options.PutPainScene == '') {
      var _step = CurrentGameData.PathSteps%Squares.length + (CurrentGameData.PathSteps%Squares.length<0?Squares.length:0);
      PutPainScene = Squares[_step].mark;
    }

    this.superInit(options);
    this.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    this.cbname = options.cbname;
    this.numberOfTokens = options.numberOfDepressionTokens;
    this.PutPainScene = options.PutPainScene; //どの状況で（Depression,Dice,…）
    this.CardType = options.CardType; //どのカード（基本Setback）
    this.CardId = options.CardId;

    var self = this;

    var _tokens = DisplayElement().addChildTo(this);
    var _Token = [];

    for (var i=0;i<options.numberOfDepressionTokens;i++) {
      _Token.push(TokenDepression().setPosition(260+80*(i%2),0));
      _Token[i].addChildTo(_tokens);
      _Token[i].tweener.by({
        y:280+60*(i%4),
      },1000,"swing");

      this.insertPain(i);
    }
    TfAp.WriteGameLog(i18n.Pain+'('+ options.numberOfDepressionTokens + i18n.UnitOfCard + '):'+ this.PutPainScene);

    this.on('pointend',function(){
      _tokens.tweener.by({y:1000},600,"swing").call(function(){
        self.app.flare(self.cbname);
        self.app.popScene();
      });
    });
  },
  insertPain : function(i) {
    var _pain = {}
    //同時に2枚以上痛みができる場合、dateだけだとユニークキーにできない様子
    _pain.PainId = (new Date()).getTime().toString() + i.toString();
    _pain.ScoreCardLevel = CurrentGameData.ScoreCardLevel;
    _pain.GetTotalThrowDice = CurrentGameData.TotalThrowDice;
    _pain.GetPathSteps = CurrentGameData.PathSteps;
    _pain.PutPainScene = this.PutPainScene;
    _pain.CardType = this.CardType;
    _pain.CardId = this.CardId;
    
    if (CurrentGameData.Pains == void 0) {
      CurrentGameData.Pains = [];
    }
    CurrentGameData.Pains.push(_pain);
  }
});

//痛みを解消するシーン
phina.define('ClaerPainScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    options = ({}).$safe(options, {
      selectNumberOfAwarenessTokens : 1,
      TokenClass : TokenAwareness, //トークンクラス名
    });

    this.superInit(options);

    var self = this;

    var pain = options.pain;

    var _ButtonBack = TFGMiniButton({text:i18n.ButtonBack,x:50,width:90}).addChildTo(this);

    _ButtonBack.on('push', function() {
      app.replaceScene(MainBoardScene());
    });

    pain.addChildTo(this).setInteractive(false);

    var _scoreLevel = CurrentGameData.ScoreCardLevel;
    var _cbname = TfAp.doneFlareName();

    this.backgroundColor = appBackGroundColor;

    this.selectNumberOfAwarenessTokens = options.selectNumberOfAwarenessTokens;

    if (CurrentGameData.InboxAwareness == void 0) {
      CurrentGameData.InboxAwareness = [];
    }
    if (CurrentGameData.InboxAwareness[_scoreLevel] == void 0) {
      CurrentGameData.InboxAwareness[_scoreLevel] = [];
    }
    this.Inbox = CurrentGameData.InboxAwareness[_scoreLevel];

    if (CurrentGameData.Awareness == void 0) {
      CurrentGameData.Awareness =[];
    }
    if (CurrentGameData.Awareness[_scoreLevel] == void 0) {
      CurrentGameData.Awareness[_scoreLevel] =[];
    }
    this.SelectedAwareness = CurrentGameData.Awareness[_scoreLevel];

    if (CurrentGameData.TransformPain == void 0) {
      CurrentGameData.TransformPain = [];
    }
    if (CurrentGameData.TransformPain[_scoreLevel] == void 0) {
      CurrentGameData.TransformPain[_scoreLevel] = [];
    }

    this.NowSelectAwareness = []; //今回選んだトークン
    this.Target = options.Target;

    this.openNumberOfTokens = 0;

    var _Master = TfAp.TokenAwareness[_scoreLevel];

    if (this.Inbox == void 0 || this.Inbox.length == 0) {
      var _Inbox = [];
      for (i in _Master) {
        _Inbox.push(_Master[i].id);
      }
      CurrentGameData.InboxAwareness[_scoreLevel] = _Inbox.shuffle();
      this.Inbox = CurrentGameData.InboxAwareness[_scoreLevel];
    }

    var self = this;

    //メッセージウインドウ
    var _selectLostTokenMessage = [];
    var _painmessage = pain.CardType;
    var _steps = pain.GetPathSteps%Squares.length + (pain.GetPathSteps%Squares.length<0?Squares.length:0);

    var _ret =  i18n.SelectedPainContents + '\n' + 
                i18n.Dice + '：' + pain.GetTotalThrowDice + '/' +
                i18n.Squere + '：' + Squares[_steps].mark + '\n';

    //パターンが増えたときのためにswitchにした。
    var _objCard = '';
    switch (pain.PutPainScene) {
      case 'Setback':
        _objCard = TfAp.MasterDecks(pain.CardType);
        _ret = _ret + '\n' + i18n.Detail + '：\n' + ((CurrentGameData.Language=='EN')?(_objCard[pain.CardId].message):(_objCard[pain.CardId].meaning));
        _painmessage = _painmessage + ':' + ((CurrentGameData.Language=='EN')?(_objCard[pain.CardId].message):(_objCard[pain.CardId].meaning));
        break;
      case 'Depression':
        _ret = _ret + i18n.Pain + '：' + i18n.PutDepressionMessage;
        _painmessage = i18n.PutDepressionMessage;
        break;
      case 'Dice':
        _ret = _ret + i18n.Pain + '：' + i18n.FailGambleDiceMessage;
        _painmessage = i18n.FailGambleDiceMessage;
        break;
      case 'Flash':
        _ret = _ret + i18n.Pain + '：' + i18n.FailGambleFlashMessage;
        _painmessage = i18n.FailGambleFlashMessage;
        break;
      default:
        _ret = _ret + i18n.Pain + '：' + pain.PutPainScene;
        _painmessage = pain.PutPainScene;
    }

    if (this.SelectedAwareness.length > 0) {
      _selectLostTokenMessage[0] = _ret + '\n\n' + i18n.CanYouClearPain;
    } else {
      _selectLostTokenMessage[0] = _ret + '\n\n' + i18n.CannotYouClearPainBecauseNoToken;
    }

    this.SelectLostTokenMessage = MessageWindow({
                          texts       :_selectLostTokenMessage,
                          x           :340,
                          y           :180,
                          width       :440,
                          height      :320,
                          buttonAName  :i18n.OK,
                          buttonWidth: 150,
                                           }).addChildTo(this);
    this.SelectLostTokenMessage.ButtonA.setInteractive(true);

    var _okButton = {
      text: i18n.OK,
      fill: 'purple',
      width: 190,
      height: 45,
      x: 240,
      y: 310,
    }
    var _ngButton = {
      text: i18n.NG,
      fill: 'purple',
      width: 190,
      height: 45,
      x: 440,
      y: 310,
    }

    this.ConfirmClearPainButton = Button(_okButton).addChildTo(this).hide().setInteractive(false);
    this.CancelClearPainButton = Button(_ngButton).addChildTo(this).hide().setInteractive(false);


    //スコアのトークン全部表示
    this._openToken = DisplayElement().addChildTo(this);
    //あとからアニメーションするために選ばれてないオブジェクトをグループ化する
    var nonSelectObjects = DisplayElement().addChildTo(this);
    var SelectObjects = DisplayElement().addChildTo(this);
    pain.addChildTo(SelectObjects);

    //トークン配列定義
    this._Token = [];
    this._SelectedToken = [];

    var _selectedNumberOfTokens = 0;
    for (i in this.SelectedAwareness) {
      this._Token.push(
        options.TokenClass({layer:i,id:this.SelectedAwareness[i],ratio:0.7,
                            isFace  :true,
                            level : _scoreLevel,
                            }).setPosition(120+(100*(i%5)),450+(140*Math.floor(i/5)))
      );
      this._Token[i].addChildTo(this);

      this._Token[i].on('pointend', function(e) {
        if (this.fill == 'gray') {
          _selectedNumberOfTokens = _selectedNumberOfTokens - 1;
          this.fill = 'white';
          this.isSelected = false;
          var _delId = self._SelectedToken.indexOf(this);
          self._SelectedToken.splice(_delId, 1);
        } else if (_selectedNumberOfTokens < self.selectNumberOfAwarenessTokens) {
          _selectedNumberOfTokens = _selectedNumberOfTokens + 1;
          this.fill = 'gray';
          this.isSelected = true;
          self._SelectedToken.push(this);
        }
      });
    }

    var _keyword = '';  //選択したトークンのキーワード
    
    this.SelectLostTokenMessage.ButtonA.on('push', function(e) {
      //消すトークン数をチェック
      if (_selectedNumberOfTokens == self.selectNumberOfAwarenessTokens) {
        //選択されたカードを判定
        for (var i = self._Token.length -1; i>=0; i--) {
          if (self._Token[i].isSelected == true) {
            //選択されたカード
            self._Token[i].addChildTo(SelectObjects);
            _keyword = (CurrentGameData.Language=='EN')?_Master[self._Token[i].id].message:_Master[self._Token[i].id].meaning;
          } else {
            self._Token[i].addChildTo(nonSelectObjects);
          }
        }
        document.getElementById("overlay").style.display='block';

        TfAp.OverLayMessage = i18n.HowDoYouRespondToPain;
        TfAp.OverLayMessage = TfAp.OverLayMessage
            .replace(/α/g,_keyword)
            .replace(/γ/g,_painmessage);
        TfAp.OverLayPlaceHolder = i18n.Within85characters;
        TfAp.OverLayPlaceHolder = TfAp.OverLayPlaceHolder.replace(/α/g,_keyword);
        self.app.pushScene(InputScene({cbname:_cbname}));

      }
    });

    app.on(_cbname, function(e) {
      if(~TfAp.OverLayInput.indexOf(_keyword)) {
        var _gatherWordOnceMore = i18n.GatherWordOnceMore;
        _gatherWordOnceMore = _gatherWordOnceMore.replace(/α/g,_painmessage);

        var _tmp = TfAp.OverLayInput + '\n' + i18n.YouSays + '\n' + _gatherWordOnceMore + self.askClearPainQuestion();
        self.SelectLostTokenMessage.ButtonA.text = '';
        self.SelectLostTokenMessage.ButtonA.hide().setInteractive(false);
        self.SelectLostTokenMessage.resetText({texts:[_tmp]});
        self.ConfirmClearPainButton.show().setInteractive(true);
        self.CancelClearPainButton.show().setInteractive(true);
      } else {
        //キーワードを含んでいない
        self.SelectLostTokenMessage.resetText({texts:[i18n.NoKeywordAndTryAgain,_selectLostTokenMessage[0]]});
        self.ConfirmClearPainButton.hide().setInteractive(false);
        self.CancelClearPainButton.hide().setInteractive(false);
        self.SelectLostTokenMessage.ButtonA.text = i18n.OK;
        self.SelectLostTokenMessage.ButtonA.show().setInteractive(true);
      }
    });

    this.CancelClearPainButton.on('push', function(e) {
      self.SelectLostTokenMessage.resetText({texts:[_selectLostTokenMessage[0],]});
      self.ConfirmClearPainButton.hide().setInteractive(false);
      self.CancelClearPainButton.hide().setInteractive(false);
      self.SelectLostTokenMessage.ButtonA.text = i18n.OK;
      self.SelectLostTokenMessage.ButtonA.show().setInteractive(true);
    });

    this.ConfirmClearPainButton.on('push', function(e) {
      self.ConfirmClearPainButton.hide().setInteractive(false);
      self.CancelClearPainButton.hide().setInteractive(false);
      self.SelectLostTokenMessage.hide();

      self.SelectLostTokenMessage.resetText({texts:['']});
      //選択されたカードを判定
      for (var i = self._Token.length -1; i>=0; i--) {
        if (self._Token[i].isSelected == true) {
          //解放内容をpainに書き込む
          pain.ReleaseTotalThrowDice = CurrentGameData.TotalThrowDice;
          pain.ReleasePathSteps = CurrentGameData.PathSteps;
          pain.UsedTokenAwarenessId = self._Token[i].id;
          pain.UserAwareness = TfAp.OverLayInput;

          //スコアカードから削除
          var _SelId = self.SelectedAwareness.indexOf(self._Token[i].id);
          self.SelectedAwareness.splice(_SelId, 1);
        }
      }

      //痛みを解放
      CurrentGameData.Pains = CurrentGameData.Pains.filter(function(v) {
        return v.PainId != pain.PainId;
      });
      //選んだ痛みをトランスフォームへ
      CurrentGameData.TransformPain[_scoreLevel].push(pain);

      //ログへ
      var _logOpenPain = i18n.LogOpenPain;
      _logOpenPain = _logOpenPain.replace(/α/g,_painmessage)
                  .replace(/γ/g,pain.ReleaseTotalThrowDice)
                  .replace(/δ/g,pain.UserAwareness);

      CurrentGameData.Scene = 'MainBoard';
      TfAp.WriteGameLog(_logOpenPain);
      TfAp.saveGameData();

      //選択されなかったトークンはスコアカードに戻す（下へ）
      nonSelectObjects.tweener.by({
        y:1000,
      },1000,"swing")
      .wait(1000)
      .call(function(){
      });

    //選択されたカードはトランスフォーメーションエリアへ（消滅）
      SelectObjects.tweener
      .wait(1000)
      .fadeOut(2000)
      .call(function(){
        self.SelectLostTokenMessage.resetText({texts:[i18n.ClearedPain]});
        self.SelectLostTokenMessage.show();
      })
      .call(function(){
        self.on('pointend',function(e){
          app.replaceScene(MainBoardScene());
        });
      });

    });

  },
  askClearPainQuestion : function() {
    var clearPainQuestion = i18n.ClearPainQuestion;
    var _selectQuestion = Random.randint(0,clearPainQuestion.length-1);
    return clearPainQuestion[_selectQuestion];
  }

});

//なみだ解消のアニメーションシーン
phina.define('AmimateClearPainScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    options = ({}).$safe(options, {
      numberOfDepressionTokens : 4,
    });

    this.superInit(options);
    this.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    this.cbname = options.cbname;
    this.numberOfTokens = options.numberOfDepressionTokens;

    var self = this;

    var _tokens = DisplayElement().addChildTo(this);
    var _Token = [];

    for (var i=0;i<Math.min(options.numberOfDepressionTokens,CurrentGameData.Pains.length);i++) {
      _Token.push(TokenDepression().setPosition(260+80*(i%2),0));
      _Token[i].addChildTo(_tokens);
      _Token[i].tweener.by({
        y:280+60*(i%4),
      },1000,"swing");

      this.clearPain();
    }

    this.on('pointend',function(){
      _tokens.tweener.fadeOut(600).call(function(){
        self.app.flare(self.cbname);
        self.app.popScene();
      });
    });
  },
  clearPain : function() {
    //ここで解放
  }
});

//なみだ全解消のアニメーションシーン
phina.define('AmimateClearAllPainScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    options = ({}).$safe(options, {
      numberOfDepressionTokens : 9,
      Reason : 'Miracle',
    });
    var _scoreLevel = CurrentGameData.ScoreCardLevel;

    this.superInit(options);
    this.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    this.cbname = options.cbname;
    this.numberOfTokens = options.numberOfDepressionTokens;
    this.UserAwareness = options.Reason;

    this.TransformPain = CurrentGameData.TransformPain[_scoreLevel];

    if (this.TransformPain == void 0) {
      CurrentGameData.TransformPain[_scoreLevel] = [];
      this.TransformPain = CurrentGameData.TransformPain[_scoreLevel];
    }

    var self = this;

    this.setInteractive(false);

    this._label = function(opt){ return Label({
                        text: opt.text + '\n(Touch to next)',
                        align: 'center',
                        baseline: 'top',
                        fontSize:40,
                        fontColor :'black',
                        x:320,
                        y:480,
                        });}

    this._tokens = DisplayElement().addChildTo(this);
    this._Token = [];

    if (CurrentGameData.Pains.length == 0) {
      this._msg = this._label({text:i18n.NoPainForClear}).addChildTo(this);
      this.setInteractive(true);
    } else {
      CurrentGameData.Pains.forEach(function(val,i,array) {
        self._Token.push(TokenDepression(val).setPosition(260+80*(i%5),0));
        self._Token[i].addChildTo(self._tokens);
        self._Token[i].tweener
          .to({y:320+160*(i<5?0:1)},1000,'swing')
          .set({alpha:0.7})
          .wait(1000)
          .fadeOut(2000)
          .call(function(){
            self.clearAllPain();
            self.setInteractive(true);
            self._msg = self._label({text:i18n.AllPainCleard}).addChildTo(self);
          });
      });
    }

    this.one('pointend',function(){
      self.app.flare(self.cbname);
      self.exit();
    });
  },
  clearAllPain : function() {
    var self = this;
      CurrentGameData.Pains.forEach(function(val,i,array) {
      //解放内容をpainに書き込む
      val.ReleaseTotalThrowDice = CurrentGameData.TotalThrowDice;
      val.ReleasePathSteps = CurrentGameData.PathSteps;
      val.UsedTokenAwarenessId = 0;
      val.UserAwareness = self.UserAwareness;

      //痛みを解放
      CurrentGameData.Pains = CurrentGameData.Pains.filter(function(v) {
        return v.PainId != val.PainId;
      });
      //選んだ痛みをトランスフォームへ
      self.TransformPain.push(val);
    });
    
    var _tmp = i18n.LogOpenAllPain;
    _tmp = _tmp.replace(/α/g,self.UserAwareness);
    TfAp.WriteGameLog(_tmp);

  }
});


//サービストークンのアニメーションシーン
phina.define('AmimateGetServiceTokenScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    options = ({}).$safe(options, {
      Reason : 'Miracle',
    });
    var _scoreLevel = CurrentGameData.ScoreCardLevel;

    this.superInit(options);
    this.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    this.cbname = options.cbname;
    this.Reason = options.Reason;

    var self = this;
    this.setInteractive(false);

    if (CurrentGameData.Service == void 0) {
      CurrentGameData.Service = [];
    }
    if (CurrentGameData.Service[_scoreLevel] == void 0) {
      CurrentGameData.Service[_scoreLevel] = 0;
    }

    var _TokenService = TokenService({isBrank:false,isDisplayCards:false,}).setPosition(320,0).addChildTo(this);
    _TokenService.setInteractive(false);

    _TokenService.tweener
      .to({y:400},1000,'swing')
      .fadeIn(1000)
      .call(function(){
        self._msg = self._label().addChildTo(self);
        self.setInteractive(true);
        var _logGetServiceToken = i18n.LogGetServiceToken;
        _logGetServiceToken = _logGetServiceToken.replace(/α/g,self.Reason);
        TfAp.WriteGameLog(_logGetServiceToken);
        CurrentGameData.Service[_scoreLevel] = CurrentGameData.Service[_scoreLevel] + 1;
      });

    this._label = function(opt){ return Label({
                        text: i18n.GetServiceToken+'\n(Touch to next)',
                        align: 'center',
                        baseline: 'top',
                        fontSize:40,
                        fontColor :'black',
                        x:320,
                        y:600,
                        });}


    this.one('pointend',function(){
      self.app.flare(self.cbname);
      app.popScene();
    });
  },
});

//背景色のみレインボー
phina.define('BackgroundRainbowScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    options = ({}).$safe(options, {
      text : '(tap to next)',
      x : 320,
      y : 480,
    });

    this.superInit(options);
    this.cbname = options.cbname||'';
    this.i = 1;
    this.x = options.x;
    this.y = options.y;

    var _lav = Label({text:options.text,x:320,y:400}).addChildTo(this);

    var self = this;

    this.on('pointend',function(){
      self.app.flare(self.cbname);
      self.app.popScene();
    });
  },
  update :function(){
    this.i = this.i + 1;
    if (this.i > 30) this.i = 1; 
    this.grad = Canvas.createRadialGradient(this.x,this.y, 1, this.x, this.y, this.i*100);
    //赤、 オレンジ、 黄色、 緑、 水色、 青、 紫
    this.grad.addColorStop(1, 'red');
    this.grad.addColorStop(0.85, 'orange');
    this.grad.addColorStop(0.65, 'yellow');
    this.grad.addColorStop(0.5, 'green');
    this.grad.addColorStop(0.35, 'blue');
    this.grad.addColorStop(0.15, 'indigo');
    this.grad.addColorStop(0, 'violet');
    // 背景色
    this.backgroundColor = this.grad;
  },
});


//未実装ダミーシーン
//のちにイベントを定義するまでのシーン
phina.define('DummyScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    options = ({}).$safe(options, {
      Event : 'Dummy',
    });

    this.superInit(options);
    this.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    this.cbname = options.cbname;
    this.numberOfTokens = options.numberOfDepressionTokens;

    var _lav = Label({text:options.Event,x:320,y:400}).addChildTo(this);

    var self = this;

    this.on('pointend',function(){
      self.app.flare(self.cbname);
      self.app.popScene();
    });
  },
});


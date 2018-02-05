phina.globalize();

phina.define('LevelUpSceneSequence' , {
  superClass: 'ManagerScene' ,
  init: function(options) {
    options = ({}).$safe(options, {
      cbname : '',
      isExit : false,
    });

    this.superInit({
      scenes: [
        {
          label: 'BackgroundRainbow',
          className: 'BackgroundRainbowScene',
          arguments: {y:30},
          nextLabel: 'LevelUpMessage',
        },
        {
          label: 'LevelUpMessage',
          className: 'LevelUpMessageScene',
          nextLabel: 'LevelUpAwarenessToken',
        },
        {
          label: 'LevelUpAwarenessToken',
          className: 'LevelUpAwarenessTokenScene',
          nextLabel: 'LevelUpServiceToken',
        },
        {
          label: 'LevelUpServiceToken',
          className: 'LevelUpServiceTokenScene',
          nextLabel: 'LevelUpAngelCard',
        },
        {
          label: 'LevelUpAngelCard',
          className: 'LevelUpAngelCardScene',
          nextLabel: 'LevelUpOver',
        },
        {
          label: 'LevelUpOver',
          className: 'LevelUpOverScene',
        },
      ],
    });

    //先にレベルをアップして保存しないとレベルアップ処理途中でやめることができてしまう。
    var _Level = CurrentGameData.ScoreCardLevel;
    if (_Level < 3){
      var _log = i18n.LogLevelUp + ScoreCardNames[_Level] + i18n.From + ScoreCardNames[_Level+1];
      TfAp.WriteGameLog(_log);
    }
    CurrentGameData.ScoreCardLevel = CurrentGameData.ScoreCardLevel + 1;

    //保存
    CurrentGameData.Scene = 'MainBoard';
    TfAp.saveGameData();

    this.on('finish',function() {
      if (options.isExit) {
        app.flare(options.cbname);
        this.exit();
      } else {
        CurrentGameData.Scene = 'MainBoard';
        TfAp.saveGameData();
        this.app.replaceScene(MainBoardScene());
      }
    });
  },
});

//レベルアップの手続きスタート
phina.define('LevelUpMessageScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();

    this.backgroundColor = appBackGroundColor;

    var _Level = CurrentGameData.ScoreCardLevel;

    var _message = '';
    if (_Level > 3){
      //ゲーム終了へ
      _message = i18n.LevelUpMax;
    } else {
      _message = i18n.LevelUpMessage;
      _message = _message
            .replace(/α/g,ScoreCardNames[_Level-1])
            .replace(/γ/g,ScoreCardNames[_Level]);
    }

    //メッセージウインドウ
    var _msg = MessageWindow({
                          texts       :[_message],
                          x           :320,
                          y           :300,
                          width       :600,
                          height      :500,
                                           }).addChildTo(this);
    _msg.showAllText();

    this._selectButton = function(opt){ return Button({
                          text      :opt.text,
                          x         :opt.x||320,
                          y         :280,
                          height    :45,
                          width     :150,
                          align: 'left',
                          fontWeight:'bold',
                          strokeWidth : 3,
                          fill: 'purple',
                          fontSize  :25})};

    var _btnGO = this._selectButton({text:i18n.ButtonNext}).setPosition(320,500).addChildTo(this);

    var self = this;
    var _cbname = TfAp.doneFlareName();
    _btnGO.on('push', function(e) {
      if (_Level > 3){
        //ゲーム終了へ
        self.app.replaceScene(GameCloseOverScene({cbname:_cbname}));
      } else {
        self.exit();
      }
    });

    app.on(_cbname, function(e) {
      var _date = new Date();
      CurrentGameData.CloseTime = _date.getTime();
      CurrentGameData.Scene = 'MainBoard';
      TfAp.WriteGameLog(i18n.LogGameEnd);
      app.replaceScene(MainBoardScene());
      TfAp.saveGameData();
    });
  },
});

//レベルアップに伴って変換するトークンを選択するシーン
phina.define('LevelUpAwarenessTokenScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    this.superInit(options);

    var self = this;
    this.backgroundColor = appBackGroundColor;

    var _scoreCurrentLevel = CurrentGameData.ScoreCardLevel-1;
    var _scoreNextLevel = CurrentGameData.ScoreCardLevel;

    //現在レベルで保有しているトークン管理
    this.SelectedCurrentLevelAwareness = CurrentGameData.Awareness[_scoreCurrentLevel];
    if (this.SelectedCurrentLevelAwareness == void 0) {
      CurrentGameData.Awareness[_scoreCurrentLevel] = [];
      this.SelectedCurrentLevelAwareness = CurrentGameData.Awareness[_scoreCurrentLevel];
    }
    var _CurrentLevelMaster = TfAp.TokenAwareness[_scoreCurrentLevel];

    //次のレベルのトークン管理
    this.SelectedNextAwareness = CurrentGameData.Awareness[_scoreNextLevel];
    if (this.SelectedNextAwareness == void 0) {
      CurrentGameData.Awareness[_scoreNextLevel] = [];
      this.SelectedNextAwareness = CurrentGameData.Awareness[_scoreNextLevel];
    }

    var _NextLevelMaster = TfAp.TokenAwareness[_scoreNextLevel];

    var _cbname = TfAp.doneFlareName();

    //メッセージウインドウ
    var _SelectExchangeTokenMessage = i18n.SelectExchangeTokenMessage;
    var _btnAName = i18n.OK;
    var _btnBName = i18n.ButtonNext;
    if (this.SelectedCurrentLevelAwareness.length <= 7) {
      _SelectExchangeTokenMessage = i18n.ExchangeNoTokenMessage;
      _btnAName = i18n.ButtonNext;
      _btnBName = '';
    }

    this.SelectExchangeTokenMessage = MessageWindow({
                          texts       :[_SelectExchangeTokenMessage],
                          x           :340,
                          y           :180,
                          width       :440,
                          height      :320,
                          buttonAName  :_btnAName,
                          buttonBName  :_btnBName,
                          buttonWidth: 150,
                                           }).addChildTo(this);
    this.SelectExchangeTokenMessage.showAllText();

    this.SelectExchangeTokenMessage.ButtonA.setInteractive(true);
    this.SelectExchangeTokenMessage.ButtonB.setInteractive(true);

    //あとからアニメーションするために選ばれてないオブジェクトをグループ化する
    var nonSelectObjects = DisplayElement().addChildTo(this);
    var SelectObjects = DisplayElement().addChildTo(this);

    //トークン配列定義
    this._Token = [];
    this._SelectedToken = [];

    var _selectedNumberOfTokens = 0;
    for (i in this.SelectedCurrentLevelAwareness) {
      this._Token.push(
        TokenAwareness({layer:i,id:this.SelectedCurrentLevelAwareness[i],ratio:0.7,
                            isFace  :true,
                            level : _scoreCurrentLevel,
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
        } else if (_selectedNumberOfTokens < 2) {
          _selectedNumberOfTokens = _selectedNumberOfTokens + 1;
          this.fill = 'gray';
          this.isSelected = true;
          self._SelectedToken.push(this);
        }
      });
    }

    this._selectButton = function(opt){ return Button({
                          text      :opt.text,
                          x         :opt.x||320,
                          y         :280,
                          height    :45,
                          width     :150,
                          align: 'left',
                          fontWeight:'bold',
                          strokeWidth : 3,
                          fill: 'purple',
                          fontSize  :25})};

    this.OKButton = this._selectButton({text:i18n.OK,width:150,x:230}).addChildTo(this).hide().setInteractive(false);
    this.NGButton = this._selectButton({text:i18n.NG,width:150,x:450}).addChildTo(this).hide().setInteractive(false);

    var _keywords = '';  //選択したトークンのキーワード
    this.SelectExchangeTokenMessage.ButtonA.on('push', function(e) {
      if (self.SelectedCurrentLevelAwareness.length <= 7) {
        self.exit();
      }

      if (_selectedNumberOfTokens != 2) {
        return;
      }

      var _thisobj = self.SelectExchangeTokenMessage;
      _thisobj.ButtonA.text = '';
      _thisobj.ButtonB.text = '';
      _thisobj.ButtonA.hide().setInteractive(false);
      _thisobj.ButtonB.hide().setInteractive(false);

      //選択されたカードを判定
      for (var i = self._Token.length -1; i>=0; i--) {
        if (self._Token[i].isSelected == true) {
          //選択されたカード
          self._Token[i].addChildTo(SelectObjects);
          _keywords = _keywords + (_keywords==''?'':',');
          _keywords = _keywords + ((CurrentGameData.Language=='EN')?_CurrentLevelMaster[self._Token[i].id].message:_CurrentLevelMaster[self._Token[i].id].meaning);
        } else {
          self._Token[i].addChildTo(nonSelectObjects);
        }
      }
      _thisobj.texts = [_keywords + i18n.ExchangeTokenMessage];
      _thisobj.showAllText();
      
      self.OKButton.show().setInteractive(true);
      self.NGButton.show().setInteractive(true);
    });

    this.NGButton.on('push', function(e) {
      self.exit('LevelUpAwarenessToken');
    });

    this.OKButton.on('push', function(e) {
      //現在のレベルのスコアカードから削除
      for (var i = self._Token.length -1; i>=0; i--) {
        if (self._Token[i].isSelected == true) {
          //スコアカードから削除
          var _SelId = self.SelectedCurrentLevelAwareness.indexOf(self._Token[i].id);
          self.SelectedCurrentLevelAwareness.splice(_SelId, 1);
        }
      }

      //次のレベルのトークン１枚選択へ
      var _cbname = TfAp.doneFlareName();
      var _exchangedToken = i18n.ExchangedToken;
      _exchangedToken = _exchangedToken.replace(/α/g,_keywords);

      TfAp.WriteGameLog(i18n.LogExchangeAwarenessToken + _exchangedToken);
      app.pushScene(SelectTokenAwarenessBoxToScoreScene({ScoreLevel:_scoreNextLevel,Target : '',selectNumberOfAwarenessTokens:1,cbname:_cbname,}));

      app.on(_cbname, function(e) {
        //ログへ
        self.exit('LevelUpAwarenessToken');
      });
    });

    this.SelectExchangeTokenMessage.ButtonB.on('push', function(e) {
      self.exit();
    });

  },
});

//レベルアップに伴って持ち上がる天使を選択するシーン
phina.define('LevelUpAngelCardScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    this.superInit(options);

    var self = this;
    this.backgroundColor = appBackGroundColor;

    var _scoreCurrentLevel = CurrentGameData.ScoreCardLevel-1;
    var _scoreNextLevel = CurrentGameData.ScoreCardLevel;

    //現在レベルで保有している天使管理
    this.SelectedCurrentLevelAngel = CurrentGameData.Angel[_scoreCurrentLevel];
    if (this.SelectedCurrentLevelAngel == void 0) {
      CurrentGameData.Angel[_scoreCurrentLevel] = [];
      this.SelectedCurrentLevelAngel = CurrentGameData.Angel[_scoreCurrentLevel];
    }

    //次のレベルの天使管理
    CurrentGameData.Angel[_scoreNextLevel] = [];
    this.SelectedNextAngel = CurrentGameData.Angel[_scoreNextLevel];

    //メッセージウインドウ
    var _SelectExchangeAngelMessage = i18n.SelectExchangeAngelMessage;
    var _btnName = i18n.OK;
    if (this.SelectedCurrentLevelAngel.length <= 3) {
      _SelectExchangeAngelMessage = i18n.ExchangeNoAngelMessage;
      _btnName = i18n.ButtonNext;
    }

    this.SelectExchangeAngelMessage = MessageWindow({
                          texts       :[_SelectExchangeAngelMessage],
                          x           :340,
                          y           :180,
                          width       :440,
                          height      :320,
                          buttonAName  :_btnName,
                          buttonWidth: 150,
                                           }).addChildTo(this);
    this.SelectExchangeAngelMessage.showAllText();
    this.SelectExchangeAngelMessage.ButtonA.setInteractive(true);

    //あとからアニメーションするために選ばれてないオブジェクトをグループ化する
    var nonSelectObjects = DisplayElement().addChildTo(this);
    var SelectObjects = DisplayElement().addChildTo(this);

    //天使配列定義
    this._Angel = [];
    this._SelectedAngel = [];

    var _selectedNumberOfTokens = 0;
    for (i in this.SelectedCurrentLevelAngel) {
      this._Angel.push(
        AngelCard({layer:i,id:this.SelectedCurrentLevelAngel[i],
                            isFace  :true,
                            }).setPosition(200+(300*(i%2)),450+(100*Math.floor(i/2)))
      );
      this._Angel[i].addChildTo(this);

      this._Angel[i].on('pointend', function(e) {
        if (this.alpha == 0.3) {
          _selectedNumberOfTokens = _selectedNumberOfTokens - 1;
          this.alpha = 1.0;
          this.isSelected = false;
          var _delId = self._SelectedAngel.indexOf(this);
          self._SelectedAngel.splice(_delId, 1);
        } else if (self.SelectedCurrentLevelAngel.length - _selectedNumberOfTokens > 3) {
          _selectedNumberOfTokens = _selectedNumberOfTokens + 1;
          this.alpha = 0.3;
          this.isSelected = true;
          self._SelectedAngel.push(this);
        }
      });
    }

    this._selectButton = function(opt){ return Button({
                          text      :opt.text,
                          x         :opt.x||320,
                          y         :280,
                          height    :45,
                          width     :150,
                          align: 'left',
                          fontWeight:'bold',
                          strokeWidth : 3,
                          fill: 'purple',
                          fontSize  :25})};

    this.OKButton = this._selectButton({text:i18n.OK,width:150,x:230}).addChildTo(this).hide().setInteractive(false);
    this.NGButton = this._selectButton({text:i18n.NG,width:150,x:450}).addChildTo(this).hide().setInteractive(false);

    var _keywords = '';  //選択した天使のキーワード
    this.SelectExchangeAngelMessage.ButtonA.on('push', function(e) {
      if (self.SelectedCurrentLevelAngel.length <= 3) {
        self.exit();
      }

      if (self.SelectedCurrentLevelAngel.length - _selectedNumberOfTokens < 3) {
        return;
      }

      var _thisobj = self.SelectExchangeAngelMessage;
      _thisobj.ButtonA.text = '';
      _thisobj.ButtonA.hide().setInteractive(false);

      //選択されたカードを判定
      for (var i = self._Angel.length -1; i>=0; i--) {
        if (self._Angel[i].isSelected == true) {
          //選択されたカード
          self._Angel[i].addChildTo(SelectObjects);
          _keywords = _keywords + (_keywords==''?'':',');
          _keywords = _keywords + ((CurrentGameData.Language=='EN')?i18n.CardAngels[self._Angel[i].id].message:i18n.CardAngels[self._Angel[i].id].meaning);
        } else {
          self._Angel[i].addChildTo(nonSelectObjects);
        }
      }
      _thisobj.texts = [_keywords + i18n.ConfirmExchangeAngelMessage];
      if(_keywords == '') {
        _thisobj.texts = [i18n.ConfirmNoExchangeAngelMessage];
      };
      _thisobj.showAllText();
      
      self.OKButton.show().setInteractive(true);
      self.NGButton.show().setInteractive(true);
    });

    this.NGButton.on('push', function(e) {
      self.exit('LevelUpAngelCard');
    });

    this.OKButton.on('push', function(e) {
      for (var i = self._Angel.length -1; i>=0; i--) {
        if (self._Angel[i].isSelected == true) {
          //現在のレベルのスコアカードから削除
          var _SelId = self.SelectedCurrentLevelAngel.indexOf(self._Angel[i].id);
          self.SelectedCurrentLevelAngel.splice(_SelId, 1);
          //次のレベルのスコアカードに追加
          self.SelectedNextAngel.push(self._Angel[i].id);
        }
      }

      //ログへ
      var _exchangedAngel = i18n.ExchangedAngel;
      _exchangedAngel = _exchangedAngel.replace(/α/g,_keywords);
      TfAp.WriteGameLog(i18n.LogExchangeAngel + _exchangedAngel);
      self.exit();
    });

  },
});

//レベルアップに伴って持ち上がるサービストークンを選択するシーン
phina.define('LevelUpServiceTokenScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    this.superInit(options);

    var self = this;
    this.backgroundColor = appBackGroundColor;

    var _scoreCurrentLevel = CurrentGameData.ScoreCardLevel-1;
    var _scoreNextLevel = CurrentGameData.ScoreCardLevel;

    //現在レベルで保有しているサービストークン管理
    this.SelectedCurrentLevelService = CurrentGameData.Service[_scoreCurrentLevel];
    if (this.SelectedCurrentLevelService == void 0) {
      CurrentGameData.Service[_scoreCurrentLevel] = 0;
      this.SelectedCurrentLevelService = CurrentGameData.Service[_scoreCurrentLevel];
    }

    //次のレベルのサービストークン管理
    CurrentGameData.Service[_scoreNextLevel] = 0;
    this.SelectedNextService = CurrentGameData.Service[_scoreNextLevel];

    //メッセージウインドウ
    var _SelectExchangeServiceMessage = i18n.SelectExchangeServiceMessage;
    var _btnName = i18n.OK;
    if (this.SelectedCurrentLevelService <= 1) {
      _SelectExchangeServiceMessage = i18n.SelectExchangeNoServiceMessage;
      _btnName = i18n.ButtonNext;
    }

    this.SelectExchangeServiceMessage = MessageWindow({
                          texts       :[_SelectExchangeServiceMessage],
                          x           :340,
                          y           :180,
                          width       :440,
                          height      :320,
                          buttonAName  :_btnName,
                          buttonWidth: 150,
                                           }).addChildTo(this);
    this.SelectExchangeServiceMessage.showAllText();
    this.SelectExchangeServiceMessage.ButtonA.setInteractive(true);

    //あとからアニメーションするために選ばれてないオブジェクトをグループ化する
    var nonSelectObjects = DisplayElement().addChildTo(this);
    var SelectObjects = DisplayElement().addChildTo(this);

    //サービストークン配列定義
    this._Service = [];
    this._SelectedService = [];

    var _selectedNumberOfTokens = 0;
    for (var i = 0;i < this.SelectedCurrentLevelService;i++) {
      this._Service.push(
        TokenService({isBrank:false,isDisplayCards:false,ratio:0.7}).setPosition(180+(150*(i%3)),450+(170*Math.floor(i/3)))
      );
      this._Service[i].addChildTo(this);

      this._Service[i].on('pointend', function(e) {
        if (this.alpha == 0.3) {
          _selectedNumberOfTokens = _selectedNumberOfTokens - 1;
          this.alpha = 1.0;
          this.isSelected = false;
          var _delId = self._SelectedService.indexOf(this);
          self._SelectedService.splice(_delId, 1);
        } else if (self.SelectedCurrentLevelService > _selectedNumberOfTokens) {
          _selectedNumberOfTokens = _selectedNumberOfTokens + 1;
          this.alpha = 0.3;
          this.isSelected = true;
          self._SelectedService.push(this);
        }
      });
    }

    this._selectButton = function(opt){ return Button({
                          text      :opt.text,
                          x         :opt.x||320,
                          y         :280,
                          height    :45,
                          width     :150,
                          align: 'left',
                          fontWeight:'bold',
                          strokeWidth : 3,
                          fill: 'purple',
                          fontSize  :25})};

    this.OKButton = this._selectButton({text:'OK',width:150,x:230}).addChildTo(this).hide().setInteractive(false);
    this.NGButton = this._selectButton({text:'NG',width:150,x:450}).addChildTo(this).hide().setInteractive(false);

    this.SelectExchangeServiceMessage.ButtonA.on('push', function(e) {
      if (self.SelectedCurrentLevelService <= 1) {
        self.exit();
      }

      //選択したトークン＋１（本来残すべきカードの１枚）が持っているカードを超えてない
      if (self.SelectedCurrentLevelService < _selectedNumberOfTokens + 1) {
        return;
      }

      var _thisobj = self.SelectExchangeServiceMessage;
      _thisobj.ButtonA.text = '';
      _thisobj.ButtonA.hide().setInteractive(false);


      var _confirmExchangeServiceMessage = i18n.ConfirmExchangeServiceMessage;
      _confirmExchangeServiceMessage = _confirmExchangeServiceMessage.replace(/α/g,_selectedNumberOfTokens);
      
      _thisobj.texts = [_confirmExchangeServiceMessage];
      if(_selectedNumberOfTokens == 0) {
        _thisobj.texts = [i18n.ConfirmNoExchangeServiceMessage];
      };
      _thisobj.showAllText();
      
      self.OKButton.show().setInteractive(true);
      self.NGButton.show().setInteractive(true);
    });

    this.NGButton.on('push', function(e) {
      self.exit('LevelUpServiceToken');
    });

    this.OKButton.on('push', function(e) {
      //現在のレベルのスコアカードから削除
      CurrentGameData.Service[_scoreCurrentLevel] = CurrentGameData.Service[_scoreCurrentLevel] - _selectedNumberOfTokens;

      //次のレベルのスコアカードに追加
      CurrentGameData.Service[_scoreNextLevel] = CurrentGameData.Service[_scoreNextLevel] + _selectedNumberOfTokens;

      //ログへ
      var _exchangedService = i18n.ExchangedService;
      _exchangedService = _exchangedService.replace(/α/g,_selectedNumberOfTokens);
      TfAp.WriteGameLog(i18n.LogExchangeService + _exchangedService);
      self.exit();
    });

  },
});

//終了
phina.define('LevelUpOverScene', {
  superClass: 'DisplayScene',
  init: function(options) {
    options = ({}).$safe(options, {
      Messages : [i18n.GoNextLevelAndContinue],
    });
    this.superInit(options);
    this.backgroundColor = appBackGroundColor;

    //メッセージウインドウ
    var _msg = MessageWindow({
                          texts       :options.Messages,
                          x           :320,
                          y           :200,
                          width       :500,
                          height      :300,
                                           }).addChildTo(this);

    this._selectButton = function(opt){ return Button({
                          text      :opt.text,
                          x         :opt.x||320,
                          y         :280,
                          height    :45,
                          width     :150,
                          align: 'left',
                          fontWeight:'bold',
                          strokeWidth : 3,
                          fill: 'purple',
                          fontSize  :25})};


    var _btnGO = this._selectButton({text:i18n.ButtonNext}).setPosition(320,300).addChildTo(this);

    var self = this;
    _btnGO.on('push', function(e) {
      self.exit();
    });
  },
});


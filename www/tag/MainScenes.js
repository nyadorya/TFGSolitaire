phina.globalize();

//シーン遷移はすべて
//      app.replaceScene(GameCloseSceneSequence());
//のようにreplaceSceneで置き換えたほうが分かりやすい。
//シーンマネージャも同様。
//シーンマネージャ内部は連続（直列）処理（と使うのが妥当）。

//メインシーン（ロード→メインのみ）
TfAp.MainScenes = [
  {
    label: 'load',
    className: 'LoadingScene',
    nextLabel: 'MainBoard', //ゲーム開始も
//    nextLabel: 'TEST', //当面開発するシーンを記載

    arguments: {assets: TfAp.ASSETS,},
  },
  {
    label: 'MainBoard',
    className: 'MainBoardScene',
  },
//開発シーンのみ都度定義
  {
    label: 'TEST',
    className: 'LevelUpSceneSequence',
  },
]

phina.define('MainBoardScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    this.superInit(options);
    //守護天使選択前の場合、ゲーム初期処理シーンへ
    this.on('enter',function(){
      if (CurrentGameData.GuardianAngel == void 0 || CurrentGameData.GuardianAngel.length == 0) {
        app.replaceScene(GameInitSceneSequence());
      }

      if (CurrentGameData.Scene != '' && CurrentGameData.Scene != 'MainBoard') {
        app.replaceScene(TfAp.SquereSceneSequence(CurrentGameData.Scene));
      }


    });

    this.backgroundColor = appBackGroundColor;

    _close = TFGMiniButton({text:'CloseGame',x:170,width:120}).addChildTo(this);
    _main = TFGMiniButton({text:'Main',x:405}).addChildTo(this);
    _scard = TFGMiniButton({text:'ScoreCard',x:560,alpha:0.3}).addChildTo(this);

    _close.on('push', function() {
      if (CurrentGameData.CloseTime == void 0 || CurrentGameData.CloseTime == 0){
        app.replaceScene(ConfirmGameCloseScene());
      }else{
      }
    });

    _scard.on('push', function() {
      app.pushScene(ScoreCardScene());
    });

    //初期値
    this.squareNumber = CurrentGameData.PathSteps;
    this.markSquare = new Array();

    //初期設定
    //スクエアの大きさ
    this.marksize = 60;

    //スクエアの基準位置
    this.squareReferencePositionX = 60;
    this.squareReferencePositionY = 200;

    //進行方向
    var _direct = CurrentGameData.Direction||1;

    RectangleShape({x:62,y:0,width:80,height:3000,fill:'cornflowerblue',stroke: 'purple',strokeWidth:4,}).addChildTo(this);

    //スクエア表示
    var _squareNumber = this.squareNumber%Squares.length;
    for (var i=-6,len=9; i<len; ++i) {
      var tmpSquareNumber = _squareNumber + i*_direct;
      while (tmpSquareNumber < 0) {
        tmpSquareNumber = tmpSquareNumber + Squares.length;
      }
      while (tmpSquareNumber > (Squares.length-1)) {
        tmpSquareNumber = tmpSquareNumber - Squares.length;
      }

      this.markSquare[tmpSquareNumber] = SquareMark({
                               name    : 'mark_' + Squares[tmpSquareNumber%Squares.length].mark,
                               x       : this.squareReferencePositionX,
                               y       : this.squareReferencePositionY
                                         + (this.marksize * 1.5 * i),
                               width   : this.marksize,
                               height  : this.marksize,
                               rotation: 0,
                             }).addChildTo(this);
    }

    this.MessageWindow = MessageWindow({
                                        texts       :this.defineMessage(),
                                        x           :380,
                                        y           :620,
                                        width       :480,
                                        height      :300,
                                      }).addChildTo(this);

    //守護天使配置
    this.GuardianAngel = AngelCard({isFace:true,id:CurrentGameData.GuardianAngel[CurrentGameData.GuardianAngel.length-1]}).addChildTo(this);
    Label({text:'Guardian Angel',fontSize:18}).setPosition(380,360).addChildTo(this);
    this.GuardianAngel.setPosition(380,410);

    //マップを表示
    this._pathMap = PathMap({ratio:0.7,x:380,y:200,isInterActive:false,}).addChildTo(this);

    //サイコロボタン
    this.MarkDice = MarkDice({diceNumber:CurrentGameData.LastDiceNumber}).addChildTo(this);
    this.enableDice();

    //痛みの配置
    this.definePains(this);
    this.selectedPain = new TokenDepression();

    this._selectButton = function(opt){ return Button({
                          text      :opt.text,
                          x         :opt.x||320,
                          y         :730,
                          height    :50,
                          width     :200,
                          align: 'left',
                          fontWeight:'bold',
                          strokeWidth : 3,
                          fill: 'purple',
                          fontSize  :25})};

    //痛み解消ボタン
    this.tryReleasePainButton = this._selectButton({text:'Clear Pain',x:250}).addChildTo(this);
    this.tryReleasePainButton.hide().setInteractive(false);

    //レベルアップボタン
    this.LevelUpButton = this._selectButton({text:'LevelUp',x:500}).addChildTo(this);
    this.LevelUpButton.hide().setInteractive(false);
    //レベルアップ判定
    this.JudgeLevelUp();

    this.focusSquare({squareNumber: _squareNumber,display:false});

    var self = this;
    this.MarkDice.on('rolleddice', function(e) {
      var _diceNumber = e.diceNumber - CurrentGameData.Pains.length;
      if (_diceNumber > 0) {
        CurrentGameData.PathSteps = CurrentGameData.PathSteps + _diceNumber*_direct;

        self.moveSquares({squareNumber: self.squareNumber,numberDice: _diceNumber, easing:'swing',});

        self.squareNumber = (self.squareNumber + _diceNumber*_direct)%64;
      } else {
        //新たな痛み
        var _tmpText = i18n.AddPainMessage;
        _tmpText = _tmpText
            .replace(/α/g,e.diceNumber)
            .replace(/γ/g,CurrentGameData.Pains.length);

        if (CurrentGameData.Pains.length < 5) {
          //1-5枚ならサイコロ振れる
          _tmpText = _tmpText + i18n.WarningPainOneToFiveMessage;
        } else {
          //6枚以上ならサイコロNG
          _tmpText = _tmpText + i18n.NGDiceForPainMessage;
        }
        self.MessageWindow.resetText({texts:[_tmpText]});

        //ダイス振った回数＋１
        CurrentGameData.TotalThrowDice++
        //ログに書き込む
        var _tmpLog = i18n.AddPainLog;
        _tmpLog = _tmpLog
            .replace(/α/g,e.diceNumber)
            .replace(/γ/g,CurrentGameData.Pains.length);
        TfAp.WriteGameLog(i18n.Dice+':'+CurrentGameData.TotalThrowDice+'/'+_tmpLog);
        //保存
        TfAp.saveGameData();

        var _cbname = TfAp.doneFlareName();
        self.app.pushScene(AmimateDepressionScene({numberOfDepressionTokens:1,PutPainScene: 'Dice',CardId: 0,cbname: _cbname}));

        self.enableDice();
        
        self.app.on(_cbname, function() {
          self.definePains(self);
        });
      }

    });

    this.on('stopSquere', function(e) {
      //移動
      app.replaceScene(TfAp.SquereSceneSequence(e.stopSquere.mark));
    });

    this.tryReleasePainButton.on('push', function(e) {
      self.tryReleasePain(self.selectedPain);
    });

    this.LevelUpButton.on('push', function(e) {
      self.app.pushScene(LevelUpSceneSequence({isExit: true,}));
    });

    this.on('resume',function(e) {
      this.JudgeLevelUp();
    });

  },
  JudgeLevelUp : function(){
    //現在のレベルで以下をすべて満たす場合にレベルアップボタン表示
    //１．気づきのトークン6枚以上
    //２．天使3枚
    //３．サービストークン1枚以上
    //４．なみだなし

    var _level = CurrentGameData.ScoreCardLevel;

    var _awareness = (CurrentGameData.Awareness[_level] == void 0)?0:CurrentGameData.Awareness[_level].length;
    var _angel = (CurrentGameData.Angel[_level] == void 0)?0:CurrentGameData.Angel[_level].length;
    var _service = (CurrentGameData.Service[_level] == void 0)?0:CurrentGameData.Service[_level];

    var _pains = (CurrentGameData.Pains == void 0)?0:CurrentGameData.Pains.length;

    this.LevelUpButton.hide().setInteractive(false);
    if (_awareness >= 6 && _angel >=3 && _service >= 1 && _pains ==0) {
      this.LevelUpButton.show().setInteractive(true);
    }

  },
  tryReleasePain : function(pain){
    var self = this;
    var tempChildren = this.children.slice();
    for (var i=0,len=tempChildren.length; i<len; ++i) {
      if (pain !== tempChildren[i]) {
        tempChildren[i].tweener
          .fadeOut(200)
          .call(function(){
          });
      } else {
        tempChildren[i].tweener
          .wait(200)
          .to({x:50,y:100},200,'default')
          .call(function(){
            app.replaceScene(ClaerPainScene({pain:pain}));
          });
      }
    }
  },
  update: function(app) {
    var pointer = app.pointer;
    //画面フリックで表示内容変更
    if (pointer.getPointingEnd()) {
      if (pointer.fx > 20) {
        app.pushScene(ScoreCardScene());
      }
    }
  },
  definePains: function(scene) {
    var self = this;

    //再描画時のため、あらかじめ存在しているTokenDepressionは削除する
    scene.children = scene.children.filter(function(v) {
      return v.className != 'TokenDepression';
    });

    var _Pains = [];
    var _tmpPains = CurrentGameData.Pains;

    for (var i = 0;i < _tmpPains.length;i++) {
      //CurrentGameData.Pains
      _Pains.push(TokenDepression(_tmpPains[i]).setPosition(180+(50*i),850));
      _Pains[i].addChildTo(scene);
      _Pains[i].setInteractive(true);

      _Pains[i].on('pointend', function(e) {
        this.toggleSelected({x:0,y:-20,reference:this});
        for (var _pain of _Pains){
          if (_pain != this && _pain.isSelected == true) {
            _pain.toggleSelected({x:0,y:-20,reference:_pain});
          }
        }

        var _isSelected = false;
        for (var _pain of _Pains){
          if (_pain.isSelected) {_isSelected = true;}
        }
        if (_isSelected) {
          if (CurrentGameData.CloseTime == void 0 || CurrentGameData.CloseTime == 0){
            self.tryReleasePainButton.show().setInteractive(true);
          }
          self.MarkDice.setInteractive(false);  //ボタン表示時はサイコロ不可
          self.MessageWindow.resetText({texts:self.definePainData(this)});
          self.selectedPain = this;
        } else {
          self.tryReleasePainButton.hide().setInteractive(false);
          self.enableDice();  //ボタン非表示時は痛みの数に依存
          self.MessageWindow.resetText({texts:self.defineMessage()});
          self.selectedPain = null;
        }
      });

    }
  },
  definePainData : function(pain){
    var _steps = pain.GetPathSteps%Squares.length + (pain.GetPathSteps%Squares.length<0?Squares.length:0);
    var _ret =  i18n.Dice + '：' + pain.GetTotalThrowDice + '\n' +
                i18n.Squere + '：' + Squares[_steps].mark + '\n';

    var _objCard = '';
    //パターンが増えたときのためにswitchにした。
    switch (pain.PutPainScene) {
      case 'Setback':
        _objCard = TfAp.MasterDecks(pain.CardType);
        _ret = _ret + i18n.Pain +'：' + i18n.PutSetbackMessage + '\n' + 
                i18n.Detail + '：\n' + _objCard[pain.CardId].meaning;
        break;
      case 'Depression':
        _ret = _ret + i18n.Pain + '：' +i18n. PutDepressionMessage;
        break;
      case 'Dice':
        _ret = _ret + i18n.Pain + '：' + i18n.FailGambleDiceMessage;
        break;
      case 'Flash':
        _ret = _ret + i18n.Pain + '：' + i18n.FailGambleFlashMessage;
        break;
      default:
        _ret =  _ret + i18n.Pain + '：' + pain.PutPainScene;
    }
    return [_ret];
  },
  defineMessage : function(opt) {
    options = ({}).$safe(opt, {
      texts: [i18n.LetsDiceNow],
    });
    var _retTexts = options.texts;

    if (CurrentGameData.Pains.length > 5) {
      _retTexts[0] = i18n.ShouldYouOpenPainMessage;
    } else if (CurrentGameData.Pains.length == 1) {
      _retTexts[0] = i18n.WouldYouOpenOnePainMessage + _retTexts[0];
    } else if (CurrentGameData.Pains.length > 0) {
        var _rettem = i18n.WouldYouOpenPainsMessage;
        _rettem = _rettem.replace(/α/g,CurrentGameData.Pains.length);
      _retTexts[0] = _rettem + _retTexts[0];
    }

    if (CurrentGameData.CloseTime == void 0 || CurrentGameData.CloseTime == 0){
    }else{
      var _retEndGame = i18n.AlreadyClosedGameMessage;
      _retEndGame = _retEndGame.replace(/α/g,TfAp.FormatDate(CurrentGameData.CloseTime));
      _retTexts[0] = _retEndGame;
    }

    return _retTexts;
  },
  enableDice : function() {
    this.MarkDice.setInteractive(true);

    //痛み６枚以下はダイス振れる
    if (CurrentGameData.Pains.length >= 6) {
      this.MarkDice.setInteractive(false);
    }

    //ゲーム終了前はダイス振れる
    if (CurrentGameData.CloseTime == void 0 || CurrentGameData.CloseTime == 0){
    }else{
      this.MarkDice.setInteractive(false);
    }
  },

  showDice: function(e) {
    this.labelDiceNumber.showRandom();
    this.labelDiceNumber.showNumber({easing: e.easing});
  },
  showSquareInstructions: function(e) {
    this.MessageWindow.resetText({texts: e.texts});
  },
  moveSquares: function(e) {
    //コール時：遷移前のスクエアナンバー
    var squareNumber = parseInt(e.squareNumber)%Squares.length;

    var tmpSquareNumber = 0;
    var self = this;

     //進行方向
    var _direct = CurrentGameData.Direction||1;

    //ダイス振った回数＋１
    CurrentGameData.TotalThrowDice++
    //シーン遷移
    var _newSquareNumber = parseInt(squareNumber+e.numberDice*_direct);
    while (_newSquareNumber < 0) {
      _newSquareNumber = _newSquareNumber + Squares.length;
    }
    while (_newSquareNumber > (Squares.length-1)) {
      _newSquareNumber = _newSquareNumber - Squares.length;
    }
    CurrentGameData.Scene = Squares[_newSquareNumber].mark;
    //ログに書き込む
    TfAp.WriteGameLog(i18n.Dice+':'+CurrentGameData.TotalThrowDice+'/'+i18n.StopSquere+':'+CurrentGameData.Scene);
    //保存
    TfAp.saveGameData();

    //スクエアを足す
    for (var i=0;i<parseInt(e.numberDice)+1;i++) {

      var addSquareNumber = parseInt(squareNumber+(8+i)*_direct);
      while (addSquareNumber < 0) {
        addSquareNumber = addSquareNumber + (addSquareNumber<0?Squares.length:0);
      }

      this.markSquare[addSquareNumber%Squares.length] = SquareMark({
                              name    : 'mark_' + Squares[addSquareNumber%Squares.length].mark,
                              x       : this.squareReferencePositionX,
                              y       : this.squareReferencePositionY
                                        + (this.marksize * 1.5 * (8+i)),
                              width   : this.marksize,
                              height  : this.marksize,
                              rotation: 0,
                            }).addChildTo(this);
    }

    //スクエアをアニメーションする
    for (var i=-2,len=9+e.numberDice; i<len; i++) {

      tmpSquareNumber = squareNumber + i*_direct;
      while (tmpSquareNumber < 0) {
        tmpSquareNumber = tmpSquareNumber + Squares.length;
      }
      while (tmpSquareNumber > (Squares.length-1)) {
        tmpSquareNumber = tmpSquareNumber - Squares.length;
      }

      self.markSquare[parseInt(tmpSquareNumber)].moveSquare(e);
    }
    var _squareNumber = (e.squareNumber + e.numberDice*_direct)%Squares.length;
    _squareNumber = _squareNumber + (_squareNumber<0?Squares.length:0);
    this.focusSquare({squareNumber:_squareNumber});

    //遷移したスクエア以外をフェードアウト
    var tempChildren = this.children.slice();
    for (var i=0,len=tempChildren.length; i<len; ++i) {
      if (this.markSquare[_squareNumber] !== tempChildren[i]) {
        tempChildren[i].tweener
          .fadeOut(1000)
          .call(function(){
          });
      } else {
        tempChildren[i].tweener
          .wait(1200)
          .to({x:50,y:50},1000,'default')
          .scaleBy(0.5,1000,'default')
          .call(function(){
            //イベント発火（ここでexitができないため）
            self.flare('stopSquere',{stopSquere : Squares[_squareNumber],});
          });
      }
    }

  },
  focusSquare: function(options) {
    options = ({}).$safe(options, {
      display: true,
      squareNumber : CurrentGameData.PathSteps%Squares.length,
    });

    options.squareNumber = options.squareNumber + (options.squareNumber<0?Squares.length:0);

    //選択スクエア変更
    for (var i in this.markSquare) {
      this.markSquare[i].changeFrameColor({color:this.orgframecolor,});
    }
    this.markSquare[options.squareNumber%Squares.length].changeFrameColor({color:options.color||'#f00',});
    this._pathMap.focusSquare();

    return this;
  },
});

phina.define('ScoreCardScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    this.superInit(options);
    options = ({}).$safe(options, {
      level : CurrentGameData.ScoreCardLevel,
    });

    var self = this;

    _main = TFGMiniButton({text:'Main',x:405,alpha:0.3}).addChildTo(this);
    _scard = TFGMiniButton({text:'ScoreCard',x:560}).addChildTo(this);

    _main.on('push', function() {
      app.popScene();
    });

    //レベル名のラベル
    var labelLevelName = Label({
                                text      : 'ScoreCard',
                                align     :'Center',
                                fontColor :'black',
                                fontWeight:'bold',
                                fontSize  :20,
                                x         :260,
                                y         :50,
                              }).addChildTo(this);

    var _buttonScoreCards = [];
    ScoreCardNames.forEach(function(val,index,ar){
      var _alpha = (CurrentGameData.ScoreCardLevel==index)?1.0:0.5
      _buttonScoreCards[index] = TFGMiniButton({text:val,x:90+150*index,y:75,width:130,fill:ScoreCardColors[index],alpha:_alpha}).addChildTo(self);

      _buttonScoreCards[index].on('push', function() {
//とりあえず開発中は未到達レベルのスコアカードを表示可にしておく
//        if (CurrentGameData.ScoreCardLevel<index) return;
        app.replaceScene(ScoreCardScene({level:index}));
      });
    });

    //メインの表示処理
    this.display(options.level);

  },
  display: function(level) {
    this._displayLevel = level;
    this.backgroundColor = ScoreCardColors[level];

    //グループ化しておく
    var DisplayObjects = DisplayElement().addChildTo(this);

    //AwanessToken
    var _countAwareness = 0;
    if (CurrentGameData.Awareness == void 0) {
      CurrentGameData.Awareness = [];
    }
    if (CurrentGameData.Awareness[level] == void 0) {
      CurrentGameData.Awareness[level] = [];
    }

    if (CurrentGameData.Awareness[level] != void 0) {
      _countAwareness = CurrentGameData.Awareness[level].length;
    }

    this.TokenAwareness = [];
    if (_countAwareness < 7) {
      for (var i=0;i<6;i++) {
        var _id = -1;
        if (CurrentGameData.Awareness[level] != void 0) {
          if (CurrentGameData.Awareness[level][i] != void 0) {
            _id = TfAp.TokenAwareness[level][CurrentGameData.Awareness[level][i]].id;
          }
        }
        this.TokenAwareness[i] = TokenAwareness({
                                id     :_id,
                                level  :level,
                                isFace  :true,
                                }).setPosition(100+(140*(i%3)),185+(200*(i<3?0:1))).addChildTo(DisplayObjects);
        if (_id == -1) {this.TokenAwareness[i].setInteractive(false)};
      }
    } else {
      for (var i=0;i<15;i++) {
        var _id = -1;
        if (CurrentGameData.Awareness[level] != void 0) {
          if (CurrentGameData.Awareness[level][i] != void 0) {
          _id = TfAp.TokenAwareness[level][CurrentGameData.Awareness[level][i]].id;
          }
        }
        this.TokenAwareness[i] = TokenAwareness({
                                id     :_id,
                                level  :level,
                                isFace  :true,
                                ratio : 0.6,
                                }).setPosition(70+(80*(i%5)),155+(130*((i<5?0:1)+(i<10?0:1)))).addChildTo(DisplayObjects);
        if (_id == -1) {this.TokenAwareness[i].setInteractive(false)};
      }
    }

    //ServiceTokenNumber
    if (CurrentGameData.Service == void 0) {
      CurrentGameData.Service = [];
    }
    if (CurrentGameData.Service[level] == void 0) {
      CurrentGameData.Service[level] = 0;
    }
    this.TokenService = TokenService({cards:CurrentGameData.Service[level],}).setPosition(520,285).addChildTo(DisplayObjects);

    //エンジェルカード
    this.CardAngel = [];
    if (CurrentGameData.Angel == void 0) {
      CurrentGameData.Angel = [];
    }
    if (CurrentGameData.Angel[level] == void 0) {
      CurrentGameData.Angel[level] = 0;
    }
    for (var i=0;i<3;i++) {
      var _id = -1;
      if (CurrentGameData.Angel[level] != void 0) {
        if (CurrentGameData.Angel[level][i] != void 0) {
          _id = (i18n.CardAngels[CurrentGameData.Angel[level][i]]).id;
        }
      }
      this.CardAngel[i] = AngelCard({id:_id,layer:i,isFace:true,}).setPosition(140,530+90*i).addChildTo(DisplayObjects);
      if (_id == -1) {this.CardAngel[i].setInteractive(false)};
    }

    //セットバックエリア
    this.AreaSetbacks = AreaSetbacks().addChildTo(DisplayObjects);
    //セットバックカード
    this.CardSetback = [];
    if (CurrentGameData.Setback[level] != void 0) {
      //最大表示は7枚。シェアしたいセットバックが消えるかもしれないが、その前にシェアしろ！
      for (var i=0;i< Math.min(CurrentGameData.Setback[level].length,7);i++) {
        var _id = -1;
        if (CurrentGameData.Setback[level][i] != void 0) {
          _id = i18n.CardSetbacks[CurrentGameData.Setback[level][i]].id;
        }
        this.CardSetback[i] = SetbackCard({id:_id,layer:i,ratio:0.6}).setPosition(-120+40*i,10).addChildTo(this.AreaSetbacks);
      }
    }

    //トランスフォーメーションエリア
    this.AreaTransformations = AreaTransformations().addChildTo(DisplayObjects);
    this.Pain = [];
    if (CurrentGameData.TransformPain == void 0) {
      CurrentGameData.TransformPain = [];
    }
    if (CurrentGameData.TransformPain[level] == void 0) {
      CurrentGameData.TransformPain[level] = [];
    }
    for (var i=0;i< Math.min(CurrentGameData.TransformPain[level].length,12);i++) {
      this.Pain[i] = TokenDepression(CurrentGameData.TransformPain[level][i]).setScale(0.85,0.85).setPosition(-135+25*i,10).addChildTo(this.AreaTransformations);
      this.Pain[i].layer = i;
    }

    this.AreaMessage = AreaMessage().addChildTo(DisplayObjects);

    this._displayMsgId = -1;
    this.on('displayMessage',function(e){
      this.AreaMessage.clearText();
      var _messageGuardianAngel = AngelCard({id:CurrentGameData.GuardianAngel[CurrentGameData.GuardianAngel.length-1]}).getMessage();

      if (this._displayMsgId != e.id) {
        this._displayMsgId = e.id;
        if (e.cardtype=='Setback') {
          var _scoreCardAreaMessageSetback = i18n.ScoreCardAreaMessageSetback;
          _scoreCardAreaMessageSetback = _scoreCardAreaMessageSetback.replace(/α/g,_messageGuardianAngel);
          this.AreaMessage.texts = [SetbackCard({id:this._displayMsgId}).getMessage() + '\n' +
                                    SetbackCard({id:this._displayMsgId}).getMeaning() + '\n' +
                                    _scoreCardAreaMessageSetback];
        } else if (e.cardtype=='Pain') {
          var _pain = this.Pain[e.id];
          var _objCard = '';
          _painmessage = i18n.Awareness + '・' + i18n.Reason + '：' + _pain.UserAwareness + '\n' + i18n.HeldPain + '：';
          switch (_pain.PutPainScene) {
            case 'Setback':
              _objCard = TfAp.MasterDecks(_pain.CardType);
              _painmessage = _painmessage + _objCard[_pain.CardId].meaning;
              break;
            case 'Dice':
              _painmessage = _painmessage + FailGambleDiceMessage;
            default:
              _painmessage = _painmessage + _pain.PutPainScene;
          }

          this.AreaMessage.texts = [_painmessage + '\n' + i18n.ScoreCardAreaMessageTransformation];

        } else if (e.cardtype=='Angel') {
          var _getMessage = AngelCard({id:this._displayMsgId}).getMessage();
          var _scoreCardAreaMessageAngel = i18n.ScoreCardAreaMessageAngel;;
          _scoreCardAreaMessageAngel = _scoreCardAreaMessageAngel.replace(/α/g,_getMessage);
          this.AreaMessage.texts = [_getMessage + '\n' +
                                    AngelCard({id:this._displayMsgId}).getMeaning() + '\n' +
                                    _scoreCardAreaMessageAngel];
        } else if (e.cardtype=='Awareness') {
          var _getMeaning = TokenAwareness({id:this._displayMsgId,level:level,}).getMeaning();
          var _scoreCardAreaMessageAwareness = i18n.ScoreCardAreaMessageAwareness;
          _scoreCardAreaMessageAwareness = _scoreCardAreaMessageAwareness.replace(/α/g,_getMeaning);
          this.AreaMessage.texts = [TokenAwareness({id:this._displayMsgId,level:level,}).getMessage() + '\n' +
                                    _getMeaning + '\n' +
                                    _scoreCardAreaMessageAwareness];
        }
      } else {
        this._displayMsgId = -1;
        this.AreaMessage.texts = [''];
      }
      this.AreaMessage.showAllText();

    });


  },
  update: function(app) {
    var pointer = app.pointer;
    //画面フリックで表示内容変更
    if (pointer.getPointingEnd()) {
      if (pointer.fx < -20) {
        app.popScene();
      }
    }

    var _MaxLayerSetback = -1;
    var _MaxLayerAngel = -1;
    var _MaxLayerAwareness = -1;
    var _MaxLayerPain = -1;
    var _SelectChild = null;

    this.TokenAwareness.each(function(child) {
      if (child.isSelecting == true && _MaxLayerAwareness < child.layer) {
        _MaxLayerAwareness = child.layer;
        _SelectChild = child;
      }
    }, this);

    this.CardSetback.each(function(child) {
      if (child.isSelecting == true && _MaxLayerSetback < child.layer) {
        _MaxLayerSetback = child.layer;
      }
    }, this);

    this.CardAngel.each(function(child) {
      if (child.isSelecting == true && _MaxLayerAngel < child.layer) {
        _MaxLayerAngel = child.layer;
      }
    }, this);

    this.Pain.each(function(child) {
      if (child.isSelecting == true && _MaxLayerPain < child.layer) {
        _MaxLayerPain = child.layer;
      }
    }, this);

    if (_MaxLayerAwareness != -1 || _MaxLayerSetback != -1 || _MaxLayerAngel != -1 || _MaxLayerPain != -1) {
    //選択してたカード（引き続き選択してる場合は除き）はいったん非選択にする
      for (var k = 0;k < this.TokenAwareness.length; k++) {
        if (this.TokenAwareness[k].isSelected == true) {
          if (_SelectChild == null || this.TokenAwareness[k].id != _SelectChild.id) {
            this.TokenAwareness[k].toggleSelected({y:-10});
            this._displayMsgId = -1;
          } else {
          }
        } else {
        }
      }
      for (var k = 0;k < this.CardSetback.length; k++) {
        if (this.CardSetback[k].isSelected == true && k != _MaxLayerSetback) {
          this.CardSetback[k].toggleSelected({y:-10});
          this._displayMsgId = -1;
        }
      }
      for (var k = 0;k < this.CardAngel.length; k++) {
        if (this.CardAngel[k].isSelected == true && k != _MaxLayerAngel) {
          this.CardAngel[k].toggleSelected({y:-10});
          this._displayMsgId = -1;
        }
      }
      for (var k = 0;k < this.Pain.length; k++) {
        if (this.Pain[k].isSelected == true && k != _MaxLayerPain) {
          this.Pain[k].toggleSelected({y:-10});
          this._displayMsgId = -1;
        }
      }

      if (_MaxLayerSetback != -1) {
        //選択済みにする
        this.CardSetback[_MaxLayerSetback].toggleSelected({y:-10});
        this.flare('displayMessage',{cardtype:'Setback',id:this.CardSetback[_MaxLayerSetback].id});
      } else if (_MaxLayerAngel != -1) {
        //選択済みにする
        this.CardAngel[_MaxLayerAngel].toggleSelected({y:-10});
        this.flare('displayMessage',{cardtype:'Angel',id:this.CardAngel[_MaxLayerAngel].id});
      } else if (_MaxLayerPain != -1) {
        //選択済みにする
        this.Pain[_MaxLayerPain].toggleSelected({y:-10});
        this.flare('displayMessage',{cardtype:'Pain',id:this.Pain[_MaxLayerPain].layer});
      } else if (_MaxLayerAwareness != -1) {
        _SelectChild.toggleSelected({y:-10});
        this.flare('displayMessage',{cardtype:'Awareness',id:_SelectChild.id});
      }

      //一通り処理を終えたのですべての選択中状態は解除
      for (var k = 0;k < this.TokenAwareness.length; k++) {
        this.TokenAwareness[k].isSelecting = false;
      }
      for (var k = 0;k < this.Pain.length; k++) {
        this.Pain[k].isSelecting = false;
      }
      for (var k = 0;k < this.CardSetback.length; k++) {
        this.CardSetback[k].isSelecting = false;
      }
      for (var k = 0;k < this.CardAngel.length; k++) {
        this.CardAngel[k].isSelecting = false;
      }
    }
  },
});


phina.define('TFGMiniButton', {
  superClass: 'Button',
  init: function(options) {
    options = ({}).$safe(options, {
      text      :'text',
      x         :250,
      y         :16,
      height    :30,
      width     :150,
      fontColor :'black',
      fontWeight:'bold',
      fill      :'#E8CFE8',
      stroke    :'purple',
      strokeWidth : 3,
      fontFamily:'monospace',
      fontSize  :18,
      alpha     :1.0,
    });
    
    this.superInit(options);
    this.alpha = options.alpha;
  },
});

phina.define('AreaMessage', {
  superClass: 'MessageWindow',
  init: function(options) {
    options = ({}).$safe(options, {
        texts: [i18n.ScoreCardAreaDefaultMessage],
        width: 540,
        height: 170,
        backgroundColor: 'white',
        framecolor  :'transparent',
        fill        :'black',
        x   :310,
        y   :855,
    });

    this.superInit(options);

    this.on('pointend', function(e) {
      this.showAllText();
    });

  },
});



phina.define('AreaSetbacks', {
  superClass: 'RectangleShape',
  init: function(options) {
    options = ({}).$safe(options, {
        width: 320,
        height: 100,
        backgroundColor: 'white',
        stroke: 'transparent',
        fill: 'transparent',
        x   :420,
        y   :555,
    });
    this.superInit(options);

    var label = Label({
                      text      :'Setbacks',
                      align     :'Left',
                      fontColor :'black',
                      fontWeight:'bold',
                      fontSize  :20,
                      x         :-165,
                      y         :-45,
                    }).addChildTo(this);

  },
});

phina.define('AreaTransformations', {
  superClass: 'RectangleShape',
  init: function(options) {
    options = ({}).$safe(options, {
        width: 320,
        height: 100,
        backgroundColor: 'white',
        stroke: 'transparent',
        fill: 'transparent',
        x   :420,
        y   :685,
    });
    this.superInit(options);

    var label = Label({
                      text      :'Transformation',
                      align     :'Left',
                      fontColor :'black',
                      fontWeight:'bold',
                      fontSize  :20,
                      x         :-165,
                      y         :-45,
                    }).addChildTo(this);

  },
});

phina.define('PathMap', {
  superClass: 'RectangleShape',
  init: function(options) {
    options = ({}).$safe(options, {
        width: 600,
        height: 400,
        backgroundColor: 'transparent',
        stroke: 'purple',
        fill: 'cornflowerblue',
        x   :320,
        y   :400,
        strokeWidth: 4,
        cornerRadius: 4,
        ratio : 0.7,
        steps : CurrentGameData.PathSteps%Squares.length,
        isFocus : true,
        isInterActive : true,
        isMarkBigger : true,
        isDisplayArrow : false,
    });

    options.width = options.width * options.ratio;
    options.height = options.height * options.ratio;

    this.superInit(options);

    this.orgX = options.x;
    this.orgY = options.y;
    this.ratio = options.ratio;

    var _step = options.steps + (options.steps<0?Squares.length:0);
    this.selectedSquereAddSteps = 0;
    this.selectedSquereSteps = options.steps;
    this.selectedSquereId = this.selectedSquereSteps%Squares.length;
    this.selectedSquereName = Squares[_step].mark;
    this.selectedDirection = 1;  //1:右へ,-1:左へ

    var label = Label({
                      text      :'Map',
                      align     :'Left',
                      fontColor :'black',
                      fontSize  :16,
                      x         :-290 * options.ratio,
                      y         :-190 * options.ratio,
                    }).addChildTo(this);

    //ライフパス
    //スクエアの大きさ
    this.marksize = 20 * options.ratio;

    this.SquareMarks = new Array();
    for (var i in Squares) {
        this.SquareMarks[i] = SquareMark({name    : 'mark_' + Squares[i].mark,
                                 x       : Squares[i].x * options.ratio,
                                 y       : Squares[i].y * options.ratio,
                                 width   : this.marksize * options.ratio,
                                 height  : this.marksize * options.ratio,
                                 rotation: Squares[i].rotation,
                               }).addChildTo(this);
        this.SquareMarks[i].setInteractive(options.isMarkBigger);
    }

    var initFocus = this.focusSquare({isFocus: options.isFocus});

    this.setInteractive(options.isInterActive);
    var self = this;

    //方向を示す矢印を定義
    if (options.isDisplayArrow) {
      var DirectionRight = Sprite('arrow',50,100).setPosition(80,-150).addChildTo(this).setInteractive(true);
      DirectionRight.rotation = 150;
      DirectionRight.alpha = 1.0;
      var DirectionLeft = Sprite('arrow',50,100).setPosition(-80,-150).addChildTo(this).setInteractive(true);
      DirectionLeft.rotation = 210;
      DirectionLeft.alpha = 0.3;

      DirectionRight.on('pointend', function(e){
        DirectionRight.alpha = 1.0;
        DirectionLeft.alpha = 0.3;
        self.selectedDirection = 1;
      });
      DirectionLeft.on('pointend', function(e){
        DirectionRight.alpha = 0.3;
        DirectionLeft.alpha = 1.0;
        self.selectedDirection = -1;
      });
    }


    var _selectMark = false;
    var _move = false;
    this.SquareMarks.forEach (function(val,i,array) {
      if (val.selected == false) {
        val.changeFrameColor({color:'#aaa',});
        self.focusSquare({isFocus: options.isFocus});
      }
      val.on('stayMark', function(e){
        _selectMark = true;
      });
      val.on('pointend', function(e){
        array.forEach (function(_val,_i,_array) {
          _val.changeFrameColor({color:'#aaa',});
          _val.selected = false;
        });
        self.focusSquare({isFocus: options.isFocus});
        _selectMark = true;
        val.changeFrameColor({color:'#a0a',});
        val.selected = true;

        var _direct = CurrentGameData.Direction||1;
        self.selectedSquereAddSteps = (_direct*Squares.length+(i-options.steps))%Squares.length;
        self.selectedSquereSteps = options.steps + self.selectedSquereAddSteps;
        self.selectedSquereId = _direct*(Squares.length + self.selectedSquereSteps)%Squares.length;
        self.selectedSquereId = (self.selectedSquereId<0?-1:1) * self.selectedSquereId;
        self.selectedSquereName = Squares[self.selectedSquereId].mark;
      });
      val.on('outMark', function(e){
        _selectMark = false;
      });
    });

    this.on('pointstart', function(e) {
      if (!_selectMark) {
        _move = !_move;
      }
    });

    this.on('pointstay', function(e) {
      if (_move == true && _selectMark == false) {
        self.x = e.pointer.x;
        self.y = Math.max(e.pointer.y,self.orgY);
      }
    });

    this.on('pointend', function(e){
      _move = false;
    });
  },
  focusSquare: function(options) {
    options = ({}).$safe(options, {
      steps : CurrentGameData.PathSteps%Squares.length,
      isFocus: true,
    });
    if (!options.isFocus) return; //フォーカス不要なら処理しない

    options.steps = options.steps<0?Squares.length+options.steps:options.steps;

    for (var i in this.SquareMarks) {
      this.SquareMarks[i].changeFrameColor({color:'#aaa'});
      this.SquareMarks[i].currentSquere = false;
    }
    this.SquareMarks[options.steps].changeFrameColor({color:'#f00',});
    this.SquareMarks[options.steps].currentSquere = true;
  }
});


phina.globalize();

//祝福スクエア
phina.define('SquereBlessingSceneSequence' , {
  superClass: 'ManagerScene' ,
  SquereMark  : 'Blessing',
  SquereMeaning : i18n.SquereBlessing,
  init: function() {
    this.superInit({
      scenes: [
        {
          label: 'SquereBlessing',
          className: 'SquereBlessingScene',
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

phina.define('SquereBlessingScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      nextLabel   : 'Start',
      SquereMark  : 'Blessing',
      SquereMeaning : i18n.SquereBlessing,
    };
    this.superInit(options);
    this.beforeInput = TfAp.OverLayInput;

    var self = this;
    var _cbname = TfAp.doneFlareName();

    //スクエアイベント開始メッセージウインドウ
    this._1stMessage = MessageWindow({
                          texts       :[i18n.WhomBlessing],
                          x           :320,
                          y           :450,
                          width       :600,
                          height      :600,
                          buttonAName :i18n.Input,
                                           }).addChildTo(this);
    this._1stMessage.visible = true;
    this._1stMessage.ButtonA.setInteractive(true);
    this._1stMessage.ButtonA.on('push', function(e) {
      document.getElementById("overlay").style.display='block';
      TfAp.OverLayMessage = i18n.OverLayInputWhomBlessing;
      TfAp.OverLayPlaceHolder = i18n.OverLayPlaceHolderWhomBlessing;
      self.app.pushScene(InputScene({cbname:_cbname}));
    });

    app.on(_cbname, function(e) {
      self.beforeInput = TfAp.OverLayInput;
      self._1stMessage.visible = false;
      self._1stMessage.ButtonA.setInteractive(false);

      var _displayMessage = i18n.ThrowDiceForWhomBlessing.replace(/α/g,TfAp.OverLayInput);
      self._3rdMessage.resetText({texts:[_displayMessage]});
      self._3rdMessage.showAllText();
      self._3rdMessage.show();
      self.MarkDice.show();
    });

    //入力後、枚数決めるためサイコロを振る
    //祝福対象入力後メッセージウインドウ
    this._3rdMessage = MessageWindow({
                          texts       :[],
                          x           :320,
                          y           :450,
                          width       :600,
                          height      :600,
                                           }).addChildTo(this);
    this._3rdMessage.hide();

    //サイコロボタン
    this.MarkDice = MarkDice({diceNumber:1}).addChildTo(this);
    this.MarkDice.hide();
    var _diceNumber = 0;
    this.MarkDice.on('rollingdice', function(e) {
      self._3rdMessage.hide();
    });

    this.MarkDice.on('rolleddice', function(e) {
      _diceNumber = e.diceNumber;

      self.__4thMessage = self.__4thMessage.replace(/α/g,TfAp.OverLayInput);
      self.__4thMessage = self.__4thMessage.replace(/γ/g,_diceNumber);
      self._4thMessage.resetText({texts:[self.__4thMessage]});
      self._4thMessage.showAllText();
      self._4thMessage.visible = true;
    });

    this.__4thMessage = i18n.SelectTokenForWhomBlessing;
    this._4thMessage = MessageWindow({
                          texts       :[''],
                          x           :320,
                          y           :450,
                          width       :600,
                          height      :600,
                          buttonAName :i18n.SelectTokenAwareness,
                                           }).addChildTo(this);
    this._4thMessage.hide();
    this._4thMessage.ButtonA.on('push', function(e) {
      self.app.pushScene(SelectTokenAwarenessBoxToScoreScene({Target : TfAp.OverLayInput,selectNumberOfAwarenessTokens:_diceNumber}));
      self.afterTarget({selectNumberOfAwarenessTokens:_diceNumber});
    });

    this.__5thMessage = i18n.SelectTokenForYourSelfBlessing;
    this._5thMessage = MessageWindow({
                          texts       :[this.__5thMessage],
                          x           :320,
                          y           :450,
                          width       :600,
                          height      :600,
                          buttonAName :i18n.SelectTokenAwareness,
                                           }).addChildTo(this);
    this._5thMessage.hide();
    this._5thMessage.ButtonA.on('push', function(e) {
      self.app.pushScene(SelectTokenAwarenessBoxToScoreScene({Target : '',selectNumberOfAwarenessTokens:_diceNumber}));
      self.afterScene();
    });

    this._6thMessage = MessageWindow({
                          texts       :[i18n.CloseBlessingMessage],
                          x           :320,
                          y           :450,
                          width       :600,
                          height      :600,
                          buttonAName :i18n.ButtonEnd,
                                           }).addChildTo(this);
    this._6thMessage.hide();
    this._6thMessage.ButtonA.on('push', function(e) {
      var _scoreLevel = CurrentGameData.ScoreCardLevel;
      CurrentGameData.Service[_scoreLevel] = CurrentGameData.Service[_scoreLevel] + 1;
      self.exit();
    });

  },
  afterTarget:function(options){
    this.__5thMessage = this.__5thMessage.replace(/α/g,options.selectNumberOfAwarenessTokens);

    this._5thMessage.resetText({texts:[this.__5thMessage]});
    this._5thMessage.showAllText();
    this._5thMessage.visible = true;

    this._4thMessage.hide();
    this._4thMessage.ButtonA.setInteractive(false);
    this._5thMessage.show();

  },
  afterScene:function(){
    this._5thMessage.hide();
    this._5thMessage.ButtonA.setInteractive(false);
    this._6thMessage.show();
  },

});

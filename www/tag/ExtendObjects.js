phina.globalize();

phina.define('MessageWindow', {
  superClass: 'LabelArea',
  init: function(options) {
    options = ({}).$safe(options, {
      texts       :['',],
      text        :'',
      x           :350,
      y           :350,
      width       :400,
      height      :600,
      fontSize    :20,
      framecolor  :'purple',
      fill        :'black',
      messageSpeed:2,
      fontWeight  :'bold',
      backgroundColor: '#E8CFE8',
      buttonAName :'',
      buttonBName :'',
      showButtonA :true,
      showButtonB :true,
    });
    this.superInit(options);

    this.RectangleShape = RectangleShape({
      cornerRadius:5,
      width:options.width+10,
      height:options.height+10,
      strokeWidth:5,
      stroke:options.framecolor,
      backgroundColor: 'transparent',
      fill:'transparent',
    }).addChildTo(this);

    this.texts = options.texts;
    this.strokecolor = options.framecolor;
    this.textIndex = 0;
    this.charIndex = 0;
    this.messageSpeed = options.messageSpeed;
    this.showButtonA = options.showButtonA;
    this.showButtonB = options.showButtonB;

    //イベントを拾うため
    this.setInteractive(true);

    this.nextTriangle = TriangleShape({
      fill:options.framecolor,
      stroke:'transparent',
      radius:options.fontSize/2,
      rotation:180,
      x: options.width/2 - 10,
      y: options.height/2 -10,
    }).addChildTo(this)
    .hide();

    this.ButtonA = Button({
      text: options.buttonAName,
      fill: 'purple',
      width: options.buttonWidth,
      height: 45,
      fontSize: options.buttonFontSize,
      y: options.height/2 -30,
      }).addChildTo(this).hide();

    this.ButtonB = Button({
      text: options.buttonBName,
      fill: 'purple',
      width: options.buttonWidth,
      height: 45,
      fontSize: options.buttonFontSize,
      y: options.height/2 -90,
      }).addChildTo(this).hide();

    
    this.showAllText();
    //イベント定義
    //ポイントされたらメッセージ全表示か次のメッセージ表示へ
    this.on('pointend', function(e) {
      this.nextText();
      this.showAllText();
    });

  },
  update:function(app){
    //フレーム内の文字列を１文字ずつ表示
    if(app.frame % this.messageSpeed === 0){
      this.showAllText();
//      this.addChar();
    }
    //フレーム内のカーソルを点滅
    if (this.textAll == true) {
      if(app.frame % 20 === 0){
        if(this.nextTriangle.visible){
          this.nextTriangle.hide();
        }else{
          this.nextTriangle.show();
        }
      }
    } else {
      this.nextTriangle.hide();
    }
  },
  showAllText: function(){
    var text = this.texts[this.textIndex];
    this.text = (text==void 0)?'':text;
    this.textAll = true;
    if(this.textIndex == this.texts.length - 1 && this.ButtonA.text != '' && this.showButtonA == true) {
      this.ButtonA.show();
    }
    if(this.textIndex == this.texts.length - 1 && this.ButtonB.text != '') {
      this.ButtonB.show();
    }
    this.charIndex = (this.text).length;
  },
  clearText:function(){
    this.text='';
  },
  resetText:function(e){
    this.text='';
    this.ButtonA.hide();
    this.ButtonB.hide();
    this.texts = e.texts;
    this.textIndex = 0;
    this.charIndex = 0;
    this.addChar();
  },
  nextText : function(){
    this.clearText();
    this.ButtonA.hide();
    this.ButtonB.hide();
    ++this.textIndex;
    this.textIndex = this.textIndex % this.texts.length;
    this.charIndex = 0;
    this.addChar();
  },
  addChar:function(){
    this.text += this.getChar();
  },
  getChar:function(){
    var text = this.texts[this.textIndex]||'';
    if(text.length <= this.charIndex){
      this.textAll = true;
      if(this.textIndex == this.texts.length - 1 && this.ButtonA.text != '' && this.showButtonA == true) {
        this.ButtonA.show();
      }
      if(this.textIndex == this.texts.length - 1 && this.ButtonB.text != '' && this.showButtonB == true) {
        this.ButtonB.show();
      }
      return '';
    }else{
      this.textAll = false;
      return text[this.charIndex++];
    }
  },
});

phina.define('SquareMark', {
  superClass: 'RectangleShape',
  init: function(options) {
    options = ({}).$safe(options, {
      name: 'dummy',
      x: '100',
      y: '100',
      width: '40',
      height: '40',
      framecolor: '#aaa',
    });
    this.superInit();

    var img = Sprite(options.name).setSize(0,0).addChildTo(this);
    img.width = options.width;
    img.height = options.height;

    this.setInteractive(true);

    this.name = options.name;

    this.fill = options.framecolor;
    this.stroke=options.framecolor;
    this.shadow=true;

    this.orgx = options.x;
    this.orgy = options.y;
    this.orgwidth = options.width+1;
    this.orgheight = options.height+1;
    this.orgrotation = options.rotation;
    this.orgframecolor = options.framecolor;

    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.rotation = options.rotation;
    this.framecolor = options.framecolor;
    this.selected = false;
    this.currentSquere = false;

    this.on('pointstay', function(e) {
      this.flare('stayMark');
      this.width = Math.min(this.width*1.05,this.orgwidth*10);
      this.height = Math.min(this.height*1.05,this.orgheight*10);
      //子供も
      var tempChildren = this.children.slice();
      for (var i=0,len=tempChildren.length; i<len; ++i) {
        tempChildren[i].width = Math.min(this.width*1.05,this.orgwidth*10);
        tempChildren[i].height = Math.min(this.height*1.05,this.orgheight*10);
      }
    });
    this.on("pointout", function(e){
      this.flare('outMark');
      this.width = this.orgwidth;
      this.height = this.orgheight;
      this.rotation = this.orgrotation;
      //子供も
      var tempChildren = this.children.slice();
      for (var i=0,len=tempChildren.length; i<len; ++i) {
        tempChildren[i].width = this.orgwidth;
        tempChildren[i].height = this.orgheight;
      }
    });
  },
  moveSquare: function(e) {
      var self = this;

      this.tweener
        .clear()
        .by({y: -90 * e.numberDice,}, 500 * e.numberDice, e.easing)
        .call(function(){
              //画面外になったらremove
              if (self.y < 0) {
                self.remove();
              }
                      });
  },
  changeFrameColor: function(e) {
    this.stroke = e.color;
  },
});

phina.define('AngelCard', {
  superClass: 'TFGCard',
  init: function(options) {
    options = ({}).$safe(options, {
      cardname    : 'card_angel',
      id          : 0,
      layer       : 0,
      ratio       : 1,
    });
    this.superInit({Master  : i18n.CardAngels,
                    cardname: options.cardname,
                    isFace  : options.isFace,
                    canOpen : true,
                    isEvent : false,
                    id      : options.id,
                    layer   : options.layer,
                    ratio   : options.ratio,
                    width   : 200,
                    height  : 71,});
  },
});


phina.define('InsightCard', {
  superClass: 'TFGCard',
  init: function(options) {
    options = ({}).$safe(options, {
      cardname    : 'card_insight',
      id          : 0,
      layer       : 0,
      ratio       : 1,
    });
    this.superInit({Master  : i18n.CardInsights,
                    cardname: options.cardname,
                    isFace  : options.isFace,
                    canOpen : false,
                    isEvent : true,
                    id      : options.id,
                    layer   : options.layer,
                    ratio   : options.ratio,
                    width   : 120,
                    height  : 150,});
  },
});

phina.define('SetbackCard', {
  superClass: 'TFGCard',
  init: function(options) {
    options = ({}).$safe(options, {
      cardname    : 'card_setback',
      id          : 0,
      layer       : 0,
      ratio       : 1,
    });
    this.superInit({Master  : i18n.CardSetbacks,
                    cardname: options.cardname,
                    isFace  : options.isFace,
                    canOpen : false,
                    isEvent : true,
                    id      : options.id,
                    layer   : options.layer,
                    ratio   : options.ratio,
                    width   : 120,
                    height  : 150,});
  },
});

phina.define('UniversalFeedbackCard', {
  superClass: 'TFGCard',
  init: function(options) {
    options = ({}).$safe(options, {
      cardname    : 'card_universalfeedback',
      id          : 0,
      layer       : 0,
      ratio       : 1,
    });
    this.superInit({Master  : i18n.CardUniversalFeedbacks,
                    cardname: options.cardname,
                    isFace  : options.isFace,
                    canOpen : false,
                    isEvent : true,
                    id      : options.id,
                    layer   : options.layer,
                    ratio   : options.ratio,
                    width   : 120,
                    height  : 150,});
  },
});


phina.define('TFGCard', {
  superClass: 'phina.display.Sprite',
  init: function(options) {
    options = ({}).$safe(options, {
      Master      : i18n.CardAngels,
      cardname    : 'card_angel',
      id          : 0,
      layer       : 0,
      isFace      : false,
      canOpen     : false,
      width       : 120,
      height      : 150,
      interactive : true,
    });

    var self = this;

    this.id = options.id;
    this.facename = options.cardname;
    this.openFaceName = 'card_blank';
    this.canOpen = options.canOpen;
    this.isOpen = false;

    //表面あり（canOpen == true）、IDが-1より大きい場合、表面の画像名を指定
    if (this.canOpen == true && this.id > -1) {
      this.openFaceName = options.cardname + '_' + options.Master[this.id].message;
      //表側表示（isFace == true）場合、表示
      if (options.isFace == true && this.canOpen == true && this.id > -1) {
        this.facename = this.openFaceName;
        this.isOpen = true;
      }
    }

    this.Master = options.Master;
    this.layer = options.layer; // 重なり順
    this.isSelecting = false; //画面でポイントしたらtrue
    this.isSelected = false;  //ポイントしたうち選択したらtrue

    this.superInit(this.facename);
    this.setSize(options.width,options.height);
    this.setScale(options.ratio,options.ratio);

    this.setInteractive(options.interactive);

    this.on('pointend',function(e){
      this.isSelecting = true;
    });
  },
  toggleSelected : function(options) {
    toggleSelected({x:options.x,y:options.y,reference:this});
  },
  openFace : function(options) {
    var _face = Sprite(this.openFaceName).setSize(this.width,this.height);

    this.isOpen = true;
    _face.alpha = 0.0;
    _face.addChildTo(this).tweener.fadeIn(1000);
    //表面なしの場合、文字を表示
    if (this.canOpen == false && this.id > -1) {
      LabelArea({ text    :this.getMessage(),
                  width   :this.width*0.9,
                  height  :this.height*0.9,
                  align   : 'left',
                  baseline: 'top',
                  fontSize:8,
                  fontColor:'black',}).addChildTo(_face);
    }
  },
  getMessage : function() {
    return this.Master[this.id].message;
  },
  getMeaning : function() {
    return (CurrentGameData.Language=='EN')?'':this.Master[this.id].meaning;
  },
  getTarget : function() {
    var _ret = this.Master[this.id].Target;
    return (_ret==void 0)?'roller':_ret;
  },
  getTokenAwareness : function() {
    var _ret = this.Master[this.id].TokenAwareness;
    return (_ret==void 0)?0:_ret;
  },
  getTokenPain : function() {
    var _ret = this.Master[this.id].TokenPain;
    return (_ret==void 0)?0:_ret;
  },
  getTokenService : function() {
    var _ret = this.Master[this.id].TokenService;
    return (_ret==void 0)?0:_ret;
  },
  getCardAngel : function() {
    var _ret = this.Master[this.id].CardAngel;
    return (_ret==void 0)?0:_ret;
  },
  getCardInsight : function() {
    var _ret = this.Master[this.id].CardInsight;
    return (_ret==void 0)?0:_ret;
  },
  getCardSetback : function() {
    var _ret = this.Master[this.id].CardSetback;
    return (_ret==void 0)?0:_ret;
  },
  getLevel : function() {
    var _ret = this.Master[this.id].Level;
    return (_ret==void 0)?0:_ret;
  },
  getMove : function() {
    var _ret = this.Master[this.id].Move;
    return (_ret==void 0)?'':_ret;
  },
});

//カードトグル処理
var toggleSelected = function(options) {
    options = ({}).$safe(options, {
      x       : 0,  //選択したときのx増分
      y       : 0,  //選択したときのy増分
      reference : null //参照（実際にはnullでは処理できない。thisなど指定）
    });

    if (options.reference == null) {return null};

    //選択したカードだけちょっとずらして表示したいのでこんな処理にしてる。
    options.reference.isSelected = !options.reference.isSelected;
    options.reference.x = options.reference.x + options.x * (options.reference.isSelected ? 1 : -1);
    options.reference.y = options.reference.y + options.y * (options.reference.isSelected ? 1 : -1);
}

//見た目が一番上のカードを選択する処理
var selectCard = function(options) {
  options = ({}).$safe(options, {
    deck: [],
    selectNumberOfCards:1,
    interActiveButton:null, //必須
    delta_x:0,
    delta_y:0,
  });

  var maxlayer = -1;
  var _selectNumberOfCards = 0;
  //現在何枚選択済かを確認する
  options.deck.children.each(function(child) {
    if (child.isSelected == true) {
      _selectNumberOfCards++
    }
  });
  if (_selectNumberOfCards == options.selectNumberOfCards) {
    //選択したカード数が引くべき数と一致したときのみボタンを有効
    options.interActiveButton.setInteractive(true);
  } else {
    options.interActiveButton.setInteractive(false);
  }

  //各オブジェクトのpointoverを取得すると重なったオブジェクトすべて反応するため
  //selectedしているobjectのうちidの最大を取得
  options.deck.children.each(function(child) {
    if (child.isSelecting == true && maxlayer < child.layer) {
      maxlayer = child.layer;
    }
  }, this);
  if (maxlayer != -1) {
    //一番手前（に見える）カードのみ処理する
    if (_selectNumberOfCards < options.selectNumberOfCards) {
      //選択する枚数以下なら無条件にtoggleSelectedをコール
      options.deck.children[maxlayer].toggleSelected({x:options.delta_x,y:options.delta_y});
    } else if (options.deck.children[maxlayer].isSelected == true) {
      //選択する枚数以上なら選択済みのみtoggleSelectedをコール
      options.deck.children[maxlayer].toggleSelected({x:options.delta_x,y:options.delta_y});
    }
  }
  for (var k = 0;k < options.deck.children.length; k++) {
    //一通り処理を終えたのですべての選択中状態は解除
    options.deck.children[k].isSelecting = false
  }
}

phina.define('TokenAwareness', {
  superClass: 'RectangleShape',
  init: function(options) {
    options = ({}).$safe(options, {
      message: 'Awareness',
      meaning: '',
      x: '100',
      y: '100',
      id          : 0,
      layer       : 0,
      isFace      : false,
      level : 0,
      width: 120,
      height: 180,
      backgroundColor: 'white',
      stroke: 'transparent',
      fill: 'transparent',
      strokeWidth: 0,
      padding: 1,
      alpha : 1.0,
      ratio : 1.0,
    });

    if (options.id < 0) {
      //空白の場合の処理
      options.alpha = 0.7;
    }

    this.superInit(options);

    this.ratio = options.ratio;

    this.Master = TfAp.TokenAwareness[options.level];
    this.id = options.id;

    this.width = options.width * this.ratio;
    this.height = options.height * this.ratio;

    //トークン表示内容定義
    this.displayCard(options);

    //表でも裏でもマークは表示
    var img = Sprite('token_Awareness').setScale(this.ratio,this.ratio).setPosition(0,-45*this.ratio).addChildTo(this);

    this.alpha = options.alpha;

    this.layer = options.layer; // 重なり順
    this.isSelecting = false; //画面でポイントしたらtrue
    this.isSelected = false;  //ポイントしたうち選択したらtrue
    this.isMoving = false;  //動かし始めたらtrue
    this.setInteractive(true);

    this.on('pointend',function(e){
      this.isSelecting = true;
    });

    this.on('pointmove', function(e) {
      this.pter = e.pointer;
      this.isMoving = true;
    });
  },
  toggleSelected : function(options) {
    toggleSelected({x:options.x,y:options.y,reference:this});
  },
  moveSelected : function(options) {
    this.x = this.pter.x + this.pter.dx;
    this.y = this.pter.y + this.pter.dy;
  },
  getMessage : function() {
    return (this.id > -1)?(this.Master[this.id].message):'Awareness';
  },
  getMeaning : function() {
    return (this.id > -1)?((CurrentGameData.Language=='EN')?'':this.Master[this.id].meaning):'';
  },
  displayCard : function(options) {
    if (options.isFace == true && options.id > -1) {
      //表側表示（かつIDが-1より大きい）場合
      var labelTokenMessage = LabelArea({text:this.getMessage(),
                      width   :this.width*this.ratio,
                      height  :40*this.ratio,
                      verticalAlign: '2',
                      align: 'center',
                      baseline: 'middle',
                      fontSize:18*this.ratio,
                      fontColor :'black',
                      fontWeight:'bold',}).setPosition(0,25*this.ratio).addChildTo(this);

      var labelTokenMeaning = LabelArea({text:this.getMeaning(),
                      width   :this.width*this.ratio,
                      height  :40*this.ratio,
                      verticalAlign: '2',
                      align: 'center',
                      baseline: 'middle',
                      fontSize:16*this.ratio,
                      fontColor :'black',
                      fontWeight:'normal',}).setPosition(0,65*this.ratio).addChildTo(this);
    } else {
      //裏側表示（かつIDが-1より大きい）場合
      //options.levelは1,2,…なので-1する。
      this.backgroundColor = ScoreCardColors[options.level];
      this.stroke = 'black';
      this.strokeWidth = 1;
    }
  },
  openFace : function(options) {
    this.isFace = !this.isFace;
    options = ({}).$safe(options, {
      isFace  : this.isFace,
      id      : this.id,
    });
    this.displayCard(options);
    this.fill = 'white';
  },
});

phina.define('TokenService', {
  superClass: 'RectangleShape',
  init: function(options) {
    options = ({}).$safe(options, {
      x: '100',
      y: '100',
      width: 120,
      height: 180,
      backgroundColor: 'white',
      stroke: 'transparent',
      fill: 'transparent',
      strokewidth: 0,
      cards : 0,
      alpha : 1.0,
      ratio : 1.0,
      isBrank : true, //空白の場合に半透明にするならtrue
      isDisplayCards : true,  //カードの枚数を表示するならtrue
    });

    if (options.cards == 0 && options.isBrank == false) {
      //空白の場合の処理
      options.alpha = 0.7;
    }

    this.superInit(options);

    this.ratio = options.ratio;
    this.width = options.width * this.ratio;
    this.height = options.height * this.ratio;

    var img = Sprite('token_Service').setSize(options.width,options.height).setScale(this.ratio,this.ratio).setPosition(0,-30).addChildTo(this);

    var labelTokenMessage = Label({text:'Service',
                    width   :options.width*this.ratio,
                    height  :40*this.ratio,
                    align: 'center',
                    baseline: 'middle',
                    fontSize:18*this.ratio,
                    fontColor :'black',
                    fontWeight:'bold',}).setPosition(0,25*this.ratio).addChildTo(this);

    if (options.isDisplayCards) {
      var labelTokenCards = Label({text:'Card:' + options.cards,
                      width   :options.width*this.ratio,
                      height  :40*this.ratio,
                      align: 'center',
                      baseline: 'middle',
                      fontSize:16*this.ratio,
                      fontColor :'black',
                      fontWeight:'normal',}).setPosition(0,40*this.ratio).addChildTo(this);
    }

    this.alpha = options.alpha;

    this.setInteractive(true);
  },
});

phina.define('FlashCoin', {
  superClass: 'Sprite',
  init: function(options) {
    options = ({}).$safe(options, {
    });
    this.superInit('coin',96,96);
    this.ss = FrameAnimation('coin_ss');
    this.ss.attachTo(this);

    this.isThrowing = false;
    this.isFace = true;

    this.ss.gotoAndStop('start');

    this.setInteractive(true);

  },

  stopCoin: function(options) {
    var self = this;
    self.tweener
    .clear()
    .call(function(){
      self.flare('stoppingCoin');
      self.ss.currentAnimation.frequency = 3;
    })
    .wait(500*Math.randint(0, 10))
    .call(function(){
      self.ss.currentAnimation.frequency = 5;
    })
    .wait(500*Math.randint(0, 10))
    .call(function(){
      self.ss.currentAnimation.frequency = 7;
    })
    .wait(500*Math.randint(0, 10))
    .call(function(){
      if(parseInt(self.ss.currentFrameIndex,10) < (self.ss.currentAnimation.frames.length)/4 || parseInt(self.ss.currentFrameIndex,10) > (self.ss.currentAnimation.frames.length)*3/4) {
        self.ss.gotoAndStop('start');
        self.frameIndex = (self.ss.currentAnimation.frames.length)/2;
        self.isFace = false;
      } else {
        self.ss.gotoAndStop('start');
        self.frameIndex = 0;
        self.isFace = true;
      }
    })
    .wait(1000)
    .call(function(){
      self.flare('resultCoin');
    });
  },
  startCoin: function(options) {
    this.ss.currentAnimation.frequency = 1;
    this.ss.gotoAndPlay('start');
  },
  throwCoin: function(options) {
    if(this.isThrowing == false) {
      this.startCoin();
    } else {
      this.stopCoin();
    }
    this.isThrowing = !this.isThrowing;
    return this.isFace;
  },
});

phina.define('TokenDepression', {
  superClass: 'Sprite',
  init: function(options) {
    options = ({}).$safe(options, {
      layer : -1,
    });
    this.superInit('token_Depression',57,96);

    this.options = options;

    this.PainId = options.PainId;
    this.ScoreCardLevel = options.ScoreCardLevel;
    this.GetTotalThrowDice = options.GetTotalThrowDice;
    this.GetPathSteps = options.GetPathSteps;
    this.PutPainScene = options.PutPainScene;
    this.CardType = options.CardType;
    this.CardId = options.CardId;
    this.ReleaseTotalThrowDice = options.ReleaseTotalThrowDice;
    this.ReleasePathSteps = options.ReleasePathSteps;
    this.UsedTokenAwarenessId = options.UsedTokenAwarenessId;
    this.UserAwareness = options.UserAwareness;

    this.layer = options.layer; // 重なり順
    this.isSelected = false;
    this.isSelecting = false;

    this.setInteractive(true);

    this.on('pointend',function(e){
      this.isSelecting = true;
    });
  },
  toggleSelected : function(options) {
    toggleSelected({x:options.x,y:options.y,reference:this});
  },

});

phina.define('MarkDice', {
  superClass: 'RectangleShape',
  init: function(options) {
    options = ({}).$safe(options, {
        width: 90,
        height: 90,
        backgroundColor: 'transparent',
        stroke: 'black',
        fill: 'white',
        x   :550,
        y   :850,
        strokeWidth: 4,
        cornerRadius: 4,
        ratio : 1,
        diceNumber : 1,
        redEye : 20,
        bigEye : 10,
        smallEye : 8,
    });
    options.width = options.width * options.ratio;
    options.height = options.height * options.ratio;
    this.redEye = options.redEye * options.ratio;
    this.bigEye = options.bigEye * options.ratio;
    this.smallEye = options.smallEye * options.ratio;
    this.orgx = options.x;
    this.orgy = options.y;

    if (options.diceNumber == void 0) options.diceNumber = 1;
    this.diceNumber = options.diceNumber;

    this.superInit(options);

    this.displayDiceNumber = DisplayElement().addChildTo(this);

    this._displayRandomNumber = false;

    this.showDice(options);
    this.setInteractive(true);

    var self = this;
    this.on('pointend', function(e){
      self._displayRandomNumber = !self._displayRandomNumber;
      if (self._displayRandomNumber) {
        self.tweener
          .clear()
          .to({x:400,y:400},400,'swing')
          .call(function(){
            self.flare('rollingdice');
            self.showRandom(options);
          });
      } else {
        self.setInteractive(false);
        self.tweener
          .clear()
          .scaleBy(1,500,'easeOutBounce')
          .to({x:self.orgx,y:self.orgy},400,'swing')
          .scaleBy(-1,500,'default')
          .call(function(){
            self.flare('rolleddice',{diceNumber : self.getDiceNumber()});
          });
      }
    });
  },
  reset : function() {
    var tempChildren = this.displayDiceNumber.children.slice();
    for (var i=0,len=tempChildren.length; i<len; ++i) {
      tempChildren[i].remove();
    }
  },
  showDice : function(options) {
    this.reset();
    switch (options.diceNumber) {
      case 6:
        this.dice6();
        break;
      case 5:
        this.dice5();
        break;
      case 4:
        this.dice4();
        break;
      case 3:
        this.dice3();
        break;
      case 2:
        this.dice2();
        break;
      default:
        this.dice1();
    }
  },
  dice1 : function() {
    var redeye = CircleShape({x:0,y:0,fill:'red',stroke: 'black',radius:this.redEye,}).addChildTo(this.displayDiceNumber);

  },
  dice2 : function() {
    var eye1 = CircleShape({x:-22,y:-22,fill:'black',stroke: 'black',radius:this.bigEye,}).addChildTo(this.displayDiceNumber);
    var eye2 = CircleShape({x: 22,y: 22,fill:'black',stroke: 'black',radius:this.bigEye,}).addChildTo(this.displayDiceNumber);
  },
  dice3 : function() {
    var eye1 = CircleShape({x:-22,y:-22,fill:'black',stroke: 'black',radius:this.bigEye,}).addChildTo(this.displayDiceNumber);
    var eye2 = CircleShape({x:  0,y:  0,fill:'black',stroke: 'black',radius:this.bigEye,}).addChildTo(this.displayDiceNumber);
    var eye3 = CircleShape({x: 22,y: 22,fill:'black',stroke: 'black',radius:this.bigEye,}).addChildTo(this.displayDiceNumber);
  },
  dice4 : function() {
    var eye1 = CircleShape({x:-22,y:-22,fill:'black',stroke: 'black',radius:this.bigEye,}).addChildTo(this.displayDiceNumber);
    var eye2 = CircleShape({x: 22,y:-22,fill:'black',stroke: 'black',radius:this.bigEye,}).addChildTo(this.displayDiceNumber);
    var eye3 = CircleShape({x:-22,y: 22,fill:'black',stroke: 'black',radius:this.bigEye,}).addChildTo(this.displayDiceNumber);
    var eye4 = CircleShape({x: 22,y: 22,fill:'black',stroke: 'black',radius:this.bigEye,}).addChildTo(this.displayDiceNumber);
  },
  dice5 : function() {
    var eye1 = CircleShape({x:-22,y:-22,fill:'black',stroke: 'black',radius:this.smallEye,}).addChildTo(this.displayDiceNumber);
    var eye2 = CircleShape({x: 22,y:-22,fill:'black',stroke: 'black',radius:this.smallEye,}).addChildTo(this.displayDiceNumber);
    var eye3 = CircleShape({x:-22,y: 22,fill:'black',stroke: 'black',radius:this.smallEye,}).addChildTo(this.displayDiceNumber);
    var eye4 = CircleShape({x: 22,y: 22,fill:'black',stroke: 'black',radius:this.smallEye,}).addChildTo(this.displayDiceNumber);
    var eye5 = CircleShape({x:  0,y:  0,fill:'black',stroke: 'black',radius:this.smallEye,}).addChildTo(this.displayDiceNumber);
  },
  dice6 : function() {
    var eye1 = CircleShape({x:-22,y:-22,fill:'black',stroke: 'black',radius:this.smallEye,}).addChildTo(this.displayDiceNumber);
    var eye2 = CircleShape({x: 22,y:-22,fill:'black',stroke: 'black',radius:this.smallEye,}).addChildTo(this.displayDiceNumber);
    var eye3 = CircleShape({x:-22,y: 22,fill:'black',stroke: 'black',radius:this.smallEye,}).addChildTo(this.displayDiceNumber);
    var eye4 = CircleShape({x: 22,y: 22,fill:'black',stroke: 'black',radius:this.smallEye,}).addChildTo(this.displayDiceNumber);
    var eye5 = CircleShape({x:-22,y:  0,fill:'black',stroke: 'black',radius:this.smallEye,}).addChildTo(this.displayDiceNumber);
    var eye6 = CircleShape({x: 22,y:  0,fill:'black',stroke: 'black',radius:this.smallEye,}).addChildTo(this.displayDiceNumber);
  },
  update:function(){
    if (this._displayRandomNumber) {
      this.diceNumber = Math.randint(1, 6);
      this.showDice({diceNumber:this.diceNumber});
    }
  },
  showRandom:function(){
    this.flare('update');
  },
  getRandom:function(){
    return this._numberDice;
  },
  getDiceNumber:function(){
    return this.diceNumber;
  },
});


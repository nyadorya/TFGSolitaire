phina.globalize();

//スクエア移動
phina.define('MoveSquereSceneSequence' , {
  superClass: 'ManagerScene' ,
  init: function(options) {
    options = ({}).$safe(options, {
      cbname : '',
      conditions : 'ALL',
    });
    this.superInit({
      scenes: [
        {
          label: 'MoveSquere',
          className: 'MoveSquereScene',
          arguments: {conditions:options.conditions,},
        },
      ],
    });
    this.on('finish',function(options) {
      CurrentGameData.Scene = 'MainBoard';
      TfAp.saveGameData();
      this.app.replaceScene(MainBoardScene());
    });
  },
});

phina.define('MoveSquereScene', {
  superClass: 'DisplayScene',
  init: function(options) {
    options = ({}).$safe(options, {
    });
    this.superInit(options);
    this.backgroundColor = appBackGroundColor;

    var self = this;
    var _cbname = TfAp.doneFlareName();

    var _msg = i18n.SelectSquereMessage;
    _msg = _msg.replace(/α/g,options.conditions=='ALL'?i18n.ExceptTransformation:options.conditions);

    //演出のために全オブジェクトをまとめる
    this._DisplayObjects = DisplayElement().addChildTo(this);

    //マップを表示
    this.pathMap = PathMap({ratio:1.2,x:320,y:500,}).addChildTo(this._DisplayObjects);

    var _btnName = i18n.ButtonEndOfSelect;
    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[_msg,],
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
      var _nextSteps = CurrentGameData.PathSteps + self.pathMap.selectedSquereAddSteps;
      while (_nextSteps < 0) {
       _nextSteps =_nextSteps + Squares.length;
      }
      while (_nextSteps > (Squares.length-1)) {
       _nextSteps =_nextSteps - Squares.length;
      }

      _msg = i18n.ConfirmMoveSquere;
      _msg = _msg.replace(/α/g,Squares[_nextSteps%Squares.length].mark);

      self.StartMessage.ButtonA.text = '';
      self.StartMessage.resetText({texts:[_msg]});
      self.StartMessage.ButtonA.hide().setInteractive(false);
      self.OKButton.show().setInteractive(true);
      self.NGButton.show().setInteractive(true);
    });

    this.OKButton.on('push', function(e) {
      var _nextSteps = CurrentGameData.PathSteps + self.pathMap.selectedSquereAddSteps;
      while (_nextSteps < 0) {
       _nextSteps =_nextSteps + Squares.length;
      }
      while (_nextSteps > (Squares.length-1)) {
       _nextSteps =_nextSteps - Squares.length;
      }
      switch (options.conditions) {
        case 'ALL':
          if ((Squares[_nextSteps%Squares.length].mark).toLowerCase() == 'transformation') {
            self.reselectSquere({nextSteps:_nextSteps,conditions:options.conditions});
          } else {
            self.nextScene({nextSteps:_nextSteps});
          }
          break;
        default:
          if ((Squares[_nextSteps%Squares.length].mark).toLowerCase() == (options.conditions).toLowerCase()) {
            self.nextScene({nextSteps:_nextSteps});
          } else {
            self.reselectSquere({nextSteps:_nextSteps,conditions:options.conditions});
          }
      }
    });

    this.NGButton.on('push', function(e) {
      var _nextSteps = CurrentGameData.PathSteps + self.pathMap.selectedSquereAddSteps;
      self.reselectSquere({nextSteps:_nextSteps,conditions:options.conditions});
    });

  },
  nextScene : function(options) {
    CurrentGameData.PathSteps = options.nextSteps;
    this.StartMessage.resetText({texts:[i18n.ButtonMoveSquere]});
    this._DisplayObjects.tweener
      .fadeOut(2000)
      .wait(1000)
      .call(function(){
        app.replaceScene(TfAp.SquereSceneSequence(Squares[options.nextSteps%Squares.length].mark));

      });
  },
  reselectSquere : function(options) {
    _msg = i18n.SelectMoveSquere;
    _msg = _msg.replace(/α/g,Squares[options.nextSteps%Squares.length].mark)
              .replace(/γ/g,options.conditions);
    this.StartMessage.ButtonA.text = i18n.ButtonEndOfSelect;
    this.StartMessage.resetText({texts:[_msg]});
    this.StartMessage.ButtonA.show().setInteractive(true);
    this.OKButton.hide().setInteractive(false);
    this.NGButton.hide().setInteractive(false);
  },
});


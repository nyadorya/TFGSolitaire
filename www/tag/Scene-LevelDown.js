phina.globalize();

phina.define('LevelDownSceneSequence' , {
  superClass: 'ManagerScene' ,
  init: function(options) {
    options = ({}).$safe(options, {
      cbname : '',
      isExit : false,
    });

    this.superInit({
      scenes: [
        {
          label: 'AmimateBigDepression',
          className: 'AmimateBigDepressionScene',
          nextLabel: 'LevelDownMessage',
        },
        {
          label: 'LevelDownMessage',
          className: 'LevelDownMessageScene',
        },
      ],
    });
    this.on('finish',function() {
      var _Level = CurrentGameData.ScoreCardLevel;

      //トークン失う
      TfAp.TokenAwareness[_Level] = [];
      CurrentGameData.Service[_Level] = 0;

      //レベルダウン（物理レベル以外）
      if (_Level > 0) {
        CurrentGameData.ScoreCardLevel = CurrentGameData.ScoreCardLevel - 1;
        var _log = i18n.LogLevelDown + ScoreCardNames[_Level] + i18n.From + ScoreCardNames[_Level-1];
        TfAp.WriteGameLog(_log);
      }

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

//なみだ大のアニメーションシーン
phina.define('AmimateBigDepressionScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    options = ({}).$safe(options, {
    });

    this.superInit(options);
    this.backgroundColor = 'rgba(0, 0, 0, 0.5)';

    var self = this;

    var _tokens = DisplayElement().addChildTo(this);
    var _Token = [];

    _Token.push(TokenDepression().setPosition(320,0).setScale(4,4));
    _Token[0].addChildTo(_tokens);
    _Token[0].tweener.by({
      y:320,
    },1000,"swing");

    this.on('pointend',function(){
      _tokens.tweener.by({y:1000},600,"swing").call(function(){
        self.app.flare(self.cbname);
        self.app.popScene();
      });
    });
  },
});

//レベルダウンのメッセージ
phina.define('LevelDownMessageScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();

    this.backgroundColor = appBackGroundColor;

    var _Level = CurrentGameData.ScoreCardLevel;

    var _message = '';
    if (_Level == 0){
      _message = i18n.LevelNoDown;
      _message = _message
            .replace(/α/g,ScoreCardNames[_Level]);
    } else {
      _message = i18n.LevelDown;
      _message = _message
            .replace(/α/g,ScoreCardNames[_Level])
            .replace(/γ/g,ScoreCardNames[_Level-1]);
    }
    _message = _message + i18n.LevelDownMessage;

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
    _btnGO.on('push', function(e) {
      self.exit();
    });
  },
});

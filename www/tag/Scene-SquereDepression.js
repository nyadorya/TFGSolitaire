phina.globalize();

//落ち込みスクエア
phina.define('SquereDepressionSceneSequence' , {
  superClass: 'ManagerScene' ,
  SquereMark  : 'Depression',
  SquereMeaning : i18n.SquereDepression,
  init: function() {
    this.superInit({
      scenes: [
        {
          label: 'SquereDepression',
          className: 'SquereDepressionScene',
          nextLabel: 'AmimateDepression',
        },
        {
          label: 'AmimateDepression',
          className: 'AmimateDepressionScene',
          nextLabel: 'CloseDepression',
          arguments: {numberOfDepressionTokens:4,}
        },
        {
          label: 'CloseDepression',
          className: 'CloseDepressionScene',
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

phina.define('SquereDepressionScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      SquereMark  : 'Depression',
      SquereMeaning : i18n.SquereDepression,
    };
    this.superInit(options);
    var self = this;
    var _cbname = TfAp.doneFlareName();

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.SquereDepressionStartMessage,],
                          x           :320,
                          y           :450,
                          width       :600,
                          height      :600,
                          buttonAName :i18n.ButtonNext,
                                           }).addChildTo(this);

    this.StartMessage.visible = true;
    this.StartMessage.ButtonA.setInteractive(true);
    this.StartMessage.ButtonA.on('push', function(e) {
      document.getElementById("overlay").style.display='block';
      TfAp.OverLayMessage = i18n.SquereDepressionOverLayMessage;
      TfAp.OverLayPlaceHolder = i18n.SquereDepressionOverLayPlaceHolder;
      TfAp.OverLayCancel = false;

      app.pushScene(InputScene({cbname:_cbname}));

      app.on(_cbname, function(e) {
        self.beforeInput = TfAp.OverLayInput;
        self.exit('AmimateDepression',{PutPainScene:TfAp.OverLayInput,numberOfDepressionTokens:4});
      });


    });
  },
});

phina.define('CloseDepressionScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      SquereMark  : 'Depression',
      SquereMeaning : i18n.SquereDepression,
    };
    this.superInit(options);
    var self = this;

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.SquereDepressionEndMessage,],
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


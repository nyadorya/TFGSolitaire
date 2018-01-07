phina.globalize();

//開発シーンを記載
//エンジェルスクエア
phina.define('SquereAngelSceneSequence' , {
  superClass: 'ManagerScene' ,
  SquereMark  : 'Angel',
  SquereMeaning : i18n.SquereAngel,
  init: function() {
    this.superInit({
      scenes: [
        {
          label: 'SquereAngel',
          className: 'SquereAngelScene',
          nextLabel: 'SelectAngel',
        },
        {
          label: 'SelectAngel',
          className: 'SelectCardScene',
          nextLabel: 'CloseAngel',
          arguments: {selectNumberOfCards:2,selectCard:'Angel',}
        },
        {
          label: 'CloseAngel',
          className: 'CloseAngelScene',
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

phina.define('SquereAngelScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      SquereMark  : 'Angel',
      SquereMeaning : 'エンジェル',
    };
    this.superInit(options);
    var self = this;

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.SquereAngelStartMessage,],
                          x           :320,
                          y           :450,
                          width       :600,
                          height      :600,
                          buttonAName :i18n.ButtonNext,
                                           }).addChildTo(this);

    this.StartMessage.visible = true;
    this.StartMessage.ButtonA.setInteractive(true);
    this.StartMessage.ButtonA.on('push', function(e) {
      self.exit('SelectAngel');
    });
  },
});

phina.define('CloseAngelScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      SquereMark  : 'Angel',
      SquereMeaning : i18n.SquereAngel,
    };
    this.superInit(options);
    var self = this;

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.SquereAngelEndMessage,],
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


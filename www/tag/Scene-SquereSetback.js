phina.globalize();

//セットバックスクエア
phina.define('SquereSetbackSceneSequence' , {
  superClass: 'ManagerScene' ,
  SquereMark  : 'Setback',
  SquereMeaning : i18n.SquereSetback,
  init: function() {
    this.superInit({
      scenes: [
        {
          label: 'SquereSetback',
          className: 'SquereSetbackScene',
          nextLabel: 'SelectSetback',
        },
        {
          label: 'SelectSetback',
          className: 'SelectCardScene',
          nextLabel: 'CloseSetback',
          arguments: {selectNumberOfCards:1,selectCard:'Setback',}
        },
        {
          label: 'CloseSetback',
          className: 'CloseSetbackScene',
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

phina.define('SquereSetbackScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      SquereMark  : 'Setback',
      SquereMeaning : i18n.SquereSetback,
    };
    this.superInit(options);
    var self = this;

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.SquereSetbackStartMessage,],
                          x           :320,
                          y           :450,
                          width       :600,
                          height      :600,
                          buttonAName :i18n.ButtonNext,
                                           }).addChildTo(this);

    this.StartMessage.visible = true;
    this.StartMessage.ButtonA.setInteractive(true);
    this.StartMessage.ButtonA.on('push', function(e) {
      self.exit('SelectSetback');
    });
  },
});

phina.define('CloseSetbackScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      SquereMark  : 'Setback',
      SquereMeaning : i18n.SquereSetback,
    };
    this.superInit(options);
    var self = this;

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.SquereSetbackEndMessage,],
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


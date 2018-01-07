phina.globalize();

//インサイトスクエア
phina.define('SquereInsightSceneSequence' , {
  superClass: 'ManagerScene' ,
  SquereMark  : 'Insight',
  SquereMeaning : i18n.SquereInsight,
  init: function() {
    this.superInit({
      scenes: [
        {
          label: 'SquereInsight',
          className: 'SquereInsightScene',
          nextLabel: 'SelectInsight',
        },
        {
          label: 'SelectInsight',
          className: 'SelectCardScene',
          nextLabel: 'CloseInsight',
          arguments: {selectNumberOfCards:1,selectCard:'Insight',}
        },
        {
          label: 'CloseInsight',
          className: 'CloseInsightScene',
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

phina.define('SquereInsightScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      SquereMark  : 'Insight',
      SquereMeaning : i18n.SquereInsight,
    };
    this.superInit(options);
    var self = this;

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.SquereInsightStartMessage,],
                          x           :320,
                          y           :450,
                          width       :600,
                          height      :600,
                          buttonAName :i18n.ButtonNext,
                                           }).addChildTo(this);

    this.StartMessage.visible = true;
    this.StartMessage.ButtonA.setInteractive(true);
    this.StartMessage.ButtonA.on('push', function(e) {
      self.exit('SelectInsight');
    });
  },
});

phina.define('CloseInsightScene', {
  superClass: 'SquereScene',
  init: function() {
    var options ={
      SquereMark  : 'Insight',
      SquereMeaning : i18n.SquereInsight,
    };
    this.superInit(options);
    var self = this;

    //スクエアイベント開始メッセージウインドウ
    this.StartMessage = MessageWindow({
                          texts       :[i18n.SquereInsightEndMessage,],
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


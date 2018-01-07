//ゲーム内共有の定義(メインボード限定はphina-dataへ)
TfAp.OverLayMessage = '';  //メッセージ
TfAp.OverLayPlaceHolder = '';  //プレイスホルダ
TfAp.OverLayInput = '';  //入力結果
TfAp.OverLayCancel = false;  //オーバレイ終了

TfAp.SelectedOptId = -1; //SelectOptionScene(選択肢選択)の結果

var isSaveGame = true; //ゲーム保存  //とりあえず=false

//予約定義（グローバル禁止）
//causeEvents：各カードを引いた後のイベントを定義（各カードのクラスごとに定義する。）
//例：[{Event:'Awareness',selectNumberOfCards : 1}]


//global変数定義
var CurrentGameData = {
  UserName : '',  //Partition Key)ユーザ名 from AWSCognito
  StartTime : 0,  //Sort Key)いつ始めたか(Date.getTime())
  LastSave : 0,  //最後のセーブ(Date.getTime())
  CloseTime : 0,  //終了時刻（Date.getTime()）
//  Language : '',
  Language : 'JP',  //とりあえず
  Scene : 'MainBoard', //スクエアの値を書き込む。
  PlayingFocus : '',
  PlayingKeyWords : [],
  PlayNotes : [],
  PlayLogs : [],
  DeckAngel : [],
  DeckInsight : [],
  DeckSetback : [],
  UnconsciousAngel : [],
  UnconsciousInsight : [],
  UnconsciousSetback : [],
  GuardianAngel: [],
  ScoreCardLevel: 0,
  PathSteps : 0,
  LastDiceNumber: 1,
  Pains: [],
  TotalThrowDice: 0,
  Direction : 1,  //1:右回り,-1:左回り
  Service : [],
  Awareness : [],  //選んだトークン
  Angel : [],
  Setback : [],
  TransformSetback : [],
  TransformInsight : [],
  TransformFeedback : [],
  TransformPain : [],
  InboxAwareness : [], //ハコのトークン（＝選ばれてないトークン）
};
//スコアカードの定義について
//  Service : [[lv1],[lv2],[lv3],[lv4],],
//  Awareness : [[lv1],[lv2],[lv3],[lv4],],
//  Angel : [[lv1],[lv2],[lv3],[lv4],],
//  Setback : [[lv1],[lv2],[lv3],[lv4],],
//  TransformSetback : [[lv1],[lv2],[lv3],[lv4],],
//  TransformInsight : [[lv1],[lv2],[lv3],[lv4],],
//  TransformFeedback : [[lv1],[lv2],[lv3],[lv4],],
//  TransformPain : [[lv1],[lv2],[lv3],[lv4],],
//  InboxAwareness : [[lv1],[lv2],[lv3],[lv4],],
//Pains
//PainId:（登録時の日時）(new Date()).getTime().toString()
//ScoreCardLevel:1,（登録時のCurrentGameData.ScoreCardLevel、0～）
//GetTotalThrowDice:4,（登録時のCurrentGameData.TotalThrowDice）
//GetPathSteps:6,（登録時のCurrentGameData.PathSteps）
//PutPainScene 'Depression', //どの状況で（Depression,Dice,…）
//CardType:'Setback'（登録時のカード。基本Setback）,
//CardId : 54,（登録時のCardTypeのID。スクエアの場合は0）
//ReleaseTotalThrowDice:4,（解放時のCurrentGameData.TotalThrowDice）
//ReleasePathSteps:7,（解放時のCurrentGameData.PathSteps）
//UsedTokenAwarenessId: 10,（解放時に利用した気づきのトークンのID）
//UserAwareness: 'こんな雑でもOK',（解放時にユーザが作文した内容）

TfAp.SetLanguage = function (lang) {
    _lang = lang||CurrentGameData.Language;
    switch (_lang) {
      case 'JP':
        TfAp.setMessagesJP();
        break;
      default :
        TfAp.setMessagesEN();
     }
    TfAp.ArrayAssets();
}

//ログなどに利用
TfAp.FormatDate = function(_dt) {
  return (new Date(_dt)).format("yyyy/MM/dd HH:mm:ss");
}

//FlareName
TfAp.doneFlareName = function() {
  return 'tfgFlare' + (new Date()).format("yyyyMMddHHmmss") + Math.randint(0, 99);
}

//ログを書き込む処理
TfAp.WriteGameLog = function(log) {
  var d = new Date();

  _log = log + ' (' + TfAp.FormatDate(d.getTime()) +')'

  //代入
  CurrentGameData.PlayLogs.unshift(_log);
  //ログタブを改めてマウントして代入したログ一覧を表示する。
  riot.mount('app-log');
}

//DynamoDB登録
TfAp.saveGameData = function(isSav) {
  var _isSav = isSav||isSaveGame;
  if (_isSav) {
    return new Promise(function(resolve,reject) {
        var dynamodb = new AWS.DynamoDB({dynamoDbCrc32: false,apiVersion: '2012-08-10'});

        var _CurrentGameData = {};

        var convStringList = function(array,prifix){
          var _tmpData = [];
          if (array == void 0) {return null;}

          _tmpData = [];
          for (var _arrayId in array) {
            //array[_arrayId] != ''だと値0のときにもスキップする（なんで？）
            if (array[_arrayId].toString() != '') {
              if (prifix == 'N') {
                _tmpData.push({N : array[_arrayId].toString()})
              } else {
                _tmpData.push({S : array[_arrayId]})
              }
            }
          }
          return {L : _tmpData};
        };

        var convStringListInLevel = function(array,prifix){
          var _tmpData = [];
          if (array == void 0) {return null;}

          _tmpData = [];
          for (var _arrayId in array) {
            if (array[_arrayId] == void 0) return;
            //array[_arrayId] != ''だと値0のときにもスキップする（なんで？）
            if (array[_arrayId].toString() != '') {
              switch (prifix) {
                case 'S':
                  _tmpData.push({N : array[_arrayId].toString()});
                  break;
                case 'P':
                  _tmpData.push(convPain(array[_arrayId]));
                  break;
                default:
                  _tmpData.push(convStringList(array[_arrayId],'N'));
              }
            }
          }
          return {L : _tmpData};
        };

        var convPain = function(array){

          var _tmpPains = [];

          if (array == void 0) {return null;}

          for (var _array of array) {
            var _tmpPain = {};

            _tmpPain.PainId = {N : _array.PainId.toString()};
            _tmpPain.ScoreCardLevel = {N : _array.ScoreCardLevel.toString()};
            _tmpPain.GetTotalThrowDice = {N : _array.GetTotalThrowDice.toString()};
            _tmpPain.GetPathSteps = {N : _array.GetPathSteps.toString()};
            _tmpPain.PutPainScene = {S : _array.PutPainScene};
            _tmpPain.CardType = {S : _array.CardType};
            _tmpPain.CardId = {N : _array.CardId.toString()};

            if (_array.ReleaseTotalThrowDice == void 0) {
              //登録なし
            } else {
              _tmpPain.ReleaseTotalThrowDice = {N : _array.ReleaseTotalThrowDice.toString()};
              _tmpPain.ReleasePathSteps = {N : _array.ReleasePathSteps.toString()};
              _tmpPain.UsedTokenAwarenessId = {N : _array.UsedTokenAwarenessId.toString()};
              _tmpPain.UserAwareness = {S : _array.UserAwareness};
            }

            _tmpPains.push({M : _tmpPain});
          }

          return {L : _tmpPains};
        };

        //JSON形式からDynamoDB形式へ
        //属性つけるのと、null対策
        //dynamodbMarshalerを使うと期待とは違う型になることがあるため使わない。
        _CurrentGameData.UserName = {S : CurrentGameData.UserName};
        _CurrentGameData.StartTime = {N : CurrentGameData.StartTime.toString()};
        _CurrentGameData.LastSave = {N : (new Date()).getTime().toString()};
        _CurrentGameData.CloseTime = {N : CurrentGameData.CloseTime.toString()};
        _CurrentGameData.Language = {S : CurrentGameData.Language};
        _CurrentGameData.Scene = {S : CurrentGameData.Scene};

        if (CurrentGameData.PlayingFocus != '') {
          _CurrentGameData.PlayingFocus = {S : CurrentGameData.PlayingFocus};
        }

        _CurrentGameData.PlayingKeyWords   = convStringList(CurrentGameData.PlayingKeyWords   ,'S');
        _CurrentGameData.PlayNotes         = convStringList(CurrentGameData.PlayNotes         ,'S');
        _CurrentGameData.PlayLogs          = convStringList(CurrentGameData.PlayLogs          ,'S');
        _CurrentGameData.DeckAngel         = convStringList(CurrentGameData.DeckAngel         ,'N');
        _CurrentGameData.UnconsciousAngel  = convStringList(CurrentGameData.UnconsciousAngel  ,'N');
        _CurrentGameData.DeckInsight       = convStringList(CurrentGameData.DeckInsight       ,'N');
        _CurrentGameData.UnconsciousInsight= convStringList(CurrentGameData.UnconsciousInsight,'N');
        _CurrentGameData.DeckSetback       = convStringList(CurrentGameData.DeckSetback       ,'N');
        _CurrentGameData.UnconsciousSetback= convStringList(CurrentGameData.UnconsciousSetback,'N');
        _CurrentGameData.GuardianAngel     = convStringList(CurrentGameData.GuardianAngel,     'N');
        _CurrentGameData.ScoreCardLevel = {N : CurrentGameData.ScoreCardLevel.toString()};
        _CurrentGameData.PathSteps = {N : CurrentGameData.PathSteps.toString()};
        _CurrentGameData.LastDiceNumber = {N : CurrentGameData.LastDiceNumber.toString()};
        _CurrentGameData.Pains = convPain(CurrentGameData.Pains);
        _CurrentGameData.TotalThrowDice = {N : CurrentGameData.TotalThrowDice.toString()};
        _CurrentGameData.Direction = {N : CurrentGameData.Direction.toString()};

        _CurrentGameData.Service = convStringListInLevel(CurrentGameData.Service,'S');
        _CurrentGameData.Awareness  = convStringListInLevel(CurrentGameData.Awareness,'N');
        _CurrentGameData.Angel      = convStringListInLevel(CurrentGameData.Angel,'N');
        _CurrentGameData.Setback    = convStringListInLevel(CurrentGameData.Setback,'N');
        _CurrentGameData.TransformSetback = convStringListInLevel(CurrentGameData.TransformSetback,'N');
        _CurrentGameData.TransformInsight = convStringListInLevel(CurrentGameData.TransformInsight,'N');
        _CurrentGameData.TransformFeedback = convStringListInLevel(CurrentGameData.TransformFeedback,'N');
        _CurrentGameData.TransformPain = convStringListInLevel(CurrentGameData.TransformPain,'P');
        _CurrentGameData.InboxAwareness  = convStringListInLevel(CurrentGameData.InboxAwareness,'N');

        var params = {
          Item : _CurrentGameData,
          TableName: 'TFGPlayData'
        };

        dynamodb.putItem(params,function(err,data){
          if (err) {
            console.log(err, err.stack); // an error occurred
            return;
          } else {
            //console.log(data);           // successful response
          }
        })
    });
  }
}

//DynamoDBLoad on Promise
TfAp.loadGameData = function(paramUserName) {
  return new Promise(function(resolve,reject) {
    var dynamodb = new AWS.DynamoDB({dynamoDbCrc32: false,apiVersion: '2012-08-10'});

    var _tmpData = [];


    var params = {
      ExpressionAttributeValues: {
       ":uname": {S: paramUserName},
       ":ust": {N: '-1'},
      },
      KeyConditionExpression: "UserName = :uname AND StartTime > :ust",
      ScanIndexForward : false,
      Limit: 3,
      TableName: 'TFGPlayData',
    };

    dynamodb.query(params,function(err,data){
      //callback
      if (err) {
        console.log(err, err.stack); // an error occurred
        reject(err);
        return;
      } else {
        var _gameDatas = [];
        //レコードでループ
        for (_dt in data.Items) {
          _gameDatas[_dt] = JSON.parse(dynamodbMarshaler.unmarshalJson(data.Items[_dt]));
          //JSON形式に変換したレコード
          //console.log(_gameDatas[_dt]);
        }
        //JSONの配列
        //console.log(_gameDatas);

        //ソート
        _gameDatas.sort(function(val1,val2){
          //sort by LastSave(integer) desc
          return ( val1.LastSave < val2.LastSave ? 1 : -1);
        });
        resolve(_gameDatas);
      }
    });
  });
}


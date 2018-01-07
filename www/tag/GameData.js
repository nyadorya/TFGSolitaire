//phina.globalize();

//アセット定義
TfAp.ASSETS = {
  width:640,
  height:960,
  image: {
    'mark_Angel'         : './img/mark_angel.png',
    'mark_Appreciation'  : './img/mark_appreciation.png',
    'mark_Blessing'      : './img/mark_blessing.png',
    'mark_Depression'    : './img/mark_depression.png',
    'mark_Flash'         : './img/mark_flash.png',
    'mark_Freewill'      : './img/mark_freewill.png',
    'mark_Insight'       : './img/mark_insight.png',
    'mark_Miracle'       : './img/mark_miracle.png',
    'mark_Service'       : './img/mark_service.png',
    'mark_Setback'       : './img/mark_setback.png',
    'mark_Transformation': './img/mark_transformation.png',
    'envelope'           : './img/envelope.png',
    'token_Angel'        : './img/token_angel.png',
    'token_Awareness'    : './img/token_awareness.png',
    'token_Service'      : './img/token_service.png',
    'token_Depression'   : './img/token_depression.png',
    'card_angel_Delight'         : './img/angel01.png',
    'card_angel_Responsibility'  : './img/angel02.png',
    'card_angel_Simplicity'      : './img/angel03.png',
    'card_angel_Willingness'     : './img/angel04.png',
    'card_angel_Acceptance'      : './img/angel05.png',
    'card_angel_Enthusiasm'      : './img/angel06.png',
    'card_angel_Expectancy'      : './img/angel07.png',
    'card_angel_Faith'           : './img/angel08.png',
    'card_angel_Flexiibility'    : './img/angel09.png',
    'card_angel_Patience'        : './img/angel10.png',
    'card_angel_Peace'           : './img/angel11.png',
    'card_angel_Play'            : './img/angel12.png',
    'card_angel_Power'           : './img/angel13.png',
    'card_angel_Purification'    : './img/angel14.png',
    'card_angel_Purpose'         : './img/angel15.png',
    'card_angel_Releace'         : './img/angel16.png',
    'card_angel_Exploration'     : './img/angel17.png',
    'card_angel_Respect'         : './img/angel18.png',
    'card_angel_Kindness'        : './img/angel19.png',
    'card_angel_Commitment'      : './img/angel20.png',
    'card_angel_Intention'       : './img/angel21.png',
    'card_angel_Risk'            : './img/angel22.png',
    'card_angel_Support'         : './img/angel23.png',
    'card_angel_Honesty'         : './img/angel24.png',
    'card_angel_Humour'          : './img/angel25.png',
    'card_angel_Inspiration'     : './img/angel26.png',
    'card_angel_Integrity'       : './img/angel27.png',
    'card_angel_Joy'             : './img/angel28.png',
    'card_angel_Light'           : './img/angel29.png',
    'card_angel_Love'            : './img/angel30.png',
    'card_angel_Obedience'       : './img/angel31.png',
    'card_angel_Tenderness'      : './img/angel32.png',
    'card_angel_Transformation'  : './img/angel33.png',
    'card_angel_Trust'           : './img/angel34.png',
    'card_angel_Truth'           : './img/angel35.png',
    'card_angel_Understsnding'   : './img/angel36.png',
    'card_angel_Efficiency'      : './img/angel37.png',
    'card_angel_Openness'        : './img/angel38.png',
    'card_angel_Abundance'       : './img/angel39.png',
    'card_angel_Adventure'       : './img/angel40.png',
    'card_angel_Balance'         : './img/angel41.png',
    'card_angel_Depth'           : './img/angel42.png',
    'card_angel_Presence'        : './img/angel43.png',
    'card_angel_Vison'           : './img/angel44.png',
    'card_angel_Authenticity'    : './img/angel45.png',
    'card_angel_Beauty'          : './img/angel46.png',
    'card_angel_Birth'           : './img/angel47.png',
    'card_angel_Sis/Brofood'     : './img/angel48.png',
    'card_angel_Clarity'         : './img/angel49.png',
    'card_angel_Communication'   : './img/angel50.png',
    'card_angel_Compassion'      : './img/angel51.png',
    'card_angel_Courage'         : './img/angel52.png',
    'card_angel_Creativity'      : './img/angel53.png',
    'card_angel_Education'       : './img/angel54.png',
    'card_angel_Forgiveness'     : './img/angel55.png',
    'card_angel_Freedom'         : './img/angel56.png',
    'card_angel_Grace'           : './img/angel57.png',
    'card_angel_Gratitude'       : './img/angel58.png',
    'card_angel_Harmony'         : './img/angel59.png',
    'card_angel_Healing'         : './img/angel60.png',
    'card_angel_Discernment'     : './img/angel61.png',
    'card_angel_Relaxation'      : './img/angel62.png',
    'card_angel_Wisdom'          : './img/angel63.png',
    'card_angel_Awakening'       : './img/angel64.png',
    'card_angel_Spontaneity'     : './img/angel65.png',
    'card_angel_Strength'        : './img/angel66.png',
    'card_angel_Surrender'       : './img/angel67.png',
    'card_angel_Synthesis'       : './img/angel68.png',
    'card_angel_Expansiveness'   : './img/angel69.png',
    'card_angel_Resilience'      : './img/angel70.png',
    'card_angel_Contentment'     : './img/angel71.png',
    'card_angel_Celebration'     : './img/angel72.png',
    'card_angel'            : './img/angel00.png',
    'card_insight'          : './img/card_insight.png',
    'card_setback'          : './img/card_setback.png',
    'card_universalfeedback': './img/card_universalfeedback.png',
    'card_blank'            : './img/card_blank.png',
    'coin'                  : './img/coin.png',
    'arrow'                 : './img/arrow.png',
  },
  spritesheet:  {
    'coin_ss' : './img/coin.json',
  },
};

//スクエア定義
//id,mark,x,y,rotation
var Squares = [
{id: '0', mark: 'Angel', x: '0', y: '-180', rotation: '0' },
{id: '1', mark: 'Flash', x: '15', y: '-155', rotation: '-20' },
{id: '2', mark: 'Insight', x: '30', y: '-130', rotation: '-20' },
{id: '3', mark: 'Blessing', x: '40', y: '-105', rotation: '-20' },
{id: '4', mark: 'Freewill', x: '45', y: '-80', rotation: '-10' },
{id: '5', mark: 'Miracle', x: '50', y: '-55', rotation: '0' },
{id: '6', mark: 'Insight', x: '55', y: '-30', rotation: '0' },
{id: '7', mark: 'Angel', x: '50', y: '40', rotation: '5' },
{id: '8', mark: 'Setback', x: '45', y: '65', rotation: '10' },
{id: '9', mark: 'Depression', x: '35', y: '90', rotation: '30' },
{id: '10', mark: 'Appreciation', x: '18', y: '110', rotation: '40' },
{id: '11', mark: 'Insight', x: '-2', y: '125', rotation: '45' },
{id: '12', mark: 'Setback', x: '-25', y: '140', rotation: '-20' },
{id: '13', mark: 'Flash', x: '-50', y: '150', rotation: '75' },
{id: '14', mark: 'Blessing', x: '-75', y: '155', rotation: '78' },
{id: '15', mark: 'Angel', x: '-100', y: '160', rotation: '-10' },
{id: '16', mark: 'Insight', x: '-125', y: '165', rotation: '-5' },
{id: '17', mark: 'Service', x: '-150', y: '165', rotation: '0' },
{id: '18', mark: 'Flash', x: '-175', y: '155', rotation: '10' },
{id: '19', mark: 'Freewill', x: '-200', y: '145', rotation: '20' },
{id: '20', mark: 'Miracle', x: '-227', y: '135', rotation: '35' },
{id: '21', mark: 'Blessing', x: '-250', y: '110', rotation: '40' },
{id: '22', mark: 'Flash', x: '-270', y: '90', rotation: '-45' },
{id: '23', mark: 'Insight', x: '-250', y: '70', rotation: '-40' },
{id: '24', mark: 'Setback', x: '-225', y: '55', rotation: '-35' },
{id: '25', mark: 'Angel', x: '-200', y: '40', rotation: '-30' },
{id: '26', mark: 'Service', x: '-175', y: '30', rotation: '-25' },
{id: '27', mark: 'Setback', x: '-150', y: '20', rotation: '-15' },
{id: '28', mark: 'Depression', x: '-125', y: '15', rotation: '-5' },
{id: '29', mark: 'Insight', x: '-95', y: '10', rotation: '0' },
{id: '30', mark: 'Blessing', x: '-25', y: '0', rotation: '0' },
{id: '31', mark: 'Transformation', x: '0', y: '0', rotation: '0' },
{id: '32', mark: 'Insight', x: '25', y: '3', rotation: '0' },
{id: '33', mark: 'Appreciation', x: '50', y: '5', rotation: '0' },
{id: '34', mark: 'Service', x: '75', y: '7', rotation: '5' },
{id: '35', mark: 'Setback', x: '100', y: '10', rotation: '10' },
{id: '36', mark: 'Angel', x: '125', y: '15', rotation: '15' },
{id: '37', mark: 'Blessing', x: '150', y: '20', rotation: '20' },
{id: '38', mark: 'Insight', x: '175', y: '30', rotation: '25' },
{id: '39', mark: 'Setback', x: '200', y: '40', rotation: '30' },
{id: '40', mark: 'Freewill', x: '225', y: '55', rotation: '35' },
{id: '41', mark: 'Miracle', x: '250', y: '70', rotation: '40' },
{id: '42', mark: 'Flash', x: '270', y: '90', rotation: '45' },
{id: '43', mark: 'Service', x: '257', y: '120', rotation: '-45' },
{id: '44', mark: 'Insight', x: '232', y: '138', rotation: '-35' },
{id: '45', mark: 'Freewill', x: '209', y: '150', rotation: '-25' },
{id: '46', mark: 'Appreciation', x: '182', y: '160', rotation: '-20' },
{id: '47', mark: 'Setback', x: '154', y: '165', rotation: '0' },
{id: '48', mark: 'Blessing', x: '127', y: '165', rotation: '0' },
{id: '49', mark: 'Angel', x: '102', y: '160', rotation: '10' },
{id: '50', mark: 'Depression', x: '77', y: '158', rotation: '15' },
{id: '51', mark: 'Service', x: '52', y: '155', rotation: '20' },
{id: '52', mark: 'Insight', x: '27', y: '150', rotation: '22' },
{id: '53', mark: 'Freewill', x: '-35', y: '100', rotation: '-15' },
{id: '54', mark: 'Service', x: '-45', y: '75', rotation: '-10' },
{id: '55', mark: 'Setback', x: '-55', y: '50', rotation: '-10' },
{id: '56', mark: 'Flash', x: '-60', y: '23', rotation: '0' },
{id: '57', mark: 'Appreciation', x: '-60', y: '-5', rotation: '0' },
{id: '58', mark: 'Blessing', x: '-55', y: '-30', rotation: '0' },
{id: '59', mark: 'Insight', x: '-50', y: '-55', rotation: '0' },
{id: '60', mark: 'Setback', x: '-45', y: '-80', rotation: '10' },
{id: '61', mark: 'Service', x: '-40', y: '-105', rotation: '20' },
{id: '62', mark: 'Insight', x: '-30', y: '-130', rotation: '20' },
{id: '63', mark: 'Freewill', x: '-15', y: '-155', rotation: '20' },
];

//背景色定義
var appBackGroundColor = '#D8BFD8';
//スコアカード色定義
var ScoreCardColors = ['red','orange','yellow','purple',];
//スコアカード名
var ScoreCardNames = ['Physical','Emotional','Mental','Spiritual',];

//定義に初期定義する配列が含まれているため、関数化した。
TfAp.ArrayAssets = function() {
  TfAp.TokenAwareness = [
    i18n.Lv1TokenAwareness,
    i18n.Lv2TokenAwareness,
    i18n.Lv3TokenAwareness,
    i18n.Lv4TokenAwareness,
  ];
}



TfAp.SquereSceneSequence = function(mark) {
    switch (mark) {
      case 'Angel':
        return SquereAngelSceneSequence();
        break;
      case 'Appreciation':
        return SquereAppreciationSceneSequence();
        break;
      case 'Blessing':
        return SquereBlessingSceneSequence();
        break;
      case 'Depression':
        return SquereDepressionSceneSequence();
        break;
      case 'Flash':
        return SquereFlashSceneSequence();
        break;
      case 'Freewill':
        return SquereFreewillSceneSequence();
        break;
      case 'Insight':
        return SquereInsightSceneSequence();
        break;
      case 'Miracle':
        return SquereMiracleSceneSequence();
        break;
      case 'Service':
        return SquereServiceSceneSequence();
        break;
      case 'Setback':
        return SquereSetbackSceneSequence();
        break;
      case 'Transformation':
        return SquereTransformationSceneSequence();
        break;
      default :
        return MainBoardScene();
     }
}

TfAp.MasterDecks = function(type) {
    switch (type) {
      case 'Angel':
        return i18n.CardAngels;
        break;
      case 'Insight':
        return i18n.CardInsights;
        break;
      case 'Setback':
        return i18n.CardSetbacks;
        break;
      default :
        return i18n.CardUniversalFeedbacks;
     }
}

TfAp.CurrentUnconscious = function(type) {
    switch (type) {
      case 'Angel':
        return CurrentGameData.UnconsciousAngel;
        break;
      case 'Insight':
        return CurrentGameData.UnconsciousInsight;
        break;
      case 'Setback':
      default :
        return CurrentGameData.UnconsciousSetback;
     }
}


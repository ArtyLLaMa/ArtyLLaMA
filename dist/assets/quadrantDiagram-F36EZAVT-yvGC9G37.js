import{_ as o,H as _e,A as D,l as At,d as wt,i as Ae,q as ie,s as ke,g as Fe,p as Pe,b as ve,c as Ce,t as Le,j as zt,k as Ee}from"./index-BJNGhUTg.js";import{l as ee}from"./linear-DpJuRxS9.js";import"./init-Gi6I4Gst.js";var Vt=function(){var t=o(function(j,r,l,g){for(l=l||{},g=j.length;g--;l[j[g]]=r);return l},"o"),n=[1,3],u=[1,4],c=[1,5],h=[1,6],p=[1,7],y=[1,4,5,10,12,13,14,18,25,35,37,39,41,42,48,50,51,52,53,54,55,56,57,60,61,63,64,65,66,67],S=[1,4,5,10,12,13,14,18,25,28,35,37,39,41,42,48,50,51,52,53,54,55,56,57,60,61,63,64,65,66,67],a=[55,56,57],A=[2,36],d=[1,37],T=[1,36],q=[1,38],m=[1,35],b=[1,43],x=[1,41],O=[1,14],Y=[1,23],G=[1,18],yt=[1,19],Tt=[1,20],dt=[1,21],Ft=[1,22],ut=[1,24],xt=[1,25],ft=[1,26],gt=[1,27],i=[1,28],Bt=[1,29],W=[1,32],U=[1,33],k=[1,34],F=[1,39],P=[1,40],v=[1,42],C=[1,44],H=[1,62],X=[1,61],L=[4,5,8,10,12,13,14,18,44,47,49,55,56,57,63,64,65,66,67],Rt=[1,65],Nt=[1,66],Wt=[1,67],Ut=[1,68],Qt=[1,69],Ot=[1,70],Ht=[1,71],Xt=[1,72],Mt=[1,73],Yt=[1,74],jt=[1,75],Gt=[1,76],I=[4,5,6,7,8,9,10,11,12,13,14,15,18],J=[1,90],$=[1,91],tt=[1,92],et=[1,99],it=[1,93],at=[1,96],nt=[1,94],st=[1,95],rt=[1,97],ot=[1,98],Pt=[1,102],Kt=[10,55,56,57],R=[4,5,6,8,10,11,13,17,18,19,20,55,56,57],vt={trace:o(function(){},"trace"),yy:{},symbols_:{error:2,idStringToken:3,ALPHA:4,NUM:5,NODE_STRING:6,DOWN:7,MINUS:8,DEFAULT:9,COMMA:10,COLON:11,AMP:12,BRKT:13,MULT:14,UNICODE_TEXT:15,styleComponent:16,UNIT:17,SPACE:18,STYLE:19,PCT:20,idString:21,style:22,stylesOpt:23,classDefStatement:24,CLASSDEF:25,start:26,eol:27,QUADRANT:28,document:29,line:30,statement:31,axisDetails:32,quadrantDetails:33,points:34,title:35,title_value:36,acc_title:37,acc_title_value:38,acc_descr:39,acc_descr_value:40,acc_descr_multiline_value:41,section:42,text:43,point_start:44,point_x:45,point_y:46,class_name:47,"X-AXIS":48,"AXIS-TEXT-DELIMITER":49,"Y-AXIS":50,QUADRANT_1:51,QUADRANT_2:52,QUADRANT_3:53,QUADRANT_4:54,NEWLINE:55,SEMI:56,EOF:57,alphaNumToken:58,textNoTagsToken:59,STR:60,MD_STR:61,alphaNum:62,PUNCTUATION:63,PLUS:64,EQUALS:65,DOT:66,UNDERSCORE:67,$accept:0,$end:1},terminals_:{2:"error",4:"ALPHA",5:"NUM",6:"NODE_STRING",7:"DOWN",8:"MINUS",9:"DEFAULT",10:"COMMA",11:"COLON",12:"AMP",13:"BRKT",14:"MULT",15:"UNICODE_TEXT",17:"UNIT",18:"SPACE",19:"STYLE",20:"PCT",25:"CLASSDEF",28:"QUADRANT",35:"title",36:"title_value",37:"acc_title",38:"acc_title_value",39:"acc_descr",40:"acc_descr_value",41:"acc_descr_multiline_value",42:"section",44:"point_start",45:"point_x",46:"point_y",47:"class_name",48:"X-AXIS",49:"AXIS-TEXT-DELIMITER",50:"Y-AXIS",51:"QUADRANT_1",52:"QUADRANT_2",53:"QUADRANT_3",54:"QUADRANT_4",55:"NEWLINE",56:"SEMI",57:"EOF",60:"STR",61:"MD_STR",63:"PUNCTUATION",64:"PLUS",65:"EQUALS",66:"DOT",67:"UNDERSCORE"},productions_:[0,[3,1],[3,1],[3,1],[3,1],[3,1],[3,1],[3,1],[3,1],[3,1],[3,1],[3,1],[3,1],[16,1],[16,1],[16,1],[16,1],[16,1],[16,1],[16,1],[16,1],[16,1],[16,1],[21,1],[21,2],[22,1],[22,2],[23,1],[23,3],[24,5],[26,2],[26,2],[26,2],[29,0],[29,2],[30,2],[31,0],[31,1],[31,2],[31,1],[31,1],[31,1],[31,2],[31,2],[31,2],[31,1],[31,1],[34,4],[34,5],[34,5],[34,6],[32,4],[32,3],[32,2],[32,4],[32,3],[32,2],[33,2],[33,2],[33,2],[33,2],[27,1],[27,1],[27,1],[43,1],[43,2],[43,1],[43,1],[62,1],[62,2],[58,1],[58,1],[58,1],[58,1],[58,1],[58,1],[58,1],[58,1],[58,1],[58,1],[58,1],[59,1],[59,1],[59,1]],performAction:o(function(r,l,g,f,_,e,pt){var s=e.length-1;switch(_){case 23:this.$=e[s];break;case 24:this.$=e[s-1]+""+e[s];break;case 26:this.$=e[s-1]+e[s];break;case 27:this.$=[e[s].trim()];break;case 28:e[s-2].push(e[s].trim()),this.$=e[s-2];break;case 29:this.$=e[s-4],f.addClass(e[s-2],e[s]);break;case 37:this.$=[];break;case 42:this.$=e[s].trim(),f.setDiagramTitle(this.$);break;case 43:this.$=e[s].trim(),f.setAccTitle(this.$);break;case 44:case 45:this.$=e[s].trim(),f.setAccDescription(this.$);break;case 46:f.addSection(e[s].substr(8)),this.$=e[s].substr(8);break;case 47:f.addPoint(e[s-3],"",e[s-1],e[s],[]);break;case 48:f.addPoint(e[s-4],e[s-3],e[s-1],e[s],[]);break;case 49:f.addPoint(e[s-4],"",e[s-2],e[s-1],e[s]);break;case 50:f.addPoint(e[s-5],e[s-4],e[s-2],e[s-1],e[s]);break;case 51:f.setXAxisLeftText(e[s-2]),f.setXAxisRightText(e[s]);break;case 52:e[s-1].text+=" ⟶ ",f.setXAxisLeftText(e[s-1]);break;case 53:f.setXAxisLeftText(e[s]);break;case 54:f.setYAxisBottomText(e[s-2]),f.setYAxisTopText(e[s]);break;case 55:e[s-1].text+=" ⟶ ",f.setYAxisBottomText(e[s-1]);break;case 56:f.setYAxisBottomText(e[s]);break;case 57:f.setQuadrant1Text(e[s]);break;case 58:f.setQuadrant2Text(e[s]);break;case 59:f.setQuadrant3Text(e[s]);break;case 60:f.setQuadrant4Text(e[s]);break;case 64:this.$={text:e[s],type:"text"};break;case 65:this.$={text:e[s-1].text+""+e[s],type:e[s-1].type};break;case 66:this.$={text:e[s],type:"text"};break;case 67:this.$={text:e[s],type:"markdown"};break;case 68:this.$=e[s];break;case 69:this.$=e[s-1]+""+e[s];break}},"anonymous"),table:[{18:n,26:1,27:2,28:u,55:c,56:h,57:p},{1:[3]},{18:n,26:8,27:2,28:u,55:c,56:h,57:p},{18:n,26:9,27:2,28:u,55:c,56:h,57:p},t(y,[2,33],{29:10}),t(S,[2,61]),t(S,[2,62]),t(S,[2,63]),{1:[2,30]},{1:[2,31]},t(a,A,{30:11,31:12,24:13,32:15,33:16,34:17,43:30,58:31,1:[2,32],4:d,5:T,10:q,12:m,13:b,14:x,18:O,25:Y,35:G,37:yt,39:Tt,41:dt,42:Ft,48:ut,50:xt,51:ft,52:gt,53:i,54:Bt,60:W,61:U,63:k,64:F,65:P,66:v,67:C}),t(y,[2,34]),{27:45,55:c,56:h,57:p},t(a,[2,37]),t(a,A,{24:13,32:15,33:16,34:17,43:30,58:31,31:46,4:d,5:T,10:q,12:m,13:b,14:x,18:O,25:Y,35:G,37:yt,39:Tt,41:dt,42:Ft,48:ut,50:xt,51:ft,52:gt,53:i,54:Bt,60:W,61:U,63:k,64:F,65:P,66:v,67:C}),t(a,[2,39]),t(a,[2,40]),t(a,[2,41]),{36:[1,47]},{38:[1,48]},{40:[1,49]},t(a,[2,45]),t(a,[2,46]),{18:[1,50]},{4:d,5:T,10:q,12:m,13:b,14:x,43:51,58:31,60:W,61:U,63:k,64:F,65:P,66:v,67:C},{4:d,5:T,10:q,12:m,13:b,14:x,43:52,58:31,60:W,61:U,63:k,64:F,65:P,66:v,67:C},{4:d,5:T,10:q,12:m,13:b,14:x,43:53,58:31,60:W,61:U,63:k,64:F,65:P,66:v,67:C},{4:d,5:T,10:q,12:m,13:b,14:x,43:54,58:31,60:W,61:U,63:k,64:F,65:P,66:v,67:C},{4:d,5:T,10:q,12:m,13:b,14:x,43:55,58:31,60:W,61:U,63:k,64:F,65:P,66:v,67:C},{4:d,5:T,10:q,12:m,13:b,14:x,43:56,58:31,60:W,61:U,63:k,64:F,65:P,66:v,67:C},{4:d,5:T,8:H,10:q,12:m,13:b,14:x,18:X,44:[1,57],47:[1,58],58:60,59:59,63:k,64:F,65:P,66:v,67:C},t(L,[2,64]),t(L,[2,66]),t(L,[2,67]),t(L,[2,70]),t(L,[2,71]),t(L,[2,72]),t(L,[2,73]),t(L,[2,74]),t(L,[2,75]),t(L,[2,76]),t(L,[2,77]),t(L,[2,78]),t(L,[2,79]),t(L,[2,80]),t(y,[2,35]),t(a,[2,38]),t(a,[2,42]),t(a,[2,43]),t(a,[2,44]),{3:64,4:Rt,5:Nt,6:Wt,7:Ut,8:Qt,9:Ot,10:Ht,11:Xt,12:Mt,13:Yt,14:jt,15:Gt,21:63},t(a,[2,53],{59:59,58:60,4:d,5:T,8:H,10:q,12:m,13:b,14:x,18:X,49:[1,77],63:k,64:F,65:P,66:v,67:C}),t(a,[2,56],{59:59,58:60,4:d,5:T,8:H,10:q,12:m,13:b,14:x,18:X,49:[1,78],63:k,64:F,65:P,66:v,67:C}),t(a,[2,57],{59:59,58:60,4:d,5:T,8:H,10:q,12:m,13:b,14:x,18:X,63:k,64:F,65:P,66:v,67:C}),t(a,[2,58],{59:59,58:60,4:d,5:T,8:H,10:q,12:m,13:b,14:x,18:X,63:k,64:F,65:P,66:v,67:C}),t(a,[2,59],{59:59,58:60,4:d,5:T,8:H,10:q,12:m,13:b,14:x,18:X,63:k,64:F,65:P,66:v,67:C}),t(a,[2,60],{59:59,58:60,4:d,5:T,8:H,10:q,12:m,13:b,14:x,18:X,63:k,64:F,65:P,66:v,67:C}),{45:[1,79]},{44:[1,80]},t(L,[2,65]),t(L,[2,81]),t(L,[2,82]),t(L,[2,83]),{3:82,4:Rt,5:Nt,6:Wt,7:Ut,8:Qt,9:Ot,10:Ht,11:Xt,12:Mt,13:Yt,14:jt,15:Gt,18:[1,81]},t(I,[2,23]),t(I,[2,1]),t(I,[2,2]),t(I,[2,3]),t(I,[2,4]),t(I,[2,5]),t(I,[2,6]),t(I,[2,7]),t(I,[2,8]),t(I,[2,9]),t(I,[2,10]),t(I,[2,11]),t(I,[2,12]),t(a,[2,52],{58:31,43:83,4:d,5:T,10:q,12:m,13:b,14:x,60:W,61:U,63:k,64:F,65:P,66:v,67:C}),t(a,[2,55],{58:31,43:84,4:d,5:T,10:q,12:m,13:b,14:x,60:W,61:U,63:k,64:F,65:P,66:v,67:C}),{46:[1,85]},{45:[1,86]},{4:J,5:$,6:tt,8:et,11:it,13:at,16:89,17:nt,18:st,19:rt,20:ot,22:88,23:87},t(I,[2,24]),t(a,[2,51],{59:59,58:60,4:d,5:T,8:H,10:q,12:m,13:b,14:x,18:X,63:k,64:F,65:P,66:v,67:C}),t(a,[2,54],{59:59,58:60,4:d,5:T,8:H,10:q,12:m,13:b,14:x,18:X,63:k,64:F,65:P,66:v,67:C}),t(a,[2,47],{22:88,16:89,23:100,4:J,5:$,6:tt,8:et,11:it,13:at,17:nt,18:st,19:rt,20:ot}),{46:[1,101]},t(a,[2,29],{10:Pt}),t(Kt,[2,27],{16:103,4:J,5:$,6:tt,8:et,11:it,13:at,17:nt,18:st,19:rt,20:ot}),t(R,[2,25]),t(R,[2,13]),t(R,[2,14]),t(R,[2,15]),t(R,[2,16]),t(R,[2,17]),t(R,[2,18]),t(R,[2,19]),t(R,[2,20]),t(R,[2,21]),t(R,[2,22]),t(a,[2,49],{10:Pt}),t(a,[2,48],{22:88,16:89,23:104,4:J,5:$,6:tt,8:et,11:it,13:at,17:nt,18:st,19:rt,20:ot}),{4:J,5:$,6:tt,8:et,11:it,13:at,16:89,17:nt,18:st,19:rt,20:ot,22:105},t(R,[2,26]),t(a,[2,50],{10:Pt}),t(Kt,[2,28],{16:103,4:J,5:$,6:tt,8:et,11:it,13:at,17:nt,18:st,19:rt,20:ot})],defaultActions:{8:[2,30],9:[2,31]},parseError:o(function(r,l){if(l.recoverable)this.trace(r);else{var g=new Error(r);throw g.hash=l,g}},"parseError"),parse:o(function(r){var l=this,g=[0],f=[],_=[null],e=[],pt=this.table,s="",mt=0,Zt=0,qe=2,Jt=1,me=e.slice.call(arguments,1),E=Object.create(this.lexer),K={yy:{}};for(var Ct in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Ct)&&(K.yy[Ct]=this.yy[Ct]);E.setInput(r,K.yy),K.yy.lexer=E,K.yy.parser=this,typeof E.yylloc>"u"&&(E.yylloc={});var Lt=E.yylloc;e.push(Lt);var be=E.options&&E.options.ranges;typeof K.yy.parseError=="function"?this.parseError=K.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function Se(B){g.length=g.length-2*B,_.length=_.length-B,e.length=e.length-B}o(Se,"popStack");function $t(){var B;return B=f.pop()||E.lex()||Jt,typeof B!="number"&&(B instanceof Array&&(f=B,B=f.pop()),B=l.symbols_[B]||B),B}o($t,"lex");for(var w,Z,N,Et,lt={},bt,M,te,St;;){if(Z=g[g.length-1],this.defaultActions[Z]?N=this.defaultActions[Z]:((w===null||typeof w>"u")&&(w=$t()),N=pt[Z]&&pt[Z][w]),typeof N>"u"||!N.length||!N[0]){var Dt="";St=[];for(bt in pt[Z])this.terminals_[bt]&&bt>qe&&St.push("'"+this.terminals_[bt]+"'");E.showPosition?Dt="Parse error on line "+(mt+1)+`:
`+E.showPosition()+`
Expecting `+St.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Dt="Parse error on line "+(mt+1)+": Unexpected "+(w==Jt?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Dt,{text:E.match,token:this.terminals_[w]||w,line:E.yylineno,loc:Lt,expected:St})}if(N[0]instanceof Array&&N.length>1)throw new Error("Parse Error: multiple actions possible at state: "+Z+", token: "+w);switch(N[0]){case 1:g.push(w),_.push(E.yytext),e.push(E.yylloc),g.push(N[1]),w=null,Zt=E.yyleng,s=E.yytext,mt=E.yylineno,Lt=E.yylloc;break;case 2:if(M=this.productions_[N[1]][1],lt.$=_[_.length-M],lt._$={first_line:e[e.length-(M||1)].first_line,last_line:e[e.length-1].last_line,first_column:e[e.length-(M||1)].first_column,last_column:e[e.length-1].last_column},be&&(lt._$.range=[e[e.length-(M||1)].range[0],e[e.length-1].range[1]]),Et=this.performAction.apply(lt,[s,Zt,mt,K.yy,N[1],_,e].concat(me)),typeof Et<"u")return Et;M&&(g=g.slice(0,-1*M*2),_=_.slice(0,-1*M),e=e.slice(0,-1*M)),g.push(this.productions_[N[1]][0]),_.push(lt.$),e.push(lt._$),te=pt[g[g.length-2]][g[g.length-1]],g.push(te);break;case 3:return!0}}return!0},"parse")},Te=function(){var j={EOF:1,parseError:o(function(l,g){if(this.yy.parser)this.yy.parser.parseError(l,g);else throw new Error(l)},"parseError"),setInput:o(function(r,l){return this.yy=l||this.yy||{},this._input=r,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:o(function(){var r=this._input[0];this.yytext+=r,this.yyleng++,this.offset++,this.match+=r,this.matched+=r;var l=r.match(/(?:\r\n?|\n).*/g);return l?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),r},"input"),unput:o(function(r){var l=r.length,g=r.split(/(?:\r\n?|\n)/g);this._input=r+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-l),this.offset-=l;var f=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),g.length-1&&(this.yylineno-=g.length-1);var _=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:g?(g.length===f.length?this.yylloc.first_column:0)+f[f.length-g.length].length-g[0].length:this.yylloc.first_column-l},this.options.ranges&&(this.yylloc.range=[_[0],_[0]+this.yyleng-l]),this.yyleng=this.yytext.length,this},"unput"),more:o(function(){return this._more=!0,this},"more"),reject:o(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:o(function(r){this.unput(this.match.slice(r))},"less"),pastInput:o(function(){var r=this.matched.substr(0,this.matched.length-this.match.length);return(r.length>20?"...":"")+r.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:o(function(){var r=this.match;return r.length<20&&(r+=this._input.substr(0,20-r.length)),(r.substr(0,20)+(r.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:o(function(){var r=this.pastInput(),l=new Array(r.length+1).join("-");return r+this.upcomingInput()+`
`+l+"^"},"showPosition"),test_match:o(function(r,l){var g,f,_;if(this.options.backtrack_lexer&&(_={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(_.yylloc.range=this.yylloc.range.slice(0))),f=r[0].match(/(?:\r\n?|\n).*/g),f&&(this.yylineno+=f.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:f?f[f.length-1].length-f[f.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+r[0].length},this.yytext+=r[0],this.match+=r[0],this.matches=r,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(r[0].length),this.matched+=r[0],g=this.performAction.call(this,this.yy,this,l,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),g)return g;if(this._backtrack){for(var e in _)this[e]=_[e];return!1}return!1},"test_match"),next:o(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var r,l,g,f;this._more||(this.yytext="",this.match="");for(var _=this._currentRules(),e=0;e<_.length;e++)if(g=this._input.match(this.rules[_[e]]),g&&(!l||g[0].length>l[0].length)){if(l=g,f=e,this.options.backtrack_lexer){if(r=this.test_match(g,_[e]),r!==!1)return r;if(this._backtrack){l=!1;continue}else return!1}else if(!this.options.flex)break}return l?(r=this.test_match(l,_[f]),r!==!1?r:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:o(function(){var l=this.next();return l||this.lex()},"lex"),begin:o(function(l){this.conditionStack.push(l)},"begin"),popState:o(function(){var l=this.conditionStack.length-1;return l>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:o(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:o(function(l){return l=this.conditionStack.length-1-Math.abs(l||0),l>=0?this.conditionStack[l]:"INITIAL"},"topState"),pushState:o(function(l){this.begin(l)},"pushState"),stateStackSize:o(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:o(function(l,g,f,_){switch(f){case 0:break;case 1:break;case 2:return 55;case 3:break;case 4:return this.begin("title"),35;case 5:return this.popState(),"title_value";case 6:return this.begin("acc_title"),37;case 7:return this.popState(),"acc_title_value";case 8:return this.begin("acc_descr"),39;case 9:return this.popState(),"acc_descr_value";case 10:this.begin("acc_descr_multiline");break;case 11:this.popState();break;case 12:return"acc_descr_multiline_value";case 13:return 48;case 14:return 50;case 15:return 49;case 16:return 51;case 17:return 52;case 18:return 53;case 19:return 54;case 20:return 25;case 21:this.begin("md_string");break;case 22:return"MD_STR";case 23:this.popState();break;case 24:this.begin("string");break;case 25:this.popState();break;case 26:return"STR";case 27:this.begin("class_name");break;case 28:return this.popState(),47;case 29:return this.begin("point_start"),44;case 30:return this.begin("point_x"),45;case 31:this.popState();break;case 32:this.popState(),this.begin("point_y");break;case 33:return this.popState(),46;case 34:return 28;case 35:return 4;case 36:return 11;case 37:return 64;case 38:return 10;case 39:return 65;case 40:return 65;case 41:return 14;case 42:return 13;case 43:return 67;case 44:return 66;case 45:return 12;case 46:return 8;case 47:return 5;case 48:return 18;case 49:return 56;case 50:return 63;case 51:return 57}},"anonymous"),rules:[/^(?:%%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n\r]+)/i,/^(?:%%[^\n]*)/i,/^(?:title\b)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?: *x-axis *)/i,/^(?: *y-axis *)/i,/^(?: *--+> *)/i,/^(?: *quadrant-1 *)/i,/^(?: *quadrant-2 *)/i,/^(?: *quadrant-3 *)/i,/^(?: *quadrant-4 *)/i,/^(?:classDef\b)/i,/^(?:["][`])/i,/^(?:[^`"]+)/i,/^(?:[`]["])/i,/^(?:["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?::::)/i,/^(?:^\w+)/i,/^(?:\s*:\s*\[\s*)/i,/^(?:(1)|(0(.\d+)?))/i,/^(?:\s*\] *)/i,/^(?:\s*,\s*)/i,/^(?:(1)|(0(.\d+)?))/i,/^(?: *quadrantChart *)/i,/^(?:[A-Za-z]+)/i,/^(?::)/i,/^(?:\+)/i,/^(?:,)/i,/^(?:=)/i,/^(?:=)/i,/^(?:\*)/i,/^(?:#)/i,/^(?:[\_])/i,/^(?:\.)/i,/^(?:&)/i,/^(?:-)/i,/^(?:[0-9]+)/i,/^(?:\s)/i,/^(?:;)/i,/^(?:[!"#$%&'*+,-.`?\\_/])/i,/^(?:$)/i],conditions:{class_name:{rules:[28],inclusive:!1},point_y:{rules:[33],inclusive:!1},point_x:{rules:[32],inclusive:!1},point_start:{rules:[30,31],inclusive:!1},acc_descr_multiline:{rules:[11,12],inclusive:!1},acc_descr:{rules:[9],inclusive:!1},acc_title:{rules:[7],inclusive:!1},title:{rules:[5],inclusive:!1},md_string:{rules:[22,23],inclusive:!1},string:{rules:[25,26],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,6,8,10,13,14,15,16,17,18,19,20,21,24,27,29,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51],inclusive:!0}}};return j}();vt.lexer=Te;function qt(){this.yy={}}return o(qt,"Parser"),qt.prototype=vt,vt.Parser=qt,new qt}();Vt.parser=Vt;var De=Vt,V=_e(),ht,ze=(ht=class{constructor(){this.classes=new Map,this.config=this.getDefaultConfig(),this.themeConfig=this.getDefaultThemeConfig(),this.data=this.getDefaultData()}getDefaultData(){return{titleText:"",quadrant1Text:"",quadrant2Text:"",quadrant3Text:"",quadrant4Text:"",xAxisLeftText:"",xAxisRightText:"",yAxisBottomText:"",yAxisTopText:"",points:[]}}getDefaultConfig(){var n,u,c,h,p,y,S,a,A,d,T,q,m,b,x,O,Y,G;return{showXAxis:!0,showYAxis:!0,showTitle:!0,chartHeight:((n=D.quadrantChart)==null?void 0:n.chartWidth)||500,chartWidth:((u=D.quadrantChart)==null?void 0:u.chartHeight)||500,titlePadding:((c=D.quadrantChart)==null?void 0:c.titlePadding)||10,titleFontSize:((h=D.quadrantChart)==null?void 0:h.titleFontSize)||20,quadrantPadding:((p=D.quadrantChart)==null?void 0:p.quadrantPadding)||5,xAxisLabelPadding:((y=D.quadrantChart)==null?void 0:y.xAxisLabelPadding)||5,yAxisLabelPadding:((S=D.quadrantChart)==null?void 0:S.yAxisLabelPadding)||5,xAxisLabelFontSize:((a=D.quadrantChart)==null?void 0:a.xAxisLabelFontSize)||16,yAxisLabelFontSize:((A=D.quadrantChart)==null?void 0:A.yAxisLabelFontSize)||16,quadrantLabelFontSize:((d=D.quadrantChart)==null?void 0:d.quadrantLabelFontSize)||16,quadrantTextTopPadding:((T=D.quadrantChart)==null?void 0:T.quadrantTextTopPadding)||5,pointTextPadding:((q=D.quadrantChart)==null?void 0:q.pointTextPadding)||5,pointLabelFontSize:((m=D.quadrantChart)==null?void 0:m.pointLabelFontSize)||12,pointRadius:((b=D.quadrantChart)==null?void 0:b.pointRadius)||5,xAxisPosition:((x=D.quadrantChart)==null?void 0:x.xAxisPosition)||"top",yAxisPosition:((O=D.quadrantChart)==null?void 0:O.yAxisPosition)||"left",quadrantInternalBorderStrokeWidth:((Y=D.quadrantChart)==null?void 0:Y.quadrantInternalBorderStrokeWidth)||1,quadrantExternalBorderStrokeWidth:((G=D.quadrantChart)==null?void 0:G.quadrantExternalBorderStrokeWidth)||2}}getDefaultThemeConfig(){return{quadrant1Fill:V.quadrant1Fill,quadrant2Fill:V.quadrant2Fill,quadrant3Fill:V.quadrant3Fill,quadrant4Fill:V.quadrant4Fill,quadrant1TextFill:V.quadrant1TextFill,quadrant2TextFill:V.quadrant2TextFill,quadrant3TextFill:V.quadrant3TextFill,quadrant4TextFill:V.quadrant4TextFill,quadrantPointFill:V.quadrantPointFill,quadrantPointTextFill:V.quadrantPointTextFill,quadrantXAxisTextFill:V.quadrantXAxisTextFill,quadrantYAxisTextFill:V.quadrantYAxisTextFill,quadrantTitleFill:V.quadrantTitleFill,quadrantInternalBorderStrokeFill:V.quadrantInternalBorderStrokeFill,quadrantExternalBorderStrokeFill:V.quadrantExternalBorderStrokeFill}}clear(){this.config=this.getDefaultConfig(),this.themeConfig=this.getDefaultThemeConfig(),this.data=this.getDefaultData(),this.classes=new Map,At.info("clear called")}setData(n){this.data={...this.data,...n}}addPoints(n){this.data.points=[...n,...this.data.points]}addClass(n,u){this.classes.set(n,u)}setConfig(n){At.trace("setConfig called with: ",n),this.config={...this.config,...n}}setThemeConfig(n){At.trace("setThemeConfig called with: ",n),this.themeConfig={...this.themeConfig,...n}}calculateSpace(n,u,c,h){const p=this.config.xAxisLabelPadding*2+this.config.xAxisLabelFontSize,y={top:n==="top"&&u?p:0,bottom:n==="bottom"&&u?p:0},S=this.config.yAxisLabelPadding*2+this.config.yAxisLabelFontSize,a={left:this.config.yAxisPosition==="left"&&c?S:0,right:this.config.yAxisPosition==="right"&&c?S:0},A=this.config.titleFontSize+this.config.titlePadding*2,d={top:h?A:0},T=this.config.quadrantPadding+a.left,q=this.config.quadrantPadding+y.top+d.top,m=this.config.chartWidth-this.config.quadrantPadding*2-a.left-a.right,b=this.config.chartHeight-this.config.quadrantPadding*2-y.top-y.bottom-d.top,x=m/2,O=b/2;return{xAxisSpace:y,yAxisSpace:a,titleSpace:d,quadrantSpace:{quadrantLeft:T,quadrantTop:q,quadrantWidth:m,quadrantHalfWidth:x,quadrantHeight:b,quadrantHalfHeight:O}}}getAxisLabels(n,u,c,h){const{quadrantSpace:p,titleSpace:y}=h,{quadrantHalfHeight:S,quadrantHeight:a,quadrantLeft:A,quadrantHalfWidth:d,quadrantTop:T,quadrantWidth:q}=p,m=!!this.data.xAxisRightText,b=!!this.data.yAxisTopText,x=[];return this.data.xAxisLeftText&&u&&x.push({text:this.data.xAxisLeftText,fill:this.themeConfig.quadrantXAxisTextFill,x:A+(m?d/2:0),y:n==="top"?this.config.xAxisLabelPadding+y.top:this.config.xAxisLabelPadding+T+a+this.config.quadrantPadding,fontSize:this.config.xAxisLabelFontSize,verticalPos:m?"center":"left",horizontalPos:"top",rotation:0}),this.data.xAxisRightText&&u&&x.push({text:this.data.xAxisRightText,fill:this.themeConfig.quadrantXAxisTextFill,x:A+d+(m?d/2:0),y:n==="top"?this.config.xAxisLabelPadding+y.top:this.config.xAxisLabelPadding+T+a+this.config.quadrantPadding,fontSize:this.config.xAxisLabelFontSize,verticalPos:m?"center":"left",horizontalPos:"top",rotation:0}),this.data.yAxisBottomText&&c&&x.push({text:this.data.yAxisBottomText,fill:this.themeConfig.quadrantYAxisTextFill,x:this.config.yAxisPosition==="left"?this.config.yAxisLabelPadding:this.config.yAxisLabelPadding+A+q+this.config.quadrantPadding,y:T+a-(b?S/2:0),fontSize:this.config.yAxisLabelFontSize,verticalPos:b?"center":"left",horizontalPos:"top",rotation:-90}),this.data.yAxisTopText&&c&&x.push({text:this.data.yAxisTopText,fill:this.themeConfig.quadrantYAxisTextFill,x:this.config.yAxisPosition==="left"?this.config.yAxisLabelPadding:this.config.yAxisLabelPadding+A+q+this.config.quadrantPadding,y:T+S-(b?S/2:0),fontSize:this.config.yAxisLabelFontSize,verticalPos:b?"center":"left",horizontalPos:"top",rotation:-90}),x}getQuadrants(n){const{quadrantSpace:u}=n,{quadrantHalfHeight:c,quadrantLeft:h,quadrantHalfWidth:p,quadrantTop:y}=u,S=[{text:{text:this.data.quadrant1Text,fill:this.themeConfig.quadrant1TextFill,x:0,y:0,fontSize:this.config.quadrantLabelFontSize,verticalPos:"center",horizontalPos:"middle",rotation:0},x:h+p,y,width:p,height:c,fill:this.themeConfig.quadrant1Fill},{text:{text:this.data.quadrant2Text,fill:this.themeConfig.quadrant2TextFill,x:0,y:0,fontSize:this.config.quadrantLabelFontSize,verticalPos:"center",horizontalPos:"middle",rotation:0},x:h,y,width:p,height:c,fill:this.themeConfig.quadrant2Fill},{text:{text:this.data.quadrant3Text,fill:this.themeConfig.quadrant3TextFill,x:0,y:0,fontSize:this.config.quadrantLabelFontSize,verticalPos:"center",horizontalPos:"middle",rotation:0},x:h,y:y+c,width:p,height:c,fill:this.themeConfig.quadrant3Fill},{text:{text:this.data.quadrant4Text,fill:this.themeConfig.quadrant4TextFill,x:0,y:0,fontSize:this.config.quadrantLabelFontSize,verticalPos:"center",horizontalPos:"middle",rotation:0},x:h+p,y:y+c,width:p,height:c,fill:this.themeConfig.quadrant4Fill}];for(const a of S)a.text.x=a.x+a.width/2,this.data.points.length===0?(a.text.y=a.y+a.height/2,a.text.horizontalPos="middle"):(a.text.y=a.y+this.config.quadrantTextTopPadding,a.text.horizontalPos="top");return S}getQuadrantPoints(n){const{quadrantSpace:u}=n,{quadrantHeight:c,quadrantLeft:h,quadrantTop:p,quadrantWidth:y}=u,S=ee().domain([0,1]).range([h,y+h]),a=ee().domain([0,1]).range([c+p,p]);return this.data.points.map(d=>{const T=this.classes.get(d.className);return T&&(d={...T,...d}),{x:S(d.x),y:a(d.y),fill:d.color??this.themeConfig.quadrantPointFill,radius:d.radius??this.config.pointRadius,text:{text:d.text,fill:this.themeConfig.quadrantPointTextFill,x:S(d.x),y:a(d.y)+this.config.pointTextPadding,verticalPos:"center",horizontalPos:"top",fontSize:this.config.pointLabelFontSize,rotation:0},strokeColor:d.strokeColor??this.themeConfig.quadrantPointFill,strokeWidth:d.strokeWidth??"0px"}})}getBorders(n){const u=this.config.quadrantExternalBorderStrokeWidth/2,{quadrantSpace:c}=n,{quadrantHalfHeight:h,quadrantHeight:p,quadrantLeft:y,quadrantHalfWidth:S,quadrantTop:a,quadrantWidth:A}=c;return[{strokeFill:this.themeConfig.quadrantExternalBorderStrokeFill,strokeWidth:this.config.quadrantExternalBorderStrokeWidth,x1:y-u,y1:a,x2:y+A+u,y2:a},{strokeFill:this.themeConfig.quadrantExternalBorderStrokeFill,strokeWidth:this.config.quadrantExternalBorderStrokeWidth,x1:y+A,y1:a+u,x2:y+A,y2:a+p-u},{strokeFill:this.themeConfig.quadrantExternalBorderStrokeFill,strokeWidth:this.config.quadrantExternalBorderStrokeWidth,x1:y-u,y1:a+p,x2:y+A+u,y2:a+p},{strokeFill:this.themeConfig.quadrantExternalBorderStrokeFill,strokeWidth:this.config.quadrantExternalBorderStrokeWidth,x1:y,y1:a+u,x2:y,y2:a+p-u},{strokeFill:this.themeConfig.quadrantInternalBorderStrokeFill,strokeWidth:this.config.quadrantInternalBorderStrokeWidth,x1:y+S,y1:a+u,x2:y+S,y2:a+p-u},{strokeFill:this.themeConfig.quadrantInternalBorderStrokeFill,strokeWidth:this.config.quadrantInternalBorderStrokeWidth,x1:y+u,y1:a+h,x2:y+A-u,y2:a+h}]}getTitle(n){if(n)return{text:this.data.titleText,fill:this.themeConfig.quadrantTitleFill,fontSize:this.config.titleFontSize,horizontalPos:"top",verticalPos:"center",rotation:0,y:this.config.titlePadding,x:this.config.chartWidth/2}}build(){const n=this.config.showXAxis&&!!(this.data.xAxisLeftText||this.data.xAxisRightText),u=this.config.showYAxis&&!!(this.data.yAxisTopText||this.data.yAxisBottomText),c=this.config.showTitle&&!!this.data.titleText,h=this.data.points.length>0?"bottom":this.config.xAxisPosition,p=this.calculateSpace(h,n,u,c);return{points:this.getQuadrantPoints(p),quadrants:this.getQuadrants(p),axisLabels:this.getAxisLabels(h,n,u,p),borderLines:this.getBorders(p),title:this.getTitle(c)}}},o(ht,"QuadrantBuilder"),ht),ct,_t=(ct=class extends Error{constructor(n,u,c){super(`value for ${n} ${u} is invalid, please use a valid ${c}`),this.name="InvalidStyleError"}},o(ct,"InvalidStyleError"),ct);function It(t){return!/^#?([\dA-Fa-f]{6}|[\dA-Fa-f]{3})$/.test(t)}o(It,"validateHexCode");function ae(t){return!/^\d+$/.test(t)}o(ae,"validateNumber");function ne(t){return!/^\d+px$/.test(t)}o(ne,"validateSizeInPixels");var Ve=wt();function Q(t){return Ae(t.trim(),Ve)}o(Q,"textSanitizer");var z=new ze;function se(t){z.setData({quadrant1Text:Q(t.text)})}o(se,"setQuadrant1Text");function re(t){z.setData({quadrant2Text:Q(t.text)})}o(re,"setQuadrant2Text");function oe(t){z.setData({quadrant3Text:Q(t.text)})}o(oe,"setQuadrant3Text");function le(t){z.setData({quadrant4Text:Q(t.text)})}o(le,"setQuadrant4Text");function he(t){z.setData({xAxisLeftText:Q(t.text)})}o(he,"setXAxisLeftText");function ce(t){z.setData({xAxisRightText:Q(t.text)})}o(ce,"setXAxisRightText");function de(t){z.setData({yAxisTopText:Q(t.text)})}o(de,"setYAxisTopText");function ue(t){z.setData({yAxisBottomText:Q(t.text)})}o(ue,"setYAxisBottomText");function kt(t){const n={};for(const u of t){const[c,h]=u.trim().split(/\s*:\s*/);if(c==="radius"){if(ae(h))throw new _t(c,h,"number");n.radius=parseInt(h)}else if(c==="color"){if(It(h))throw new _t(c,h,"hex code");n.color=h}else if(c==="stroke-color"){if(It(h))throw new _t(c,h,"hex code");n.strokeColor=h}else if(c==="stroke-width"){if(ne(h))throw new _t(c,h,"number of pixels (eg. 10px)");n.strokeWidth=h}else throw new Error(`style named ${c} is not supported.`)}return n}o(kt,"parseStyles");function xe(t,n,u,c,h){const p=kt(h);z.addPoints([{x:u,y:c,text:Q(t.text),className:n,...p}])}o(xe,"addPoint");function fe(t,n){z.addClass(t,kt(n))}o(fe,"addClass");function ge(t){z.setConfig({chartWidth:t})}o(ge,"setWidth");function pe(t){z.setConfig({chartHeight:t})}o(pe,"setHeight");function ye(){const t=wt(),{themeVariables:n,quadrantChart:u}=t;return u&&z.setConfig(u),z.setThemeConfig({quadrant1Fill:n.quadrant1Fill,quadrant2Fill:n.quadrant2Fill,quadrant3Fill:n.quadrant3Fill,quadrant4Fill:n.quadrant4Fill,quadrant1TextFill:n.quadrant1TextFill,quadrant2TextFill:n.quadrant2TextFill,quadrant3TextFill:n.quadrant3TextFill,quadrant4TextFill:n.quadrant4TextFill,quadrantPointFill:n.quadrantPointFill,quadrantPointTextFill:n.quadrantPointTextFill,quadrantXAxisTextFill:n.quadrantXAxisTextFill,quadrantYAxisTextFill:n.quadrantYAxisTextFill,quadrantExternalBorderStrokeFill:n.quadrantExternalBorderStrokeFill,quadrantInternalBorderStrokeFill:n.quadrantInternalBorderStrokeFill,quadrantTitleFill:n.quadrantTitleFill}),z.setData({titleText:ie()}),z.build()}o(ye,"getQuadrantData");var Ie=o(function(){z.clear(),Le()},"clear"),we={setWidth:ge,setHeight:pe,setQuadrant1Text:se,setQuadrant2Text:re,setQuadrant3Text:oe,setQuadrant4Text:le,setXAxisLeftText:he,setXAxisRightText:ce,setYAxisTopText:de,setYAxisBottomText:ue,parseStyles:kt,addPoint:xe,addClass:fe,getQuadrantData:ye,clear:Ie,setAccTitle:ke,getAccTitle:Fe,setDiagramTitle:Pe,getDiagramTitle:ie,getAccDescription:ve,setAccDescription:Ce},Be=o((t,n,u,c)=>{var xt,ft,gt;function h(i){return i==="top"?"hanging":"middle"}o(h,"getDominantBaseLine");function p(i){return i==="left"?"start":"middle"}o(p,"getTextAnchor");function y(i){return`translate(${i.x}, ${i.y}) rotate(${i.rotation||0})`}o(y,"getTransformation");const S=wt();At.debug(`Rendering quadrant chart
`+t);const a=S.securityLevel;let A;a==="sandbox"&&(A=zt("#i"+n));const T=(a==="sandbox"?zt(A.nodes()[0].contentDocument.body):zt("body")).select(`[id="${n}"]`),q=T.append("g").attr("class","main"),m=((xt=S.quadrantChart)==null?void 0:xt.chartWidth)??500,b=((ft=S.quadrantChart)==null?void 0:ft.chartHeight)??500;Ee(T,b,m,((gt=S.quadrantChart)==null?void 0:gt.useMaxWidth)??!0),T.attr("viewBox","0 0 "+m+" "+b),c.db.setHeight(b),c.db.setWidth(m);const x=c.db.getQuadrantData(),O=q.append("g").attr("class","quadrants"),Y=q.append("g").attr("class","border"),G=q.append("g").attr("class","data-points"),yt=q.append("g").attr("class","labels"),Tt=q.append("g").attr("class","title");x.title&&Tt.append("text").attr("x",0).attr("y",0).attr("fill",x.title.fill).attr("font-size",x.title.fontSize).attr("dominant-baseline",h(x.title.horizontalPos)).attr("text-anchor",p(x.title.verticalPos)).attr("transform",y(x.title)).text(x.title.text),x.borderLines&&Y.selectAll("line").data(x.borderLines).enter().append("line").attr("x1",i=>i.x1).attr("y1",i=>i.y1).attr("x2",i=>i.x2).attr("y2",i=>i.y2).style("stroke",i=>i.strokeFill).style("stroke-width",i=>i.strokeWidth);const dt=O.selectAll("g.quadrant").data(x.quadrants).enter().append("g").attr("class","quadrant");dt.append("rect").attr("x",i=>i.x).attr("y",i=>i.y).attr("width",i=>i.width).attr("height",i=>i.height).attr("fill",i=>i.fill),dt.append("text").attr("x",0).attr("y",0).attr("fill",i=>i.text.fill).attr("font-size",i=>i.text.fontSize).attr("dominant-baseline",i=>h(i.text.horizontalPos)).attr("text-anchor",i=>p(i.text.verticalPos)).attr("transform",i=>y(i.text)).text(i=>i.text.text),yt.selectAll("g.label").data(x.axisLabels).enter().append("g").attr("class","label").append("text").attr("x",0).attr("y",0).text(i=>i.text).attr("fill",i=>i.fill).attr("font-size",i=>i.fontSize).attr("dominant-baseline",i=>h(i.horizontalPos)).attr("text-anchor",i=>p(i.verticalPos)).attr("transform",i=>y(i));const ut=G.selectAll("g.data-point").data(x.points).enter().append("g").attr("class","data-point");ut.append("circle").attr("cx",i=>i.x).attr("cy",i=>i.y).attr("r",i=>i.radius).attr("fill",i=>i.fill).attr("stroke",i=>i.strokeColor).attr("stroke-width",i=>i.strokeWidth),ut.append("text").attr("x",0).attr("y",0).text(i=>i.text.text).attr("fill",i=>i.text.fill).attr("font-size",i=>i.text.fontSize).attr("dominant-baseline",i=>h(i.text.horizontalPos)).attr("text-anchor",i=>p(i.text.verticalPos)).attr("transform",i=>y(i.text))},"draw"),Re={draw:Be},Qe={parser:De,db:we,renderer:Re,styles:o(()=>"","styles")};export{Qe as diagram};

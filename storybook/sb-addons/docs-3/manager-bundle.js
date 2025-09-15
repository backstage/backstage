try{
(()=>{var l=__REACT__,{Children:lt,Component:dt,Fragment:ft,Profiler:ct,PureComponent:mt,StrictMode:ht,Suspense:bt,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:gt,act:yt,cloneElement:vt,createContext:xt,createElement:St,createFactory:Tt,createRef:wt,forwardRef:Pt,isValidElement:_t,lazy:kt,memo:Ct,startTransition:Et,unstable_act:Rt,useCallback:It,useContext:Ot,useDebugValue:Ft,useDeferredValue:Ht,useEffect:G,useId:jt,useImperativeHandle:zt,useInsertionEffect:At,useLayoutEffect:Mt,useMemo:Bt,useReducer:Nt,useRef:Lt,useState:K,useSyncExternalStore:Dt,useTransition:$t,version:qt}=__REACT__;var Ut=__STORYBOOK_COMPONENTS__,{A:Zt,ActionBar:Jt,AddonPanel:U,Badge:Qt,Bar:Xt,Blockquote:Vt,Button:er,ClipboardCode:tr,Code:rr,DL:ar,Div:nr,DocumentWrapper:or,EmptyTabContent:sr,ErrorFormatter:ir,FlexBar:pr,Form:ur,H1:lr,H2:dr,H3:fr,H4:cr,H5:mr,H6:hr,HR:br,IconButton:gr,Img:yr,LI:vr,Link:xr,ListItem:Sr,Loader:Tr,Modal:wr,OL:Pr,P:_r,Placeholder:kr,Pre:Cr,ProgressSpinner:Er,ResetWrapper:Rr,ScrollArea:Ir,Separator:Or,Spaced:Fr,Span:Hr,StorybookIcon:jr,StorybookLogo:zr,SyntaxHighlighter:Z,TT:Ar,TabBar:Mr,TabButton:Br,TabWrapper:Nr,Table:Lr,Tabs:Dr,TabsState:$r,TooltipLinkList:qr,TooltipMessage:Wr,TooltipNote:Yr,UL:Gr,WithTooltip:Kr,WithTooltipPure:Ur,Zoom:Zr,codeCommon:Jr,components:Qr,createCopyToClipboardFunction:Xr,getStoryHref:Vr,interleaveSeparators:ea,nameSpaceClassNames:ta,resetComponents:ra,withReset:J}=__STORYBOOK_COMPONENTS__;var ia=__STORYBOOK_API__,{ActiveTabs:pa,Consumer:ua,ManagerContext:la,Provider:da,RequestResponseError:fa,addons:H,combineParameters:ca,controlOrMetaKey:ma,controlOrMetaSymbol:ha,eventMatchesShortcut:ba,eventToShortcut:ga,experimental_MockUniversalStore:ya,experimental_UniversalStore:va,experimental_getStatusStore:xa,experimental_getTestProviderStore:Sa,experimental_requestResponse:Ta,experimental_useStatusStore:wa,experimental_useTestProviderStore:Pa,experimental_useUniversalStore:_a,internal_fullStatusStore:ka,internal_fullTestProviderStore:Ca,internal_universalStatusStore:Ea,internal_universalTestProviderStore:Ra,isMacLike:Ia,isShortcutTaken:Oa,keyToSymbol:Fa,merge:Ha,mockChannel:ja,optionOrAltSymbol:za,shortcutMatchesShortcut:Aa,shortcutToHumanString:Ma,types:Q,useAddonState:Ba,useArgTypes:Na,useArgs:La,useChannel:X,useGlobalTypes:Da,useGlobals:$a,useParameter:V,useSharedState:qa,useStoryPrepared:Wa,useStorybookApi:Ya,useStorybookState:Ga}=__STORYBOOK_API__;var Qa=__STORYBOOK_THEMING__,{CacheProvider:Xa,ClassNames:Va,Global:en,ThemeProvider:ee,background:tn,color:rn,convert:te,create:an,createCache:nn,createGlobal:on,createReset:sn,css:pn,darken:un,ensure:ln,ignoreSsrWarning:j,isPropValid:dn,jsx:fn,keyframes:cn,lighten:mn,styled:w,themes:z,typography:hn,useTheme:A,withTheme:bn}=__STORYBOOK_THEMING__;var W="storybook/docs",le=`${W}/panel`,re="docs",ae=`${W}/snippet-rendered`;function d(){return d=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)({}).hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e},d.apply(null,arguments)}function de(e){if(e===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function C(e,t){return C=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(r,a){return r.__proto__=a,r},C(e,t)}function fe(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,C(e,t)}function L(e){return L=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},L(e)}function ce(e){try{return Function.toString.call(e).indexOf("[native code]")!==-1}catch{return typeof e=="function"}}function oe(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch{}return(oe=function(){return!!e})()}function me(e,t,r){if(oe())return Reflect.construct.apply(null,arguments);var a=[null];a.push.apply(a,t);var n=new(e.bind.apply(e,a));return r&&C(n,r.prototype),n}function D(e){var t=typeof Map=="function"?new Map:void 0;return D=function(r){if(r===null||!ce(r))return r;if(typeof r!="function")throw new TypeError("Super expression must either be null or a function");if(t!==void 0){if(t.has(r))return t.get(r);t.set(r,a)}function a(){return me(r,arguments,L(this).constructor)}return a.prototype=Object.create(r.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),C(a,r)},D(e)}var he={1:`Passed invalid arguments to hsl, please pass multiple numbers e.g. hsl(360, 0.75, 0.4) or an object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75 }).

`,2:`Passed invalid arguments to hsla, please pass multiple numbers e.g. hsla(360, 0.75, 0.4, 0.7) or an object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75, alpha: 0.7 }).

`,3:`Passed an incorrect argument to a color function, please pass a string representation of a color.

`,4:`Couldn't generate valid rgb string from %s, it returned %s.

`,5:`Couldn't parse the color string. Please provide the color as a string in hex, rgb, rgba, hsl or hsla notation.

`,6:`Passed invalid arguments to rgb, please pass multiple numbers e.g. rgb(255, 205, 100) or an object e.g. rgb({ red: 255, green: 205, blue: 100 }).

`,7:`Passed invalid arguments to rgba, please pass multiple numbers e.g. rgb(255, 205, 100, 0.75) or an object e.g. rgb({ red: 255, green: 205, blue: 100, alpha: 0.75 }).

`,8:`Passed invalid argument to toColorString, please pass a RgbColor, RgbaColor, HslColor or HslaColor object.

`,9:`Please provide a number of steps to the modularScale helper.

`,10:`Please pass a number or one of the predefined scales to the modularScale helper as the ratio.

`,11:`Invalid value passed as base to modularScale, expected number or em string but got "%s"

`,12:`Expected a string ending in "px" or a number passed as the first argument to %s(), got "%s" instead.

`,13:`Expected a string ending in "px" or a number passed as the second argument to %s(), got "%s" instead.

`,14:`Passed invalid pixel value ("%s") to %s(), please pass a value like "12px" or 12.

`,15:`Passed invalid base value ("%s") to %s(), please pass a value like "12px" or 12.

`,16:`You must provide a template to this method.

`,17:`You passed an unsupported selector state to this method.

`,18:`minScreen and maxScreen must be provided as stringified numbers with the same units.

`,19:`fromSize and toSize must be provided as stringified numbers with the same units.

`,20:`expects either an array of objects or a single object with the properties prop, fromSize, and toSize.

`,21:"expects the objects in the first argument array to have the properties `prop`, `fromSize`, and `toSize`.\n\n",22:"expects the first argument object to have the properties `prop`, `fromSize`, and `toSize`.\n\n",23:`fontFace expects a name of a font-family.

`,24:`fontFace expects either the path to the font file(s) or a name of a local copy.

`,25:`fontFace expects localFonts to be an array.

`,26:`fontFace expects fileFormats to be an array.

`,27:`radialGradient requries at least 2 color-stops to properly render.

`,28:`Please supply a filename to retinaImage() as the first argument.

`,29:`Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.

`,30:"Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n",31:`The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation

`,32:`To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])
To pass a single animation please supply them in simple values, e.g. animation('rotate', '2s')

`,33:`The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation

`,34:`borderRadius expects a radius value as a string or number as the second argument.

`,35:`borderRadius expects one of "top", "bottom", "left" or "right" as the first argument.

`,36:`Property must be a string value.

`,37:`Syntax Error at %s.

`,38:`Formula contains a function that needs parentheses at %s.

`,39:`Formula is missing closing parenthesis at %s.

`,40:`Formula has too many closing parentheses at %s.

`,41:`All values in a formula must have the same unit or be unitless.

`,42:`Please provide a number of steps to the modularScale helper.

`,43:`Please pass a number or one of the predefined scales to the modularScale helper as the ratio.

`,44:`Invalid value passed as base to modularScale, expected number or em/rem string but got %s.

`,45:`Passed invalid argument to hslToColorString, please pass a HslColor or HslaColor object.

`,46:`Passed invalid argument to rgbToColorString, please pass a RgbColor or RgbaColor object.

`,47:`minScreen and maxScreen must be provided as stringified numbers with the same units.

`,48:`fromSize and toSize must be provided as stringified numbers with the same units.

`,49:`Expects either an array of objects or a single object with the properties prop, fromSize, and toSize.

`,50:`Expects the objects in the first argument array to have the properties prop, fromSize, and toSize.

`,51:`Expects the first argument object to have the properties prop, fromSize, and toSize.

`,52:`fontFace expects either the path to the font file(s) or a name of a local copy.

`,53:`fontFace expects localFonts to be an array.

`,54:`fontFace expects fileFormats to be an array.

`,55:`fontFace expects a name of a font-family.

`,56:`linearGradient requries at least 2 color-stops to properly render.

`,57:`radialGradient requries at least 2 color-stops to properly render.

`,58:`Please supply a filename to retinaImage() as the first argument.

`,59:`Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.

`,60:"Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n",61:`Property must be a string value.

`,62:`borderRadius expects a radius value as a string or number as the second argument.

`,63:`borderRadius expects one of "top", "bottom", "left" or "right" as the first argument.

`,64:`The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation.

`,65:`To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])\\nTo pass a single animation please supply them in simple values, e.g. animation('rotate', '2s').

`,66:`The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation.

`,67:`You must provide a template to this method.

`,68:`You passed an unsupported selector state to this method.

`,69:`Expected a string ending in "px" or a number passed as the first argument to %s(), got %s instead.

`,70:`Expected a string ending in "px" or a number passed as the second argument to %s(), got %s instead.

`,71:`Passed invalid pixel value %s to %s(), please pass a value like "12px" or 12.

`,72:`Passed invalid base value %s to %s(), please pass a value like "12px" or 12.

`,73:`Please provide a valid CSS variable.

`,74:`CSS variable not found and no default was provided.

`,75:`important requires a valid style object, got a %s instead.

`,76:`fromSize and toSize must be provided as stringified numbers with the same units as minScreen and maxScreen.

`,77:`remToPx expects a value in "rem" but you provided it in "%s".

`,78:`base must be set in "px" or "%" but you set it in "%s".
`};function be(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var a=t[0],n=[],o;for(o=1;o<t.length;o+=1)n.push(t[o]);return n.forEach(function(s){a=a.replace(/%[a-z]/,s)}),a}var b=function(e){fe(t,e);function t(r){for(var a,n=arguments.length,o=new Array(n>1?n-1:0),s=1;s<n;s++)o[s-1]=arguments[s];return a=e.call(this,be.apply(void 0,[he[r]].concat(o)))||this,de(a)}return t}(D(Error));function M(e){return Math.round(e*255)}function ge(e,t,r){return M(e)+","+M(t)+","+M(r)}function E(e,t,r,a){if(a===void 0&&(a=ge),t===0)return a(r,r,r);var n=(e%360+360)%360/60,o=(1-Math.abs(2*r-1))*t,s=o*(1-Math.abs(n%2-1)),i=0,p=0,u=0;n>=0&&n<1?(i=o,p=s):n>=1&&n<2?(i=s,p=o):n>=2&&n<3?(p=o,u=s):n>=3&&n<4?(p=s,u=o):n>=4&&n<5?(i=s,u=o):n>=5&&n<6&&(i=o,u=s);var h=r-o/2,m=i+h,f=p+h,k=u+h;return a(m,f,k)}var ne={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"ff00ff",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"639",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"};function ye(e){if(typeof e!="string")return e;var t=e.toLowerCase();return ne[t]?"#"+ne[t]:e}var ve=/^#[a-fA-F0-9]{6}$/,xe=/^#[a-fA-F0-9]{8}$/,Se=/^#[a-fA-F0-9]{3}$/,Te=/^#[a-fA-F0-9]{4}$/,B=/^rgb\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*\)$/i,we=/^rgb(?:a)?\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i,Pe=/^hsl\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*\)$/i,_e=/^hsl(?:a)?\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i;function P(e){if(typeof e!="string")throw new b(3);var t=ye(e);if(t.match(ve))return{red:parseInt(""+t[1]+t[2],16),green:parseInt(""+t[3]+t[4],16),blue:parseInt(""+t[5]+t[6],16)};if(t.match(xe)){var r=parseFloat((parseInt(""+t[7]+t[8],16)/255).toFixed(2));return{red:parseInt(""+t[1]+t[2],16),green:parseInt(""+t[3]+t[4],16),blue:parseInt(""+t[5]+t[6],16),alpha:r}}if(t.match(Se))return{red:parseInt(""+t[1]+t[1],16),green:parseInt(""+t[2]+t[2],16),blue:parseInt(""+t[3]+t[3],16)};if(t.match(Te)){var a=parseFloat((parseInt(""+t[4]+t[4],16)/255).toFixed(2));return{red:parseInt(""+t[1]+t[1],16),green:parseInt(""+t[2]+t[2],16),blue:parseInt(""+t[3]+t[3],16),alpha:a}}var n=B.exec(t);if(n)return{red:parseInt(""+n[1],10),green:parseInt(""+n[2],10),blue:parseInt(""+n[3],10)};var o=we.exec(t.substring(0,50));if(o)return{red:parseInt(""+o[1],10),green:parseInt(""+o[2],10),blue:parseInt(""+o[3],10),alpha:parseFloat(""+o[4])>1?parseFloat(""+o[4])/100:parseFloat(""+o[4])};var s=Pe.exec(t);if(s){var i=parseInt(""+s[1],10),p=parseInt(""+s[2],10)/100,u=parseInt(""+s[3],10)/100,h="rgb("+E(i,p,u)+")",m=B.exec(h);if(!m)throw new b(4,t,h);return{red:parseInt(""+m[1],10),green:parseInt(""+m[2],10),blue:parseInt(""+m[3],10)}}var f=_e.exec(t.substring(0,50));if(f){var k=parseInt(""+f[1],10),pe=parseInt(""+f[2],10)/100,ue=parseInt(""+f[3],10)/100,Y="rgb("+E(k,pe,ue)+")",R=B.exec(Y);if(!R)throw new b(4,t,Y);return{red:parseInt(""+R[1],10),green:parseInt(""+R[2],10),blue:parseInt(""+R[3],10),alpha:parseFloat(""+f[4])>1?parseFloat(""+f[4])/100:parseFloat(""+f[4])}}throw new b(5)}function ke(e){var t=e.red/255,r=e.green/255,a=e.blue/255,n=Math.max(t,r,a),o=Math.min(t,r,a),s=(n+o)/2;if(n===o)return e.alpha!==void 0?{hue:0,saturation:0,lightness:s,alpha:e.alpha}:{hue:0,saturation:0,lightness:s};var i,p=n-o,u=s>.5?p/(2-n-o):p/(n+o);switch(n){case t:i=(r-a)/p+(r<a?6:0);break;case r:i=(a-t)/p+2;break;default:i=(t-r)/p+4;break}return i*=60,e.alpha!==void 0?{hue:i,saturation:u,lightness:s,alpha:e.alpha}:{hue:i,saturation:u,lightness:s}}function g(e){return ke(P(e))}var Ce=function(e){return e.length===7&&e[1]===e[2]&&e[3]===e[4]&&e[5]===e[6]?"#"+e[1]+e[3]+e[5]:e},$=Ce;function v(e){var t=e.toString(16);return t.length===1?"0"+t:t}function N(e){return v(Math.round(e*255))}function Ee(e,t,r){return $("#"+N(e)+N(t)+N(r))}function O(e,t,r){return E(e,t,r,Ee)}function Re(e,t,r){if(typeof e=="number"&&typeof t=="number"&&typeof r=="number")return O(e,t,r);if(typeof e=="object"&&t===void 0&&r===void 0)return O(e.hue,e.saturation,e.lightness);throw new b(1)}function Ie(e,t,r,a){if(typeof e=="number"&&typeof t=="number"&&typeof r=="number"&&typeof a=="number")return a>=1?O(e,t,r):"rgba("+E(e,t,r)+","+a+")";if(typeof e=="object"&&t===void 0&&r===void 0&&a===void 0)return e.alpha>=1?O(e.hue,e.saturation,e.lightness):"rgba("+E(e.hue,e.saturation,e.lightness)+","+e.alpha+")";throw new b(2)}function q(e,t,r){if(typeof e=="number"&&typeof t=="number"&&typeof r=="number")return $("#"+v(e)+v(t)+v(r));if(typeof e=="object"&&t===void 0&&r===void 0)return $("#"+v(e.red)+v(e.green)+v(e.blue));throw new b(6)}function F(e,t,r,a){if(typeof e=="string"&&typeof t=="number"){var n=P(e);return"rgba("+n.red+","+n.green+","+n.blue+","+t+")"}else{if(typeof e=="number"&&typeof t=="number"&&typeof r=="number"&&typeof a=="number")return a>=1?q(e,t,r):"rgba("+e+","+t+","+r+","+a+")";if(typeof e=="object"&&t===void 0&&r===void 0&&a===void 0)return e.alpha>=1?q(e.red,e.green,e.blue):"rgba("+e.red+","+e.green+","+e.blue+","+e.alpha+")"}throw new b(7)}var Oe=function(e){return typeof e.red=="number"&&typeof e.green=="number"&&typeof e.blue=="number"&&(typeof e.alpha!="number"||typeof e.alpha>"u")},Fe=function(e){return typeof e.red=="number"&&typeof e.green=="number"&&typeof e.blue=="number"&&typeof e.alpha=="number"},He=function(e){return typeof e.hue=="number"&&typeof e.saturation=="number"&&typeof e.lightness=="number"&&(typeof e.alpha!="number"||typeof e.alpha>"u")},je=function(e){return typeof e.hue=="number"&&typeof e.saturation=="number"&&typeof e.lightness=="number"&&typeof e.alpha=="number"};function y(e){if(typeof e!="object")throw new b(8);if(Fe(e))return F(e);if(Oe(e))return q(e);if(je(e))return Ie(e);if(He(e))return Re(e);throw new b(8)}function se(e,t,r){return function(){var a=r.concat(Array.prototype.slice.call(arguments));return a.length>=t?e.apply(this,a):se(e,t,a)}}function c(e){return se(e,e.length,[])}function ze(e,t){if(t==="transparent")return t;var r=g(t);return y(d({},r,{hue:r.hue+parseFloat(e)}))}c(ze);function _(e,t,r){return Math.max(e,Math.min(t,r))}function Ae(e,t){if(t==="transparent")return t;var r=g(t);return y(d({},r,{lightness:_(0,1,r.lightness-parseFloat(e))}))}c(Ae);function Me(e,t){if(t==="transparent")return t;var r=g(t);return y(d({},r,{saturation:_(0,1,r.saturation-parseFloat(e))}))}c(Me);function Be(e,t){if(t==="transparent")return t;var r=g(t);return y(d({},r,{lightness:_(0,1,r.lightness+parseFloat(e))}))}c(Be);function Ne(e,t,r){if(t==="transparent")return r;if(r==="transparent")return t;if(e===0)return r;var a=P(t),n=d({},a,{alpha:typeof a.alpha=="number"?a.alpha:1}),o=P(r),s=d({},o,{alpha:typeof o.alpha=="number"?o.alpha:1}),i=n.alpha-s.alpha,p=parseFloat(e)*2-1,u=p*i===-1?p:p+i,h=1+p*i,m=(u/h+1)/2,f=1-m,k={red:Math.floor(n.red*m+s.red*f),green:Math.floor(n.green*m+s.green*f),blue:Math.floor(n.blue*m+s.blue*f),alpha:n.alpha*parseFloat(e)+s.alpha*(1-parseFloat(e))};return F(k)}var Le=c(Ne),ie=Le;function De(e,t){if(t==="transparent")return t;var r=P(t),a=typeof r.alpha=="number"?r.alpha:1,n=d({},r,{alpha:_(0,1,(a*100+parseFloat(e)*100)/100)});return F(n)}c(De);function $e(e,t){if(t==="transparent")return t;var r=g(t);return y(d({},r,{saturation:_(0,1,r.saturation+parseFloat(e))}))}c($e);function qe(e,t){return t==="transparent"?t:y(d({},g(t),{hue:parseFloat(e)}))}c(qe);function We(e,t){return t==="transparent"?t:y(d({},g(t),{lightness:parseFloat(e)}))}c(We);function Ye(e,t){return t==="transparent"?t:y(d({},g(t),{saturation:parseFloat(e)}))}c(Ye);function Ge(e,t){return t==="transparent"?t:ie(parseFloat(e),"rgb(0, 0, 0)",t)}c(Ge);function Ke(e,t){return t==="transparent"?t:ie(parseFloat(e),"rgb(255, 255, 255)",t)}c(Ke);function Ue(e,t){if(t==="transparent")return t;var r=P(t),a=typeof r.alpha=="number"?r.alpha:1,n=d({},r,{alpha:_(0,1,+(a*100-parseFloat(e)*100).toFixed(2)/100)});return F(n)}var Ze=c(Ue),Je=Ze,Qe=w.div(J,({theme:e})=>({backgroundColor:e.base==="light"?"rgba(0,0,0,.01)":"rgba(255,255,255,.01)",borderRadius:e.appBorderRadius,border:`1px dashed ${e.appBorderColor}`,display:"flex",alignItems:"center",justifyContent:"center",padding:20,margin:"25px 0 40px",color:Je(.3,e.color.defaultText),fontSize:e.typography.size.s2})),Xe=e=>l.createElement(Qe,{...e,className:"docblock-emptyblock sb-unstyled"}),Ve=w(Z)(({theme:e})=>({fontSize:`${e.typography.size.s2-1}px`,lineHeight:"19px",margin:"25px 0 40px",borderRadius:e.appBorderRadius,boxShadow:e.base==="light"?"rgba(0, 0, 0, 0.10) 0 1px 3px 0":"rgba(0, 0, 0, 0.20) 0 2px 5px 0","pre.prismjs":{padding:20,background:"inherit"}})),et=w.div(({theme:e})=>({background:e.background.content,borderRadius:e.appBorderRadius,border:`1px solid ${e.appBorderColor}`,boxShadow:e.base==="light"?"rgba(0, 0, 0, 0.10) 0 1px 3px 0":"rgba(0, 0, 0, 0.20) 0 2px 5px 0",margin:"25px 0 40px",padding:"20px 20px 20px 22px"})),I=w.div(({theme:e})=>({animation:`${e.animation.glow} 1.5s ease-in-out infinite`,background:e.appBorderColor,height:17,marginTop:1,width:"60%",[`&:first-child${j}`]:{margin:0}})),tt=()=>l.createElement(et,null,l.createElement(I,null),l.createElement(I,{style:{width:"80%"}}),l.createElement(I,{style:{width:"30%"}}),l.createElement(I,{style:{width:"80%"}})),rt=({isLoading:e,error:t,language:r,code:a,dark:n,format:o=!0,...s})=>{let{typography:i}=A();if(e)return l.createElement(tt,null);if(t)return l.createElement(Xe,null,t);let p=l.createElement(Ve,{bordered:!0,copyable:!0,format:o,language:r??"jsx",className:"docblock-source sb-unstyled",...s},a);if(typeof n>"u")return p;let u=n?z.dark:z.light;return l.createElement(ee,{theme:te({...u,fontCode:i.fonts.mono,fontBase:i.fonts.base})},p)};H.register(W,e=>{H.add(le,{title:"Code",type:Q.PANEL,paramKey:re,disabled:t=>!t?.docs?.codePanel,match:({viewMode:t})=>t==="story",render:({active:t})=>{let r=e.getChannel(),a=e.getCurrentStoryData(),n=r?.last(ae)?.[0],[o,s]=K({source:n?.source,format:n?.format??void 0}),i=V(re,{source:{code:""},theme:"dark"});G(()=>{s({source:void 0,format:void 0})},[a?.id]),X({[ae]:({source:u,format:h})=>{s({source:u,format:h})}});let p=A().base!=="light";return l.createElement(U,{active:!!t},l.createElement(at,null,l.createElement(rt,{...i.source,code:i.source?.code||o.source||i.source?.originalSource,format:o.format,dark:p})))}})});var at=w.div(()=>({height:"100%",[`> :first-child${j}`]:{margin:0,height:"100%",boxShadow:"none"}}));})();
}catch(e){ console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e); }

import{r as i,z as se,aE as E,_ as oe,v as ue,P as Y,m as le,u as ce,j as W}from"./iframe-B6vHPHUS.js";import{_ as K}from"./objectSpread2-Cuy-jdVu.js";import{B as F}from"./Box-BsuLuKk6.js";var ge={percent:0,prefixCls:"rc-progress",strokeColor:"#2db7f5",strokeLinecap:"round",strokeWidth:1,trailColor:"#D9D9D9",trailWidth:1,gapPosition:"bottom"},de=function(){var t=i.useRef([]),r=i.useRef(null);return i.useEffect(function(){var n=Date.now(),a=!1;t.current.forEach(function(s){if(s){a=!0;var o=s.style;o.transitionDuration=".3s, .3s, .3s, .06s",r.current&&n-r.current<100&&(o.transitionDuration="0s, 0s")}}),a&&(r.current=Date.now())}),t.current};function me(){return!!(typeof window<"u"&&window.document&&window.document.createElement)}var X=0,ve=me();function pe(){var e;return ve?(e=X,X+=1):e="TEST_OR_SSR",e}const ke=function(e){var t=i.useState(),r=se(t,2),n=r[0],a=r[1];return i.useEffect(function(){a("rc_progress_".concat(pe()))},[]),e||n};var Z=function(t){var r=t.bg,n=t.children;return i.createElement("div",{style:{width:"100%",height:"100%",background:r}},n)};function J(e,t){return Object.keys(e).map(function(r){var n=parseFloat(r),a="".concat(Math.floor(n*t),"%");return"".concat(e[r]," ").concat(a)})}var fe=i.forwardRef(function(e,t){var r=e.prefixCls,n=e.color,a=e.gradientId,s=e.radius,o=e.style,g=e.ptg,k=e.strokeLinecap,l=e.strokeWidth,m=e.size,u=e.gapDegree,v=n&&E(n)==="object",f=v?"#FFF":void 0,d=m/2,c=i.createElement("circle",{className:"".concat(r,"-circle-path"),r:s,cx:d,cy:d,stroke:f,strokeLinecap:k,strokeWidth:l,opacity:g===0?0:1,style:o,ref:t});if(!v)return c;var y="".concat(a,"-conic"),w=u?"".concat(180+u/2,"deg"):"0deg",b=J(n,(360-u)/360),q=J(n,1),p="conic-gradient(from ".concat(w,", ").concat(b.join(", "),")"),h="linear-gradient(to ".concat(u?"bottom":"top",", ").concat(q.join(", "),")");return i.createElement(i.Fragment,null,i.createElement("mask",{id:y},c),i.createElement("foreignObject",{x:0,y:0,width:m,height:m,mask:"url(#".concat(y,")")},i.createElement(Z,{bg:h},i.createElement(Z,{bg:p}))))}),P=100,O=function(t,r,n,a,s,o,g,k,l,m){var u=arguments.length>10&&arguments[10]!==void 0?arguments[10]:0,v=n/100*360*((360-o)/360),f=o===0?0:{bottom:0,top:180,left:90,right:-90}[g],d=(100-a)/100*r;l==="round"&&a!==100&&(d+=m/2,d>=r&&(d=r-.01));var c=P/2;return{stroke:typeof k=="string"?k:void 0,strokeDasharray:"".concat(r,"px ").concat(t),strokeDashoffset:d+u,transform:"rotate(".concat(s+v+f,"deg)"),transformOrigin:"".concat(c,"px ").concat(c,"px"),transition:"stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s, opacity .3s ease 0s",fillOpacity:0}},ye=["id","prefixCls","steps","strokeWidth","trailWidth","gapDegree","gapPosition","trailColor","strokeLinecap","style","className","strokeColor","percent"];function Q(e){var t=e??[];return Array.isArray(t)?t:[t]}var be=function(t){var r=K(K({},ge),t),n=r.id,a=r.prefixCls,s=r.steps,o=r.strokeWidth,g=r.trailWidth,k=r.gapDegree,l=k===void 0?0:k,m=r.gapPosition,u=r.trailColor,v=r.strokeLinecap,f=r.style,d=r.className,c=r.strokeColor,y=r.percent,w=oe(r,ye),b=P/2,q=ke(n),p="".concat(q,"-gradient"),h=b-o/2,x=Math.PI*2*h,R=l>0?90+l/2:-90,S=x*((360-l)/360),A=E(s)==="object"?s:{count:s,space:2},T=A.count,G=A.space,$=Q(y),j=Q(c),H=j.find(function(L){return L&&E(L)==="object"}),re=H&&E(H)==="object",_=re?"butt":v,te=O(x,S,0,100,R,l,m,u,_,o),V=de(),ne=function(){var I=0;return $.map(function(B,C){var M=j[C]||j[j.length-1],D=O(x,S,I,B,R,l,m,M,_,o);return I+=B,i.createElement(fe,{key:C,color:M,ptg:B,radius:h,prefixCls:a,gradientId:p,style:D,strokeLinecap:_,strokeWidth:o,gapDegree:l,ref:function(z){V[C]=z},size:P})}).reverse()},ae=function(){var I=Math.round(T*($[0]/100)),B=100/T,C=0;return new Array(T).fill(null).map(function(M,D){var N=D<=I-1?j[0]:u,z=N&&E(N)==="object"?"url(#".concat(p,")"):void 0,U=O(x,S,C,B,R,l,m,N,"butt",o,G);return C+=(S-U.strokeDashoffset+G)*100/S,i.createElement("circle",{key:D,className:"".concat(a,"-circle-path"),r:h,cx:b,cy:b,stroke:z,strokeWidth:o,opacity:1,style:U,ref:function(ie){V[D]=ie}})})};return i.createElement("svg",ue({className:Y("".concat(a,"-circle"),d),viewBox:"0 0 ".concat(P," ").concat(P),style:f,id:n,role:"presentation"},w),!T&&i.createElement("circle",{className:"".concat(a,"-circle-trail"),r:h,cx:b,cy:b,stroke:u,strokeLinecap:_,strokeWidth:g||o,style:te}),T?ae():ne())};const he=le(e=>({root:{position:"relative",lineHeight:0},overlay:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -60%)",fontSize:e.typography.pxToRem(45),fontWeight:e.typography.fontWeightBold,color:e.palette.textContrast},overlaySmall:{fontSize:e.typography.pxToRem(25)},description:{fontSize:"100%",top:"50%",left:"50%",transform:"translate(-50%, -50%)",position:"absolute",wordBreak:"break-all",display:"inline-block"},circle:{width:"80%",transform:"translate(10%, 0)"},colorUnknown:{}}),{name:"BackstageGauge"}),ee={fractional:!0,inverse:!1,unit:"%",max:100,relativeToMax:!1},qe=({palette:e,value:t,inverse:r,max:n})=>{if(isNaN(t))return"#ddd";const a=n||ee.max,s=r?a-t:t;return s<a/3?e.status.error:s<a*(2/3)?e.status.warning:e.status.ok};function xe(e){const[t,r]=i.useState(null),{getColor:n=qe,size:a="normal"}=e,s=he(e),{palette:o}=ce(),{value:g,fractional:k,inverse:l,unit:m,max:u,description:v,relativeToMax:f,decimalDigits:d}={...ee,...e};let c;f?c=g/u*100:c=k?Math.round(g*u):g;let y;f?y=g:y=u!==100?Math.round(g):c;const w=d===void 0?y.toString():y.toFixed(d),[b,q]=i.useState(!1);return i.useEffect(()=>{const p=t,h=()=>q(!0),x=()=>q(!1);return p&&v?(p.addEventListener("mouseenter",h),p.addEventListener("mouseleave",x),()=>{p.removeEventListener("mouseenter",h),p.removeEventListener("mouseleave",x)}):()=>{q(!1)}},[v,t]),W.jsxs(F,{ref:r,className:s.root,children:[W.jsx(be,{strokeLinecap:"butt",percent:c,strokeWidth:12,trailWidth:12,strokeColor:n({palette:o,value:c,inverse:l,max:f?100:u}),className:s.circle}),v&&b?W.jsx(F,{className:s.description,children:v}):W.jsx(F,{className:Y(s.overlay,{[s.overlaySmall]:a==="small"}),children:isNaN(g)?"N/A":`${w}${m}`})]})}xe.__docgenInfo={description:`Circular Progress Bar

@public`,methods:[],displayName:"Gauge",props:{value:{required:!0,tsType:{name:"number"},description:""},fractional:{required:!1,tsType:{name:"boolean"},description:""},inverse:{required:!1,tsType:{name:"boolean"},description:""},unit:{required:!1,tsType:{name:"string"},description:""},max:{required:!1,tsType:{name:"number"},description:""},size:{required:!1,tsType:{name:"union",raw:"'normal' | 'small'",elements:[{name:"literal",value:"'normal'"},{name:"literal",value:"'small'"}]},description:""},description:{required:!1,tsType:{name:"ReactNode"},description:""},getColor:{required:!1,tsType:{name:"signature",type:"function",raw:"(args: GaugePropsGetColorOptions) => string",signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
  palette: BackstagePalette;
  value: number;
  inverse?: boolean;
  max?: number;
}`,signature:{properties:[{key:"palette",value:{name:"intersection",raw:"MuiPalette & BackstagePaletteAdditions",elements:[{name:"MuiPalette"},{name:"signature",type:"object",raw:`{
  status: {
    ok: string;
    warning: string;
    error: string;
    pending: string;
    running: string;
    aborted: string;
  };
  border: string;
  textContrast: string;
  textVerySubtle: string;
  textSubtle: string;
  highlight: string;
  errorBackground: string;
  warningBackground: string;
  infoBackground: string;
  errorText: string;
  infoText: string;
  warningText: string;
  linkHover: string;
  link: string;
  gold: string;
  navigation: {
    background: string;
    indicator: string;
    color: string;
    selectedColor: string;
    navItem?: {
      hoverBackground: string;
    };
    submenu?: {
      background: string;
    };
  };
  tabbar: {
    indicator: string;
  };
  /**
   * @deprecated The entire \`bursts\` section will be removed in a future release
   */
  bursts: {
    fontColor: string;
    slackChannelText: string;
    backgroundColor: {
      default: string;
    };
    gradient: {
      linear: string;
    };
  };
  pinSidebarButton: {
    icon: string;
    background: string;
  };
  banner: {
    info: string;
    error: string;
    text: string;
    link: string;
    closeButtonColor?: string;
    warning?: string;
  };
  code?: {
    background?: string;
  };
}`,signature:{properties:[{key:"status",value:{name:"signature",type:"object",raw:`{
  ok: string;
  warning: string;
  error: string;
  pending: string;
  running: string;
  aborted: string;
}`,signature:{properties:[{key:"ok",value:{name:"string",required:!0}},{key:"warning",value:{name:"string",required:!0}},{key:"error",value:{name:"string",required:!0}},{key:"pending",value:{name:"string",required:!0}},{key:"running",value:{name:"string",required:!0}},{key:"aborted",value:{name:"string",required:!0}}]},required:!0}},{key:"border",value:{name:"string",required:!0}},{key:"textContrast",value:{name:"string",required:!0}},{key:"textVerySubtle",value:{name:"string",required:!0}},{key:"textSubtle",value:{name:"string",required:!0}},{key:"highlight",value:{name:"string",required:!0}},{key:"errorBackground",value:{name:"string",required:!0}},{key:"warningBackground",value:{name:"string",required:!0}},{key:"infoBackground",value:{name:"string",required:!0}},{key:"errorText",value:{name:"string",required:!0}},{key:"infoText",value:{name:"string",required:!0}},{key:"warningText",value:{name:"string",required:!0}},{key:"linkHover",value:{name:"string",required:!0}},{key:"link",value:{name:"string",required:!0}},{key:"gold",value:{name:"string",required:!0}},{key:"navigation",value:{name:"signature",type:"object",raw:`{
  background: string;
  indicator: string;
  color: string;
  selectedColor: string;
  navItem?: {
    hoverBackground: string;
  };
  submenu?: {
    background: string;
  };
}`,signature:{properties:[{key:"background",value:{name:"string",required:!0}},{key:"indicator",value:{name:"string",required:!0}},{key:"color",value:{name:"string",required:!0}},{key:"selectedColor",value:{name:"string",required:!0}},{key:"navItem",value:{name:"signature",type:"object",raw:`{
  hoverBackground: string;
}`,signature:{properties:[{key:"hoverBackground",value:{name:"string",required:!0}}]},required:!1}},{key:"submenu",value:{name:"signature",type:"object",raw:`{
  background: string;
}`,signature:{properties:[{key:"background",value:{name:"string",required:!0}}]},required:!1}}]},required:!0}},{key:"tabbar",value:{name:"signature",type:"object",raw:`{
  indicator: string;
}`,signature:{properties:[{key:"indicator",value:{name:"string",required:!0}}]},required:!0}},{key:"bursts",value:{name:"signature",type:"object",raw:`{
  fontColor: string;
  slackChannelText: string;
  backgroundColor: {
    default: string;
  };
  gradient: {
    linear: string;
  };
}`,signature:{properties:[{key:"fontColor",value:{name:"string",required:!0}},{key:"slackChannelText",value:{name:"string",required:!0}},{key:"backgroundColor",value:{name:"signature",type:"object",raw:`{
  default: string;
}`,signature:{properties:[{key:"default",value:{name:"string",required:!0}}]},required:!0}},{key:"gradient",value:{name:"signature",type:"object",raw:`{
  linear: string;
}`,signature:{properties:[{key:"linear",value:{name:"string",required:!0}}]},required:!0}}]},required:!0},description:"@deprecated The entire `bursts` section will be removed in a future release"},{key:"pinSidebarButton",value:{name:"signature",type:"object",raw:`{
  icon: string;
  background: string;
}`,signature:{properties:[{key:"icon",value:{name:"string",required:!0}},{key:"background",value:{name:"string",required:!0}}]},required:!0}},{key:"banner",value:{name:"signature",type:"object",raw:`{
  info: string;
  error: string;
  text: string;
  link: string;
  closeButtonColor?: string;
  warning?: string;
}`,signature:{properties:[{key:"info",value:{name:"string",required:!0}},{key:"error",value:{name:"string",required:!0}},{key:"text",value:{name:"string",required:!0}},{key:"link",value:{name:"string",required:!0}},{key:"closeButtonColor",value:{name:"string",required:!1}},{key:"warning",value:{name:"string",required:!1}}]},required:!0}},{key:"code",value:{name:"signature",type:"object",raw:`{
  background?: string;
}`,signature:{properties:[{key:"background",value:{name:"string",required:!1}}]},required:!1}}]}}],required:!0}},{key:"value",value:{name:"number",required:!0}},{key:"inverse",value:{name:"boolean",required:!1}},{key:"max",value:{name:"number",required:!1}}]}},name:"args"}],return:{name:"string"}}},description:""},relativeToMax:{required:!1,tsType:{name:"boolean"},description:""},decimalDigits:{required:!1,tsType:{name:"number"},description:""}}};export{xe as G,ge as d,qe as g,de as u};

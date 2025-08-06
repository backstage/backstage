import{j as r}from"./jsx-runtime-CvpxdxdE.js";import{b as Q,_ as U}from"./defaultTheme-DT8oR2d2.js";import{_ as j}from"./objectSpread2-cg3Cjc-H.js";import{r as b}from"./index-DSHF18-l.js";import{c as X}from"./index-jB8bSz_h.js";import{d as Y,u as Z,g as ee}from"./Gauge-CJ4ujEnz.js";import{u as re}from"./useTheme-DT5kHe_T.js";import{T as ne}from"./Tooltip-BZbacX7V.js";import{T as te}from"./Typography-C4wK928C.js";import"./makeStyles-yUUo8jj4.js";import"./Box-CBL4LtOb.js";import"./typography-BTdCO-e1.js";import"./hoist-non-react-statics.cjs-DlMN-SZi.js";import"./index-DBvFAGNd.js";import"./capitalize-Bw5a1ocu.js";import"./withStyles-BYtY9EuN.js";import"./useIsFocusVisible-Sgmp0f7s.js";import"./unstable_useId-BAMTp7ON.js";import"./useControlled-i6Pam0ca.js";import"./Popper-B4Xi0-98.js";import"./createChainedFunction-Da-WpsAN.js";import"./Portal-Dl07bpo2.js";import"./Grow-CSLyW-xI.js";import"./utils-BnkjTVkr.js";import"./TransitionGroupContext-BUwkeBv7.js";var ae=["className","percent","prefixCls","strokeColor","strokeLinecap","strokeWidth","style","trailColor","trailWidth","transition"],ie=function(c){var e=j(j({},Y),c),k=e.className,o=e.percent,n=e.prefixCls,i=e.strokeColor,t=e.strokeLinecap,a=e.strokeWidth,A=e.style,E=e.trailColor,O=e.trailWidth,H=e.transition,q=Q(e,ae);delete q.gapPosition;var R=Array.isArray(o)?o:[o],v=Array.isArray(i)?i:[i],V=Z(),y=a/2,$=100-a/2,x="M ".concat(t==="round"?y:0,",").concat(y,`
         L `).concat(t==="round"?$:100,",").concat(y),z="0 0 100 ".concat(a),w=0;return b.createElement("svg",U({className:X("".concat(n,"-line"),k),viewBox:z,preserveAspectRatio:"none",style:A},q),b.createElement("path",{className:"".concat(n,"-line-trail"),d:x,strokeLinecap:t,stroke:E,strokeWidth:O||a,fillOpacity:"0"}),R.map(function(C,f){var m=1;switch(t){case"round":m=1-a/100;break;case"square":m=1-a/2/100;break;default:m=1;break}var F={strokeDasharray:"".concat(C*m,"px, 100px"),strokeDashoffset:"-".concat(w,"px"),transition:H||"stroke-dashoffset 0.3s ease 0s, stroke-dasharray .3s ease 0s, stroke 0.3s linear"},J=v[f]||v[v.length-1];return w+=C,b.createElement("path",{key:f,className:"".concat(n,"-line-path"),d:x,strokeLinecap:t,stroke:J,strokeWidth:a,fillOpacity:"0",ref:function(K){V[f]=K},style:F})}))};function s(h){const{value:c,getColor:e=ee,width:k="thick"}=h,{palette:o}=re();if(isNaN(c))return null;let n=Math.round(c*100*100)/100;n>100&&(n=100);const i=k==="thick"?4:1,t=e({palette:o,value:n,inverse:!1,max:100});return r.jsx(ne,{title:`${n}%`,children:r.jsx(te,{component:"span",children:r.jsx(ie,{percent:n,strokeWidth:i,trailWidth:i,strokeColor:t})})})}s.__docgenInfo={description:"",methods:[],displayName:"LinearGauge",props:{value:{required:!0,tsType:{name:"number"},description:"Progress value between 0.0 - 1.0."},width:{required:!1,tsType:{name:"union",raw:"'thick' | 'thin'",elements:[{name:"literal",value:"'thick'"},{name:"literal",value:"'thin'"}]},description:""},getColor:{required:!1,tsType:{name:"signature",type:"function",raw:"(args: GaugePropsGetColorOptions) => string",signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"background",value:{name:"string",required:!1}}]},required:!1}}]}}],required:!0}},{key:"value",value:{name:"number",required:!0}},{key:"inverse",value:{name:"boolean",required:!1}},{key:"max",value:{name:"number",required:!1}}]}},name:"args"}],return:{name:"string"}}},description:""}}};const p={width:300},Ne={title:"Data Display/LinearGauge",component:s},u=()=>r.jsx("div",{style:p,children:r.jsx(s,{value:.8})}),l=()=>r.jsx("div",{style:p,children:r.jsx(s,{value:.5})}),g=()=>r.jsx("div",{style:p,children:r.jsx(s,{value:.2})}),d=()=>r.jsx("div",{style:p,children:r.jsx(s,{getColor:()=>"#f0f",value:.5})});u.__docgenInfo={description:"",methods:[],displayName:"Default"};l.__docgenInfo={description:"",methods:[],displayName:"MediumProgress"};g.__docgenInfo={description:"",methods:[],displayName:"LowProgress"};d.__docgenInfo={description:"",methods:[],displayName:"StaticColor"};var S,P,T;u.parameters={...u.parameters,docs:{...(S=u.parameters)==null?void 0:S.docs,source:{originalSource:`() => <div style={containerStyle}>
    <LinearGauge value={0.8} />
  </div>`,...(T=(P=u.parameters)==null?void 0:P.docs)==null?void 0:T.source}}};var _,B,L;l.parameters={...l.parameters,docs:{...(_=l.parameters)==null?void 0:_.docs,source:{originalSource:`() => <div style={containerStyle}>
    <LinearGauge value={0.5} />
  </div>`,...(L=(B=l.parameters)==null?void 0:B.docs)==null?void 0:L.source}}};var N,W,G;g.parameters={...g.parameters,docs:{...(N=g.parameters)==null?void 0:N.docs,source:{originalSource:`() => <div style={containerStyle}>
    <LinearGauge value={0.2} />
  </div>`,...(G=(W=g.parameters)==null?void 0:W.docs)==null?void 0:G.source}}};var D,I,M;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`() => <div style={containerStyle}>
    <LinearGauge getColor={() => '#f0f'} value={0.5} />
  </div>`,...(M=(I=d.parameters)==null?void 0:I.docs)==null?void 0:M.source}}};const We=["Default","MediumProgress","LowProgress","StaticColor"];export{u as Default,g as LowProgress,l as MediumProgress,d as StaticColor,We as __namedExportsOrder,Ne as default};

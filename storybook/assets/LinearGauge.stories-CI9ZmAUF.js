import{_ as M,r as f,t as A,N as E,u as O,j as r,d as H}from"./iframe-CA0Xqitl.js";import{_ as j}from"./objectSpread2-DnjQsjez.js";import{d as R,u as V,g as $}from"./Gauge-C6ERBPuc.js";import{T as z}from"./Tooltip-CuEp3aUv.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-Ds7zC8BR.js";import"./styled-BOzNBejn.js";import"./Popper-yvDUz_ZU.js";import"./Portal-DUJxNLzx.js";var F=["className","percent","prefixCls","strokeColor","strokeLinecap","strokeWidth","style","trailColor","trailWidth","transition"],J=function(c){var e=j(j({},R),c),k=e.className,o=e.percent,n=e.prefixCls,i=e.strokeColor,t=e.strokeLinecap,a=e.strokeWidth,S=e.style,P=e.trailColor,_=e.trailWidth,B=e.transition,q=M(e,F);delete q.gapPosition;var L=Array.isArray(o)?o:[o],v=Array.isArray(i)?i:[i],T=V(),y=a/2,N=100-a/2,x="M ".concat(t==="round"?y:0,",").concat(y,`
         L `).concat(t==="round"?N:100,",").concat(y),W="0 0 100 ".concat(a),w=0;return f.createElement("svg",A({className:E("".concat(n,"-line"),k),viewBox:W,preserveAspectRatio:"none",style:S},q),f.createElement("path",{className:"".concat(n,"-line-trail"),d:x,strokeLinecap:t,stroke:P,strokeWidth:_||a,fillOpacity:"0"}),L.map(function(C,b){var m=1;switch(t){case"round":m=1-a/100;break;case"square":m=1-a/2/100;break;default:m=1;break}var G={strokeDasharray:"".concat(C*m,"px, 100px"),strokeDashoffset:"-".concat(w,"px"),transition:B||"stroke-dashoffset 0.3s ease 0s, stroke-dasharray .3s ease 0s, stroke 0.3s linear"},D=v[b]||v[v.length-1];return w+=C,f.createElement("path",{key:b,className:"".concat(n,"-line-path"),d:x,strokeLinecap:t,stroke:D,strokeWidth:a,fillOpacity:"0",ref:function(I){T[b]=I},style:G})}))};function s(h){const{value:c,getColor:e=$,width:k="thick"}=h,{palette:o}=O();if(isNaN(c))return null;let n=Math.round(c*100*100)/100;n>100&&(n=100);const i=k==="thick"?4:1,t=e({palette:o,value:n,inverse:!1,max:100});return r.jsx(z,{title:`${n}%`,children:r.jsx(H,{component:"span",children:r.jsx(J,{percent:n,strokeWidth:i,trailWidth:i,strokeColor:t})})})}s.__docgenInfo={description:"",methods:[],displayName:"LinearGauge",props:{value:{required:!0,tsType:{name:"number"},description:"Progress value between 0.0 - 1.0."},width:{required:!1,tsType:{name:"union",raw:"'thick' | 'thin'",elements:[{name:"literal",value:"'thick'"},{name:"literal",value:"'thin'"}]},description:""},getColor:{required:!1,tsType:{name:"signature",type:"function",raw:"(args: GaugePropsGetColorOptions) => string",signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"background",value:{name:"string",required:!1}}]},required:!1}}]}}],required:!0}},{key:"value",value:{name:"number",required:!0}},{key:"inverse",value:{name:"boolean",required:!1}},{key:"max",value:{name:"number",required:!1}}]}},name:"args"}],return:{name:"string"}}},description:""}}};const p={width:300},ae={title:"Data Display/LinearGauge",component:s},u=()=>r.jsx("div",{style:p,children:r.jsx(s,{value:.8})}),l=()=>r.jsx("div",{style:p,children:r.jsx(s,{value:.5})}),g=()=>r.jsx("div",{style:p,children:r.jsx(s,{value:.2})}),d=()=>r.jsx("div",{style:p,children:r.jsx(s,{getColor:()=>"#f0f",value:.5})});u.__docgenInfo={description:"",methods:[],displayName:"Default"};l.__docgenInfo={description:"",methods:[],displayName:"MediumProgress"};g.__docgenInfo={description:"",methods:[],displayName:"LowProgress"};d.__docgenInfo={description:"",methods:[],displayName:"StaticColor"};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <LinearGauge value={0.8} />
  </div>`,...u.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <LinearGauge value={0.5} />
  </div>`,...l.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <LinearGauge value={0.2} />
  </div>`,...g.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <LinearGauge getColor={() => '#f0f'} value={0.5} />
  </div>`,...d.parameters?.docs?.source}}};const ie=["Default","MediumProgress","LowProgress","StaticColor"];export{u as Default,g as LowProgress,l as MediumProgress,d as StaticColor,ie as __namedExportsOrder,ae as default};

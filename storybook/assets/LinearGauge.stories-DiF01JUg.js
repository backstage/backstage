import{j as r}from"./jsx-runtime-hv06LKfz.js";import{_ as M,a as A}from"./defaultTheme-NkpNA350.js";import{_ as j}from"./objectSpread2-DqJxAmNn.js";import{r as b}from"./index-D8-PC79C.js";import{c as E}from"./index-DlxYA1zJ.js";import{d as O,u as H,g as R}from"./Gauge-Dkjb8boV.js";import{u as V}from"./useTheme-Dk0AiudM.js";import{T as $}from"./Tooltip-fGAyvfC5.js";import{T as z}from"./Typography-NhBf-tfS.js";import"./makeStyles-CJp8qHqH.js";import"./Box-dSpCvcz2.js";import"./typography-Mwc_tj4E.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./capitalize-fS9uM6tv.js";import"./withStyles-BsQ9H3bp.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./unstable_useId-DQJte0g1.js";import"./useControlled-CliGfT3L.js";import"./Popper-ErueZYbr.js";import"./createChainedFunction-Da-WpsAN.js";import"./Portal-yuzZovYw.js";import"./Grow-BOepmPk1.js";import"./utils-DMni-BWz.js";import"./TransitionGroupContext-CcnbR2YJ.js";var F=["className","percent","prefixCls","strokeColor","strokeLinecap","strokeWidth","style","trailColor","trailWidth","transition"],J=function(c){var e=j(j({},O),c),k=e.className,o=e.percent,n=e.prefixCls,i=e.strokeColor,t=e.strokeLinecap,a=e.strokeWidth,S=e.style,P=e.trailColor,T=e.trailWidth,_=e.transition,q=M(e,F);delete q.gapPosition;var B=Array.isArray(o)?o:[o],v=Array.isArray(i)?i:[i],L=H(),y=a/2,N=100-a/2,x="M ".concat(t==="round"?y:0,",").concat(y,`
         L `).concat(t==="round"?N:100,",").concat(y),W="0 0 100 ".concat(a),w=0;return b.createElement("svg",A({className:E("".concat(n,"-line"),k),viewBox:W,preserveAspectRatio:"none",style:S},q),b.createElement("path",{className:"".concat(n,"-line-trail"),d:x,strokeLinecap:t,stroke:P,strokeWidth:T||a,fillOpacity:"0"}),B.map(function(C,f){var m=1;switch(t){case"round":m=1-a/100;break;case"square":m=1-a/2/100;break;default:m=1;break}var G={strokeDasharray:"".concat(C*m,"px, 100px"),strokeDashoffset:"-".concat(w,"px"),transition:_||"stroke-dashoffset 0.3s ease 0s, stroke-dasharray .3s ease 0s, stroke 0.3s linear"},D=v[f]||v[v.length-1];return w+=C,b.createElement("path",{key:f,className:"".concat(n,"-line-path"),d:x,strokeLinecap:t,stroke:D,strokeWidth:a,fillOpacity:"0",ref:function(I){L[f]=I},style:G})}))};function s(h){const{value:c,getColor:e=R,width:k="thick"}=h,{palette:o}=V();if(isNaN(c))return null;let n=Math.round(c*100*100)/100;n>100&&(n=100);const i=k==="thick"?4:1,t=e({palette:o,value:n,inverse:!1,max:100});return r.jsx($,{title:`${n}%`,children:r.jsx(z,{component:"span",children:r.jsx(J,{percent:n,strokeWidth:i,trailWidth:i,strokeColor:t})})})}s.__docgenInfo={description:"",methods:[],displayName:"LinearGauge",props:{value:{required:!0,tsType:{name:"number"},description:"Progress value between 0.0 - 1.0."},width:{required:!1,tsType:{name:"union",raw:"'thick' | 'thin'",elements:[{name:"literal",value:"'thick'"},{name:"literal",value:"'thin'"}]},description:""},getColor:{required:!1,tsType:{name:"signature",type:"function",raw:"(args: GaugePropsGetColorOptions) => string",signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"background",value:{name:"string",required:!1}}]},required:!1}}]}}],required:!0}},{key:"value",value:{name:"number",required:!0}},{key:"inverse",value:{name:"boolean",required:!1}},{key:"max",value:{name:"number",required:!1}}]}},name:"args"}],return:{name:"string"}}},description:""}}};const p={width:300},qe={title:"Data Display/LinearGauge",component:s},u=()=>r.jsx("div",{style:p,children:r.jsx(s,{value:.8})}),l=()=>r.jsx("div",{style:p,children:r.jsx(s,{value:.5})}),g=()=>r.jsx("div",{style:p,children:r.jsx(s,{value:.2})}),d=()=>r.jsx("div",{style:p,children:r.jsx(s,{getColor:()=>"#f0f",value:.5})});u.__docgenInfo={description:"",methods:[],displayName:"Default"};l.__docgenInfo={description:"",methods:[],displayName:"MediumProgress"};g.__docgenInfo={description:"",methods:[],displayName:"LowProgress"};d.__docgenInfo={description:"",methods:[],displayName:"StaticColor"};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <LinearGauge value={0.8} />
  </div>`,...u.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <LinearGauge value={0.5} />
  </div>`,...l.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <LinearGauge value={0.2} />
  </div>`,...g.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <LinearGauge getColor={() => '#f0f'} value={0.5} />
  </div>`,...d.parameters?.docs?.source}}};const xe=["Default","MediumProgress","LowProgress","StaticColor"];export{u as Default,g as LowProgress,l as MediumProgress,d as StaticColor,xe as __namedExportsOrder,qe as default};

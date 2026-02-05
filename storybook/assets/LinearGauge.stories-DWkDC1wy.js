import{g as M,r as b,_ as A,d as E,u as O,j as r,e as H}from"./iframe-M9O-K8SB.js";import{_ as j}from"./objectSpread2-izM-efS4.js";import{d as R,u as V,g as $}from"./Gauge-DGVyLgyX.js";import{T as z}from"./Tooltip-Bg-nqDOZ.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-DrVgjJoD.js";import"./styled-Ddkk_tuK.js";import"./Popper-BxqJldSX.js";import"./Portal-B9990TVI.js";var F=["className","percent","prefixCls","strokeColor","strokeLinecap","strokeWidth","style","trailColor","trailWidth","transition"],J=function(c){var e=j(j({},R),c),v=e.className,d=e.percent,n=e.prefixCls,l=e.strokeColor,o=e.strokeLinecap,u=e.strokeWidth,S=e.style,L=e.trailColor,P=e.trailWidth,_=e.transition,q=M(e,F);delete q.gapPosition;var B=Array.isArray(d)?d:[d],k=Array.isArray(l)?l:[l],T=V(),y=u/2,G=100-u/2,x="M ".concat(o==="round"?y:0,",").concat(y,`
         L `).concat(o==="round"?G:100,",").concat(y),N="0 0 100 ".concat(u),w=0;return b.createElement("svg",A({className:E("".concat(n,"-line"),v),viewBox:N,preserveAspectRatio:"none",style:S},q),b.createElement("path",{className:"".concat(n,"-line-trail"),d:x,strokeLinecap:o,stroke:L,strokeWidth:P||u,fillOpacity:"0"}),B.map(function(C,f){var m=1;switch(o){case"round":m=1-u/100;break;case"square":m=1-u/2/100;break;default:m=1;break}var W={strokeDasharray:"".concat(C*m,"px, 100px"),strokeDashoffset:"-".concat(w,"px"),transition:_||"stroke-dashoffset 0.3s ease 0s, stroke-dasharray .3s ease 0s, stroke 0.3s linear"},D=k[f]||k[k.length-1];return w+=C,b.createElement("path",{key:f,className:"".concat(n,"-line-path"),d:x,strokeLinecap:o,stroke:D,strokeWidth:u,fillOpacity:"0",ref:function(I){T[f]=I},style:W})}))};function g(h){const{value:c,getColor:e=$,width:v="thick"}=h,{palette:d}=O();if(isNaN(c))return null;let n=Math.round(c*100*100)/100;n>100&&(n=100);const l=v==="thick"?4:1,o=e({palette:d,value:n,inverse:!1,max:100});return r.jsx(z,{title:`${n}%`,children:r.jsx(H,{component:"span",children:r.jsx(J,{percent:n,strokeWidth:l,trailWidth:l,strokeColor:o})})})}g.__docgenInfo={description:"",methods:[],displayName:"LinearGauge",props:{value:{required:!0,tsType:{name:"number"},description:"Progress value between 0.0 - 1.0."},width:{required:!1,tsType:{name:"union",raw:"'thick' | 'thin'",elements:[{name:"literal",value:"'thick'"},{name:"literal",value:"'thin'"}]},description:""},getColor:{required:!1,tsType:{name:"signature",type:"function",raw:"(args: GaugePropsGetColorOptions) => string",signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"background",value:{name:"string",required:!1}}]},required:!1}}]}}],required:!0}},{key:"value",value:{name:"number",required:!0}},{key:"inverse",value:{name:"boolean",required:!1}},{key:"max",value:{name:"number",required:!1}}]}},name:"args"}],return:{name:"string"}}},description:""}}};const p={width:300},ae={title:"Data Display/LinearGauge",component:g,tags:["!manifest"]},t=()=>r.jsx("div",{style:p,children:r.jsx(g,{value:.8})}),a=()=>r.jsx("div",{style:p,children:r.jsx(g,{value:.5})}),i=()=>r.jsx("div",{style:p,children:r.jsx(g,{value:.2})}),s=()=>r.jsx("div",{style:p,children:r.jsx(g,{getColor:()=>"#f0f",value:.5})});t.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"MediumProgress"};i.__docgenInfo={description:"",methods:[],displayName:"LowProgress"};s.__docgenInfo={description:"",methods:[],displayName:"StaticColor"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const Default = () => (
  <div style={containerStyle}>
    <LinearGauge value={0.8} />
  </div>
);
`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const MediumProgress = () => (
  <div style={containerStyle}>
    <LinearGauge value={0.5} />
  </div>
);
`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{code:`const LowProgress = () => (
  <div style={containerStyle}>
    <LinearGauge value={0.2} />
  </div>
);
`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const StaticColor = () => (
  <div style={containerStyle}>
    <LinearGauge getColor={() => "#f0f"} value={0.5} />
  </div>
);
`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <LinearGauge value={0.8} />
  </div>`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <LinearGauge value={0.5} />
  </div>`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <LinearGauge value={0.2} />
  </div>`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <LinearGauge getColor={() => '#f0f'} value={0.5} />
  </div>`,...s.parameters?.docs?.source}}};const ie=["Default","MediumProgress","LowProgress","StaticColor"];export{t as Default,i as LowProgress,a as MediumProgress,s as StaticColor,ie as __namedExportsOrder,ae as default};

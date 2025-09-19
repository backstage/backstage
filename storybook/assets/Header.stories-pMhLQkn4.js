import{j as e}from"./iframe-hd6BgcQH.js";import{H as o}from"./Header-CAvgC825.js";import{P as p}from"./Page-BWbDECR4.js";import{H as r}from"./HeaderLabel-DsLodAO5.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-54I3Et5U.js";import"./Box-C4_Hx4tK.js";import"./styled-Csv0DLFw.js";import"./Grid-C4Dm4yGa.js";import"./Breadcrumbs-y9Hok9Wg.js";import"./index-DnL3XN75.js";import"./Popover-w_sS1QxY.js";import"./Modal-DC-l3nZj.js";import"./Portal-QtjodaYU.js";import"./List-Eydl9qQR.js";import"./ListContext-DMV1tqqG.js";import"./ListItem-BuICECdF.js";import"./Link-DIsoXdRS.js";import"./lodash-CwBbdt2Q.js";import"./index-BvioCNb0.js";import"./useAnalytics-BNw5WHP5.js";import"./useApp-D57mFECn.js";import"./Page-Mmd9AkpJ.js";import"./useMediaQuery-CQ8eWNdn.js";import"./Tooltip-DHFXXWJ1.js";import"./Popper-BLI_ywQx.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
  type: string;
  title: string;
  subtitle: string;
}) => {
  const {
    type
  } = args;
  return <Page themeId={type}>
      <Header {...args}>{labels}</Header>
    </Page>;
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,N as default};

import{bR as e}from"./iframe-hQz1Bovf.js";import{H as o}from"./Header-Cw1UyyB0.js";import{P as p}from"./Page-Dmam8Ca3.js";import{H as r}from"./HeaderLabel-BLcMX1LE.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-D_kgFV2s.js";import"./Box-CFfSeaSI.js";import"./styled-DjRvED2X.js";import"./Grid-BHtxnF4E.js";import"./makeStyles-CRkWSsAX.js";import"./Breadcrumbs-DuiJD8-S.js";import"./index-B9sM2jn7.js";import"./Popover-DfiFNTXi.js";import"./Modal-DvhKrn83.js";import"./Portal-CPzfTq6t.js";import"./List-Czan3J2f.js";import"./ListContext-Dkj8oSFA.js";import"./ListItem-Cj74SqHm.js";import"./Link-Bcq4-4Is.js";import"./index-tlBBGTW_.js";import"./lodash-BeTb6-To.js";import"./useAnalytics-1xUyB9Hg.js";import"./useApp-CNSTaFkm.js";import"./Page-6Wa2Eljw.js";import"./useMediaQuery-DCWmJXDR.js";import"./Tooltip-SafoiP2J.js";import"./Popper-BEk1nR9x.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,N as default};

import{bR as e}from"./iframe-NUkawwzR.js";import{H as o}from"./Header-p4p4zfbO.js";import{P as p}from"./Page-CfQcB0aR.js";import{H as r}from"./HeaderLabel-C-gOg1qu.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BwjYeXHS.js";import"./Box-uNF0ND2L.js";import"./styled-CoNMgIxM.js";import"./Grid-CTlAuf7X.js";import"./makeStyles-CNV3hMKY.js";import"./Breadcrumbs-byjfXBGb.js";import"./index-B9sM2jn7.js";import"./Popover-2iYb6kWG.js";import"./Modal-DAR7GsXJ.js";import"./Portal-BgDfH8Z8.js";import"./List-B-MMhnOL.js";import"./ListContext-MI5-zAg3.js";import"./ListItem-B_oYa0lB.js";import"./Link-B2W3RHwT.js";import"./index-DGio2NzG.js";import"./lodash-BZMNBUXh.js";import"./useAnalytics-D_vtRMir.js";import"./useApp-C-T9q94R.js";import"./Page-BJJuTOWL.js";import"./useMediaQuery-RCIMYZo4.js";import"./Tooltip-CdpWTf1d.js";import"./Popper-BHCCzf0k.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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

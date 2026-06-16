import{bR as e}from"./iframe-Bm5ba6Eo.js";import{H as o}from"./Header-CAEoexQq.js";import{P as p}from"./Page-Biu1ipXL.js";import{H as r}from"./HeaderLabel-CfrllZOg.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BJb3UP4I.js";import"./Box-NESd7kYt.js";import"./styled-DeEwf9nS.js";import"./Grid-2YxRqddS.js";import"./makeStyles-BxPw9vCe.js";import"./Breadcrumbs--_LvaeiO.js";import"./index-B9sM2jn7.js";import"./Popover-CYDJVvd7.js";import"./Modal-Cx8YqiY2.js";import"./Portal-Cg5Nvqt2.js";import"./List-CJhMPRPP.js";import"./ListContext-CVjS-G2V.js";import"./ListItem-UVpWaDMa.js";import"./Link-BddbTmYm.js";import"./index-ob8zNRki.js";import"./lodash-KBhUdAYx.js";import"./useAnalytics-BQdStjBt.js";import"./useApp-kMVg8txh.js";import"./Page-GHPfoNq2.js";import"./useMediaQuery-C64kqk46.js";import"./Tooltip-Dj-fCTBD.js";import"./Popper-SjxBkGs3.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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

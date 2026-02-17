import{j as t}from"./iframe-BWaAozhM.js";import{H as i}from"./Header-mPkv1lID.js";import{P as a}from"./Page-Br4yEsYS.js";import{H as r}from"./HeaderLabel-BRYzGJBt.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BNMTjnmn.js";import"./makeStyles-BXQqwRxM.js";import"./Box-B9d7t8SV.js";import"./styled-BFyqjI4T.js";import"./Grid-Bpm_oOGo.js";import"./Breadcrumbs-Cu-x-74e.js";import"./index-B9sM2jn7.js";import"./Popover-GnSZHMUP.js";import"./Modal-DSMNGChR.js";import"./Portal-CeZ7D8j3.js";import"./List-d_1gDOpt.js";import"./ListContext-KZtCLGQU.js";import"./ListItem-CwaI1EQV.js";import"./Link-CLkGqC_d.js";import"./index-8XpF7eZo.js";import"./lodash-C-lPDFyh.js";import"./index-Dm-FVvkq.js";import"./useAnalytics-CGFkzRxT.js";import"./useApp-oTx36hQg.js";import"./Page-DnN8b5qI.js";import"./useMediaQuery-DxWsq45C.js";import"./Tooltip-f0Mm140e.js";import"./Popper-Bx9nzt2H.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { type } = args;

  return (
    <Page themeId={type}>
      <Header type="home" title="This is a title" subtitle="This is a subtitle">
        {labels}
      </Header>
    </Page>
  );
};
`,...e.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`(args: {
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
}`,...e.parameters?.docs?.source}}};const k=["Default"];export{e as Default,k as __namedExportsOrder,S as default};

import{j as t}from"./iframe-CXYsSFqX.js";import{H as i}from"./Header-CIN7maHp.js";import{P as a}from"./Page-Bhw_X4l9.js";import{H as r}from"./HeaderLabel-CnDn371E.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DDFNY1L8.js";import"./Box-DCh7b65F.js";import"./styled-DYzq_tB8.js";import"./Grid-CBLufU_i.js";import"./Breadcrumbs-C2cQp20E.js";import"./index-B9sM2jn7.js";import"./Popover-Cjl51Zxu.js";import"./Modal-D6jcPeuR.js";import"./Portal-y4yvUJUe.js";import"./List-CDWQPT5T.js";import"./ListContext-CWoF9LZC.js";import"./ListItem-DLX99J84.js";import"./Link-DWEj90Ez.js";import"./lodash-Czox7iJy.js";import"./index-mbELQmCK.js";import"./useAnalytics-wpQnmzLK.js";import"./useApp-LC36H6z3.js";import"./Page-CR8-gVCX.js";import"./useMediaQuery-rzHzD8B0.js";import"./Tooltip-DYDrJaUH.js";import"./Popper-BaB5wJeP.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...e.parameters?.docs?.source}}};const R=["Default"];export{e as Default,R as __namedExportsOrder,N as default};

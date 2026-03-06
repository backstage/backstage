import{j as t}from"./iframe-CMBqt-A6.js";import{H as i}from"./Header-BXDvp28b.js";import{P as a}from"./Page-BFu83TT5.js";import{H as r}from"./HeaderLabel-DmqJ2PzJ.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-swi6xFUN.js";import"./makeStyles-OaxjZhE6.js";import"./Box-iylMMNr_.js";import"./styled-B4IYquMA.js";import"./Grid-DdcqWz44.js";import"./Breadcrumbs-f_EsGSbg.js";import"./index-B9sM2jn7.js";import"./Popover-DfyanNUg.js";import"./Modal-BA9N_ZP5.js";import"./Portal-CNrrtJUq.js";import"./List-B_Ga0lkw.js";import"./ListContext-CNfMiW9V.js";import"./ListItem-Cz-H-GSR.js";import"./Link-ChThVH_b.js";import"./index-B6V69iLc.js";import"./lodash-CmQdFQ2M.js";import"./index-9jpoN6B7.js";import"./useAnalytics-C5YKKJWk.js";import"./useApp-C6w65p7O.js";import"./Page-8OptEZu0.js";import"./useMediaQuery-BxggRSoP.js";import"./Tooltip-B1ugzKqz.js";import"./Popper-BlEuC4wp.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

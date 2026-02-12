import{j as t}from"./iframe-B4O_Vvag.js";import{H as i}from"./Header-CIdfz63Y.js";import{P as a}from"./Page-DWHCDHVK.js";import{H as r}from"./HeaderLabel-D3V9q5mz.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CoUzSUOZ.js";import"./makeStyles-cJwDV4Qm.js";import"./Box-C04O_gsk.js";import"./styled-PYdNBIQ3.js";import"./Grid-_k0ZCqMG.js";import"./Breadcrumbs-BfLmEOau.js";import"./index-B9sM2jn7.js";import"./Popover-DYirk5y4.js";import"./Modal-Dd9cCrfG.js";import"./Portal-xwYCxZwo.js";import"./List-DFytLOeW.js";import"./ListContext-sIVQTiWf.js";import"./ListItem-5COuZZ3k.js";import"./Link-BOAEMJKF.js";import"./index-BAgXqP9X.js";import"./lodash-Dnd4eAD2.js";import"./index-Cy_WZBfJ.js";import"./useAnalytics-Bg8WP0fn.js";import"./useApp-5p1flZ5M.js";import"./Page-DxJMHP-u.js";import"./useMediaQuery-DQEcvruJ.js";import"./Tooltip-DIKSL5Jf.js";import"./Popper-BBytZYgc.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

import{j as t}from"./iframe-C1ohgxPY.js";import{H as i}from"./Header-CO9ck4es.js";import{P as a}from"./Page-q3ZMbJSG.js";import{H as r}from"./HeaderLabel-BT7ki2ZJ.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CwPqQe4j.js";import"./Box-B9XEklXr.js";import"./styled-DiQntVKI.js";import"./Grid-ClUEh4fm.js";import"./Breadcrumbs-CxdD3rZO.js";import"./index-B9sM2jn7.js";import"./Popover-dG1DuDKo.js";import"./Modal-EWqQvSRV.js";import"./Portal-CA7fRi5Y.js";import"./List-BRbAiMJU.js";import"./ListContext-Ds-TBdUQ.js";import"./ListItem-Ck2-kEA7.js";import"./Link-DLDptLAM.js";import"./lodash-Czox7iJy.js";import"./index-pzwzu_48.js";import"./useAnalytics-CjWTFi6W.js";import"./useApp-J6Z3sWBa.js";import"./Page-DP0lLrKb.js";import"./useMediaQuery-D8awJejh.js";import"./Tooltip-Dpj1LhZh.js";import"./Popper-BcbGe3J0.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

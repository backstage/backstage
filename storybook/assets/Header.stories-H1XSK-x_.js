import{j as t}from"./iframe-Dc6SVWG5.js";import{H as i}from"./Header-DU4iKDjU.js";import{P as a}from"./Page-C4OWdnPB.js";import{H as r}from"./HeaderLabel-CEYeTwn_.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BctwlJgP.js";import"./Box-DORcO5nL.js";import"./styled-Dq5lPzbL.js";import"./Grid-BSXyf9SS.js";import"./Breadcrumbs-B5C_EO2M.js";import"./index-B9sM2jn7.js";import"./Popover-iM_ezzPB.js";import"./Modal-DUt8H3ab.js";import"./Portal-COm53pHi.js";import"./List-CqEwDLab.js";import"./ListContext-CQwj8Qg7.js";import"./ListItem-BhueXXFi.js";import"./Link-CiS0SEiJ.js";import"./lodash-Czox7iJy.js";import"./index-8XuG-gel.js";import"./useAnalytics-BxYnHleN.js";import"./useApp-B6m3gjBm.js";import"./Page-KCNtzKaC.js";import"./useMediaQuery-CmuQ3QFH.js";import"./Tooltip-C8OYhGnh.js";import"./Popper-CJ7TZbcE.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

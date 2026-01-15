import{j as t}from"./iframe-Ca4Oq2uP.js";import{H as i}from"./Header-B8YO36e8.js";import{P as a}from"./Page-TVSr2f-O.js";import{H as r}from"./HeaderLabel-DAUk63-Z.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DoJDyaav.js";import"./Box-C6YthH4K.js";import"./styled-bS2mVuuT.js";import"./Grid-DvRbNd4W.js";import"./Breadcrumbs-CnzMI3eB.js";import"./index-B9sM2jn7.js";import"./Popover-C2h9W_Jp.js";import"./Modal-DNybagJK.js";import"./Portal-DfnbqdYt.js";import"./List-_jXEyBxC.js";import"./ListContext-DFKFAB0C.js";import"./ListItem-BrncrmWC.js";import"./Link-C9Yjpk8V.js";import"./lodash-DLuUt6m8.js";import"./index-CWD4-Z7Q.js";import"./useAnalytics-BO6qv_N6.js";import"./useApp-CIEu2n9t.js";import"./Page-fG8-TlpK.js";import"./useMediaQuery-Be7CXmob.js";import"./Tooltip-DlFbz0wm.js";import"./Popper-D7At4psl.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

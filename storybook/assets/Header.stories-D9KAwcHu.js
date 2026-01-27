import{j as t}from"./iframe-DEXNC9RX.js";import{H as i}from"./Header-DG6eimWM.js";import{P as a}from"./Page-Bp2krsps.js";import{H as r}from"./HeaderLabel-BHoNhAn-.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-AdRZ9yrT.js";import"./Box-BngrI2dT.js";import"./styled-B4iJQM5t.js";import"./Grid-DwntcsAr.js";import"./Breadcrumbs-B-eXH0GH.js";import"./index-B9sM2jn7.js";import"./Popover-Deo6ztQs.js";import"./Modal-qxnLeQlM.js";import"./Portal-O6zOHTQ9.js";import"./List-861P7w9f.js";import"./ListContext-CuQ6sOnh.js";import"./ListItem-BsFeXcoa.js";import"./Link-7jnzHmir.js";import"./lodash-Czox7iJy.js";import"./index-BlCxWptt.js";import"./useAnalytics-DzYvNwaC.js";import"./useApp-CPRzbwsy.js";import"./Page-CAlfsOJg.js";import"./useMediaQuery-MA-Sdype.js";import"./Tooltip-B5JVDv03.js";import"./Popper-Dtp4XQPR.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

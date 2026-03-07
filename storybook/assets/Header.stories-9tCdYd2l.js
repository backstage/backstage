import{j as t}from"./iframe-CSFr66Yj.js";import{H as i}from"./Header-0bKBgBUv.js";import{P as a}from"./Page-BrK12JdE.js";import{H as r}from"./HeaderLabel-B6Ofbotm.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DejXtqI7.js";import"./makeStyles-uVnrWAVB.js";import"./Box-Cb3Gr3iO.js";import"./styled-CmsioGDa.js";import"./Grid-ClhOBUNV.js";import"./Breadcrumbs-BDoI-H0s.js";import"./index-B9sM2jn7.js";import"./Popover-BWrBUsLM.js";import"./Modal-5v8JZx8M.js";import"./Portal-B40i3148.js";import"./List-CTsa5Vil.js";import"./ListContext-hUquPiBr.js";import"./ListItem--clkBOsd.js";import"./Link-BuppC-Xy.js";import"./index-BbjHc-mo.js";import"./lodash-DoZXRjYt.js";import"./index-CWVjNXJ7.js";import"./useAnalytics-iKBzR4vv.js";import"./useApp-9WiUV6Eb.js";import"./Page-W_eHw0n3.js";import"./useMediaQuery-DIGLFfUs.js";import"./Tooltip-DNXEZsSN.js";import"./Popper-P787cLfX.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

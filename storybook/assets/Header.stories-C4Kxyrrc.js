import{j as t}from"./iframe-IlkKTMMY.js";import{H as i}from"./Header-Y-ve6hrs.js";import{P as a}from"./Page-DjyfK8_r.js";import{H as r}from"./HeaderLabel-PSmIKeAl.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Ol7Pg3qt.js";import"./Box-Co-CX5dU.js";import"./styled-Bwl9pvyb.js";import"./Grid-CGYs8N7L.js";import"./Breadcrumbs-BakN3WUm.js";import"./index-B9sM2jn7.js";import"./Popover-CoR_2wpB.js";import"./Modal-Cn4PMnDV.js";import"./Portal-WsTivW4Y.js";import"./List-CWjVqxD3.js";import"./ListContext-CqKUV46p.js";import"./ListItem-SM0MND7k.js";import"./Link-CTXwvBoU.js";import"./lodash-60wLm22K.js";import"./index-D1wY3pZr.js";import"./useAnalytics-BBLhO3cg.js";import"./useApp-YIfbik5w.js";import"./Page-3NLlljAw.js";import"./useMediaQuery-BUDVBaP5.js";import"./Tooltip-CtyCqi0f.js";import"./Popper-BekvFLxn.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

import{j as t}from"./iframe-DFN6SAj3.js";import{H as i}from"./Header-DK6vYaKu.js";import{P as a}from"./Page-B5N2j2ge.js";import{H as r}from"./HeaderLabel-Dkr2dx-8.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CshNHVBv.js";import"./Box-CrX2Agh3.js";import"./styled-UJWvm5Ja.js";import"./Grid-CnDsPTZJ.js";import"./Breadcrumbs-pcNxTJOE.js";import"./index-B9sM2jn7.js";import"./Popover-Bzc6rxtE.js";import"./Modal-B95o4eGb.js";import"./Portal-6-SOUMqq.js";import"./List-CNrJvNp3.js";import"./ListContext-B6gycCKe.js";import"./ListItem-khPUul4I.js";import"./Link-DZVnE3x4.js";import"./lodash-DLuUt6m8.js";import"./index-BUG12Py2.js";import"./useAnalytics-B9OoIKEa.js";import"./useApp-B_iVMZKS.js";import"./Page-CWBGk8Er.js";import"./useMediaQuery-DSgtlo1T.js";import"./Tooltip-B6ATafnk.js";import"./Popper-BPOHrmiw.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

import{j as t}from"./iframe-CMoZkI_V.js";import{H as i}from"./Header-DPPt5Mr9.js";import{P as a}from"./Page-qdmVxXkj.js";import{H as r}from"./HeaderLabel-BEuHZNEG.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-F1ZVjyJn.js";import"./Box-DDWlRNcc.js";import"./styled-BPnpuM9w.js";import"./Grid-Cc5u-Kft.js";import"./Breadcrumbs-CD3XNUT7.js";import"./index-B9sM2jn7.js";import"./Popover-uKAOvxlN.js";import"./Modal-JpNI_f-q.js";import"./Portal-BsEe4NVr.js";import"./List-mLBkoS87.js";import"./ListContext-DCW7FG4X.js";import"./ListItem-DQ5raIpn.js";import"./Link-_YMea8vG.js";import"./lodash-DLuUt6m8.js";import"./index-Dl6v8jff.js";import"./useAnalytics-aVKC-y-x.js";import"./useApp-Cq0FwDqI.js";import"./Page-B6y8loe4.js";import"./useMediaQuery-B79j4-5g.js";import"./Tooltip-DqsRLJKa.js";import"./Popper-p2DZK6W8.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

import{j as t}from"./iframe-CZ56O-V9.js";import{H as i}from"./Header-CiWu5IK6.js";import{P as a}from"./Page-BZ1W-zKi.js";import{H as r}from"./HeaderLabel-vyzPPhD1.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-B72-K-tM.js";import"./Box-MN-uZs4I.js";import"./styled-D9whByUF.js";import"./Grid-DjbHNKXL.js";import"./Breadcrumbs-DRsST65h.js";import"./index-B9sM2jn7.js";import"./Popover-hzCM8euj.js";import"./Modal-CQLQBAd-.js";import"./Portal-rgcloK6u.js";import"./List-DEdaJe5c.js";import"./ListContext-BmrJCIpO.js";import"./ListItem-BtvfynNb.js";import"./Link-BQF_zimC.js";import"./lodash-Czox7iJy.js";import"./index-Ca3h4iDJ.js";import"./useAnalytics-BS680IS8.js";import"./useApp-BeYLp8SO.js";import"./Page-Bc5nNmPG.js";import"./useMediaQuery-BZs__Am8.js";import"./Tooltip-B8FLw8lE.js";import"./Popper-7tudyaaz.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

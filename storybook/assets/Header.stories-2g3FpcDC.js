import{j as t}from"./iframe-B9hgvJLw.js";import{H as i}from"./Header-BbWoIgpF.js";import{P as a}from"./Page-DB3kDhK8.js";import{H as r}from"./HeaderLabel-CQ9AId0a.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-ClD742rZ.js";import"./Box-BsI7Fu14.js";import"./styled-CF5nzrfv.js";import"./Grid-g3HyMBvJ.js";import"./Breadcrumbs-DT0jw4fQ.js";import"./index-B9sM2jn7.js";import"./Popover-Bfr2YV3y.js";import"./Modal-Ca-S6eXi.js";import"./Portal-pCoOC46-.js";import"./List-BDdcqK40.js";import"./ListContext-DgcYteU3.js";import"./ListItem-Bp1BuLev.js";import"./Link-C9X-RXqH.js";import"./lodash-Czox7iJy.js";import"./index-CsGVCGL2.js";import"./useAnalytics-DMsrMH_e.js";import"./useApp-DISJeDPh.js";import"./Page-BdxQozw5.js";import"./useMediaQuery-YZUmHHf3.js";import"./Tooltip-RfNF6Jnk.js";import"./Popper-BAAWK9EZ.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

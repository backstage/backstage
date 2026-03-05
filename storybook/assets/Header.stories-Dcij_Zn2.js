import{j as t}from"./iframe-B7rMUZLI.js";import{H as i}from"./Header-WP8Sc-xy.js";import{P as a}from"./Page-DxLZQqJa.js";import{H as r}from"./HeaderLabel-DsIiXlCO.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DI0FfCHM.js";import"./makeStyles-BbDOaNwq.js";import"./Box-DE3k0g2W.js";import"./styled-rHipxG34.js";import"./Grid-ChmRa1xb.js";import"./Breadcrumbs-BFvn7nsA.js";import"./index-B9sM2jn7.js";import"./Popover-QJoOcoVv.js";import"./Modal-BTIfo08e.js";import"./Portal-Gi_4ezMI.js";import"./List-NlkzeZDP.js";import"./ListContext-2sTnrhYf.js";import"./ListItem-DUvIrbAd.js";import"./Link-CkavcW4q.js";import"./index-YYjQiTXP.js";import"./lodash-DMrnViDb.js";import"./index-CJOPKnnX.js";import"./useAnalytics-KiNG90-s.js";import"./useApp-BRmPnhRt.js";import"./Page-CbKU7Z12.js";import"./useMediaQuery-BK_9emi-.js";import"./Tooltip-DJ88mzvg.js";import"./Popper-TzRORtoi.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

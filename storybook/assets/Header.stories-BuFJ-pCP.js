import{j as t}from"./iframe-DC0HuKGF.js";import{H as i}from"./Header-R5fTsQng.js";import{P as a}from"./Page-B7hdviRN.js";import{H as r}from"./HeaderLabel-Ma470FtI.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-C-2tOhS-.js";import"./makeStyles-CdFTekTr.js";import"./Box-CHRqFhJe.js";import"./styled-B4TWoPqU.js";import"./Grid-B4PBabAQ.js";import"./Breadcrumbs-Dxkze4z9.js";import"./index-B9sM2jn7.js";import"./Popover-DGTyTaBx.js";import"./Modal-BmT395tY.js";import"./Portal-BQrNoYBv.js";import"./List-CssDjDLP.js";import"./ListContext-P3rTeiNo.js";import"./ListItem-ppf-hIBK.js";import"./Link-DfdNxTky.js";import"./index-CMG1MCtf.js";import"./lodash-CrNJApB2.js";import"./index-B88MtuqO.js";import"./useAnalytics-BaWCJwCB.js";import"./useApp-qCrtr9Gq.js";import"./Page-l1o6nwDT.js";import"./useMediaQuery-Ch9WpVI5.js";import"./Tooltip-CTOYHy8_.js";import"./Popper-3kZsTegL.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

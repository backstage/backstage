import{j as t}from"./iframe-DDK8UA9d.js";import{H as i}from"./Header-DzIKiWrB.js";import{P as a}from"./Page-Da9rv8DJ.js";import{H as r}from"./HeaderLabel-CYnbngNm.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-C9AhP0Z9.js";import"./Box-DhjbYf3r.js";import"./styled-DMKPGzcT.js";import"./Grid-D0K-a10_.js";import"./Breadcrumbs-qKJbm6Tq.js";import"./index-B9sM2jn7.js";import"./Popover-PlQK-Tnp.js";import"./Modal-BvYRzzOq.js";import"./Portal-DcnhuCwR.js";import"./List-DFzXqQTw.js";import"./ListContext-Gb2XOrAs.js";import"./ListItem-DLPNurIO.js";import"./Link-D2O1VvQJ.js";import"./lodash-Czox7iJy.js";import"./index-BCCOFm5P.js";import"./useAnalytics-BzcY6zQX.js";import"./useApp-CEEPe1BL.js";import"./Page-BeYwig3P.js";import"./useMediaQuery-Cur73O44.js";import"./Tooltip-Cy4RFEYG.js";import"./Popper-BHoeK-6N.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

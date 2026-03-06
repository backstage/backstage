import{j as t}from"./iframe-Zkjja1CZ.js";import{H as i}from"./Header-EnlVCsFA.js";import{P as a}from"./Page-DwcpB8Ch.js";import{H as r}from"./HeaderLabel-AWx2U7RU.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-D4f5FQ6m.js";import"./makeStyles-Dy9T_vRY.js";import"./Box-BMvVsAhI.js";import"./styled-BgXxje-f.js";import"./Grid-CmkVhak9.js";import"./Breadcrumbs-BrsSeKuP.js";import"./index-B9sM2jn7.js";import"./Popover-DiWYzlET.js";import"./Modal-VTjU7VJ1.js";import"./Portal-BlfvlNo0.js";import"./List-CDBWKecp.js";import"./ListContext-R-tftgRd.js";import"./ListItem-WvMtEKfL.js";import"./Link-BGdkHKdy.js";import"./index-CHk62GMG.js";import"./lodash-psU78ChZ.js";import"./index-CR-oEA4Y.js";import"./useAnalytics-C26DZv84.js";import"./useApp-DO9gHob0.js";import"./Page-CdhjnvrV.js";import"./useMediaQuery-D7pcoSwO.js";import"./Tooltip-9gNW0pGl.js";import"./Popper-HBCr7d9w.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

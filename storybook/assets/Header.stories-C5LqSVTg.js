import{j as t}from"./iframe-r9k78NKI.js";import{H as i}from"./Header-DjnooJHB.js";import{P as a}from"./Page-BqZkrfpe.js";import{H as r}from"./HeaderLabel-C95F0zTk.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BQIq0tBH.js";import"./makeStyles-CipF_TRV.js";import"./Box-CPjilEka.js";import"./styled-Cg4IVtII.js";import"./Grid-Bz9nGms7.js";import"./Breadcrumbs-COXW8vDS.js";import"./index-B9sM2jn7.js";import"./Popover-CvDqd1rk.js";import"./Modal-UJSdMD3k.js";import"./Portal-CW8an0o0.js";import"./List-BDEgjW0i.js";import"./ListContext-BzmVZQwf.js";import"./ListItem-DD0_kxo4.js";import"./Link-zcGWAEux.js";import"./index-s9MTga9j.js";import"./lodash-B26Sq6Yw.js";import"./index-C1fYClSH.js";import"./useAnalytics-wKKBdz0U.js";import"./useApp-Nm0FtJwT.js";import"./Page-DM1NGGBl.js";import"./useMediaQuery-DYnfh06o.js";import"./Tooltip-B1Vym-uO.js";import"./Popper-oo_sRFxI.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

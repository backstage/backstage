import{j as e}from"./iframe-C8uhRVJE.js";import{H as o}from"./Header-BnV_dGZw.js";import{P as p}from"./Page-Cnoit7wb.js";import{H as r}from"./HeaderLabel-BfeWxXsQ.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CWtiooSY.js";import"./Box-CqSl_hUY.js";import"./styled-CsbE0ba0.js";import"./Grid-C5ZyGaTv.js";import"./Breadcrumbs-BYJ1keNx.js";import"./index-B9sM2jn7.js";import"./Popover-BGm3xZF3.js";import"./Modal-BCg34ymo.js";import"./Portal-DGxbDxZD.js";import"./List-DvPRKsUn.js";import"./ListContext-CLNvlY7i.js";import"./ListItem-CMqPdlpf.js";import"./Link-BbMg_ACg.js";import"./lodash-Y_-RFQgK.js";import"./index-BYn64cw2.js";import"./useAnalytics-CMB7EDSs.js";import"./useApp-IzIBR1Vv.js";import"./Page-CUVzxIzP.js";import"./useMediaQuery-CVETFPFB.js";import"./Tooltip-Dm66oIkk.js";import"./Popper-DTopPJJ5.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,N as default};

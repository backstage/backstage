import{j as e}from"./iframe-DvObL_em.js";import{H as o}from"./Header-Cr6EdA3u.js";import{P as p}from"./Page-CILrrK-P.js";import{H as r}from"./HeaderLabel-DZgpNORY.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DnAdK-kJ.js";import"./Box-vIlJQZHO.js";import"./styled-BUTQ37RD.js";import"./Grid-D0oIIaci.js";import"./makeStyles-CUBlkZ58.js";import"./Breadcrumbs-B-z6XiD3.js";import"./index-B9sM2jn7.js";import"./Popover-cEldhMRk.js";import"./Modal-BYBpZn83.js";import"./Portal-ByK_zElx.js";import"./List-2eV0WyBd.js";import"./ListContext-DWdyoQ2B.js";import"./ListItem-HID7QX3w.js";import"./Link-D58R_yeB.js";import"./index-7QwSRqxh.js";import"./lodash-BX0jKKjM.js";import"./useAnalytics-Cik4L6Xq.js";import"./useApp-C8xACzk4.js";import"./Page-hIeikuxZ.js";import"./useMediaQuery-DH2RmI0G.js";import"./Tooltip-BP-m0gVY.js";import"./Popper-ClNNU78F.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,R as default};

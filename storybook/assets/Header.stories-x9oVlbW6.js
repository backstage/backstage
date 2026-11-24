import{j as e}from"./iframe-4nxqZpQH.js";import{H as o}from"./Header-jx118SXl.js";import{P as p}from"./Page-CabvkFM3.js";import{H as r}from"./HeaderLabel-B8iarQjj.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-B65bAoys.js";import"./Box-Cd_GZSF7.js";import"./styled-BbGqbqb-.js";import"./Grid-CtTdTKXZ.js";import"./makeStyles-JOYHJdob.js";import"./Breadcrumbs-BfTVaOcm.js";import"./index-B9sM2jn7.js";import"./Popover-EK6jLsvD.js";import"./Modal-DmvqJ9RE.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-BjKoysKQ.js";import"./List-5gUO4rvo.js";import"./ListContext-CGw5idQE.js";import"./ListItem-1vF4zgeG.js";import"./Link-AWxWmhmT.js";import"./index-BY3E6cHa.js";import"./lodash-D_m0bAY4.js";import"./useApp-BXGH6_Hd.js";import"./index-CKs39xo2.js";import"./useAnalytics-CLQ0SWuB.js";import"./Page-DJO7V1_p.js";import"./useMediaQuery-CjjStWBD.js";import"./Tooltip-D9U6dpsc.js";import"./Popper-BHz6vzSp.js";const k={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const z=["Default"];export{t as Default,z as __namedExportsOrder,k as default};

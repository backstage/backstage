const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-BMfVmZEE.js","./iframe-DPEQU9sg.js","./preload-helper-PPVm8Dsz.js","./iframe-BixOA4ww.css","./Search-BiX3XKaH.js","./useDebounce-CX9ADosI.js","./translation-BfJviIKI.js","./SearchContext-Dejq-K2O.js","./lodash-Czox7iJy.js","./useAsync-BqETPqxv.js","./useMountedState-BqkaBMSv.js","./api-D1aB2rhI.js","./useAnalytics-odk5YTGP.js","./InputAdornment-BqmH1JSp.js","./useFormControl-CnLv8su9.js","./Button-B3E66A3B.js","./TextField-DeCofTAY.js","./Select-B-khT1R0.js","./index-B9sM2jn7.js","./Popover-CRfqc1ul.js","./Modal-BY3dMB2D.js","./Portal-AonZoDqn.js","./List-DquDfnLJ.js","./ListContext-DyGfW3pa.js","./formControlState-ByiNFc8I.js","./FormLabel-BUXwqQDg.js","./InputLabel-DxGPQhnv.js","./useApp-WY7YhADn.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-DPEQU9sg.js";import{s as l,M as h}from"./api-D1aB2rhI.js";import{SearchBar as m}from"./SearchBar-BMfVmZEE.js";import{S}from"./SearchContext-Dejq-K2O.js";import{S as p}from"./Grid-V2KC8DrR.js";import{w as B}from"./appWrappers-Bk2njHpK.js";import"./Search-BiX3XKaH.js";import"./useDebounce-CX9ADosI.js";import"./translation-BfJviIKI.js";import"./InputAdornment-BqmH1JSp.js";import"./useFormControl-CnLv8su9.js";import"./Button-B3E66A3B.js";import"./TextField-DeCofTAY.js";import"./Select-B-khT1R0.js";import"./index-B9sM2jn7.js";import"./Popover-CRfqc1ul.js";import"./Modal-BY3dMB2D.js";import"./Portal-AonZoDqn.js";import"./List-DquDfnLJ.js";import"./ListContext-DyGfW3pa.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-BUXwqQDg.js";import"./InputLabel-DxGPQhnv.js";import"./useAnalytics-odk5YTGP.js";import"./useApp-WY7YhADn.js";import"./lodash-Czox7iJy.js";import"./useAsync-BqETPqxv.js";import"./useMountedState-BqkaBMSv.js";import"./useObservable-Bl5WmSl_.js";import"./useIsomorphicLayoutEffect-8D8X83kR.js";import"./componentData-DiYtav-w.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-9w1oJKxU.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-BMfVmZEE.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
  return <SearchBar />;
};
`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const CustomPlaceholder = () => {
  return <SearchBar placeholder="This is a custom placeholder" />;
};
`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const CustomLabel = () => {
  return <SearchBar label="This is a custom label" />;
};
`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const Focused = () => {
  return (
    // decision up to adopter, read https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md#no-autofocus
    // eslint-disable-next-line jsx-a11y/no-autofocus
    <SearchBar autoFocus />
  );
};
`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{code:`const WithoutClearButton = () => {
  return <SearchBar clearButton={false} />;
};
`,...c.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const CustomStyles = () => {
  const classes = useStyles();
  return (
    <SearchBar
      InputProps={{
        classes: {
          root: classes.searchBarRoot,
          notchedOutline: classes.searchBarOutline,
        },
      }}
    />
  );
};
`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  return <SearchBar />;
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  return <SearchBar placeholder="This is a custom placeholder" />;
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <SearchBar label="This is a custom label" />;
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return (
    // decision up to adopter, read https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md#no-autofocus
    // eslint-disable-next-line jsx-a11y/no-autofocus
    <SearchBar autoFocus />
  );
}`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  return <SearchBar clearButton={false} />;
}`,...c.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  return <SearchBar InputProps={{
    classes: {
      root: classes.searchBarRoot,
      notchedOutline: classes.searchBarOutline
    }
  }} />;
}`,...n.parameters?.docs?.source}}};const re=["Default","CustomPlaceholder","CustomLabel","Focused","WithoutClearButton","CustomStyles"];export{a as CustomLabel,o as CustomPlaceholder,n as CustomStyles,s as Default,t as Focused,c as WithoutClearButton,re as __namedExportsOrder,ee as default};

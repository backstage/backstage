const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-q-1P9Q8u.js","./iframe-Cih9KYts.js","./preload-helper-PPVm8Dsz.js","./iframe-BixOA4ww.css","./Search-CTK3U7Sv.js","./useDebounce-DqiQBHM6.js","./translation-BGdEcgPq.js","./SearchContext-DIcRkiWA.js","./lodash-Czox7iJy.js","./useAsync-DPHt3xdh.js","./useMountedState-BYMagqon.js","./api-C9Cc-uCq.js","./useAnalytics-Cmhz127l.js","./InputAdornment-CpD9WJQR.js","./useFormControl-4MorzmI2.js","./Button-CKd96K2t.js","./TextField-xUwXrmKL.js","./Select-zsC6tXpT.js","./index-B9sM2jn7.js","./Popover-Dg3slux6.js","./Modal-BZoQWh9B.js","./Portal-DG1SCA6E.js","./List-DfB6hke5.js","./ListContext-DH23_8Wk.js","./formControlState-ByiNFc8I.js","./FormLabel-COht3U-T.js","./InputLabel-Bs3e7Pvi.js","./useApp-sV2xt9cM.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-Cih9KYts.js";import{s as l,M as h}from"./api-C9Cc-uCq.js";import{SearchBar as m}from"./SearchBar-q-1P9Q8u.js";import{S}from"./SearchContext-DIcRkiWA.js";import{S as p}from"./Grid-CLRvRbDN.js";import{w as B}from"./appWrappers-C7AQtpTy.js";import"./Search-CTK3U7Sv.js";import"./useDebounce-DqiQBHM6.js";import"./translation-BGdEcgPq.js";import"./InputAdornment-CpD9WJQR.js";import"./useFormControl-4MorzmI2.js";import"./Button-CKd96K2t.js";import"./TextField-xUwXrmKL.js";import"./Select-zsC6tXpT.js";import"./index-B9sM2jn7.js";import"./Popover-Dg3slux6.js";import"./Modal-BZoQWh9B.js";import"./Portal-DG1SCA6E.js";import"./List-DfB6hke5.js";import"./ListContext-DH23_8Wk.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-COht3U-T.js";import"./InputLabel-Bs3e7Pvi.js";import"./useAnalytics-Cmhz127l.js";import"./useApp-sV2xt9cM.js";import"./lodash-Czox7iJy.js";import"./useAsync-DPHt3xdh.js";import"./useMountedState-BYMagqon.js";import"./useObservable-BtgVS7-k.js";import"./useIsomorphicLayoutEffect-dPDL8wRM.js";import"./componentData-DlgYE3l_.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Bp0jFuCJ.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-q-1P9Q8u.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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

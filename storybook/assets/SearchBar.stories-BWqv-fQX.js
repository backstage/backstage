const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-DiTBXJAn.js","./iframe-CJaWlx9k.js","./preload-helper-PPVm8Dsz.js","./iframe-DGvoTQWn.css","./Search-Ca8YyrQM.js","./useDebounce-CRFtWfPL.js","./translation-CvClunBN.js","./SearchContext-BsgFsiMu.js","./lodash-Czox7iJy.js","./useAsync-BIkYo0dn.js","./useMountedState-BX2n2ffy.js","./api-B2GOuMSA.js","./useAnalytics-B9VoDArS.js","./InputAdornment-7AhpIQYh.js","./useFormControl-QuigaWzh.js","./Button-BIo1VJpq.js","./TextField-DoeMvY-N.js","./Select-DDdsjrAg.js","./index-B9sM2jn7.js","./Popover-4AFqMLPU.js","./Modal-DA7gw75D.js","./Portal-CCaSbatU.js","./List-CG61H5Q6.js","./ListContext-BgC5EWvT.js","./formControlState-ByiNFc8I.js","./FormLabel-BEqYHiJN.js","./InputLabel-DMp1RElY.js","./useApp-C3Rn7vNb.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-CJaWlx9k.js";import{s as l,M as h}from"./api-B2GOuMSA.js";import{SearchBar as m}from"./SearchBar-DiTBXJAn.js";import{S}from"./SearchContext-BsgFsiMu.js";import{S as p}from"./Grid-CvrlVjPi.js";import{w as B}from"./appWrappers-KXpf8wG0.js";import"./Search-Ca8YyrQM.js";import"./useDebounce-CRFtWfPL.js";import"./translation-CvClunBN.js";import"./InputAdornment-7AhpIQYh.js";import"./useFormControl-QuigaWzh.js";import"./Button-BIo1VJpq.js";import"./TextField-DoeMvY-N.js";import"./Select-DDdsjrAg.js";import"./index-B9sM2jn7.js";import"./Popover-4AFqMLPU.js";import"./Modal-DA7gw75D.js";import"./Portal-CCaSbatU.js";import"./List-CG61H5Q6.js";import"./ListContext-BgC5EWvT.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-BEqYHiJN.js";import"./InputLabel-DMp1RElY.js";import"./useAnalytics-B9VoDArS.js";import"./useApp-C3Rn7vNb.js";import"./lodash-Czox7iJy.js";import"./useAsync-BIkYo0dn.js";import"./useMountedState-BX2n2ffy.js";import"./useObservable-Ci9nj0uo.js";import"./useIsomorphicLayoutEffect-DaQ9vgb_.js";import"./componentData-DJazsba3.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BQ0Bm2RY.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-DiTBXJAn.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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

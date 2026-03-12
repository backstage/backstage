const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-BVJW4PGr.js","./iframe-CmF8XmXW.js","./preload-helper-PPVm8Dsz.js","./iframe-CmXu-F3L.css","./Search-BorbYsTT.js","./useDebounce-LxjuuCSP.js","./translation-27upvxjK.js","./SearchContext-DL68mesI.js","./lodash-BMfEwEVA.js","./useAsync-BlS6PWf7.js","./useMountedState-R5vPNZNY.js","./api-aBcga9Tq.js","./useAnalytics-BnM0MC_9.js","./InputAdornment-V1Te3gi0.js","./formControlState-M8LFgNtt.js","./Button-CAnlWrjv.js","./TextField-D4uWFQjo.js","./Select-BCMka2Zl.js","./index-B9sM2jn7.js","./Popover-D8ZxMx0p.js","./Modal-DKAQifd-.js","./Portal-DLYTgwQk.js","./List-D_AhGxTu.js","./ListContext-CMFfQs0i.js","./FormLabel-CsUHcHeY.js","./InputLabel-BUg-8uEv.js","./useApp-DpGn1tXX.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as i}from"./iframe-CmF8XmXW.js";import{s as d,M as l}from"./api-aBcga9Tq.js";import{SearchBar as m}from"./SearchBar-BVJW4PGr.js";import{S as h}from"./SearchContext-DL68mesI.js";import{S as p}from"./Grid-DKauYoce.js";import{m as S}from"./makeStyles-Ibhc4-lx.js";import{w as B}from"./appWrappers-CUWm5cOJ.js";import"./Search-BorbYsTT.js";import"./useDebounce-LxjuuCSP.js";import"./translation-27upvxjK.js";import"./InputAdornment-V1Te3gi0.js";import"./formControlState-M8LFgNtt.js";import"./Button-CAnlWrjv.js";import"./TextField-D4uWFQjo.js";import"./Select-BCMka2Zl.js";import"./index-B9sM2jn7.js";import"./Popover-D8ZxMx0p.js";import"./Modal-DKAQifd-.js";import"./Portal-DLYTgwQk.js";import"./List-D_AhGxTu.js";import"./ListContext-CMFfQs0i.js";import"./FormLabel-CsUHcHeY.js";import"./InputLabel-BUg-8uEv.js";import"./useAnalytics-BnM0MC_9.js";import"./useApp-DpGn1tXX.js";import"./lodash-BMfEwEVA.js";import"./useAsync-BlS6PWf7.js";import"./useMountedState-R5vPNZNY.js";import"./useObservable-DAhkL3FZ.js";import"./useIsomorphicLayoutEffect-BvOu1nZP.js";import"./componentData-6buD7kJq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-llNJvO4J.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-BVJW4PGr.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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

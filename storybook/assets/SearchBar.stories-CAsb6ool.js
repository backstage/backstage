const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CHMMa6cZ.js","./iframe-C7l5P2_I.js","./preload-helper-PPVm8Dsz.js","./iframe-CmXu-F3L.css","./Search-C1ZK11T8.js","./useDebounce-C2o2WC8_.js","./translation-BtRyzUJJ.js","./SearchContext-9snaNFoN.js","./lodash-C_n5Ni0i.js","./useAsync-D4ApmH3Q.js","./useMountedState-C3T3GhQF.js","./api-SlqoqosF.js","./useAnalytics-DvfsJVgo.js","./InputAdornment-Bj8RPjdS.js","./formControlState-Cg625is9.js","./Button-D7Ao-a7e.js","./TextField-B7UhiS5j.js","./Select-DtfcHVIh.js","./index-B9sM2jn7.js","./Popover-B2wLjBT4.js","./Modal-irLIXdct.js","./Portal-YwRf0OFq.js","./List-C_Ju4KCi.js","./ListContext-Dobuofun.js","./FormLabel-BduOcCS6.js","./InputLabel-BzXMwAn9.js","./useApp-B0ylAoYl.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as i}from"./iframe-C7l5P2_I.js";import{s as d,M as l}from"./api-SlqoqosF.js";import{SearchBar as m}from"./SearchBar-CHMMa6cZ.js";import{S as h}from"./SearchContext-9snaNFoN.js";import{S as p}from"./Grid-3Bz-t9Mk.js";import{m as S}from"./makeStyles-DO0dhQTG.js";import{w as B}from"./appWrappers-BwMR1oiP.js";import"./Search-C1ZK11T8.js";import"./useDebounce-C2o2WC8_.js";import"./translation-BtRyzUJJ.js";import"./InputAdornment-Bj8RPjdS.js";import"./formControlState-Cg625is9.js";import"./Button-D7Ao-a7e.js";import"./TextField-B7UhiS5j.js";import"./Select-DtfcHVIh.js";import"./index-B9sM2jn7.js";import"./Popover-B2wLjBT4.js";import"./Modal-irLIXdct.js";import"./Portal-YwRf0OFq.js";import"./List-C_Ju4KCi.js";import"./ListContext-Dobuofun.js";import"./FormLabel-BduOcCS6.js";import"./InputLabel-BzXMwAn9.js";import"./useAnalytics-DvfsJVgo.js";import"./useApp-B0ylAoYl.js";import"./lodash-C_n5Ni0i.js";import"./useAsync-D4ApmH3Q.js";import"./useMountedState-C3T3GhQF.js";import"./useObservable-Cb3DKD_r.js";import"./useIsomorphicLayoutEffect-C1XtiqS1.js";import"./componentData-CwoAHc-h.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Ct-Fv-qt.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-CHMMa6cZ.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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

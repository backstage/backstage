const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-B2zR3YJP.js","./iframe-CMoZkI_V.js","./preload-helper-PPVm8Dsz.js","./iframe-DbcXpUTb.css","./Search-BtO6Gze0.js","./useDebounce-CiGUy-gO.js","./translation-ChqOoxIc.js","./SearchContext-D7PPC6FZ.js","./lodash-DLuUt6m8.js","./useAsync-nuZztPgy.js","./useMountedState-DXAXWcHb.js","./api-BfofgL2m.js","./useAnalytics-aVKC-y-x.js","./InputAdornment-BEnE_DHi.js","./useFormControl-CYLNnuhF.js","./Button-CMlJ_q4q.js","./TextField-CzAvqVqZ.js","./Select-Du7ISKFa.js","./index-B9sM2jn7.js","./Popover-uKAOvxlN.js","./Modal-JpNI_f-q.js","./Portal-BsEe4NVr.js","./List-mLBkoS87.js","./ListContext-DCW7FG4X.js","./formControlState-ByiNFc8I.js","./FormLabel-puaj9Kks.js","./InputLabel-h0iWwr6w.js","./useApp-Cq0FwDqI.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-CMoZkI_V.js";import{s as l,M as h}from"./api-BfofgL2m.js";import{SearchBar as m}from"./SearchBar-B2zR3YJP.js";import{S}from"./SearchContext-D7PPC6FZ.js";import{S as p}from"./Grid-Cc5u-Kft.js";import{w as B}from"./appWrappers-CwLdvgVt.js";import"./Search-BtO6Gze0.js";import"./useDebounce-CiGUy-gO.js";import"./translation-ChqOoxIc.js";import"./InputAdornment-BEnE_DHi.js";import"./useFormControl-CYLNnuhF.js";import"./Button-CMlJ_q4q.js";import"./TextField-CzAvqVqZ.js";import"./Select-Du7ISKFa.js";import"./index-B9sM2jn7.js";import"./Popover-uKAOvxlN.js";import"./Modal-JpNI_f-q.js";import"./Portal-BsEe4NVr.js";import"./List-mLBkoS87.js";import"./ListContext-DCW7FG4X.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-puaj9Kks.js";import"./InputLabel-h0iWwr6w.js";import"./useAnalytics-aVKC-y-x.js";import"./useApp-Cq0FwDqI.js";import"./lodash-DLuUt6m8.js";import"./useAsync-nuZztPgy.js";import"./useMountedState-DXAXWcHb.js";import"./useObservable-f8TZQGuk.js";import"./useIsomorphicLayoutEffect-DTydLypZ.js";import"./componentData-C1GpKGWH.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Dl6v8jff.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-B2zR3YJP.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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

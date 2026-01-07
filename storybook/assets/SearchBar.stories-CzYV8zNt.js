const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-BNF9rHlH.js","./iframe-BY6cr4Gs.js","./preload-helper-PPVm8Dsz.js","./iframe-BTlUUeQn.css","./Search-C1C8jSb1.js","./useDebounce-CWCoFPVw.js","./translation-IDVW-xh6.js","./SearchContext-Dt9zyNyK.js","./lodash-Y_-RFQgK.js","./useAsync-BOpzAa1K.js","./useMountedState-wBq7rhLl.js","./api-Bn_bwlkS.js","./useAnalytics-BgncGw0N.js","./InputAdornment-0KpUIsyl.js","./useFormControl-CHRehZxK.js","./Button-BcV-aad6.js","./TextField-CzeKprQz.js","./Select-Dk4pHiCq.js","./index-B9sM2jn7.js","./Popover-CSLjBTLK.js","./Modal-27M29ymL.js","./Portal-RovY2swJ.js","./List-BYnFuPKk.js","./ListContext-Cv7Ut4-T.js","./formControlState-ByiNFc8I.js","./FormLabel-BzT2D_7Q.js","./InputLabel-C4V1mFuX.js","./useApp-Tcb-kbrm.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-BY6cr4Gs.js";import{s as l,M as h}from"./api-Bn_bwlkS.js";import{SearchBar as m}from"./SearchBar-BNF9rHlH.js";import{S}from"./SearchContext-Dt9zyNyK.js";import{S as p}from"./Grid-CPNST6ei.js";import{w as B}from"./appWrappers-Pq-5KpLz.js";import"./Search-C1C8jSb1.js";import"./useDebounce-CWCoFPVw.js";import"./translation-IDVW-xh6.js";import"./InputAdornment-0KpUIsyl.js";import"./useFormControl-CHRehZxK.js";import"./Button-BcV-aad6.js";import"./TextField-CzeKprQz.js";import"./Select-Dk4pHiCq.js";import"./index-B9sM2jn7.js";import"./Popover-CSLjBTLK.js";import"./Modal-27M29ymL.js";import"./Portal-RovY2swJ.js";import"./List-BYnFuPKk.js";import"./ListContext-Cv7Ut4-T.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-BzT2D_7Q.js";import"./InputLabel-C4V1mFuX.js";import"./useAnalytics-BgncGw0N.js";import"./useApp-Tcb-kbrm.js";import"./lodash-Y_-RFQgK.js";import"./useAsync-BOpzAa1K.js";import"./useMountedState-wBq7rhLl.js";import"./useObservable-BMg2j1pk.js";import"./useIsomorphicLayoutEffect-BEJqApFw.js";import"./componentData-DkH1zoGD.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CidjncPb.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-BNF9rHlH.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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

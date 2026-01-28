const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-DCpH0ZQG.js","./iframe-B9hgvJLw.js","./preload-helper-PPVm8Dsz.js","./iframe-DGvoTQWn.css","./Search-CeDKu8cY.js","./useDebounce-BkkthU-t.js","./translation-BweiYMkS.js","./SearchContext-CI5oNyE_.js","./lodash-Czox7iJy.js","./useAsync-y2hE-c2R.js","./useMountedState-kHvlJXnr.js","./api-o595VOBj.js","./useAnalytics-DMsrMH_e.js","./InputAdornment-CiDgCo6f.js","./useFormControl-C7CCQ6d6.js","./Button-D3LDd96-.js","./TextField-Bd7Hhesh.js","./Select-DA_ifAoh.js","./index-B9sM2jn7.js","./Popover-Bfr2YV3y.js","./Modal-Ca-S6eXi.js","./Portal-pCoOC46-.js","./List-BDdcqK40.js","./ListContext-DgcYteU3.js","./formControlState-ByiNFc8I.js","./FormLabel-Dm56BTx2.js","./InputLabel-zUexdHPJ.js","./useApp-DISJeDPh.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-B9hgvJLw.js";import{s as l,M as h}from"./api-o595VOBj.js";import{SearchBar as m}from"./SearchBar-DCpH0ZQG.js";import{S}from"./SearchContext-CI5oNyE_.js";import{S as p}from"./Grid-g3HyMBvJ.js";import{w as B}from"./appWrappers-Du9InaF6.js";import"./Search-CeDKu8cY.js";import"./useDebounce-BkkthU-t.js";import"./translation-BweiYMkS.js";import"./InputAdornment-CiDgCo6f.js";import"./useFormControl-C7CCQ6d6.js";import"./Button-D3LDd96-.js";import"./TextField-Bd7Hhesh.js";import"./Select-DA_ifAoh.js";import"./index-B9sM2jn7.js";import"./Popover-Bfr2YV3y.js";import"./Modal-Ca-S6eXi.js";import"./Portal-pCoOC46-.js";import"./List-BDdcqK40.js";import"./ListContext-DgcYteU3.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-Dm56BTx2.js";import"./InputLabel-zUexdHPJ.js";import"./useAnalytics-DMsrMH_e.js";import"./useApp-DISJeDPh.js";import"./lodash-Czox7iJy.js";import"./useAsync-y2hE-c2R.js";import"./useMountedState-kHvlJXnr.js";import"./useObservable-BcGRWwwK.js";import"./useIsomorphicLayoutEffect-DSwb9vld.js";import"./componentData-BIeygeYY.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CsGVCGL2.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-DCpH0ZQG.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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

const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-H24HmxwQ.js","./iframe-BJyhMgZx.js","./preload-helper-PPVm8Dsz.js","./iframe-BixOA4ww.css","./Search-DsGvQKCM.js","./useDebounce-BxkxbYKH.js","./translation-DakUQ2Gq.js","./SearchContext-C7gGdmvg.js","./lodash-Owt1XfFv.js","./useAsync-Bw-fkNAq.js","./useMountedState-Cu_WIlx5.js","./api-Cdm69iM_.js","./useAnalytics-D5KbbwDD.js","./InputAdornment-Blox4nKH.js","./useFormControl-Dkq16rYo.js","./Button-DRlQNqFD.js","./TextField-SHaQth9T.js","./Select-C14uzBLV.js","./index-B9sM2jn7.js","./Popover-BMSZCUIK.js","./Modal-CpRiOHte.js","./Portal-Bs15JVl2.js","./List-BFZ4Qrp4.js","./ListContext-wap519Wf.js","./formControlState-ByiNFc8I.js","./FormLabel-B_ZS34Ie.js","./InputLabel-UOElIK4s.js","./useApp-7IUhkz1i.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as i,m as d}from"./iframe-BJyhMgZx.js";import{s as l,M as h}from"./api-Cdm69iM_.js";import{SearchBar as m}from"./SearchBar-H24HmxwQ.js";import{S}from"./SearchContext-C7gGdmvg.js";import{S as p}from"./Grid-Ce4w6y7_.js";import{w as B}from"./appWrappers-DIW0xdlj.js";import"./Search-DsGvQKCM.js";import"./useDebounce-BxkxbYKH.js";import"./translation-DakUQ2Gq.js";import"./InputAdornment-Blox4nKH.js";import"./useFormControl-Dkq16rYo.js";import"./Button-DRlQNqFD.js";import"./TextField-SHaQth9T.js";import"./Select-C14uzBLV.js";import"./index-B9sM2jn7.js";import"./Popover-BMSZCUIK.js";import"./Modal-CpRiOHte.js";import"./Portal-Bs15JVl2.js";import"./List-BFZ4Qrp4.js";import"./ListContext-wap519Wf.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-B_ZS34Ie.js";import"./InputLabel-UOElIK4s.js";import"./useAnalytics-D5KbbwDD.js";import"./useApp-7IUhkz1i.js";import"./lodash-Owt1XfFv.js";import"./useAsync-Bw-fkNAq.js";import"./useMountedState-Cu_WIlx5.js";import"./useObservable-D9KjtyYv.js";import"./useIsomorphicLayoutEffect-Bd7MsJ0s.js";import"./componentData-qacj-XNq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CgpX80zE.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-H24HmxwQ.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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

const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-BeE-nDvA.js","./iframe-DsSIhbnH.js","./preload-helper-PPVm8Dsz.js","./iframe-CmXu-F3L.css","./Search-BSTPTSBK.js","./useDebounce-Dw2XWAZL.js","./translation-DCgv1bM7.js","./SearchContext-CwiYvo6a.js","./lodash-Cg6PKVQd.js","./useAsync-aBdJ7Q8-.js","./useMountedState-C6iJ77g7.js","./api-CymgrvAp.js","./useAnalytics-DEZMyLWf.js","./InputAdornment-DocIvHr3.js","./formControlState-DiVLcwSD.js","./Button-Bd8OjFri.js","./TextField-CUR4pckB.js","./Select-CX7BN7Qw.js","./index-B9sM2jn7.js","./Popover-C10icIW0.js","./Modal-jFWOd40w.js","./Portal-BImzt5t3.js","./List-CxhAFISx.js","./ListContext-B0w45w1v.js","./FormLabel-BeUo2ALU.js","./InputLabel-BV_HhXw-.js","./useApp-ByARTA3Z.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as i}from"./iframe-DsSIhbnH.js";import{s as d,M as l}from"./api-CymgrvAp.js";import{SearchBar as m}from"./SearchBar-BeE-nDvA.js";import{S as h}from"./SearchContext-CwiYvo6a.js";import{S as p}from"./Grid-DCNbb8Yd.js";import{m as S}from"./makeStyles-BTdK2mva.js";import{w as B}from"./appWrappers-YNWN04ek.js";import"./Search-BSTPTSBK.js";import"./useDebounce-Dw2XWAZL.js";import"./translation-DCgv1bM7.js";import"./InputAdornment-DocIvHr3.js";import"./formControlState-DiVLcwSD.js";import"./Button-Bd8OjFri.js";import"./TextField-CUR4pckB.js";import"./Select-CX7BN7Qw.js";import"./index-B9sM2jn7.js";import"./Popover-C10icIW0.js";import"./Modal-jFWOd40w.js";import"./Portal-BImzt5t3.js";import"./List-CxhAFISx.js";import"./ListContext-B0w45w1v.js";import"./FormLabel-BeUo2ALU.js";import"./InputLabel-BV_HhXw-.js";import"./useAnalytics-DEZMyLWf.js";import"./useApp-ByARTA3Z.js";import"./lodash-Cg6PKVQd.js";import"./useAsync-aBdJ7Q8-.js";import"./useMountedState-C6iJ77g7.js";import"./useObservable-Caqpr-Ay.js";import"./useIsomorphicLayoutEffect-C4ssAhsG.js";import"./componentData-DtY2_pZ9.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DGCaJysn.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-BeE-nDvA.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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

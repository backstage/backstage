import{j as r,r as s,a0 as n,a1 as m,a2 as d,a3 as c}from"./iframe-DC0HuKGF.js";import{F as a}from"./FavoriteToggle-AFntO2wF.js";import{w as v}from"./appWrappers-tP4ySi-x.js";import"./preload-helper-PPVm8Dsz.js";import"./Tooltip-CTOYHy8_.js";import"./Popper-3kZsTegL.js";import"./Portal-BQrNoYBv.js";import"./makeStyles-CdFTekTr.js";import"./icons-DnGYesUI.js";import"./useApp-qCrtr9Gq.js";import"./useObservable-CHbz0Rru.js";import"./useIsomorphicLayoutEffect-Btshp-T3.js";import"./useAnalytics-BaWCJwCB.js";import"./useAsync-pX4Qh_w3.js";import"./useMountedState-DsJQXF1h.js";import"./componentData-D6GUiLTG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-B88MtuqO.js";const B={title:"Core/FavoriteToggle",component:a,decorators:[o=>v(r.jsx(o,{}))],tags:["!manifest"]},e=()=>{const[o,i]=s.useState(!1);return r.jsx(a,{id:"favorite-toggle",title:"Add entity to favorites",isFavorite:o,onToggle:i})},p=m({...d({palette:c.dark}),components:{BackstageFavoriteToggleIcon:{styleOverrides:{icon:()=>({color:"aqua"}),iconBorder:()=>({color:"white"})}}}}),t=()=>{const[o,i]=s.useState(!1);return r.jsx(n,{theme:p,children:r.jsx(a,{id:"favorite-toggle",title:"Add entity to favorites",isFavorite:o,onToggle:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"WithThemeOverride"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const [isFavorite, setFavorite] = useState(false);
  return (
    <FavoriteToggle
      id="favorite-toggle"
      title="Add entity to favorites"
      isFavorite={isFavorite}
      onToggle={setFavorite}
    />
  );
};
`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const WithThemeOverride = () => {
  const [isFavorite, setFavorite] = useState(false);
  return (
    <UnifiedThemeProvider theme={theme}>
      <FavoriteToggle
        id="favorite-toggle"
        title="Add entity to favorites"
        isFavorite={isFavorite}
        onToggle={setFavorite}
      />
    </UnifiedThemeProvider>
  );
};
`,...t.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const [isFavorite, setFavorite] = useState(false);
  return <FavoriteToggle id="favorite-toggle" title="Add entity to favorites" isFavorite={isFavorite} onToggle={setFavorite} />;
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const [isFavorite, setFavorite] = useState(false);
  return <UnifiedThemeProvider theme={theme}>
      <FavoriteToggle id="favorite-toggle" title="Add entity to favorites" isFavorite={isFavorite} onToggle={setFavorite} />
    </UnifiedThemeProvider>;
}`,...t.parameters?.docs?.source}}};const E=["Default","WithThemeOverride"];export{e as Default,t as WithThemeOverride,E as __namedExportsOrder,B as default};

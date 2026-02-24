import{j as r,r as s,a0 as n,a1 as m,a2 as d,a3 as c}from"./iframe-n0fImp44.js";import{F as a}from"./FavoriteToggle-DcUexppp.js";import{w as v}from"./appWrappers-Zn1Dzz5V.js";import"./preload-helper-PPVm8Dsz.js";import"./Tooltip-Ni_hV5_d.js";import"./Popper-D6PulSAE.js";import"./Portal-DaF9Kh8d.js";import"./makeStyles-7xRdzCom.js";import"./icons-Bvyne1-8.js";import"./useApp-8qQHYFVi.js";import"./useObservable-CVilGQrk.js";import"./useIsomorphicLayoutEffect-Dw9zUxRi.js";import"./useAnalytics-Z90ozCE5.js";import"./useAsync-BaYKehuj.js";import"./useMountedState-2Tq8J5yq.js";import"./componentData-CRFypemT.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DIbljhmp.js";const B={title:"Core/FavoriteToggle",component:a,decorators:[o=>v(r.jsx(o,{}))],tags:["!manifest"]},e=()=>{const[o,i]=s.useState(!1);return r.jsx(a,{id:"favorite-toggle",title:"Add entity to favorites",isFavorite:o,onToggle:i})},p=m({...d({palette:c.dark}),components:{BackstageFavoriteToggleIcon:{styleOverrides:{icon:()=>({color:"aqua"}),iconBorder:()=>({color:"white"})}}}}),t=()=>{const[o,i]=s.useState(!1);return r.jsx(n,{theme:p,children:r.jsx(a,{id:"favorite-toggle",title:"Add entity to favorites",isFavorite:o,onToggle:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"WithThemeOverride"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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

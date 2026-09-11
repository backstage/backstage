import{bQ as e,c8 as o,a4 as h}from"./iframe-CZAQRplz.js";import{s as y,M as S}from"./api-BLooGu2X.js";import{c as L}from"./SearchResult-8a1aTFoq.js";import{S as s}from"./SearchResultList-BiQsI5YW.js";import{S as q}from"./SearchContext-Bo3Z51V3.js";import{L as f}from"./ListItemText-CUI1aXOB.js";import{H as x}from"./DefaultResultListItem-kyD7Thls.js";import{C as j}from"./icons-D8C5WnVp.js";import{O as P,a as C}from"./appWrappers-DHMn8qWD.js";import{L as w}from"./ListItem-ZGqbZKXu.js";import{L as A}from"./ListItemIcon-QwFFLOM-.js";import{a as _}from"./Plugin-DnL3C0EB.js";import{S as R}from"./Grid-DzCeEWhe.js";import{L as W}from"./Link-CvqIzusg.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-BlCfiJ5k.js";import"./useAsync-BBMi03Xp.js";import"./useMountedState-CdIJTKGb.js";import"./lodash-CsxFj9lc.js";import"./useElementFilter-BVHBWo-P.js";import"./componentData-DPmdG49O.js";import"./List-DLb1QRd3.js";import"./ListContext-C7UxNvJ1.js";import"./translation-Bnz_EIUU.js";import"./EmptyState-BnIaNwIS.js";import"./makeStyles-Cb2cCzWc.js";import"./Progress-zFXEKFMq.js";import"./LinearProgress-BKLGsv_L.js";import"./Box-BT6vekTm.js";import"./styled-D7sM8uiQ.js";import"./ResponseErrorPanel-Cdgpd4as.js";import"./ErrorPanel-C70WrcfX.js";import"./WarningPanel-jCLK6dLd.js";import"./ExpandMore-DGLt-LUh.js";import"./AccordionDetails-CmRMtsuC.js";import"./index-B9sM2jn7.js";import"./Collapse-D69rxmfn.js";import"./MarkdownContent-BBQs1Glt.js";import"./CodeSnippet-B4Hyy7e_.js";import"./CopyTextButton-ChiaW4rC.js";import"./useCopyToClipboard-DzIgqp7X.js";import"./Tooltip-BbrTD1_A.js";import"./useObjectRef-DwsoHqPD.js";import"./useOverlayTriggerState-BMaBp8bg.js";import"./utils-BddjkJjV.js";import"./useFocusRing-w6vd38rs.js";import"./openLink-CS4qCOfy.js";import"./number-BaLbbo2Y.js";import"./I18nProvider-Dmp-YX3j.js";import"./useControlledState-Cx450bSi.js";import"./animation-5CSH7QQO.js";import"./useHover-CrLHZKML.js";import"./ButtonIcon-wEBhiqto.js";import"./Button-ByHr54p0.js";import"./Label-Z5tvaBq7.js";import"./Hidden-nk8B1O_e.js";import"./useLabel-CveRpJyO.js";import"./useLabels-D2HB4ybw.js";import"./useButton-CKjpqyyh.js";import"./usePress-QNMEwl8q.js";import"./textSelection-DmuaJtMt.js";import"./index-D3WcWjUz.js";import"./Divider-D2m1Gpq4.js";import"./useApp-BwYv7u9J.js";import"./WebStorage-Cx4cDOuP.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-D_FYj-VW.js";import"./useIsomorphicLayoutEffect-BD9JGZ-e.js";import"./BUIProvider-DYyFDI-V.js";import"./BUIRoutingProvider-C_mkOCzL.js";import"./useResolvedHref-Ddyd4aYm.js";import"./useRouteRef-CfSH58z8.js";import"./index-DWX2uXpx.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  return <SearchContextProvider>
      <SearchResultList />
    </SearchContextProvider>;
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <SearchResultList query={query} />;
}`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {})
  }]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {
      throw new Error();
    })
  }]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList query={query} noResultsComponent={<ListItemText primary="No results were found" />} />
    </TestApiProvider>;
}`,...p.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom']
  });
  return <SearchResultList query={query} renderResultItem={({
    type,
    document,
    highlight,
    rank
  }) => {
    switch (type) {
      case 'custom':
        return <CustomResultListItem key={document.location} icon={<CatalogIcon />} result={document} highlight={highlight} rank={rank} />;
      default:
        return <DefaultResultListItem key={document.location} result={document} />;
    }
  }} />;
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  const plugin = createPlugin({
    id: 'plugin'
  });
  const DefaultSearchResultListItem = plugin.provide(createSearchResultListItemExtension({
    name: 'DefaultResultListItem',
    component: async () => DefaultResultListItem
  }));
  return <SearchResultList query={query}>
      <DefaultSearchResultListItem />
    </SearchResultList>;
}`,...d.parameters?.docs?.source}}};const rt=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,rt as __namedExportsOrder,tt as default};

import{j as e,r as o,a3 as h}from"./iframe-SQ-DrL5X.js";import{s as y,M as S}from"./api-BNKCg0aq.js";import{c as L}from"./SearchResult-CaZgrr2h.js";import{S as s}from"./SearchResultList-DC2gxDbd.js";import{S as q}from"./SearchContext-CM9k6e-l.js";import{L as f}from"./ListItemText-k6zwYryN.js";import{H as x}from"./DefaultResultListItem-B6vbLOil.js";import{C as j}from"./icons-CW-KURBa.js";import{w as P,c as C}from"./appWrappers-Rh5_rLhm.js";import{L as w}from"./ListItem-gDNiL9FP.js";import{L as A}from"./ListItemIcon-D9G4W8uu.js";import{c as _}from"./Plugin-efXmlwoQ.js";import{S as R}from"./Grid-HVfBHifM.js";import{L as W}from"./Link-Bar4EQzr.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-CVS451d_.js";import"./useAsync-DQVALOZU.js";import"./useMountedState-DACqQM7r.js";import"./lodash-aVxBzF5u.js";import"./useElementFilter-BTGT0lo2.js";import"./componentData-B92yaxEl.js";import"./List-DB7A22uf.js";import"./ListContext-kEGsA8es.js";import"./translation-axeN7B6O.js";import"./EmptyState-BDHWh7hG.js";import"./makeStyles-CcvGO_cU.js";import"./Progress-CjsTbPWg.js";import"./LinearProgress-oKKUdwh6.js";import"./Box-jO9atyci.js";import"./styled-1GO4OxeJ.js";import"./ResponseErrorPanel-D3jue_BY.js";import"./ErrorPanel-Ckzx14op.js";import"./WarningPanel-C1kgmh91.js";import"./ExpandMore-DJRaFll9.js";import"./AccordionDetails-jaK267eJ.js";import"./index-B9sM2jn7.js";import"./Collapse-jswZGveg.js";import"./MarkdownContent-DnTsAUwj.js";import"./CodeSnippet-DrVOOVLi.js";import"./CopyTextButton-DZCWb9mw.js";import"./useCopyToClipboard-C4mcqumo.js";import"./Tooltip-pye6v7I6.js";import"./useObjectRef-BvCpdf-D.js";import"./useOverlayTriggerState-DEML2GX7.js";import"./utils-DS6PrpIl.js";import"./useFocusRing-BjVI5GO7.js";import"./openLink-DWLtw0ci.js";import"./number-CcK3WKXn.js";import"./I18nProvider-z6RUFbQd.js";import"./useControlledState-BLu3Mzk7.js";import"./animation-CoeCW5HE.js";import"./useHover-DHCGAdFi.js";import"./ButtonIcon-DSZd6VxV.js";import"./Button-ChyeSkQq.js";import"./Label-CZqZr_x1.js";import"./Hidden-ZDc1mtAl.js";import"./useLabel-w96aGTJB.js";import"./useLabels-X84YCiAH.js";import"./useButton-BSkNsead.js";import"./usePress-DMyM15Qa.js";import"./textSelection-B-fLBI4W.js";import"./index-CmVRNaDw.js";import"./Divider-DIkUV8fk.js";import"./useApp-BSyWMm0o.js";import"./WebStorage-Dtblz6IV.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-7CAZnaF2.js";import"./useIsomorphicLayoutEffect-DEHqBdEt.js";import"./BUIProvider-BlJs7uSL.js";import"./BUIRoutingProvider-ByqVwzoJ.js";import"./useResolvedHref-0dOuUxIW.js";import"./useRouteRef-B44PqngG.js";import"./index-hXrAf_FH.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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

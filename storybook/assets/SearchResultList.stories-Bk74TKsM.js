import{j as e,r as o,a3 as h}from"./iframe-CMSX-Slv.js";import{s as y,M as S}from"./api-DxPdYrrE.js";import{c as L}from"./SearchResult-DYNeYmAe.js";import{S as s}from"./SearchResultList-CudMZrIc.js";import{S as q}from"./SearchContext-cnM6DFvB.js";import{L as f}from"./ListItemText-C3Uz1I1p.js";import{H as x}from"./DefaultResultListItem-BQKUptU1.js";import{C as j}from"./icons-CpzoJk3k.js";import{w as P,c as C}from"./appWrappers-CVSao9ZM.js";import{L as w}from"./ListItem-zoeI7a-b.js";import{L as A}from"./ListItemIcon-Bb6Dr3lC.js";import{c as _}from"./Plugin-DJDHrf_u.js";import{S as R}from"./Grid-CftEnNEm.js";import{L as W}from"./Link-CWhz2WXp.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-BQThuKWZ.js";import"./useAsync-aXM3lV21.js";import"./useMountedState-CRdqm6Ni.js";import"./lodash-CziDWmf6.js";import"./useElementFilter-DfwofMr2.js";import"./componentData-DvM2i4Kp.js";import"./List-C_4Wuvt0.js";import"./ListContext-DVytDPzj.js";import"./translation-QeVefKOI.js";import"./EmptyState-QQqyioSX.js";import"./makeStyles-C56sb6JC.js";import"./Progress-CtdYEdVV.js";import"./LinearProgress-Byv3VdFA.js";import"./Box-DUV89UkZ.js";import"./styled-EAA9K7Rc.js";import"./ResponseErrorPanel-zeI49Jgu.js";import"./ErrorPanel-BpJTolUg.js";import"./WarningPanel-CVXsWPFb.js";import"./ExpandMore-CxD86Ymg.js";import"./AccordionDetails-CG6VB7z5.js";import"./index-B9sM2jn7.js";import"./Collapse-B7qWjyOd.js";import"./MarkdownContent-DE-av-nW.js";import"./CodeSnippet-CZA_HRyb.js";import"./CopyTextButton-CBQR8gRU.js";import"./useCopyToClipboard-4CXQdWGo.js";import"./Tooltip-Dd1GWXAA.js";import"./useObjectRef-BtQagX3Q.js";import"./useOverlayTriggerState-u57ke4k2.js";import"./utils-lN068qtb.js";import"./useFocusRing-DUZK2ZXK.js";import"./openLink-p0OhMCOD.js";import"./number-gVXFFl9I.js";import"./I18nProvider-B2rLmNuT.js";import"./useControlledState-DUMTY9Yj.js";import"./animation-rB_Nrf2Y.js";import"./useHover-D7owYt-e.js";import"./ButtonIcon-DN3nNPiF.js";import"./Button-C89HVwFt.js";import"./Label-QJ7mfr_v.js";import"./Hidden-kIQntXwy.js";import"./useLabel-BoN1kqrs.js";import"./useLabels-B9A8JaNL.js";import"./useButton-C_sygl1c.js";import"./usePress-BzSNyydx.js";import"./textSelection-CwsB_5f_.js";import"./getMetaValue-DyXwXlFD.js";import"./index-DnnZFGoL.js";import"./Divider-DrJnGvnU.js";import"./useApp-ghU1X1ft.js";import"./WebStorage-C5-Lnuo3.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DoFBgZRI.js";import"./useIsomorphicLayoutEffect-CbYSmtjY.js";import"./BUIProvider-rCuBO32v.js";import"./BUIRoutingProvider-CMtIo0Uo.js";import"./useResolvedHref-CvdgPikl.js";import"./useRouteRef-Ck-5alzw.js";import"./index-CrZisxgt.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const st=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,st as __namedExportsOrder,rt as default};

import{bR as e,ca as o,a5 as h}from"./iframe-B-XWDeDQ.js";import{s as y,M as S}from"./api-BLZgOCJI.js";import{c as L}from"./SearchResult-CFeTxZli.js";import{S as s}from"./SearchResultList-DP82-Kiw.js";import{S as q}from"./SearchContext-Bo26oFhK.js";import{L as f}from"./ListItemText-Bzq1QA9U.js";import{H as x}from"./DefaultResultListItem-DfxhiZIi.js";import{C as j}from"./icons-Clv0NMxx.js";import{O as P,a as C}from"./appWrappers-U7qRfizJ.js";import{L as w}from"./ListItem-DoBNITuN.js";import{L as A}from"./ListItemIcon-BgxQ76uL.js";import{a as _}from"./Plugin-CHmOPpz3.js";import{S as R}from"./Grid-DlZWfQ-Q.js";import{L as W}from"./Link-CSdGXlEL.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-DVZxQzXL.js";import"./useAsync-DUW1TQn3.js";import"./useMountedState-BukLh9ih.js";import"./lodash-B6QrYLNa.js";import"./useElementFilter-C7b49D9j.js";import"./componentData-CFqG8mL3.js";import"./List-B2qp51Az.js";import"./ListContext-FIADtkdO.js";import"./translation-zSQ1bmkH.js";import"./EmptyState-BQkGW_s-.js";import"./makeStyles-B-ovMmn3.js";import"./Progress-DxyZK7XM.js";import"./LinearProgress-Bw2RhlSz.js";import"./Box-B2gdNV-U.js";import"./styled-BkxpGzDj.js";import"./ResponseErrorPanel-AYWBR7I7.js";import"./ErrorPanel-CaxrQ0ad.js";import"./WarningPanel-r8Qqg8pm.js";import"./ExpandMore-D0m5rZPI.js";import"./AccordionDetails-BaZKIOPB.js";import"./index-B9sM2jn7.js";import"./Collapse-DrD8TQK7.js";import"./MarkdownContent-UDRC7-cM.js";import"./CodeSnippet-CW5DvjkE.js";import"./CopyTextButton-C1Tg5Cdg.js";import"./useCopyToClipboard-Bl9FFERX.js";import"./Tooltip-D4Ye8L4j.js";import"./useObjectRef-BjeGjbpr.js";import"./useOverlayTriggerState-Bvm7VbjX.js";import"./utils-DALzhVoK.js";import"./useFocusRing-rcGClAZz.js";import"./openLink-m4-wtxGX.js";import"./number-CqHCUUB4.js";import"./I18nProvider-DDduGJCb.js";import"./useControlledState-BYvHYB8a.js";import"./animation-DroFJ5da.js";import"./useHover-CNCT38hS.js";import"./ButtonIcon-CLqLS6zp.js";import"./Button-Ce-wB0G_.js";import"./Label-D7GSmtfn.js";import"./Hidden-BedOfKsW.js";import"./useLabel-DttkFmAP.js";import"./useLabels-B3aofaea.js";import"./useButton-Br7mSKpa.js";import"./usePress-RR4GC8Vt.js";import"./textSelection-BxRq1vrn.js";import"./index-Bhxil5SO.js";import"./Divider-B6ZuA0Sw.js";import"./useApp-DQh8lVpI.js";import"./WebStorage-DVcG-WvC.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CiHpYyCN.js";import"./useIsomorphicLayoutEffect-lbFfukZz.js";import"./BUIProvider-D9rRdaFt.js";import"./useResolvedHref-F8wq_2PL.js";import"./useRouteRef-BZ7VBikN.js";import"./index-BOP42mNO.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const tt=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,tt as __namedExportsOrder,et as default};

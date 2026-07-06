import{bR as e,ca as o,a5 as h}from"./iframe-D-U3XCi_.js";import{s as y,M as S}from"./api-DV1kXobU.js";import{c as L}from"./SearchResult-DVXaGbeB.js";import{S as s}from"./SearchResultList-BvHUEv9x.js";import{S as q}from"./SearchContext-CynHsH_q.js";import{L as f}from"./ListItemText-Ah0rTT0N.js";import{H as x}from"./DefaultResultListItem-C5HsaeVF.js";import{C as j}from"./icons-CmD0g6DB.js";import{O as P,a as C}from"./appWrappers-BaWcwZMN.js";import{L as w}from"./ListItem-BICUgtEX.js";import{L as A}from"./ListItemIcon-9AsF9plF.js";import{a as _}from"./Plugin-RXoEb6tP.js";import{S as R}from"./Grid-3D9u4l8r.js";import{L as W}from"./Link-BBOsyqXp.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-B1tdSmq6.js";import"./useAsync-DXF9iof3.js";import"./useMountedState-CnSySDzk.js";import"./lodash-KEAh9Gl1.js";import"./useElementFilter-JagACkd6.js";import"./componentData-0C9L9b0T.js";import"./List-Bt_VxheE.js";import"./ListContext-DMa2K4C7.js";import"./translation-tkBE4Dw7.js";import"./EmptyState-DJ4BpB2r.js";import"./makeStyles-BHo2IBLU.js";import"./Progress-CKp04M1G.js";import"./LinearProgress-DWMptQjJ.js";import"./Box-CiofjXgh.js";import"./styled-B4F0dw99.js";import"./ResponseErrorPanel-a-6C4JXV.js";import"./ErrorPanel-afGinZys.js";import"./WarningPanel-ChoLhM-U.js";import"./ExpandMore-DudBgA4X.js";import"./AccordionDetails-DHQKlz72.js";import"./index-B9sM2jn7.js";import"./Collapse-C3Lt1qny.js";import"./MarkdownContent-CrtvNdWY.js";import"./CodeSnippet-BCp1dgf9.js";import"./CopyTextButton-BQQISJCS.js";import"./useCopyToClipboard-C8ecOTn7.js";import"./Tooltip-ChAjjmE8.js";import"./useObjectRef-CPQl0FPH.js";import"./useOverlayTriggerState-BMh6qldU.js";import"./utils-BR4WWUPw.js";import"./useFocusRing-ChTmVwiQ.js";import"./openLink-CUqeOgDt.js";import"./number-v8QHaCn-.js";import"./I18nProvider-QDJG5ejG.js";import"./useControlledState-CXF1rY7r.js";import"./animation-DU5l6MIa.js";import"./useHover-C7AGz9RX.js";import"./ButtonIcon-CKZEErcO.js";import"./Button-CNFlQLM7.js";import"./Label-67Mz0DTG.js";import"./Hidden-BT-waPLA.js";import"./useLabel-D8B5Ekv6.js";import"./useLabels-CrgyuspR.js";import"./useButton-CtCvtk7k.js";import"./usePress-D5PsofWG.js";import"./textSelection-C16VXh1L.js";import"./index-1kifiLVj.js";import"./Divider-CbGLj0gZ.js";import"./useApp-CXgo0NWV.js";import"./WebStorage-BzHu-HT4.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CAWuc5G6.js";import"./useIsomorphicLayoutEffect-BP1UAeEv.js";import"./BUIProvider-DxfsVl8y.js";import"./useResolvedHref-CKBZ7MYz.js";import"./useRouteRef-BkYIUSQI.js";import"./index-DUl2QbDn.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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

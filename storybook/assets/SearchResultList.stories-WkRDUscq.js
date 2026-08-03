import{bR as e,ca as o,a5 as h}from"./iframe-BErNvpjr.js";import{s as y,M as S}from"./api-C1x-ni0b.js";import{c as L}from"./SearchResult-BF1t_x79.js";import{S as s}from"./SearchResultList-v0zIQvER.js";import{S as q}from"./SearchContext-BjOekDZw.js";import{L as f}from"./ListItemText-DwxzA3ij.js";import{H as x}from"./DefaultResultListItem-D6EBDt8S.js";import{C as j}from"./icons-DwrUyo6t.js";import{O as P,a as C}from"./appWrappers-A6fCf0AU.js";import{L as w}from"./ListItem-CeLlFv2m.js";import{L as A}from"./ListItemIcon-C2N_qs5Y.js";import{a as _}from"./Plugin-BTrbMg8k.js";import{S as R}from"./Grid-DJysy46s.js";import{L as W}from"./Link-CW9uhsyO.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-AQKAppCK.js";import"./useAsync-Cwk1j0DW.js";import"./useMountedState-D3TlKKjE.js";import"./lodash-0cH3ibhz.js";import"./useElementFilter-Bv8a5Duy.js";import"./componentData-D0w50on-.js";import"./List-D-_MzgLt.js";import"./ListContext-uCf9E0gM.js";import"./translation-Jovb_7mD.js";import"./EmptyState-CCKl0RkD.js";import"./makeStyles-BfJTzYxE.js";import"./Progress-zPBmA3bB.js";import"./LinearProgress-D3ceGrBI.js";import"./Box-DlU-DYqp.js";import"./styled-CONJ26HT.js";import"./ResponseErrorPanel-RBQ8xAOJ.js";import"./ErrorPanel-DUJWY3Dj.js";import"./WarningPanel-aeS1uxlY.js";import"./ExpandMore-cdbn0UMB.js";import"./AccordionDetails-BHPknckT.js";import"./index-B9sM2jn7.js";import"./Collapse-CH6-pVPs.js";import"./MarkdownContent-OKD1FB1e.js";import"./CodeSnippet-BeMik3xT.js";import"./CopyTextButton-gR9BLXAd.js";import"./useCopyToClipboard-BN932-yp.js";import"./Tooltip-XMa2Y4y3.js";import"./useObjectRef-BTVJqnIZ.js";import"./useOverlayTriggerState-dtDxw6VN.js";import"./utils-CkI-fiaI.js";import"./useFocusRing-DhH0pnm8.js";import"./openLink-VEX9Ze2_.js";import"./number-B7KdHmdZ.js";import"./I18nProvider-Co2RDX0c.js";import"./useControlledState-DHvityQM.js";import"./animation-vcnj4bnB.js";import"./useHover-n_zdByGl.js";import"./ButtonIcon-DzHq31Aa.js";import"./Button-ZmGKrZ8S.js";import"./Label-CdvKSS9p.js";import"./Hidden-BXpNp4mY.js";import"./useLabel-0LCDbxSL.js";import"./useLabels-BfB1Y_Ok.js";import"./useButton-CuzCCNla.js";import"./usePress-BuVIReZf.js";import"./textSelection-Beclu5dQ.js";import"./index-9xGCRmTA.js";import"./Divider-rnFOpPZ9.js";import"./useApp-C0t03fHF.js";import"./WebStorage-BZhYXFJG.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-B6p4sWiD.js";import"./useIsomorphicLayoutEffect-DYOaoGXA.js";import"./BUIProvider-Dq5AuJpk.js";import"./useResolvedHref-D6iP9kLP.js";import"./useRouteRef-CLazalLu.js";import"./index-CCyVLSfT.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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

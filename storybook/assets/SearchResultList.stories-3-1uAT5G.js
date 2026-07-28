import{bR as e,ca as o,a5 as h}from"./iframe-DQtIir6_.js";import{s as y,M as S}from"./api-C0Hpf04Q.js";import{c as L}from"./SearchResult-DRSRdF0c.js";import{S as s}from"./SearchResultList-DN4IKuTb.js";import{S as q}from"./SearchContext-hprKWKlc.js";import{L as f}from"./ListItemText-CKhQJenL.js";import{H as x}from"./DefaultResultListItem-BDPY9jRI.js";import{C as j}from"./icons-DG_-coDt.js";import{O as P,a as C}from"./appWrappers-QWvw0PME.js";import{L as w}from"./ListItem-D7j56-L5.js";import{L as A}from"./ListItemIcon-DO2sfe6B.js";import{a as _}from"./Plugin-hz3JFJfH.js";import{S as R}from"./Grid-DtwO6FOq.js";import{L as W}from"./Link-WvvQIOcL.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-Nt1lbfmh.js";import"./useAsync-B2B92X5M.js";import"./useMountedState-DRMZFfHM.js";import"./lodash-BeLSVBlD.js";import"./useElementFilter-B97JRtd6.js";import"./componentData-DhuZXKP2.js";import"./List-C72_ZxQh.js";import"./ListContext-f0KYlYlh.js";import"./translation-D8ERj5F7.js";import"./EmptyState-42m7ATYz.js";import"./makeStyles-BGUJ1R1k.js";import"./Progress-IwO1uvoz.js";import"./LinearProgress-DgeG-fqv.js";import"./Box-O4mveAiq.js";import"./styled-BhIgo9Dl.js";import"./ResponseErrorPanel-CyijHQ-F.js";import"./ErrorPanel-ZL5mskZ0.js";import"./WarningPanel-DV06t-QB.js";import"./ExpandMore-Dx9L6UHV.js";import"./AccordionDetails-CEs8-W4z.js";import"./index-B9sM2jn7.js";import"./Collapse-ELObKcrO.js";import"./MarkdownContent-CCrH7sfU.js";import"./CodeSnippet-BTplX1ot.js";import"./CopyTextButton-SBufMEt8.js";import"./useCopyToClipboard-iDN3WyYX.js";import"./Tooltip-zNdaS_lN.js";import"./useObjectRef-DXWxL9lA.js";import"./useOverlayTriggerState-BR5G58Ql.js";import"./utils-Bxehr4HY.js";import"./useFocusRing-C5ZfLx-L.js";import"./openLink-DLb8P_7j.js";import"./number-CQw8CDov.js";import"./I18nProvider-DPDmyrTN.js";import"./useControlledState-DM-B3g3-.js";import"./animation-BlVyC_Be.js";import"./useHover-Dsk-KXl4.js";import"./ButtonIcon-DlTdXCD7.js";import"./Button-hU1qrjNo.js";import"./Label-CAcSZgVu.js";import"./Hidden-BXNE10bz.js";import"./useLabel-mAp9Q6tE.js";import"./useLabels-DLIlGtBk.js";import"./useButton-yvh0BHKl.js";import"./usePress-T3jvNl8O.js";import"./textSelection-Nrcy7rMY.js";import"./index-DAbm8TV7.js";import"./Divider-D3NWx-U1.js";import"./useApp-D0OeqPVb.js";import"./WebStorage-DaKYb1Rr.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-PNrdDs4m.js";import"./useIsomorphicLayoutEffect-Dy6XiFEk.js";import"./BUIProvider-BFppeoJz.js";import"./useResolvedHref-DS33idVI.js";import"./useRouteRef-CogNHl6p.js";import"./index-CEfocwCu.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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

import{j as e,r as o,X as h}from"./iframe-CIT-dZu_.js";import{s as y,M as S}from"./api-BIvPCHlh.js";import{c as L}from"./SearchResult-1kfMfqjE.js";import{S as s}from"./SearchResultList-DZdIF5gH.js";import{S as q}from"./SearchContext-CyYTGuj6.js";import{L as f}from"./ListItemText-DYNNiolN.js";import{H as x}from"./DefaultResultListItem-DcVbe2pC.js";import{C as j}from"./icons-fuRomCZJ.js";import{w as P,c as C}from"./appWrappers-BLSLivpy.js";import{L as w}from"./ListItem-Dm8k4XZR.js";import{L as A}from"./ListItemIcon-BbfAhDDF.js";import{c as _}from"./Plugin-BR7F4ypl.js";import{S as R}from"./Grid-lcFrT8I1.js";import{L as W}from"./Link-CpjWFI-c.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-DnCYApMA.js";import"./useAsync-DQRKAK2T.js";import"./useMountedState-s2okVxfw.js";import"./lodash-2vuPdsKC.js";import"./useElementFilter-CSmDoJFK.js";import"./componentData-FNzt3Gb-.js";import"./List-DWlZD8z9.js";import"./ListContext-Ce2BqoB3.js";import"./translation-WF1GcINk.js";import"./EmptyState-m9OUMTAd.js";import"./makeStyles-CS1pZXKe.js";import"./Progress-Ccm818mP.js";import"./LinearProgress-DdzsMX29.js";import"./Box-Cl1WRrl1.js";import"./styled-ezS9pEl7.js";import"./ResponseErrorPanel-DvdJp1gB.js";import"./ErrorPanel-Dbcg21SQ.js";import"./WarningPanel-C3bhPiN2.js";import"./ExpandMore-CXSEGLAk.js";import"./AccordionDetails-BG1S2WMZ.js";import"./index-B9sM2jn7.js";import"./Collapse-Bce_Nnnm.js";import"./MarkdownContent-BKw6et7U.js";import"./CopyTextButton-Ba4-8T-c.js";import"./useCopyToClipboard-Dto8Kasq.js";import"./Tooltip-2dCQur-O.js";import"./useObjectRef-B4D9CzQM.js";import"./useOverlayTriggerState-B26sLsFg.js";import"./utils-3SfRWDXk.js";import"./useFocusRing-ByVMGaNA.js";import"./number-BCBVXMPD.js";import"./I18nProvider-CmgCSkj9.js";import"./useControlledState-Bo32Yv4j.js";import"./animation-pATfZ50U.js";import"./useHover-tuK_rbDS.js";import"./ButtonIcon-CoxYVv_r.js";import"./Button-BzxePFvu.js";import"./Label-BoyMwewe.js";import"./Hidden-paCviALj.js";import"./useLabel-Cq-2nnHJ.js";import"./useLabels-BEUaVICg.js";import"./useButton-B66KWxu2.js";import"./usePress-BOnalXjM.js";import"./textSelection-aEjP62Wo.js";import"./getMetaValue-SvU3Wp5k.js";import"./index-C4qi6jZX.js";import"./Divider-BqD5GKWO.js";import"./CodeSnippet-DQQln6v9.js";import"./useApp-BxfNURiw.js";import"./index-bElBlM3z.js";import"./WebStorage-H1s3aA7_.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CXvUbn17.js";import"./useIsomorphicLayoutEffect-BpFVEX6_.js";import"./BUIProvider-DvUfRZ9N.js";import"./useRouteRef-CV0cv-s3.js";import"./index-B-HyNN-b.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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

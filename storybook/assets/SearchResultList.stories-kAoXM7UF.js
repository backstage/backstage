import{j as e,r as o,a3 as h}from"./iframe-BIybnMXI.js";import{s as y,M as S}from"./api-BeLm5gjz.js";import{c as L}from"./SearchResult-Dn1-Zkk_.js";import{S as s}from"./SearchResultList-D-Uk5vK3.js";import{S as q}from"./SearchContext-xxB6vczu.js";import{L as f}from"./ListItemText-2j2zbfbt.js";import{H as x}from"./DefaultResultListItem-BTA7tOdM.js";import{C as j}from"./icons-CTCKNfMp.js";import{w as P,c as C}from"./appWrappers-CWLlPpC1.js";import{L as w}from"./ListItem-B-2MPIj6.js";import{L as A}from"./ListItemIcon-B2viDiqc.js";import{c as _}from"./Plugin-ByDFrRuu.js";import{S as R}from"./Grid-CKJ_Bjce.js";import{L as W}from"./Link-DXi97D8o.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-Cee1mTCP.js";import"./useAsync-35LYdSE_.js";import"./useMountedState-Dhu05aIm.js";import"./lodash-BF9MgLAH.js";import"./useElementFilter-BwNotvRl.js";import"./componentData-VudDzjAh.js";import"./List-BskmEb7a.js";import"./ListContext-Dy9wnKpt.js";import"./translation-D-cYg0IO.js";import"./EmptyState-BWmF-4Mh.js";import"./makeStyles-cGXTSjHb.js";import"./Progress-D9WC94Nj.js";import"./LinearProgress-B3gPn5Jj.js";import"./Box-DUmu2mdv.js";import"./styled-BLvF1qNR.js";import"./ResponseErrorPanel-PB3YW-da.js";import"./ErrorPanel-CpAnlstS.js";import"./WarningPanel-1OyW3Mut.js";import"./ExpandMore-DngtdUVl.js";import"./AccordionDetails-DaKdjAtU.js";import"./index-B9sM2jn7.js";import"./Collapse-B_j-r4sF.js";import"./MarkdownContent-DVMKUHD_.js";import"./CodeSnippet-XmFwewW9.js";import"./CopyTextButton-BjdDstQ0.js";import"./useCopyToClipboard-Dh7Hxa4Z.js";import"./Tooltip-DG-AcMGe.js";import"./useObjectRef-CbQSD8dp.js";import"./useOverlayTriggerState-Dl82bCOM.js";import"./utils-BNWuCLNS.js";import"./useFocusRing-14fD-rIq.js";import"./openLink-_nIoHyS5.js";import"./number-DllxhX9c.js";import"./I18nProvider-CQNLYzfm.js";import"./useControlledState-CPQ03ATl.js";import"./animation-ChJpkI5_.js";import"./useHover-S-WcK3-g.js";import"./ButtonIcon-B3TYP0eD.js";import"./Button-ejIqj8kn.js";import"./Label-DU9qK1mL.js";import"./Hidden-CFw0S2EP.js";import"./useLabel-DOK2Qr8p.js";import"./useLabels-BYUTWxfw.js";import"./useButton-DMoQoLuK.js";import"./usePress-BTAge9_g.js";import"./textSelection-Dxc81R1_.js";import"./getMetaValue-BRyplxPo.js";import"./index-DRRrr8Fx.js";import"./Divider-4hCZ9_lh.js";import"./useApp-B-DAdzWT.js";import"./WebStorage-Cv07gffl.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BlFTL7mD.js";import"./useIsomorphicLayoutEffect-CCl5E4y2.js";import"./BUIProvider-BGFGf2ST.js";import"./BUIRoutingProvider-CnIqwql2.js";import"./useResolvedHref-Cp7X7JN9.js";import"./useRouteRef-BP3dw6pm.js";import"./index-C71EKvje.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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

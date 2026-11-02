import{j as e,r as o,a3 as h}from"./iframe-DvObL_em.js";import{s as y,M as S}from"./api-DyhUSvEH.js";import{c as L}from"./SearchResult-CThyhzPl.js";import{S as s}from"./SearchResultList-CQHQ2ajQ.js";import{S as q}from"./SearchContext-CCXPdnuE.js";import{L as f}from"./ListItemText-CdvKngye.js";import{H as x}from"./DefaultResultListItem-CRoghxel.js";import{C as j}from"./icons-BT_g7IF2.js";import{w as P,c as C}from"./appWrappers-gR2agPjp.js";import{L as w}from"./ListItem-HID7QX3w.js";import{L as A}from"./ListItemIcon-MnOYk2wQ.js";import{c as _}from"./Plugin-BnIrIoL7.js";import{S as R}from"./Grid-D0oIIaci.js";import{L as W}from"./Link-D58R_yeB.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-Cik4L6Xq.js";import"./useAsync-C_QuVvY4.js";import"./useMountedState-qWdGL57P.js";import"./lodash-BX0jKKjM.js";import"./useElementFilter-N6P_26Oe.js";import"./componentData-B3frsaQo.js";import"./List-2eV0WyBd.js";import"./ListContext-DWdyoQ2B.js";import"./translation-crtx32to.js";import"./EmptyState-C2hhda_Z.js";import"./makeStyles-CUBlkZ58.js";import"./Progress-CsD73cPU.js";import"./LinearProgress-z12xxeQr.js";import"./Box-vIlJQZHO.js";import"./styled-BUTQ37RD.js";import"./ResponseErrorPanel-CpjFZFLe.js";import"./ErrorPanel-BGlPlf1U.js";import"./WarningPanel-DKgWQShY.js";import"./ExpandMore-BPw42VZj.js";import"./AccordionDetails-BjGpGUQw.js";import"./index-B9sM2jn7.js";import"./Collapse-nQM4YuR3.js";import"./MarkdownContent-BYBbURLA.js";import"./CodeSnippet-ta_ZtIb9.js";import"./CopyTextButton-Cium_hFz.js";import"./useCopyToClipboard-v9MY_fxM.js";import"./Tooltip-Ee6WRrpT.js";import"./useObjectRef-DwzLjeGu.js";import"./useOverlayTriggerState-DTpXlUK_.js";import"./utils-BE29XZkF.js";import"./useFocusRing-piHZ0Lw1.js";import"./openLink-Ba7f2eDn.js";import"./number-Brjj_L0c.js";import"./I18nProvider-D9Ed_WqX.js";import"./useControlledState-DTrBQisE.js";import"./animation-PoAPtwJr.js";import"./useHover-BBinV-uq.js";import"./ButtonIcon-CxBdcPMM.js";import"./Button-BnuV3xvc.js";import"./Label-DVU8J7bE.js";import"./Hidden-9nwWkQxZ.js";import"./useLabel-Dnkr3wg9.js";import"./useLabels-B4Qm2p4e.js";import"./useButton-1rnyv_zw.js";import"./usePress-YbeHGM9M.js";import"./textSelection-C86JgNxW.js";import"./getMetaValue-aV81Iu2D.js";import"./index-D2Zpwq-Q.js";import"./Divider-DztT0DPF.js";import"./useApp-C8xACzk4.js";import"./WebStorage-CADH-q5X.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DRY9ixeB.js";import"./useIsomorphicLayoutEffect-PWyqTlhF.js";import"./BUIProvider-AdcJPj66.js";import"./BUIRoutingProvider-FkpniH64.js";import"./useResolvedHref-DnRnBf0l.js";import"./useRouteRef-nSqCXu_w.js";import"./index-7QwSRqxh.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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

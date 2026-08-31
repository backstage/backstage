import{bQ as e,c8 as o,a4 as h}from"./iframe-D3gHomOk.js";import{s as y,M as S}from"./api-CSqAMwdU.js";import{c as L}from"./SearchResult-BDgOKnQM.js";import{S as s}from"./SearchResultList-BCSZjap5.js";import{S as q}from"./SearchContext-D_tv9kYR.js";import{L as f}from"./ListItemText-DP3tOgeZ.js";import{H as x}from"./DefaultResultListItem-CyH0K-7M.js";import{C as j}from"./icons-mR1qKgFJ.js";import{O as P,a as C}from"./appWrappers-H0a9YQ-l.js";import{L as w}from"./ListItem-CqA_znyK.js";import{L as A}from"./ListItemIcon-EaRXVwrs.js";import{a as _}from"./Plugin-DECEvu0s.js";import{S as R}from"./Grid-CyyBT709.js";import{L as W}from"./Link-2oVCQXKr.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-l6aR9y4o.js";import"./useAsync-B81SIAob.js";import"./useMountedState-D4RFf6EC.js";import"./lodash-D6bxT6gM.js";import"./useElementFilter-BrEmoMz_.js";import"./componentData-BrD0tNsD.js";import"./List-CAlmE_09.js";import"./ListContext-CQj0z8nE.js";import"./translation-mt0DWe2n.js";import"./EmptyState-BcnH6fTz.js";import"./makeStyles-T-ZYABdB.js";import"./Progress-Cr4oGLNN.js";import"./LinearProgress-D3wfxoXD.js";import"./Box-DrtPh2Ik.js";import"./styled-BVXiuVTX.js";import"./ResponseErrorPanel-CAmnCjaw.js";import"./ErrorPanel-B0mYOaLc.js";import"./WarningPanel-BpUFRYf8.js";import"./ExpandMore-yHnPDXWT.js";import"./AccordionDetails-Bv_YAfR_.js";import"./index-B9sM2jn7.js";import"./Collapse-Bod_ULtb.js";import"./MarkdownContent-BfLKIc-z.js";import"./CodeSnippet-CVrhC5QD.js";import"./CopyTextButton-B_AkJsCd.js";import"./useCopyToClipboard-e2Hpv1m7.js";import"./Tooltip-CdsBNNYj.js";import"./useObjectRef-hXxbhaat.js";import"./useOverlayTriggerState-BAAbOSKk.js";import"./utils--jiZfpYa.js";import"./useFocusRing-DHt_dYoo.js";import"./openLink-BpYvnjEr.js";import"./number-L24Dz_3k.js";import"./I18nProvider-Bras-Ck8.js";import"./useControlledState-fmlyVL5h.js";import"./animation-BtY6VQj9.js";import"./useHover-ZdERZDwl.js";import"./ButtonIcon-o_P6yo4U.js";import"./Button-Cu1Zpd0O.js";import"./Label-CAWIGhje.js";import"./Hidden-CXwBcFFN.js";import"./useLabel-W6Ub3U1-.js";import"./useLabels-DMTWiEER.js";import"./useButton-BQFf-KYE.js";import"./usePress-CVpxTLfU.js";import"./textSelection-NP_j1vUN.js";import"./index-CIObmbyT.js";import"./Divider-BpCVoIJb.js";import"./useApp-MRQbwWB5.js";import"./WebStorage-Cb28cuwL.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Cla-FsHD.js";import"./useIsomorphicLayoutEffect-DONxPHXM.js";import"./BUIProvider-Bxr4G_Rv.js";import"./BUIRoutingProvider-ClLZP9qs.js";import"./useResolvedHref-F6RORdbO.js";import"./useRouteRef-CGGg16P4.js";import"./index-CP6cbUjo.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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

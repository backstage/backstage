import{j as e,r as o,a3 as h}from"./iframe-psIK5yLO.js";import{s as y,M as S}from"./api-BvqLUifP.js";import{c as L}from"./SearchResult-BnaHNv9n.js";import{S as s}from"./SearchResultList-syg-VGHc.js";import{S as q}from"./SearchContext-AePd5d4c.js";import{L as f}from"./ListItemText-Ohlq3yEc.js";import{H as x}from"./DefaultResultListItem-D0JigQSk.js";import{C as j}from"./icons-CoR-lal-.js";import{w as P,c as C}from"./appWrappers-D-NWaiz3.js";import{L as w}from"./ListItem-CUlz7EaG.js";import{L as A}from"./ListItemIcon-Dv-jhMIX.js";import{c as _}from"./Plugin-Cc_I9Ptk.js";import{S as R}from"./Grid-CMGT3-M2.js";import{L as W}from"./Link-CoeLOjL5.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-DunOMgS-.js";import"./useAsync-mn43h2uI.js";import"./useMountedState-JsdGtBh8.js";import"./lodash-DavWhvf8.js";import"./useElementFilter-BaCB_-eP.js";import"./componentData-CxNu6_8q.js";import"./List-CsoDoiW7.js";import"./ListContext-CW1RYZn6.js";import"./translation-C_SYtxWy.js";import"./EmptyState-CJcJYBOL.js";import"./makeStyles-BO5raylp.js";import"./Progress-DV2Y4RSX.js";import"./LinearProgress-DuOR5f-z.js";import"./Box-R-XiqEG_.js";import"./styled-Bxm6pxZC.js";import"./ResponseErrorPanel-wdDayVr-.js";import"./ErrorPanel-C77gNZJI.js";import"./WarningPanel-BbmOJUMi.js";import"./ExpandMore-C7UmlSI-.js";import"./AccordionDetails-CqQf_glR.js";import"./index-B9sM2jn7.js";import"./Collapse-8SCsonqF.js";import"./MarkdownContent-CjzjczbN.js";import"./CodeSnippet-DXcmFfDg.js";import"./CopyTextButton-Be_Zq688.js";import"./useCopyToClipboard-Cx2KmM20.js";import"./Tooltip-CCeQ_uk9.js";import"./useObjectRef-JQhcLLWe.js";import"./useOverlayTriggerState-qoSrz_6x.js";import"./utils-CftV7EFJ.js";import"./useFocusRing-MLrPTLpZ.js";import"./openLink-CZeZ1U9d.js";import"./number-DZFckd1I.js";import"./I18nProvider-NMyyBc2c.js";import"./useControlledState-vYZGCggF.js";import"./animation-BSlcDtlM.js";import"./useHover-B93NGpPn.js";import"./ButtonIcon-DKFtXmkR.js";import"./Button-DCPejbPh.js";import"./Label-ChcPP0Iy.js";import"./Hidden-EyJpXoDf.js";import"./useLabel-C2F-sL7S.js";import"./useLabels-F6gridtO.js";import"./useButton-CXcOFXh4.js";import"./usePress-Bjjm_ouf.js";import"./textSelection-Df_eiIv9.js";import"./getMetaValue-Cq3cpixi.js";import"./index-Co8i19eP.js";import"./Divider-7jYIyKh_.js";import"./useApp-Dtg5HRbD.js";import"./WebStorage-D_BhlxFV.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BiFXzlrm.js";import"./useIsomorphicLayoutEffect-Bv8sPo2x.js";import"./BUIProvider-C83dKFXg.js";import"./BUIRoutingProvider-DGp64BJg.js";import"./useResolvedHref-D6pK9K8J.js";import"./useRouteRef-Ba9Wwey9.js";import"./index-DmDFDvYh.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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

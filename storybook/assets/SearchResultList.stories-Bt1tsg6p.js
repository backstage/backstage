import{j as e,r as o,a3 as h}from"./iframe-D_sJ6DQq.js";import{s as y,M as S}from"./api-D3_gYsw2.js";import{c as L}from"./SearchResult-BjO7PGXR.js";import{S as s}from"./SearchResultList-Gu0hsLoh.js";import{S as q}from"./SearchContext-BL8wJAP5.js";import{L as f}from"./ListItemText-DWiwot-8.js";import{H as x}from"./DefaultResultListItem-BXz_Hxyn.js";import{C as j}from"./icons-BvP2ovlu.js";import{w as P,c as C}from"./appWrappers-UMN25zqj.js";import{L as w}from"./ListItem-Bx10SaLX.js";import{L as A}from"./ListItemIcon-DmgB2hDk.js";import{c as _}from"./Plugin-CEeaQ149.js";import{S as R}from"./Grid-WyTZzD8J.js";import{L as W}from"./Link-DK9bz3Wb.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-DuovMTEZ.js";import"./useAsync-B5gGGIHo.js";import"./useMountedState-CI2sWujd.js";import"./lodash-CO9od4is.js";import"./useElementFilter-C1uOarc6.js";import"./componentData-6D7_Pmdl.js";import"./List-BTunbdig.js";import"./ListContext-B5K8tLHG.js";import"./translation-DIHYx_jW.js";import"./EmptyState-InSo_CFb.js";import"./makeStyles-YbKVSigC.js";import"./Progress-BQVnzA4-.js";import"./LinearProgress-BBqIje3q.js";import"./Box-DJ0NzJ3e.js";import"./styled-DG5hZJap.js";import"./ResponseErrorPanel-Be68RHk7.js";import"./ErrorPanel-C4e-wnbL.js";import"./WarningPanel-DC0apbI3.js";import"./ExpandMore-BPAQkCGI.js";import"./AccordionDetails-WN2ENuyD.js";import"./index-B9sM2jn7.js";import"./Collapse-iL-BhdWY.js";import"./MarkdownContent-l5npv1ih.js";import"./CodeSnippet-D4_0l468.js";import"./CopyTextButton-DqizaOeP.js";import"./useCopyToClipboard-COHg6DWB.js";import"./Tooltip-sRD7G72k.js";import"./useObjectRef-C71_ODYl.js";import"./useOverlayTriggerState-D-wAUn4a.js";import"./utils-rcqHDtde.js";import"./useFocusRing-DDwhFymc.js";import"./openLink-DVi3OW0T.js";import"./number-Dv4CgBIP.js";import"./I18nProvider-Bnu7qnYs.js";import"./useControlledState-F0ZESx8Q.js";import"./animation-uPm_hcT3.js";import"./useHover-CC1tHz-Y.js";import"./ButtonIcon-DMG0d2wX.js";import"./Button-B76pvApp.js";import"./Label-CqUgdJka.js";import"./Hidden-B0JsmZw6.js";import"./useLabel-JU3kQl_C.js";import"./useLabels-CtqB2Ot9.js";import"./useButton-BuKBKhUn.js";import"./usePress-LFrjKvgu.js";import"./textSelection-5Cu1iBDL.js";import"./getMetaValue-DT9wVw6b.js";import"./index-BDjCUC6F.js";import"./Divider-_pvAg02y.js";import"./useApp-DU8gpE_8.js";import"./WebStorage-L-UzL4rC.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Bv0v18zr.js";import"./useIsomorphicLayoutEffect-DptDwTeC.js";import"./BUIProvider-BidkyxVm.js";import"./BUIRoutingProvider-BnYGukOM.js";import"./useResolvedHref-DjhEn3qh.js";import"./useRouteRef-Qaeq3qme.js";import"./index-BdNqNG9A.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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

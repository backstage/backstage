import{bR as e,ca as o,a5 as h}from"./iframe-COykYx45.js";import{s as y,M as S}from"./api-D8D9l_gL.js";import{c as L}from"./SearchResult-B4st3Skl.js";import{S as s}from"./SearchResultList-CdjM7fk6.js";import{S as q}from"./SearchContext-DTMb5kZp.js";import{L as f}from"./ListItemText-Cn4bfwC7.js";import{H as x}from"./DefaultResultListItem-DUSnNzz3.js";import{C as j}from"./icons-CIBZDD43.js";import{O as P,a as C}from"./appWrappers-_7AfosWs.js";import{L as w}from"./ListItem-MGSaNCae.js";import{L as A}from"./ListItemIcon-CALRPc6N.js";import{a as _}from"./Plugin-Dfqv077V.js";import{S as R}from"./Grid-BRcD6lxX.js";import{L as W}from"./Link-Bm3AlTT9.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-D6lRulOX.js";import"./useAsync-cYsllXRD.js";import"./useMountedState-Bnm4--Gr.js";import"./lodash-B-tmFX5K.js";import"./useElementFilter-C2Ksdf1N.js";import"./componentData-DnWTcKbZ.js";import"./List-D4wG1S98.js";import"./ListContext-CnRdieQg.js";import"./translation-BFa40vAy.js";import"./EmptyState-BEbNRZya.js";import"./makeStyles-4LVf8ZW1.js";import"./Progress-bOD6IYnU.js";import"./LinearProgress-8pDldgJi.js";import"./Box-BZMsMDiJ.js";import"./styled-CwK1uEmG.js";import"./ResponseErrorPanel-Di3xngVT.js";import"./ErrorPanel-BWXYxd2G.js";import"./WarningPanel-CwfO6u39.js";import"./ExpandMore-BGkiTmW-.js";import"./AccordionDetails-B_CD0nxU.js";import"./index-B9sM2jn7.js";import"./Collapse-E9qJExDE.js";import"./MarkdownContent-TbO5Qkzz.js";import"./CodeSnippet-XMznKSLI.js";import"./CopyTextButton-DWVvtU-z.js";import"./useCopyToClipboard-fn2va9VA.js";import"./Tooltip-BOZftJPl.js";import"./useObjectRef-CMiC6ke_.js";import"./useOverlayTriggerState-BkDz7Lrc.js";import"./utils-ijm_b3mJ.js";import"./useFocusRing-Bjvn0GS4.js";import"./openLink-DVwmAOKC.js";import"./number-B3izyAdU.js";import"./I18nProvider-DL1Ps6Ca.js";import"./useControlledState-CjsdyDjY.js";import"./animation-By8SMLky.js";import"./useHover-gDb7vOkJ.js";import"./ButtonIcon-DD_AnQDN.js";import"./Button-Bito0oFe.js";import"./Label--YQs_5DF.js";import"./Hidden-BsQlbI9F.js";import"./useLabel-PGKREU8T.js";import"./useLabels-Cpdv89rG.js";import"./useButton-rnhRQmzJ.js";import"./usePress-C3UrLlH7.js";import"./textSelection-BToKgSXC.js";import"./index-C2j_KLnZ.js";import"./Divider-1peNkIEd.js";import"./useApp-OLJN8mL2.js";import"./WebStorage-DtSjkpRW.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-AfbIGo3s.js";import"./useIsomorphicLayoutEffect-B5EgTCFx.js";import"./BUIProvider-C1SLyjta.js";import"./useResolvedHref-B4mcLcl5.js";import"./useRouteRef-CO8HfKAe.js";import"./index-CS7sQkHC.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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

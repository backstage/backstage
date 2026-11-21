import{j as e,r as o,X as h}from"./iframe-81VbGqYS.js";import{s as y,M as S}from"./api-C-96Yyne.js";import{c as L}from"./SearchResult-Bo8HH19j.js";import{S as s}from"./SearchResultList-1N7krFWV.js";import{S as q}from"./SearchContext-fyDMa4SO.js";import{L as f}from"./ListItemText-BJVQ0grI.js";import{H as x}from"./DefaultResultListItem-awHHCGtD.js";import{C as j}from"./icons-DH2GuWqz.js";import{w as P,c as C}from"./appWrappers-Cb3HAO7q.js";import{L as w}from"./ListItem-BwaGLIri.js";import{L as A}from"./ListItemIcon-BU4x6kL0.js";import{c as _}from"./Plugin-DdzpiD66.js";import{S as R}from"./Grid-DMrlSwZy.js";import{L as W}from"./Link-DgC69_CC.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-CopnWV3T.js";import"./useAsync-CJdW20Xt.js";import"./useMountedState-aviZ0bSe.js";import"./lodash-BPAWgrT_.js";import"./useElementFilter-BXwSk66L.js";import"./componentData-BZtDhLVM.js";import"./List-DIoifV4W.js";import"./ListContext-CiutZ7F_.js";import"./translation-UBm5Pdpr.js";import"./EmptyState-DXINhVja.js";import"./makeStyles-CLUNqzBM.js";import"./Progress-Cy5JZQ2z.js";import"./LinearProgress-C66E09sW.js";import"./Box-BgoSIZ4q.js";import"./styled-eVahdZR4.js";import"./ResponseErrorPanel-wVkTeFbQ.js";import"./ErrorPanel-BUE9WhgI.js";import"./WarningPanel-C4UqJ8qc.js";import"./ExpandMore-BNqiNRNH.js";import"./AccordionDetails-Zz6eKI1V.js";import"./index-B9sM2jn7.js";import"./Collapse-BjQrsG8d.js";import"./MarkdownContent-zENPN7ya.js";import"./CopyTextButton-Bzoc_Gy2.js";import"./useCopyToClipboard-D-VyiVhb.js";import"./Tooltip-C6UWXmVf.js";import"./useObjectRef-CnOD3daG.js";import"./useOverlayTriggerState-CQqx4yUK.js";import"./utils-Bc3qSy6a.js";import"./useFocusRing-DYHYlv_4.js";import"./number-CXfm_f_X.js";import"./I18nProvider-DxzKOluv.js";import"./useControlledState-DitDneEU.js";import"./animation-DeGzi18H.js";import"./useHover-BliW0Nnt.js";import"./ButtonIcon-Dr7UhB0P.js";import"./Button-C-RbpSFH.js";import"./Label-Dd3OarLH.js";import"./Hidden-Cb1mFWSL.js";import"./useLabel-DNA1h8U7.js";import"./useLabels-DvwPDbuz.js";import"./useButton-D4MYDvTL.js";import"./usePress-Ck2OcU07.js";import"./textSelection-Dc2ic2y7.js";import"./getMetaValue-CCa-nVAs.js";import"./index-CoR4Ep33.js";import"./Divider-C6TLtV4P.js";import"./CodeSnippet-C9Qd9eKE.js";import"./useApp-Bu-r3o5K.js";import"./index-BTbib15M.js";import"./WebStorage-BF1feFiL.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BISMHxfU.js";import"./useIsomorphicLayoutEffect-CmNqTClv.js";import"./BUIProvider-E8WhSxx6.js";import"./useRouteRef-PTLjTNOc.js";import"./index-CUwVFkQ3.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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

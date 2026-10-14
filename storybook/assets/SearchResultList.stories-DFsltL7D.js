import{j as e,r as o,a3 as h}from"./iframe-BboAvpku.js";import{s as y,M as S}from"./api-BKmu6aKy.js";import{c as L}from"./SearchResult-V7XHgck3.js";import{S as s}from"./SearchResultList-Udvw_ORg.js";import{S as q}from"./SearchContext-CNkU5QLw.js";import{L as f}from"./ListItemText-YTyAL1wR.js";import{H as x}from"./DefaultResultListItem-D7rkX1dP.js";import{C as j}from"./icons-B5OUaK3p.js";import{w as P,c as C}from"./appWrappers-KA3ZCXah.js";import{L as w}from"./ListItem-Dkgy1Td7.js";import{L as A}from"./ListItemIcon-CzcYjLS8.js";import{c as _}from"./Plugin-hQpE537q.js";import{S as R}from"./Grid-BGOrXcY9.js";import{L as W}from"./Link-js1uqTlL.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-CgDc_Zie.js";import"./useAsync-C5cukq2r.js";import"./useMountedState-Bzk4ehad.js";import"./lodash-DkpW-IpZ.js";import"./useElementFilter-ZcFK_fB8.js";import"./componentData-xOZ5oXse.js";import"./List-OZSHlN34.js";import"./ListContext-BOEEedU_.js";import"./translation-BjcQbxoD.js";import"./EmptyState-CbmV1jyh.js";import"./makeStyles-iFGDkJwR.js";import"./Progress-AwbORWX-.js";import"./LinearProgress-Cb6aWc4T.js";import"./Box-AqVT1Pws.js";import"./styled-DoG2XfKF.js";import"./ResponseErrorPanel-nC97gNAE.js";import"./ErrorPanel-TqNQNmhF.js";import"./WarningPanel-V20DwlQC.js";import"./ExpandMore-BjuwtgxK.js";import"./AccordionDetails-DX8tynby.js";import"./index-B9sM2jn7.js";import"./Collapse-Cw4T2uQ_.js";import"./MarkdownContent-Cj_r4xeT.js";import"./CodeSnippet-tKgRAv2c.js";import"./CopyTextButton-D1x-Ruaz.js";import"./useCopyToClipboard-BKMmrM2p.js";import"./Tooltip-B92S_96o.js";import"./useObjectRef-BBnfzFd-.js";import"./useOverlayTriggerState-Bs6TYJ4q.js";import"./utils-RjN6cOlV.js";import"./useFocusRing-BIuw5o9K.js";import"./openLink-TmJYTFGY.js";import"./number-2cz8Gb4T.js";import"./I18nProvider-XE_7i8YB.js";import"./useControlledState-DOt2_KtG.js";import"./animation-8A7n9uPm.js";import"./useHover-Cg57FJ61.js";import"./ButtonIcon-WVia_wbC.js";import"./Button-lIgsiol8.js";import"./Label-CSCfT4hg.js";import"./Hidden-B9xv55fQ.js";import"./useLabel-BJaNI2Tj.js";import"./useLabels-C3K2MhXi.js";import"./useButton-Cy5D_Qbf.js";import"./usePress-DjSnnouJ.js";import"./textSelection-CDb6_zJX.js";import"./getMetaValue-Dkox27la.js";import"./index-CsJ4-CBU.js";import"./Divider-SqGTKvAo.js";import"./useApp-CGvPwDHO.js";import"./WebStorage-Cv-XFmYs.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CxOdppH4.js";import"./useIsomorphicLayoutEffect-Bq9LMOw0.js";import"./BUIProvider-DWqxfoNj.js";import"./BUIRoutingProvider-CNr62xTS.js";import"./useResolvedHref-ChAYmSfX.js";import"./useRouteRef-O9pRsJkm.js";import"./index-Bseu-KSo.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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

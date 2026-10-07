import{j as e,r as o,a3 as h}from"./iframe-DsaViRt6.js";import{s as y,M as S}from"./api-CRhHQ3kI.js";import{c as L}from"./SearchResult-BwzM5RHA.js";import{S as s}from"./SearchResultList-DAswiTBG.js";import{S as q}from"./SearchContext-e_6WWvtC.js";import{L as f}from"./ListItemText-RuCxYiQf.js";import{H as x}from"./DefaultResultListItem-vhIyb4px.js";import{C as j}from"./icons-Bi58G9bS.js";import{w as P,c as C}from"./appWrappers-4T5Umbw4.js";import{L as w}from"./ListItem-C0JUr0PJ.js";import{L as A}from"./ListItemIcon-Cv5I4DqQ.js";import{c as _}from"./Plugin-BzAwdV0K.js";import{S as R}from"./Grid-8AdasDhF.js";import{L as W}from"./Link-Ddg_NHNk.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-C8e92oTN.js";import"./useAsync-1_mPOrBB.js";import"./useMountedState-tMdzOAMm.js";import"./lodash-MieUkT6_.js";import"./useElementFilter-DWHhWgoY.js";import"./componentData-B2aBErUu.js";import"./List-DXgisE-a.js";import"./ListContext-DhuLCPQN.js";import"./translation-C4FNvYPZ.js";import"./EmptyState-CBZSjjxl.js";import"./makeStyles-DomhxC8K.js";import"./Progress-CGqxJW7w.js";import"./LinearProgress-DUXOyGGE.js";import"./Box-CkIMQTPE.js";import"./styled-C9i7J3Hk.js";import"./ResponseErrorPanel-B1vbj-16.js";import"./ErrorPanel-DcyTyiAX.js";import"./WarningPanel-CoM8knqw.js";import"./ExpandMore-BJmwiUAU.js";import"./AccordionDetails-Bmn9Uyiw.js";import"./index-B9sM2jn7.js";import"./Collapse-BxUF1mA9.js";import"./MarkdownContent-xtsadi98.js";import"./CodeSnippet-BJsB8wjm.js";import"./CopyTextButton-CMXm_7GY.js";import"./useCopyToClipboard-BDWSkNch.js";import"./Tooltip-CsEou8gd.js";import"./useObjectRef-C8p51AiY.js";import"./useOverlayTriggerState-AJWVqgd9.js";import"./utils-BMtDQ3Mp.js";import"./useFocusRing-BGqp868t.js";import"./openLink-DOqnQA7B.js";import"./number-DJMv4vuV.js";import"./I18nProvider-C_4m3VHk.js";import"./useControlledState-C9PUVjXY.js";import"./animation-BJNMN6_t.js";import"./useHover-DqXkt4DH.js";import"./ButtonIcon-DZtq07FP.js";import"./Button-S9X553hq.js";import"./Label-BVmI6bof.js";import"./Hidden-D546-sk9.js";import"./useLabel-yKsWsykb.js";import"./useLabels-DdirUbZa.js";import"./useButton-Tyy1zmtL.js";import"./usePress-DMXgY0oY.js";import"./textSelection-8YvAK-Rq.js";import"./index-B0Q9OrQR.js";import"./Divider-DtY1Y9Is.js";import"./useApp-Fb2uCB2O.js";import"./WebStorage-CNdBqC6r.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-D37lPVdM.js";import"./useIsomorphicLayoutEffect-ehheGkQi.js";import"./BUIProvider-CSv_q2aR.js";import"./BUIRoutingProvider-80Q71Qhv.js";import"./useResolvedHref-BnrY4UN4.js";import"./useRouteRef-BDc5HK_0.js";import"./index-kl08ino_.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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

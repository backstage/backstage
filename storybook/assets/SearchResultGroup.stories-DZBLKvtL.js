import{bR as e,ca as s,a5 as D}from"./iframe-DhttR-Z-.js";import{S as o,D as i,c as _,b as G}from"./InsertDriveFile-DHga-xvZ.js";import{s as F,M as w}from"./api-DBjJ-jAU.js";import{c as Q}from"./SearchResult-DmgU4Jbe.js";import{S as A}from"./SearchContext-sRsuNos3.js";import{L}from"./ListItemText-Cn8xzOI9.js";import{M as q}from"./MenuItem-ZprNJSVL.js";import{O as b,a as N}from"./appWrappers-W5GcWo01.js";import{L as T}from"./ListItem-C_3NeckJ.js";import{L as E}from"./ListItemIcon-VxUDE6Xl.js";import{a as M}from"./Plugin-4vUB_1H0.js";import{H as O}from"./DefaultResultListItem-BX6WlNOc.js";import{S as P}from"./Grid-VkbE96t3.js";import{L as H}from"./Link-CmpVD7EF.js";import"./preload-helper-PPVm8Dsz.js";import"./index-jjOY_5Uc.js";import"./Add-DXmiO6d9.js";import"./ArrowForwardIos-_DfWFQvC.js";import"./translation-D1F5ey81.js";import"./useAnalytics-Cg4YSIs1.js";import"./Select-CZso9XJc.js";import"./index-B9sM2jn7.js";import"./Popover-DHFEClMd.js";import"./Modal-LyNkSPwz.js";import"./Portal-CqcvHw1l.js";import"./List-DzoxYXEY.js";import"./ListContext-DPsuXuco.js";import"./formControlState-B-rxgywu.js";import"./ListSubheader-B1xb2e_8.js";import"./Chip-D7Y_Twro.js";import"./makeStyles-C_GO-7Nl.js";import"./EmptyState-IpQpfSsB.js";import"./Progress-gQWo-M1M.js";import"./LinearProgress-B3WYKoOp.js";import"./Box-CUxFOM_T.js";import"./styled-jJXBC4kr.js";import"./ResponseErrorPanel-chHdV_ZF.js";import"./ErrorPanel-D_q8qYhi.js";import"./WarningPanel-DgRNnxkJ.js";import"./ExpandMore-BIuXHLqD.js";import"./AccordionDetails-DRqafEwz.js";import"./Collapse-CQ74Gc0d.js";import"./MarkdownContent-CmlvBWEr.js";import"./CodeSnippet-ClFaEFmB.js";import"./CopyTextButton-BwcNHDZX.js";import"./useCopyToClipboard-CWfwN7Xp.js";import"./useMountedState-CE-seWbI.js";import"./Tooltip-CLkcFFIX.js";import"./Popper-CM66lfCc.js";import"./Divider-Dn59IuqE.js";import"./useAsync-ki1MR06s.js";import"./lodash-B8DiURsi.js";import"./useElementFilter-8GGhuKVE.js";import"./componentData-BvjWmSwQ.js";import"./WebStorage-DjcMxtyl.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-7t-5UrlQ.js";import"./useIsomorphicLayoutEffect-DHDV1_5M.js";import"./useApp-CHw-3fg9.js";import"./BUIProvider-CUKyC6Rl.js";import"./openLink-DDEWcvNy.js";import"./useResolvedHref-CHSc8dmW.js";import"./useRouteRef-DBe8dPTu.js";import"./index-B5_svkds.js";const J=N({id:"storybook.search.results.group.route"}),V=new w({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),it={title:"Plugins/Search/SearchResultGroup",component:o,decorators:[t=>b(e.jsx(D,{apis:[[F,V]],children:e.jsx(P,{container:!0,direction:"row",children:e.jsx(P,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":J}})],tags:["!manifest"]},m=()=>e.jsx(A,{children:e.jsx(o,{icon:e.jsx(i,{}),title:"Documentation"})}),d=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation"})},h=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(D,{apis:[[F,{query:()=>new Promise(()=>{})}]],children:e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation"})})},y=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(D,{apis:[[F,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation"})})},S=()=>{const[t]=s.useState({types:["custom"]});return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Custom",titleProps:{color:"secondary"}})},f=()=>{const[t]=s.useState({types:["custom"]});return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Custom",link:"See all custom results",linkProps:{to:"/custom"}})},x=()=>{const[t,n]=s.useState({types:["software-catalog"]}),c=[{label:"Lifecycle",value:"lifecycle"},{label:"Owner",value:"owner"}],C=s.useCallback(r=>()=>{n(l=>{const{filters:u,...p}=l,a={...u,[r]:void 0};return{...p,filters:a}})},[]),j=s.useCallback(r=>l=>{n(u=>{const{filters:p,...a}=u,W={...p,[r]:l};return{...a,filters:W}})},[]),k=s.useCallback(r=>()=>{n(l=>{const{filters:u,...p}=l,a={...u};return delete a[r],{...p,filters:a}})},[]);return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation",filterOptions:c,renderFilterOption:r=>e.jsx(q,{onClick:C(r.value),children:r.label},r.value),renderFilterField:r=>{switch(r){case"lifecycle":return e.jsxs(G,{label:"Lifecycle",value:t.filters?.lifecycle,onChange:j("lifecycle"),onDelete:k("lifecycle"),children:[e.jsx(q,{value:"production",children:"Production"}),e.jsx(q,{value:"experimental",children:"Experimental"})]},r);case"owner":return e.jsx(_,{label:"Owner",value:t.filters?.owner,onChange:j("owner"),onDelete:k("owner")},r);default:return null}}})},R=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(D,{apis:[[F,new w]],children:e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation"})})},g=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(D,{apis:[[F,new w]],children:e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation",noResultsComponent:e.jsx(L,{primary:"No results were found"})})})},z=t=>{const{icon:n,result:c}=t;return e.jsx(H,{to:c.location,children:e.jsxs(T,{alignItems:"flex-start",divider:!0,children:[n&&e.jsx(E,{children:n}),e.jsx(L,{primary:c.title,primaryTypographyProps:{variant:"h6"},secondary:c.text})]})})},I=()=>{const[t]=s.useState({types:["custom"]});return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Custom",link:"See all custom results",renderResultItem:({document:n,highlight:c,rank:C})=>e.jsx(z,{result:n,highlight:c,rank:C},n.location)})},v=()=>{const[t]=s.useState({types:["techdocs"]}),c=M({id:"plugin"}).provide(Q({name:"DefaultResultListItem",component:async()=>O}));return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation",children:e.jsx(c,{})})};m.__docgenInfo={description:"",methods:[],displayName:"Default"};d.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};h.__docgenInfo={description:"",methods:[],displayName:"Loading"};y.__docgenInfo={description:"",methods:[],displayName:"WithError"};S.__docgenInfo={description:"",methods:[],displayName:"WithCustomTitle"};f.__docgenInfo={description:"",methods:[],displayName:"WithCustomLink"};x.__docgenInfo={description:"",methods:[],displayName:"WithFilters"};R.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};g.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};I.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};v.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  return <SearchContextProvider>
      <SearchResultGroup icon={<DocsIcon />} title="Documentation" />
    </SearchContextProvider>;
}`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" />;
}`,...d.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {})
  }]]}>
      <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" />
    </TestApiProvider>;
}`,...h.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {
      throw new Error();
    })
  }]]}>
      <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" />
    </TestApiProvider>;
}`,...y.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom']
  });
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Custom" titleProps={{
    color: 'secondary'
  }} />;
}`,...S.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom']
  });
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Custom" link="See all custom results" linkProps={{
    to: '/custom'
  }} />;
}`,...f.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`() => {
  const [query, setQuery] = useState<Partial<SearchQuery>>({
    types: ['software-catalog']
  });
  const filterOptions = [{
    label: 'Lifecycle',
    value: 'lifecycle'
  }, {
    label: 'Owner',
    value: 'owner'
  }];
  const handleFilterAdd = useCallback((key: string) => () => {
    setQuery(prevQuery => {
      const {
        filters: prevFilters,
        ...rest
      } = prevQuery;
      const newFilters = {
        ...prevFilters,
        [key]: undefined
      };
      return {
        ...rest,
        filters: newFilters
      };
    });
  }, []);
  const handleFilterChange = useCallback((key: string) => (value: JsonValue) => {
    setQuery(prevQuery => {
      const {
        filters: prevFilters,
        ...rest
      } = prevQuery;
      const newFilters = {
        ...prevFilters,
        [key]: value
      };
      return {
        ...rest,
        filters: newFilters
      };
    });
  }, []);
  const handleFilterDelete = useCallback((key: string) => () => {
    setQuery(prevQuery => {
      const {
        filters: prevFilters,
        ...rest
      } = prevQuery;
      const newFilters = {
        ...prevFilters
      };
      delete newFilters[key];
      return {
        ...rest,
        filters: newFilters
      };
    });
  }, []);
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" filterOptions={filterOptions} renderFilterOption={option => <MenuItem key={option.value} onClick={handleFilterAdd(option.value)}>
          {option.label}
        </MenuItem>} renderFilterField={(key: string) => {
    switch (key) {
      case 'lifecycle':
        return <SearchResultGroupSelectFilterField key={key} label="Lifecycle" value={query.filters?.lifecycle} onChange={handleFilterChange('lifecycle')} onDelete={handleFilterDelete('lifecycle')}>
                <MenuItem value="production">Production</MenuItem>
                <MenuItem value="experimental">Experimental</MenuItem>
              </SearchResultGroupSelectFilterField>;
      case 'owner':
        return <SearchResultGroupTextFilterField key={key} label="Owner" value={query.filters?.owner} onChange={handleFilterChange('owner')} onDelete={handleFilterDelete('owner')} />;
      default:
        return null;
    }
  }} />;
}`,...x.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" />
    </TestApiProvider>;
}`,...R.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" noResultsComponent={<ListItemText primary="No results were found" />} />
    </TestApiProvider>;
}`,...g.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom']
  });
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Custom" link="See all custom results" renderResultItem={({
    document,
    highlight,
    rank
  }) => <CustomResultListItem key={document.location} result={document} highlight={highlight} rank={rank} />} />;
}`,...I.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  const plugin = createPlugin({
    id: 'plugin'
  });
  const DefaultSearchResultGroupItem = plugin.provide(createSearchResultListItemExtension({
    name: 'DefaultResultListItem',
    component: async () => DefaultResultListItem
  }));
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation">
      <DefaultSearchResultGroupItem />
    </SearchResultGroup>;
}`,...v.parameters?.docs?.source}}};const nt=["Default","WithQuery","Loading","WithError","WithCustomTitle","WithCustomLink","WithFilters","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{m as Default,h as Loading,f as WithCustomLink,g as WithCustomNoResultsComponent,I as WithCustomResultItem,S as WithCustomTitle,R as WithDefaultNoResultsComponent,y as WithError,x as WithFilters,d as WithQuery,v as WithResultItemExtensions,nt as __namedExportsOrder,it as default};

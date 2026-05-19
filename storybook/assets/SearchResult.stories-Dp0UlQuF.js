import{aR as I,aS as L,aT as S,aU as j,aE as g,j as t,a2 as D}from"./iframe-BCuiGO18.js";import{c as f,D as v}from"./InsertDriveFile-BBqVo-QN.js";import{s as C,M as _}from"./api-0IOqnvCu.js";import{S as o,c as k}from"./SearchResult-DXNpMlgI.js";import{L as R}from"./List-DYKyo639.js";import{H as n}from"./DefaultResultListItem-BpTzskn0.js";import{a as N}from"./SearchResultList-CfvQ4l3O.js";import{w as q}from"./appWrappers-FXjjnWoR.js";import{L as w}from"./ListItem-D5tv8MX2.js";import{c as E}from"./Plugin-tVce2jSJ.js";import{S as A}from"./SearchContext-Bi8yukTC.js";import{L as W}from"./Link-D8nUG02y.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B-Lu9oRi.js";import"./Add-CgMjBztw.js";import"./ArrowForwardIos-apjp8Cvb.js";import"./translation-BmZcizJl.js";import"./useAnalytics-CLav7vMM.js";import"./Select-CMVAeCz_.js";import"./index-B9sM2jn7.js";import"./Popover-CyM8W8X-.js";import"./Modal-BjSLJdmT.js";import"./Portal-Bdh2rISL.js";import"./formControlState-D7uetKle.js";import"./MenuItem-D6_iPtny.js";import"./ListSubheader-CTB6WK5C.js";import"./Chip-weePpAxC.js";import"./makeStyles-BiC0-IRq.js";import"./EmptyState-5WqB2kRY.js";import"./Grid-ks1F9Ab_.js";import"./Progress-BIGOivZ4.js";import"./LinearProgress-DliUtTjE.js";import"./Box-DF0subjV.js";import"./styled-n3Xk8m2M.js";import"./ResponseErrorPanel-Do-_bX9w.js";import"./ErrorPanel-BnBbbale.js";import"./WarningPanel-B696fEmr.js";import"./ExpandMore-Yv_q-kXu.js";import"./AccordionDetails-kOY2jM_p.js";import"./Collapse-rzCTC0c6.js";import"./MarkdownContent-D8ld7Hxa.js";import"./CodeSnippet-BfJZpbWM.js";import"./CopyTextButton-Cw35R9dI.js";import"./useCopyToClipboard-CwAb5EaD.js";import"./useMountedState-HGb4mU5a.js";import"./Tooltip-C0suzQKt.js";import"./Popper-nJ1Os4sA.js";import"./ListItemText-BF4AZnbO.js";import"./ListContext-DefbUR_f.js";import"./Divider-DQRcUmcz.js";import"./useAsync-Cj0IJRXY.js";import"./lodash-LxfdXjj1.js";import"./useElementFilter-CNoJY1KP.js";import"./componentData-BAI3xY0R.js";import"./ListItemIcon-DULFlkD5.js";import"./WebStorage-iwA75k21.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Blt0GDYI.js";import"./useIsomorphicLayoutEffect-DP-1EADe.js";import"./useApp-57KoDWVG.js";import"./BUIProvider-DVdVOrKl.js";import"./openLink-qumaaci0.js";import"./useResolvedHref-BM9nXUlO.js";import"./useRouteRef-BQyVyRKp.js";import"./index-BOxQOO6X.js";var i={},y;function G(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var H=G();const P=g(H),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},U=new _(M),$t={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,U]],children:t.jsx(A,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(P,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=E({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...a.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  const query = {
    term: 'documentation'
  };
  return <SearchResult query={query}>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...m.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <SearchResultListLayout resultItems={results} renderResultItem={({
      type,
      document
    }) => {
      switch (type) {
        case 'custom-result-item':
          return <CustomResultListItem key={document.location} result={document} />;
        default:
          return <DefaultResultListItem key={document.location} result={document} />;
      }
    }} />}
    </SearchResult>;
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <>
          <SearchResultGroupLayout icon={<CustomIcon />} title="Custom" link="See all custom results" resultItems={results.filter(({
        type
      }) => type === 'custom-result-item')} renderResultItem={({
        document
      }) => <CustomResultListItem key={document.location} result={document} />} />
          <SearchResultGroupLayout icon={<DefaultIcon />} title="Default" resultItems={results.filter(({
        type
      }) => type !== 'custom-result-item')} renderResultItem={({
        document
      }) => <DefaultResultListItem key={document.location} result={document} />} />
        </>}
    </SearchResult>;
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult noResultsComponent={<>No results were found</>}>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
  const plugin = createPlugin({
    id: 'plugin'
  });
  const DefaultResultItem = plugin.provide(createSearchResultListItemExtension({
    name: 'DefaultResultListItem',
    component: async () => DefaultResultListItem
  }));
  return <SearchResult>
      <DefaultResultItem />
    </SearchResult>;
}`,...d.parameters?.docs?.source}}};const te=["Default","WithQuery","ListLayout","GroupLayout","WithCustomNoResultsComponent","UsingSearchResultItemExtensions"];export{a as Default,c as GroupLayout,l as ListLayout,d as UsingSearchResultItemExtensions,p as WithCustomNoResultsComponent,m as WithQuery,te as __namedExportsOrder,$t as default};

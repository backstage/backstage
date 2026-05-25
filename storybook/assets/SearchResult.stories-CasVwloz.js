import{aR as I,aS as L,aT as S,aU as j,aE as g,j as t,a2 as D}from"./iframe-C0T-wj8W.js";import{c as f,D as v}from"./InsertDriveFile-D67bN--P.js";import{s as C,M as _}from"./api-DWyDta_6.js";import{S as o,c as k}from"./SearchResult-HhU3pbRH.js";import{L as R}from"./List-CHzHxHRI.js";import{H as n}from"./DefaultResultListItem-BXvQqpB3.js";import{a as N}from"./SearchResultList-BVCP3N_b.js";import{w as q}from"./appWrappers-CriX5g6D.js";import{L as w}from"./ListItem-CnMPBa6o.js";import{c as E}from"./Plugin-uJj8IM1L.js";import{S as A}from"./SearchContext-B-ITRdTG.js";import{L as W}from"./Link-Dh9Tk7z5.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Csb278mP.js";import"./Add-B4wTZOsM.js";import"./ArrowForwardIos-C56JzC-1.js";import"./translation-WV0MJw8A.js";import"./useAnalytics-C8hlcdRX.js";import"./Select-DA_1oRmP.js";import"./index-B9sM2jn7.js";import"./Popover-CvJzuGky.js";import"./Modal-u1aPM6tr.js";import"./Portal-ChEPYBl8.js";import"./formControlState-CIdYd_6k.js";import"./MenuItem-Djzp-hkL.js";import"./ListSubheader-CjF0yGgV.js";import"./Chip-hQOleSUD.js";import"./makeStyles-DViRTVia.js";import"./EmptyState-B6jRhb49.js";import"./Grid-Kd3bNwE8.js";import"./Progress-edJIoLv8.js";import"./LinearProgress-DssGitzM.js";import"./Box-zHlL_yoj.js";import"./styled-DP6UPB8s.js";import"./ResponseErrorPanel-1JerxqWk.js";import"./ErrorPanel-BMMw8EFa.js";import"./WarningPanel-D9JgV2fG.js";import"./ExpandMore-COx-v0R9.js";import"./AccordionDetails-DEQ_T6Yo.js";import"./Collapse-Jcz9uW_S.js";import"./MarkdownContent-CuZ6yXyH.js";import"./CodeSnippet-BuSnneud.js";import"./CopyTextButton-BM9kYZOc.js";import"./useCopyToClipboard-CA2a2PSS.js";import"./useMountedState-CFrOHiDa.js";import"./Tooltip-Dvdk8_gO.js";import"./Popper-Vn_FLfwt.js";import"./ListItemText-B20cMJ-q.js";import"./ListContext-C3ivO856.js";import"./Divider-DV_cLnB1.js";import"./useAsync-PxR9m19r.js";import"./lodash-ByAGuY73.js";import"./useElementFilter-CIpwN7k7.js";import"./componentData-Wenc7sxq.js";import"./ListItemIcon-Kd9X9YMV.js";import"./WebStorage-wXFQu-Oc.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CwTrF2-_.js";import"./useIsomorphicLayoutEffect-DUd4iW2_.js";import"./useApp-CHDrtVuY.js";import"./BUIProvider-BysIBW5M.js";import"./openLink-LrDtNDVV.js";import"./useResolvedHref-Dgg1vi6i.js";import"./useRouteRef-CNNtqCdh.js";import"./index-DiT9MzNM.js";var i={},y;function G(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var H=G();const P=g(H),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},U=new _(M),$t={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,U]],children:t.jsx(A,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(P,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=E({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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

import{cf as I,cg as L,cj as S,ce as j,bu as g,bR as t,a5 as D}from"./iframe-CNmrqhdp.js";import{a as f,D as v}from"./InsertDriveFile-DX1D1Cao.js";import{s as C,M as _}from"./api-CoPVOKZF.js";import{S as o,c as k}from"./SearchResult-DfY6Df-h.js";import{L as R}from"./List-ahum0BRu.js";import{H as n}from"./DefaultResultListItem-BX8KIwLU.js";import{a as N}from"./SearchResultList-D1b4OkIl.js";import{O as q}from"./appWrappers-TRDMH51E.js";import{L as w}from"./ListItem-B6bQ60ol.js";import{a as A}from"./Plugin-BA0J1vJQ.js";import{S as E}from"./SearchContext-6AdMozhh.js";import{L as W}from"./Link-Buntv2pG.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DkIbyARY.js";import"./Add-DC-QEui-.js";import"./ArrowForwardIos-B7dQgJyv.js";import"./translation-93xhI-OU.js";import"./useAnalytics-BfmOd9pS.js";import"./Select-BRs4pJN5.js";import"./index-B9sM2jn7.js";import"./Popover-DXsb97Zc.js";import"./Modal-Bj4IWEm7.js";import"./Portal-BeWhklMr.js";import"./formControlState-DzzoqcVY.js";import"./MenuItem-DpDyyn3a.js";import"./ListSubheader-B0VZ-cx_.js";import"./Chip-Cs6bdejH.js";import"./makeStyles-CoULisOM.js";import"./EmptyState-CrcGjEni.js";import"./Grid-BGPHOMQP.js";import"./Progress--oYdH08K.js";import"./LinearProgress-DyvRqfdb.js";import"./Box-1MBd1NdD.js";import"./styled-wlFTiasm.js";import"./ResponseErrorPanel-CzYS-I-S.js";import"./ErrorPanel-r6vIQ9Y1.js";import"./WarningPanel-kTOcUjWz.js";import"./ExpandMore-C1SJEl53.js";import"./AccordionDetails-C0yuhCvO.js";import"./Collapse-DkReGfOr.js";import"./MarkdownContent-CcNF5Ko8.js";import"./CodeSnippet-B4QHrZxA.js";import"./ListItemText-BeWx-Vvf.js";import"./ListContext-B5UlMvnw.js";import"./CopyTextButton-1pXQlLSE.js";import"./useCopyToClipboard-BX3Cc1_x.js";import"./useMountedState-CokGl4ZB.js";import"./Tooltip-BQ2DH04K.js";import"./Popper-zherBlvX.js";import"./Divider-DvCVn6dj.js";import"./useAsync-AVyJcLhD.js";import"./lodash-DcRUHytK.js";import"./useElementFilter-ZfzbKvpN.js";import"./componentData-Bajmr2_W.js";import"./ListItemIcon-PtywKY5-.js";import"./WebStorage-C7CWBF3C.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-6BaQCvWb.js";import"./useIsomorphicLayoutEffect-BrvmqhnJ.js";import"./useApp-DjNgU9QR.js";import"./BUIProvider-DQTw1zNm.js";import"./openLink-Dcd4pMbN.js";import"./useResolvedHref-wx132o6L.js";import"./useRouteRef-8V-QgAtT.js";import"./index-CecqzQJ6.js";var i={},y;function G(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var H=G();const P=g(H),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},O=new _(M),$t={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,O]],children:t.jsx(E,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(P,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=A({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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

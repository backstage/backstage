import{cf as I,cg as L,cj as S,ce as j,bu as g,bR as t,a5 as D}from"./iframe-Bm5ba6Eo.js";import{a as f,D as v}from"./InsertDriveFile-BNABrX-8.js";import{s as C,M as _}from"./api-6tYSjb2W.js";import{S as o,c as k}from"./SearchResult-qPcEsyqZ.js";import{L as R}from"./List-CJhMPRPP.js";import{H as n}from"./DefaultResultListItem-qHZ5ErQJ.js";import{a as N}from"./SearchResultList-VOv7Ncw1.js";import{O as q}from"./appWrappers-CjN0uS8o.js";import{L as w}from"./ListItem-UVpWaDMa.js";import{a as A}from"./Plugin-DktZ4BGz.js";import{S as E}from"./SearchContext-hvWarYky.js";import{L as W}from"./Link-BddbTmYm.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DFYQHB0n.js";import"./Add-DJ8bwqTj.js";import"./ArrowForwardIos-CkW5nqPC.js";import"./translation-Dhmn5mhy.js";import"./useAnalytics-BQdStjBt.js";import"./Select-EsGPAfN_.js";import"./index-B9sM2jn7.js";import"./Popover-CYDJVvd7.js";import"./Modal-Cx8YqiY2.js";import"./Portal-Cg5Nvqt2.js";import"./formControlState-BIqw7ICg.js";import"./MenuItem-D2iqw-vS.js";import"./ListSubheader-DghnudQf.js";import"./Chip-C4iYXxfQ.js";import"./makeStyles-BxPw9vCe.js";import"./EmptyState-DgStH4SM.js";import"./Grid-2YxRqddS.js";import"./Progress-C1gvWhvN.js";import"./LinearProgress-CUWL3Pet.js";import"./Box-NESd7kYt.js";import"./styled-DeEwf9nS.js";import"./ResponseErrorPanel-Curs6Dcv.js";import"./ErrorPanel-NY_QZQW2.js";import"./WarningPanel-DkzSJ2lp.js";import"./ExpandMore-DZhVJ5gx.js";import"./AccordionDetails-BH84Cqgt.js";import"./Collapse-8dQvh7gn.js";import"./MarkdownContent-Ck3aSIvu.js";import"./CodeSnippet-DRGENOjW.js";import"./ListItemText-D1JMY5d6.js";import"./ListContext-CVjS-G2V.js";import"./CopyTextButton-BbbFijNF.js";import"./useCopyToClipboard-T3ghPtvH.js";import"./useMountedState-CX6Pdejq.js";import"./Tooltip-Dj-fCTBD.js";import"./Popper-SjxBkGs3.js";import"./Divider-DgXuoSNG.js";import"./useAsync-BFTdLWGt.js";import"./lodash-KBhUdAYx.js";import"./useElementFilter-CU0OSqen.js";import"./componentData-VX6GSl-M.js";import"./ListItemIcon-BIBGeTx2.js";import"./WebStorage-Ddi_3Tst.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CzA18W9B.js";import"./useIsomorphicLayoutEffect-ChAZlZKa.js";import"./useApp-kMVg8txh.js";import"./BUIProvider-BToDF3TK.js";import"./openLink-B3PKQziN.js";import"./useResolvedHref-DYKBvNag.js";import"./useRouteRef-B5wYKb_5.js";import"./index-ob8zNRki.js";var i={},y;function G(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var H=G();const P=g(H),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},O=new _(M),$t={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,O]],children:t.jsx(E,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(P,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=A({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
